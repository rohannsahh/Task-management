/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { Task } from "@/types/task";
import { format } from "date-fns";
import { memo } from 'react';

interface TaskTableProps {
  tasks: Task[];
  selectedTasks: string[];
  onSelect: (taskId: string) => void;
  onSelectAll: (selected: boolean) => void;
  onEdit: (task: Task) => void;
}

export const TaskTable = memo(function TaskTable({
  tasks,
  selectedTasks,
  onSelect,
  onSelectAll,
  onEdit,
}: TaskTableProps) {
  const formatDateTime = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd MMM yyyy HH:mm");
    } catch (error) {
      return 'Invalid date';
    }
  };

  const calculateTimeToFinish = (task: Task) => {
    if (task.status === 'finished') return '-';
    
    const now = new Date();
    const endTime = new Date(task.endTime);
    const diffInHours = (endTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    return diffInHours > 0 ? diffInHours.toFixed(3) : '0.000';
  };

  const allSelected = tasks.length > 0 && selectedTasks.length === tasks.length;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={(checked) => onSelectAll(!!checked)}
                aria-label="Select all tasks"
              />
            </TableHead>
            <TableHead className="w-24">ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Time to Finish (hrs)</TableHead>
            <TableHead className="w-12">Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task._id}>
              <TableCell>
                <Checkbox
                  checked={selectedTasks.includes(task._id)}
                  onCheckedChange={() => onSelect(task._id)}
                  aria-label={`Select task ${task.title}`}
                />
              </TableCell>
              <TableCell className="truncate max-w-[100px]" title={task._id}>
                {task._id.slice(-6)}
              </TableCell>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.priority}</TableCell>
              <TableCell>
                <span 
                  className={`capitalize ${
                    task.status === 'finished' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-yellow-600 dark:text-yellow-400'
                  }`}
                >
                  {task.status}
                </span>
              </TableCell>
              <TableCell>{formatDateTime(task.startTime)}</TableCell>
              <TableCell>{formatDateTime(task.endTime)}</TableCell>
              <TableCell>
                {calculateTimeToFinish(task)}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const editableTask = {
                      _id: task._id,
                      title: task.title,
                      priority: task.priority,
                      status: task.status,
                      startTime: task.startTime,
                      endTime: task.endTime,
                      timeToFinish: parseFloat(calculateTimeToFinish(task))
                    };
                    onEdit(editableTask);
                  }}
                  aria-label={`Edit task ${task.title}`}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {tasks.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-4">
                No tasks found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
});