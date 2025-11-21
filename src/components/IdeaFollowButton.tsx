import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface IdeaFollowButtonProps {
  ideaId: string;
  size?: "sm" | "default" | "lg";
  variant?: "ghost" | "outline" | "default";
  showCount?: boolean;
  onFollowChange?: () => void;
}

const IdeaFollowButton = ({ 
  ideaId, 
  size = "sm", 
  variant = "ghost",
  showCount = false,
  onFollowChange
}: IdeaFollowButtonProps) => {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followCount, setFollowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    checkFollowStatus();
    fetchFollowCount();
  }, [ideaId]);

  const checkFollowStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      setUserId(null);
      return;
    }

    setUserId(session.user.id);

    // Get user profile to check user type
    const { data: profile } = await supabase
      .from("profiles")
      .select("user_type")
      .eq("user_id", session.user.id)
      .single();

    if (profile) {
      setUserType(profile.user_type);
    }

    // Check if already following
    const { data } = await supabase
      .from("idea_followers")
      .select("id")
      .eq("idea_id", ideaId)
      .eq("investor_id", session.user.id)
      .maybeSingle();

    setIsFollowing(!!data);
  };

  const fetchFollowCount = async () => {
    const { count } = await supabase
      .from("idea_followers")
      .select("*", { count: "exact", head: true })
      .eq("idea_id", ideaId);

    setFollowCount(count || 0);
  };

  const handleToggleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking heart

    if (!userId) {
      toast.error("Please sign in to follow ideas");
      navigate("/auth");
      return;
    }

    if (userType !== "investor") {
      toast.error("Only investors can follow ideas");
      return;
    }

    setLoading(true);

    try {
      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from("idea_followers")
          .delete()
          .eq("idea_id", ideaId)
          .eq("investor_id", userId);

        if (error) throw error;

        setIsFollowing(false);
        setFollowCount((prev) => Math.max(0, prev - 1));
        toast.success("Idea removed from favorites");
        onFollowChange?.();
      } else {
        // Follow
        const { error } = await supabase
          .from("idea_followers")
          .insert({
            idea_id: ideaId,
            investor_id: userId,
          });

        if (error) throw error;

        setIsFollowing(true);
        setFollowCount((prev) => prev + 1);
        toast.success("Idea added to favorites");
        onFollowChange?.();
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      toast.error("Failed to update favorites");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size={size}
      variant={variant}
      className={`${size === "sm" ? "h-8 w-8 p-0" : ""} gap-2 transition-colors ${
        isFollowing ? "text-red-500 hover:text-red-600" : ""
      }`}
      onClick={handleToggleFollow}
      disabled={loading}
    >
      <Heart
        className={`w-4 h-4 ${isFollowing ? "fill-current" : ""}`}
      />
      {showCount && followCount > 0 && (
        <span className="text-xs">{followCount}</span>
      )}
    </Button>
  );
};

export default IdeaFollowButton;
