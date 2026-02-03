import { supabase } from "@/lib/supabase";

const INSTAGRAM_APP_ID = import.meta.env.VITE_INSTAGRAM_APP_ID || "123456789"; // Placeholder if not in env
const REDIRECT_URI =
  "https://nfapcfclofdycraqyipe.supabase.co/functions/v1/instagram-auth-callback"; // Must match Meta App Settings

export const instagramService = {
  /**
   * Get the Instagram OAuth URL
   */
  getAuthUrl: async () => {
    // Get current user ID to pass as state
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const state = user ? user.id : "";

    return `https://www.instagram.com/oauth/authorize?force_reauth=true&client_id=${INSTAGRAM_APP_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI,
    )}&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights&state=${state}`;
  },

  /**
   * Check connection status for current user
   */
  checkConnection: async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return { connected: false };

      const { data, error } = await supabase
        .from("instagram_accounts")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error || !data) return { connected: false };

      return {
        connected: true,
        account: data,
      };
    } catch (error) {
      console.error("Error checking Instagram connection:", error);
      return { connected: false };
    }
  },

  /**
   * Disconnect Instagram account
   */
  disconnect: async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No authenticated user");

      const { error } = await supabase
        .from("instagram_accounts")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error("Error disconnecting Instagram:", error);
      return { success: false, error: error.message };
    }
  },
};
