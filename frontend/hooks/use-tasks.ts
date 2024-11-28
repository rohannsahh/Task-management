"use client";

import { useState } from "react";
import { Task } from "@/types/task";
import * as taskApi from "@/lib/api/tasks";
import { useToast } from "@/hooks/use-toast";

export function useTasks(initialTasks: Task[] = []) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskApi.getTasks();
      setTasks(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: Omit<Task, "id">) => {
    try {
      setLoading(true);
      const newTask = await taskApi.createTask(taskData);
      setTasks((prev) => [...prev, newTask]);
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id: string, taskData: Partial<Omit<Task, "id">>) => {
    try {
      setLoading(true);
      const updatedTask = await taskApi.updateTask(id, taskData);
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? updatedTask : task))
      );
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteTasks = async (ids: string[]) => {
    try {
      setLoading(true);
      await taskApi.deleteTasks(ids);
      setTasks((prev) => prev.filter((task) => !ids.includes(task._id)));
      toast({
        title: "Success",
        description: "Tasks deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete tasks",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sortTasks = (field: keyof Task, direction: "asc" | "desc") => {
    setTasks((prev) => {
      const sorted = [...prev].sort((a, b) => {
        const aValue = a[field];
        const bValue = b[field];
        if (direction === "asc") {
          return (aValue ?? "") < (bValue ?? "") ? -1 : (aValue ?? "") > (bValue ?? "") ? 1 : 0;
        } else {
          return (aValue ?? "") > (bValue ?? "") ? -1 : (aValue ?? "") < (bValue ?? "") ? 1 : 0;
        }
      });
      return sorted;
    });
  };

  const filterTasks = (priority: number | null, status: string | null) => {
    return tasks.filter((task) => {
      if (priority && task.priority !== priority) return false;
      if (status && task.status !== status) return false;
      return true;
    });
  };

  return {
    tasks,
    loading,
    fetchTasks,
    createTask,
    updateTask,
    deleteTasks,
    sortTasks,
    filterTasks,
  };
}