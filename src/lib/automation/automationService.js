/**
 * Automation Service - Supabase CRUD
 *
 * Handles cloud persistence for automation workflows.
 */

import { supabase } from "../supabase";

const TABLE_NAME = "automations";

/**
 * Fetch all workflows for a user
 */
export async function fetchWorkflows(userEmail) {
  if (!userEmail) {
    console.warn("fetchWorkflows: No user email provided");
    return { data: [], error: null };
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .eq("user_email", userEmail)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching workflows:", error);
    return { data: [], error };
  }

  // Transform from DB format to app format
  const workflows = data.map((row) => ({
    id: row.workflow_id,
    name: row.name,
    isActive: row.is_active,
    nodes: row.nodes || [],
    connections: row.connections || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));

  return { data: workflows, error: null };
}

/**
 * Save (upsert) a workflow
 */
export async function saveWorkflow(userEmail, workflow) {
  if (!userEmail) {
    return { success: false, error: "No user email" };
  }

  const { error } = await supabase.from(TABLE_NAME).upsert(
    {
      user_email: userEmail,
      workflow_id: workflow.id,
      name: workflow.name,
      is_active: workflow.isActive || false,
      nodes: workflow.nodes || [],
      connections: workflow.connections || [],
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "user_email,workflow_id",
    },
  );

  if (error) {
    console.error("Error saving workflow:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Delete a workflow
 */
export async function deleteWorkflow(userEmail, workflowId) {
  if (!userEmail) {
    return { success: false, error: "No user email" };
  }

  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq("user_email", userEmail)
    .eq("workflow_id", workflowId);

  if (error) {
    console.error("Error deleting workflow:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export default {
  fetchWorkflows,
  saveWorkflow,
  deleteWorkflow,
};
