import mongoose from 'mongoose';
import { z } from 'zod';
import Task from '../models/task.model.js';

const taskSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(1000).optional().default(''),
  priority: z.enum(['Low', 'Medium', 'High']).optional().default('Medium'),
  dueDate: z.string().trim().optional().default(''),
  completed: z.boolean().optional().default(false),
  savedForLater: z.boolean().optional(),
});

function readTaskInput(req, res) {
  const result = taskSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: 'Enter a task title and check the task details.',
    });
    return null;
  }

  let dueDate = null;

  if (result.data.dueDate) {
    const date = new Date(`${result.data.dueDate}T00:00:00.000Z`);

    if (
      Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== result.data.dueDate
    ) {
      res.status(400).json({
        success: false,
        message: 'Due date must use YYYY-MM-DD format.',
      });
      return null;
    }

    dueDate = date;
  }

  const taskInput = {
    title: result.data.title,
    description: result.data.description,
    priority: result.data.priority,
    dueDate,
    completed: result.data.completed,
  };

  if (result.data.completed) {
    taskInput.savedForLater = false;
  } else if (result.data.savedForLater !== undefined) {
    taskInput.savedForLater = result.data.savedForLater;
  }

  return taskInput;
}

function publicTask(task) {
  return {
    id: task._id.toString(),
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate ? task.dueDate.toISOString().slice(0, 10) : '',
    completed: task.completed,
    savedForLater: task.savedForLater ?? false,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}

export async function getTasks(req, res, next) {
  try {
    const tasks = await Task.find({ userId: req.auth.userId }).sort({
      completed: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: { tasks: tasks.map(publicTask) },
    });
  } catch (error) {
    return next(error);
  }
}

export async function createTask(req, res, next) {
  try {
    const taskInput = readTaskInput(req, res);
    if (!taskInput) return;

    const task = await Task.create({
      ...taskInput,
      userId: req.auth.userId,
    });

    return res.status(201).json({
      success: true,
      message: 'Task created successfully.',
      data: { task: publicTask(task) },
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateTask(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID.',
      });
    }

    const taskInput = readTaskInput(req, res);
    if (!taskInput) return;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.auth.userId },
      taskInput,
      { returnDocument: 'after', runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully.',
      data: { task: publicTask(task) },
    });
  } catch (error) {
    return next(error);
  }
}

export async function deleteTask(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID.',
      });
    }

    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.auth.userId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully.',
    });
  } catch (error) {
    return next(error);
  }
}
