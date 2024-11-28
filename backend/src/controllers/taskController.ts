



import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../types';
import Task from '../models/Task';
import { catchAsync } from '../utils/catchAsync';

// Create Task
export const createTask = catchAsync(async (req: AuthRequest, res: Response) => {
  const { title, startTime, endTime, priority, status } = req.body;

  // Validate end time is after start time
  if (new Date(endTime) <= new Date(startTime)) {
    return res.status(400).json({
      message: 'End time must be after start time'
    });
  }

  const task = await Task.create({
    title,
    startTime,
    endTime,
    priority,
    status,
    userId: req.user!.id
  });

  res.status(201).json(task);
});

// Get Tasks with filtering and sorting
export const getTasks = catchAsync(async (req: AuthRequest, res: Response) => {
  const { priority, status, sortBy, sortOrder = 'asc' } = req.query;

  // Build query
  const query: any = { userId: req.user!.id };
  if (priority) query.priority = Number(priority);
  if (status) query.status = status;

  // Build sort object
  let sort: any = {};
  if (sortBy) {
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;
  }

  const tasks = await Task.find(query).sort(sort);
  res.json(tasks);
});

// Get Single Task
export const getTaskById = catchAsync(async (req: AuthRequest, res: Response) => {
  const task = await Task.findOne({
    _id: req.params.id,
    userId: req.user!.id
  });

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  res.json(task);
});

// Update Task
export const updateTask = catchAsync(async (req: AuthRequest, res: Response) => {
  const { title, startTime, endTime, priority, status } = req.body;

  // Validate end time is after start time
  if (new Date(endTime) <= new Date(startTime)) {
    return res.status(400).json({
      message: 'End time must be after start time'
    });
  }

  const task = await Task.findOne({
    _id: req.params.id,
    userId: req.user!.id
  });

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  // If marking as finished, set endTime to current time
  if (status === 'finished' && task.status === 'pending') {
    task.endTime = new Date();
  }

  // Update fields
  task.title = title;
  task.startTime = new Date(startTime);
  if (status !== 'finished') {
    task.endTime = new Date(endTime);
  }
  task.priority = priority;
  task.status = status;

  await task.save();
  res.json(task);
});

// Delete Task
export const deleteTask = catchAsync(async (req: AuthRequest, res: Response) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    userId: req.user!.id
  });

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  res.json({ message: 'Task deleted successfully' });
});

// Get Task Statistics
export const getTaskStats = catchAsync(async (req: AuthRequest, res: Response) => {
  const currentTime = new Date();

  // Aggregate pipeline for task statistics
  const stats = await Task.aggregate([
    // Match user's tasks
    { $match: { userId: new mongoose.Types.ObjectId(req.user!.id) } },
    
    // First group to calculate basic stats
    {
      $group: {
        _id: null,
        totalTasks: { $sum: 1 },
        completedTasks: {
          $sum: { $cond: [{ $eq: ['$status', 'finished'] }, 1, 0] }
        },
        pendingTasks: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        // Calculate completion times for finished tasks
        completionTimes: {
          $push: {
            $cond: [
              { $eq: ['$status', 'finished'] },
              {
                timeTaken: {
                  $divide: [
                    { $subtract: ['$endTime', '$startTime'] },
                    3600000 // Convert to hours
                  ]
                }
              },
              null
            ]
          }
        }
      }
    },
    
    // Project final statistics
    {
      $project: {
        _id: 0,
        totalTasks: 1,
        completedTasks: 1,
        pendingTasks: 1,
        completionRate: {
          $multiply: [
            { $divide: ['$completedTasks', '$totalTasks'] },
            100
          ]
        },
        averageCompletionTime: {
          $avg: {
            $filter: {
              input: '$completionTimes',
              as: 'time',
              cond: { $ne: ['$$time', null] }
            }
          }
        }
      }
    }
  ]);

  // Calculate time statistics by priority
  const timeStatsByPriority = await Task.aggregate([
    { $match: { 
      userId: new mongoose.Types.ObjectId(req.user!.id),
      status: 'pending'
    }},
    {
      $group: {
        _id: '$priority',
        timeElapsed: {
          $sum: {
            $divide: [
              { $subtract: [currentTime, '$startTime'] },
              3600000 // Convert to hours
            ]
          }
        },
        estimatedTimeLeft: {
          $sum: {
            $divide: [
              { $subtract: ['$endTime', currentTime] },
              3600000 // Convert to hours
            ]
          }
        }
      }
    }
  ]);

  // Format time stats by priority
  const timeStats = timeStatsByPriority.reduce((acc: any, curr) => {
    acc[curr._id] = {
      timeElapsed: Math.max(0, curr.timeElapsed),
      estimatedTimeLeft: Math.max(0, curr.estimatedTimeLeft)
    };
    return acc;
  }, {});

  // Combine all statistics
  const finalStats = {
    ...(stats[0] || {
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      completionRate: 0,
      averageCompletionTime: 0
    }),
    timeStatsByPriority: timeStats
  };

  res.json(finalStats);
});