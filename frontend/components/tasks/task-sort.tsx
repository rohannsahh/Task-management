"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDownUp } from "lucide-react";

interface TaskSortProps {
  onSort: (field: string, direction: 'asc' | 'desc') => void;
}

export function TaskSort({ onSort }: TaskSortProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <ArrowDownUp className="mr-2 h-4 w-4" />
          Sort
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onSort('startTime', 'asc')}>
          Start Time (Ascending)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSort('startTime', 'desc')}>
          Start Time (Descending)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSort('endTime', 'asc')}>
          End Time (Ascending)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSort('endTime', 'desc')}>
          End Time (Descending)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}