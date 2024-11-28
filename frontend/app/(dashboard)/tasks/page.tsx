/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState, useCallback } from "react";
import { TaskTable } from "@/components/tasks/task-table";
import { TaskFilters } from "@/components/tasks/task-filters";
import { TaskSort } from "@/components/tasks/task-sort";
import { TaskForm } from "@/components/tasks/task-form";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Task } from "@/types/task";
import { taskService } from "@/services/task-service";
import { useToast } from "@/hooks/use-toast";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const { toast } = useToast();

  const fetchTasks = useCallback(async () => {
    try {
      const data = await taskService.getTasks({
        priority: priorityFilter || undefined,
        status: statusFilter || undefined,
      });
      setTasks(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [priorityFilter, statusFilter, toast]);

  useEffect(() => {
    // Fetch tasks initially
    fetchTasks();

    // Set interval to fetch tasks every 40 seconds
    const interval = setInterval(() => {
      fetchTasks();
    }, 40000);

    // Cleanup the interval when component unmounts
    return () => clearInterval(interval);
  }, [fetchTasks]);

  const handleSelectTask = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedTasks(selected ? tasks.map((task) => task._id) : []);
  };

  const handleSort = async (field: string, direction: 'asc' | 'desc') => {
    setLoading(true);
    try {
      const data = await taskService.getTasks(
        {
          priority: priorityFilter || undefined,
          status: statusFilter || undefined,
        },
        { field, direction }
      );
      setTasks(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sort tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (taskData: Omit<Task, '_id'>) => {
    try {
      if (editingTask) {
        const updatedTask = await taskService.updateTask(editingTask._id, taskData);
        setTasks(tasks.map(task => 
          task._id === editingTask._id ? updatedTask : task
        ));
        toast({
          title: "Success",
          description: "Task updated successfully",
        });
      } else {
        const newTask = await taskService.createTask({...taskData, _id: ''});
        setTasks([...tasks, newTask]);
        toast({
          title: "Success", 
          description: "Task created successfully",
        });
      }
      setIsFormOpen(false);
      setEditingTask(undefined);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save task",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await Promise.all(
        selectedTasks.map((taskId) => taskService.deleteTask(taskId))
      );
      setTasks(tasks.filter(task => !selectedTasks.includes(task._id)));
      setSelectedTasks([]);
      toast({
        title: "Success",
        description: "Tasks deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete tasks",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setEditingTask(undefined);
              setIsFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
          {selectedTasks.length > 0 && (
            <Button 
              variant="destructive" 
              size="icon"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <TaskFilters
          priorityFilter={priorityFilter}
          statusFilter={statusFilter}
          onPriorityChange={setPriorityFilter}
          onStatusChange={setStatusFilter}
        />
        <TaskSort onSort={handleSort} />
      </div>

      <TaskTable
        tasks={tasks}
        selectedTasks={selectedTasks}
        onSelect={handleSelectTask}
        onSelectAll={handleSelectAll}
        onEdit={(task) => {
          setEditingTask(task);
          setIsFormOpen(true);
        }}
      />

      <TaskForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        task={editingTask}
        onSubmit={handleSubmit}
      />
    </div>
  );
}