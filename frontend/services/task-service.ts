import api from './api';
import { Task } from '@/types/task';

export const taskService = {
  async getTasks(filters?: { priority?: number; status?: string }, sort?: { field: string; direction: 'asc' | 'desc' }) {
    const params = new URLSearchParams();
    if (filters?.priority) params.append('priority', filters.priority.toString());
    if (filters?.status) params.append('status', filters.status);
    if (sort) {
      params.append('sortBy', sort.field);
      params.append('sortOrder', sort.direction);
    }
    const response = await api.get(`/tasks?${params.toString()}`);
    return response.data;
  },

  async createTask(taskData: Omit<Task, 'id'>) {
    const task = {
      ...taskData,
      startTime: new Date(taskData.startTime).toISOString(),
      endTime: new Date(taskData.endTime).toISOString(),
    };
    
    const response = await api.post('/tasks', task);
    return response.data;
  },

  async updateTask(id: string, taskData: Partial<Task>) {
    const task = {
      ...taskData,
      startTime: taskData.startTime ? new Date(taskData.startTime).toISOString() : undefined,
      endTime: taskData.endTime ? new Date(taskData.endTime).toISOString() : undefined,
    };
    
    const response = await api.put(`/tasks/${id}`, task);
    return response.data;
  },

  async deleteTask(id: string) {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  async getStats() {
    const response = await api.get('/tasks/stats');
    return response.data;
  }
}; 