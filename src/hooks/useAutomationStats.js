import { useState, useEffect } from "react";
import { logService } from "@/lib/automation/logService";
import { useAuth } from "@/contexts/AuthContext";

export function useAutomationStats(days = 7) {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRuns: 0,
    successRate: 0,
    avgDuration: 0,
    runsByDay: [],
    isLoading: true,
  });

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user, days]);

  const fetchStats = async () => {
    const result = await logService.fetchStats(days);

    if (!result.success) {
      setStats((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    const logs = result.data;
    const totalRuns = logs.length;

    // Calculate success rate
    const successRuns = logs.filter(
      (log) => log.metadata?.status === "success",
    ).length;
    const successRate =
      totalRuns > 0 ? Math.round((successRuns / totalRuns) * 100) : 0;

    // Calculate avg duration
    const totalDuration = logs.reduce(
      (acc, log) => acc + (log.metadata?.duration_ms || 0),
      0,
    );
    const avgDuration =
      totalRuns > 0 ? Math.round(totalDuration / totalRuns) : 0;

    // TODO: Group by day for charts if needed

    setStats({
      totalRuns,
      successRate,
      avgDuration,
      runsByDay: [], // Helper for charts
      isLoading: false,
    });
  };

  return stats;
}
