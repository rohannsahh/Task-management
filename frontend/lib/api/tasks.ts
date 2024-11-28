import { Task } from "@/types/task";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function getTasks() {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch tasks');
  return response.json();
}

export async function createTask(task: Omit<Task, 'id'>) {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error('Failed to create task');
  return response.json();
}

export async function updateTask(id: string, task: Partial<Omit<Task, 'id'>>) {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error('Failed to update task');
  return response.json();
}

export async function deleteTasks(ids: string[]) {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ ids }),
  });
  if (!response.ok) throw new Error('Failed to delete tasks');
  return response.json();
}

export async function getDashboardStats() {
  const response = await fetch(`${API_BASE_URL}/tasks/stats`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch dashboard stats');
  return response.json();
}