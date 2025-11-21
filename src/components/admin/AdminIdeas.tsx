import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Idea {
  id: string;
  title: string;
  category: string;
  status: string;
  views_count: number;
  funding_needed: number;
  created_at: string;
  user_id: string;
  profiles?: {
    full_name: string;
  };
}

export function AdminIdeas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      const { data, error } = await supabase
        .from("ideas")
        .select("*, profiles(full_name)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setIdeas(data || []);
    } catch (error) {
      console.error("Error fetching ideas:", error);
      toast({
        title: "Error",
        description: "Failed to load ideas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateIdeaStatus = async (ideaId: string, status: "published" | "draft") => {
    try {
      const { error } = await supabase
        .from("ideas")
        .update({ status })
        .eq("id", ideaId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Idea ${status === "published" ? "published" : "unpublished"} successfully`,
      });

      fetchIdeas();
    } catch (error) {
      console.error("Error updating idea status:", error);
      toast({
        title: "Error",
        description: "Failed to update idea status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading ideas...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Idea Management</CardTitle>
        <CardDescription>Moderate and manage platform content</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Funding</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ideas.map((idea) => (
              <TableRow key={idea.id}>
                <TableCell className="font-medium max-w-xs truncate">
                  {idea.title}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{idea.category}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {idea.profiles?.full_name || "Unknown"}
                </TableCell>
                <TableCell className="text-sm">
                  ${idea.funding_needed.toLocaleString()}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {idea.views_count}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={idea.status === "published" ? "default" : "secondary"}
                  >
                    {idea.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/idea/${idea.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    {idea.status === "published" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateIdeaStatus(idea.id, "draft")}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Unpublish
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateIdeaStatus(idea.id, "published")}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Publish
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
