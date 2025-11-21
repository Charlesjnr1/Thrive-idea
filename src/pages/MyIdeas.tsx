import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Rocket, ArrowLeft, PlusCircle, Edit, Eye, Trash2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Idea = Database["public"]["Tables"]["ideas"]["Row"];

const MyIdeas = () => {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdeas = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("ideas")
        .select("*")
        .eq("user_id", session.user.id)
        .order("updated_at", { ascending: false });

      if (error) {
        toast.error("Failed to load ideas");
        console.error(error);
      } else {
        setIdeas(data || []);
      }

      setLoading(false);
    };

    fetchIdeas();
  }, [navigate]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this idea?")) return;

    const { error } = await supabase
      .from("ideas")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete idea");
      console.error(error);
    } else {
      toast.success("Idea deleted successfully");
      setIdeas(ideas.filter(idea => idea.id !== id));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
          <div className="container px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/dashboard" className="flex items-center gap-2 group">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  ThriveNation
                </span>
              </Link>
            </div>
          </div>
        </header>

        <main className="container px-4 py-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ThriveNation
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <Button asChild variant="ghost">
                <Link to="/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Ideas</h1>
            <p className="text-muted-foreground text-lg">
              Manage your startup ideas and continue where you left off
            </p>
          </div>
          <Button asChild className="bg-gradient-to-r from-primary to-accent">
            <Link to="/submit-idea">
              <PlusCircle className="w-4 h-4 mr-2" />
              New Idea
            </Link>
          </Button>
        </div>

        {ideas.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <PlusCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No ideas yet</h3>
              <p className="text-muted-foreground mb-6">
                Start by creating your first startup idea to share with investors
              </p>
              <Button asChild className="bg-gradient-to-r from-primary to-accent">
                <Link to="/submit-idea">Create Your First Idea</Link>
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <Card key={idea.id} className="hover:shadow-medium transition-all group">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant={idea.status === "published" ? "default" : "secondary"}>
                      {idea.status === "published" ? "Published" : "Draft"}
                    </Badge>
                    {idea.status === "published" && (
                      <div className="flex items-center gap-1 text-muted-foreground text-sm">
                        <Eye className="w-4 h-4" />
                        {idea.views_count || 0}
                      </div>
                    )}
                  </div>
                  <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                    {idea.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-1">
                    {idea.category} • {idea.business_stage}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {idea.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Funding Needed:</span>
                      <span className="font-semibold">{formatCurrency(idea.funding_needed)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span>{formatDate(idea.updated_at)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      asChild 
                      className="flex-1"
                      variant={idea.status === "draft" ? "default" : "outline"}
                    >
                      <Link to={`/submit-idea?id=${idea.id}`}>
                        <Edit className="w-4 h-4 mr-2" />
                        {idea.status === "draft" ? "Continue" : "Edit"}
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(idea.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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

export default MyIdeas;
