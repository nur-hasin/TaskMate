import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Alert,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import {
  createTask as apiCreateTask,
  deleteTask as apiDeleteTask,
  getTasks as apiGetTasks,
  updateTask as apiUpdateTask,
} from '../services/api';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function animateTaskLayout() {
  LayoutAnimation.configureNext({
    duration: 280,
    create: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
    update: {
      type: LayoutAnimation.Types.easeInEaseOut,
    },
    delete: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
  });
}

const TasksContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshTasks = useCallback(async () => {
    try {
      const data = await apiGetTasks();

      setError(null);

      animateTaskLayout();
      setTasks(data);

      return data;
    } catch (err) {
      setError(err.message || 'Could not load tasks.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    apiGetTasks()
      .then((data) => {
        if (cancelled) return;

        setError(null);
        animateTaskLayout();
        setTasks(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Could not load tasks.');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function createTask(payload) {
    const newTask = await apiCreateTask(payload);
    await refreshTasks();
    return newTask;
  }

  async function updateTask(id, payload) {
    const updated = await apiUpdateTask(id, payload);
    await refreshTasks();
    return updated;
  }

  async function toggleTask(task) {
    return updateTask(task.id, {
      title: task.title,
      description: task.description || '',
      priority: task.priority || 'Medium',
      dueDate: task.dueDate || '',
      completed: !task.completed,
    });
  }

  async function toggleSavedForLater(task) {
    if (task.completed) {
      throw new Error('Completed tasks cannot be saved for later.');
    }

    return updateTask(task.id, {
      title: task.title,
      description: task.description || '',
      priority: task.priority || 'Medium',
      dueDate: task.dueDate || '',
      completed: false,
      savedForLater: !task.savedForLater,
    });
  }

  async function performDelete(taskId) {
    try {
      await apiDeleteTask(taskId);

      animateTaskLayout();

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== taskId)
      );

      setError(null);
    } catch (err) {
      setError(err.message || 'Could not delete task.');
    }
  }

  function confirmDeleteTask(task) {
    Alert.alert(
      'Delete this task?',
      `"${task.title}" will be removed from your account.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => void performDelete(task.id),
        },
      ]
    );
  }

  const pendingCount = tasks.filter(
    (task) => !task.completed
  ).length;

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  return (
    <TasksContext.Provider
      value={{
        tasks,
        loading,
        error,
        refreshTasks,
        createTask,
        updateTask,
        toggleTask,
        toggleSavedForLater,
        confirmDeleteTask,
        pendingCount,
        completedCount,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasksContext() {
  const context = useContext(TasksContext);

  if (!context) {
    throw new Error(
      'useTasks must be used inside TasksProvider.'
    );
  }

  return context;
}