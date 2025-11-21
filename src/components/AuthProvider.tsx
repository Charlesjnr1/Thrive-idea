import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check for invalid session on mount
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        // If there's an error getting the session, clear it
        if (error) {
          console.error("Session error:", error);
          await supabase.auth.signOut();
          localStorage.clear();
        }
      } catch (error) {
        console.error("Auth check error:", error);
        await supabase.auth.signOut();
        localStorage.clear();
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed successfully');
        }
        
        if (event === 'SIGNED_OUT') {
          localStorage.clear();
        }

        // Handle invalid token or session errors
        if (event === 'USER_UPDATED' && !session) {
          await supabase.auth.signOut();
          localStorage.clear();
        }
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return <>{children}</>;
};
