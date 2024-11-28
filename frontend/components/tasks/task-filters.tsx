"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, X } from "lucide-react";

interface TaskFiltersProps {
  priorityFilter: number | null;
  statusFilter: string | null;
  onPriorityChange: (priority: number | null) => void;
  onStatusChange: (status: string | null) => void;
}

export function TaskFilters({
  priorityFilter,
  statusFilter,
  onPriorityChange,
  onStatusChange,
}: TaskFiltersProps) {
  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            Priority
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {[1, 2, 3, 4, 5].map((priority) => (
            <DropdownMenuItem
              key={priority}
              onClick={() => onPriorityChange(priority)}
            >
              Priority {priority}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            Status
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onStatusChange("pending")}>
            Pending
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusChange("finished")}>
            Finished
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {(priorityFilter || statusFilter) && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            onPriorityChange(null);
            onStatusChange(null);
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}