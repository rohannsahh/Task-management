"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PriorityStats {
  priority: number;
  pendingTasks: number;
  timeLapsed: number;
  timeToFinish: number;
}

interface PriorityTableProps {
  stats: PriorityStats[];
}

export function PriorityTable({ stats }: PriorityTableProps) {
  const formatNumber = (num: number) => num.toFixed(3);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Priority Level</TableHead>
            <TableHead>Pending Tasks</TableHead>
            <TableHead>Time Lapsed (hrs)</TableHead>
            <TableHead>Time to Finish (hrs)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stats.map((stat) => (
            <TableRow key={stat.priority}>
              <TableCell>Priority {stat.priority}</TableCell>
              <TableCell>{stat.pendingTasks}</TableCell>
              <TableCell>{formatNumber(stat.timeLapsed)}</TableCell>
              <TableCell>{formatNumber(stat.timeToFinish)}</TableCell>
            </TableRow>
          ))}
          {stats.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                No priority data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}