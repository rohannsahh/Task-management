/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { PriorityTable } from "@/components/dashboard/priority-table";
import { taskService } from "@/services/task-service";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await taskService.getStats();
        setStats(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch dashboard statistics",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [toast]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  const priorityStats = Object.entries(stats?.timeStatsByPriority || {}).map(
    ([priority, data]: [string, any]) => ({
      priority: Number(priority),
      pendingTasks: stats.pendingTasks,
      timeLapsed: data.timeElapsed,
      timeToFinish: data.estimatedTimeLeft,
    })
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Total Tasks"
          value={stats?.totalTasks?.toString() || "0"}
        />
        <StatsCard
          title="Tasks Completed"
          value={`${Math.round(stats?.completionRate || 0)}%`}
        />
        <StatsCard
          title="Tasks Pending"
          value={`${100 - Math.round(stats?.completionRate || 0)}%`}
        />
        <StatsCard
          title="Average Completion Time"
          value={`${stats?.averageCompletionTime?.toFixed(1) || 0} hrs`}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Pending Tasks Summary</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <StatsCard
            title="Pending Tasks"
            value={stats?.pendingTasks?.toString() || "0"}
          />
          <StatsCard
            title="Total Time Lapsed"
            value={`${Object.values(stats?.timeStatsByPriority || {}).reduce(
              (acc: number, curr: any) => acc + curr.timeElapsed,
              0
            ).toFixed(1)} hrs`}
          />
          <StatsCard
            title="Estimated Time to Finish"
            value={`${Object.values(stats?.timeStatsByPriority || {}).reduce(
              (acc: number, curr: any) => acc + curr.estimatedTimeLeft,
              0
            ).toFixed(1)} hrs`}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Priority-wise Analysis</h2>
        <PriorityTable stats={priorityStats} />
      </div>
    </div>
  );
}