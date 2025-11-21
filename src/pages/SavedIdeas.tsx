import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, MapPin, DollarSign, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import IdeaFollowButton from "@/components/IdeaFollowButton";

interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  business_stage: string;
  funding_needed: number;
  location: string | null;
  views_count: number;
  created_at: string;
  profiles: {
    full_name: string;
    startup_name: string | null;
  };
}

const SavedIdeas = () => {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkAuthAndFetchIdeas();
  }, []);

  const checkAuthAndFetchIdeas = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUserId(session.user.id);
    fetchSavedIdeas(session.user.id);
  };

  const fetchSavedIdeas = async (investorId: string) => {
    setLoading(true);

    // First get all idea IDs that the investor follows
    const { data: follows, error: followsError } = await supabase
      .from("idea_followers")
      .select("idea_id")
      .eq("investor_id", investorId);

    if (followsError) {
      toast.error("Failed to load saved ideas");
      console.error(followsError);
      setLoading(false);
      return;
    }

    if (!follows || follows.length === 0) {
      setIdeas([]);
      setLoading(false);
      return;
    }

    const ideaIds = follows.map((f) => f.idea_id);

    // Fetch the actual idea details
    const { data: ideasData, error: ideasError } = await supabase
      .from("ideas")
      .select(`
        *,
        profiles (full_name, startup_name)
      `)
      .in("id", ideaIds)
      .order("created_at", { ascending: false });

    if (ideasError) {
      toast.error("Failed to load idea details");
      console.error(ideasError);
    } else {
      setIdeas(ideasData || []);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  };

  const handleIdeaClick = (ideaId: string) => {
    navigate(`/idea/${ideaId}`);
  };

  // Refresh the list when an idea is unfollowed
  const handleFollowChange = () => {
    if (userId) {
      fetchSavedIdeas(userId);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ThriveNation
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <Button asChild variant="ghost">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/discover">Discover</Link>
              </Button>
              <Button onClick={handleLogout} variant="outline">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Saved <span className="text-accent">Ideas</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Your followed startup ideas
          </p>
        </div>

        {/* Ideas Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading saved ideas...</p>
          </div>
        ) : ideas.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">
                You haven't saved any ideas yet.
              </p>
              <Button asChild>
                <Link to="/discover">Discover Ideas</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <Card
                key={idea.id}
                className="group hover:shadow-medium transition-all cursor-pointer border-border hover:border-primary"
                onClick={() => handleIdeaClick(idea.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary">{idea.category}</Badge>
                    <Badge variant="outline" className="capitalize">
                      {idea.business_stage}
                    </Badge>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                    {idea.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {idea.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-semibold text-primary">
                      {formatCurrency(idea.funding_needed)}
                    </span>
                    <span>needed</span>
                  </div>
                  {idea.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{idea.location}</span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-border flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-medium">
                        {idea.profiles.startup_name || idea.profiles.full_name}
                      </span>
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                      <IdeaFollowButton 
                        ideaId={idea.id}
                        showCount={true}
                        onFollowChange={handleFollowChange}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedIdeas;
