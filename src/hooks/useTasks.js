import { useTasksContext } from '../context/TasksContext';

export default function useTasks() {
  return useTasksContext();
}