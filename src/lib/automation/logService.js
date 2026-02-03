import { supabase } from "@/lib/supabase";

const TABLE_NAME = "activity_log";

/**
 * Log Service
 * Handles saving and fetching execution logs for automations.
 * Uses the existing 'activity_log' table.
 */
export const logService = {
  /**
   * Log an automation execution
   * @param {Object} params
   * @param {string} params.userEmail - Needed to look up user (if not using auth.uid)
   * @param {string} params.workflowId
   * @param {string} params.workflowName
   * @param {string} params.status - 'success' | 'error'
   * @param {Object} params.triggerData
   * @param {Array} params.executionDetails - Array of node execution results
   * @param {number} params.durationMs
   * @param {string} [params.errorMessage]
   */
  async logExecution({
    userEmail,
    workflowId,
    workflowName,
    status,
    triggerData,
    executionDetails,
    durationMs,
    errorMessage,
  }) {
    try {
      // Get current user ID
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error("No authenticated user found for logging");
        return { success: false, error: "Authentication required" };
      }

      const logEntry = {
        user_id: user.id,
        action_type: "automation_run",
        description: `Executed workflow: ${workflowName}`,
        metadata: {
          workflow_id: workflowId,
          workflow_name: workflowName,
          status,
          trigger_data: triggerData,
          execution_details: executionDetails,
          duration_ms: durationMs,
          error_message: errorMessage,
        },
      };

      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert(logEntry)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Failed to log execution:", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Fetch logs for a specific workflow
   * @param {string} workflowId
   * @param {number} limit
   */
  async fetchLogs(workflowId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("*")
        .eq("action_type", "automation_run")
        .contains("metadata", { workflow_id: workflowId }) // Query JSONB column
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Failed to fetch logs:", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Fetch recent stats for dashboard
   */
  async fetchStats(days = 7) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("*")
        .eq("action_type", "automation_run")
        .gte("created_at", startDate.toISOString());

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      return { success: false, error: error.message };
    }
  },
};
