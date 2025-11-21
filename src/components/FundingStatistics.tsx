import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, FileText, Eye } from "lucide-react";

interface FundingStats {
  totalIdeas: number;
  publishedIdeas: number;
  draftIdeas: number;
  totalFunding: number;
  averageFunding: number;
  totalViews: number;
}

interface InvestorStats {
  followedIdeas: number;
  totalFundingInFollowed: number;
  averageFundingInFollowed: number;
  categoriesFollowed: number;
}

interface FundingStatisticsProps {
  userType: "entrepreneur" | "investor";
  userId: string;
}

const FundingStatistics = ({ userType, userId }: FundingStatisticsProps) => {
  const [entrepreneurStats, setEntrepreneurStats] = useState<FundingStats>({
    totalIdeas: 0,
    publishedIdeas: 0,
    draftIdeas: 0,
    totalFunding: 0,
    averageFunding: 0,
    totalViews: 0,
  });

  const [investorStats, setInvestorStats] = useState<InvestorStats>({
    followedIdeas: 0,
    totalFundingInFollowed: 0,
    averageFundingInFollowed: 0,
    categoriesFollowed: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);

      if (userType === "entrepreneur") {
        const { data: ideas, error } = await supabase
          .from("ideas")
          .select("funding_needed, status, views_count")
          .eq("user_id", userId);

        if (!error && ideas) {
          const published = ideas.filter((i) => i.status === "published");
          const drafts = ideas.filter((i) => i.status === "draft");
          const totalFunding = ideas.reduce((sum, i) => sum + (i.funding_needed || 0), 0);
          const totalViews = ideas.reduce((sum, i) => sum + (i.views_count || 0), 0);

          setEntrepreneurStats({
            totalIdeas: ideas.length,
            publishedIdeas: published.length,
            draftIdeas: drafts.length,
            totalFunding,
            averageFunding: ideas.length > 0 ? totalFunding / ideas.length : 0,
            totalViews,
          });
        }
      } else {
        const { data: follows, error } = await supabase
          .from("idea_followers")
          .select("idea_id")
          .eq("investor_id", userId);

        if (!error && follows && follows.length > 0) {
          const ideaIds = follows.map((f) => f.idea_id);
          const { data: ideas } = await supabase
            .from("ideas")
            .select("funding_needed, category")
            .in("id", ideaIds);

          if (ideas) {
            const totalFunding = ideas.reduce((sum, i) => sum + (i.funding_needed || 0), 0);
            const uniqueCategories = new Set(ideas.map((i) => i.category));

            setInvestorStats({
              followedIdeas: ideas.length,
              totalFundingInFollowed: totalFunding,
              averageFundingInFollowed: ideas.length > 0 ? totalFunding / ideas.length : 0,
              categoriesFollowed: uniqueCategories.size,
            });
          }
        }
      }

      setLoading(false);
    };

    fetchStats();

    // Set up realtime subscription for entrepreneurs to see view count updates
    if (userType === "entrepreneur") {
      const channel = supabase
        .channel('ideas-changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'ideas',
            filter: `user_id=eq.${userId}`
          },
          () => {
            // Refetch stats when any of the user's ideas are updated
            fetchStats();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [userType, userId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded w-24 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-32 animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {userType === "entrepreneur" ? (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Funding Requested</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(entrepreneurStats.totalFunding)}</div>
              <p className="text-xs text-muted-foreground">
                Across {entrepreneurStats.totalIdeas} {entrepreneurStats.totalIdeas === 1 ? "idea" : "ideas"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published Ideas</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{entrepreneurStats.publishedIdeas}</div>
              <p className="text-xs text-muted-foreground">
                {entrepreneurStats.draftIdeas} {entrepreneurStats.draftIdeas === 1 ? "draft" : "drafts"} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Funding</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(entrepreneurStats.averageFunding)}</div>
              <p className="text-xs text-muted-foreground">Per idea</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{entrepreneurStats.totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Across all ideas</p>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Following</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{investorStats.followedIdeas}</div>
              <p className="text-xs text-muted-foreground">
                {investorStats.followedIdeas === 1 ? "Startup idea" : "Startup ideas"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Funding Tracked</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(investorStats.totalFundingInFollowed)}</div>
              <p className="text-xs text-muted-foreground">In followed ideas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Investment</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(investorStats.averageFundingInFollowed)}</div>
              <p className="text-xs text-muted-foreground">Per followed idea</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{investorStats.categoriesFollowed}</div>
              <p className="text-xs text-muted-foreground">Industries followed</p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default FundingStatistics;
