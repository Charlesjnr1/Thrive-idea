import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Lightbulb, TrendingUp, DollarSign } from "lucide-react";

interface Analytics {
  totalUsers: number;
  totalIdeas: number;
  totalInvestors: number;
  totalEntrepreneurs: number;
  publishedIdeas: number;
  totalFollowers: number;
  totalInvestmentInterests: number;
  pendingApprovals: number;
}

export function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<Analytics>({
    totalUsers: 0,
    totalIdeas: 0,
    totalInvestors: 0,
    totalEntrepreneurs: 0,
    publishedIdeas: 0,
    totalFollowers: 0,
    totalInvestmentInterests: 0,
    pendingApprovals: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch all data in parallel
      const [
        { count: totalUsers },
        { count: totalIdeas },
        { count: totalInvestors },
        { count: totalEntrepreneurs },
        { count: publishedIdeas },
        { count: totalFollowers },
        { count: totalInvestmentInterests },
        { count: pendingApprovals },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("ideas").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("user_type", "investor"),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("user_type", "entrepreneur"),
        supabase.from("ideas").select("*", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("idea_followers").select("*", { count: "exact", head: true }),
        supabase.from("investment_interests").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("approval_status", "pending"),
      ]);

      setAnalytics({
        totalUsers: totalUsers || 0,
        totalIdeas: totalIdeas || 0,
        totalInvestors: totalInvestors || 0,
        totalEntrepreneurs: totalEntrepreneurs || 0,
        publishedIdeas: publishedIdeas || 0,
        totalFollowers: totalFollowers || 0,
        totalInvestmentInterests: totalInvestmentInterests || 0,
        pendingApprovals: pendingApprovals || 0,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const engagementRate = analytics.publishedIdeas > 0
    ? ((analytics.totalFollowers + analytics.totalInvestmentInterests) / analytics.publishedIdeas * 100).toFixed(1)
    : "0";

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.totalEntrepreneurs} entrepreneurs, {analytics.totalInvestors} investors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ideas</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalIdeas}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.publishedIdeas} published
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{engagementRate}%</div>
            <p className="text-xs text-muted-foreground">
              {analytics.totalFollowers} follows, {analytics.totalInvestmentInterests} interests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">
              Require review
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Activity</CardTitle>
          <CardDescription>Overview of user engagement and content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Active Investors</span>
              <span className="text-sm text-muted-foreground">{analytics.totalInvestors}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Active Entrepreneurs</span>
              <span className="text-sm text-muted-foreground">{analytics.totalEntrepreneurs}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Investment Interests</span>
              <span className="text-sm text-muted-foreground">{analytics.totalInvestmentInterests}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Idea Followers</span>
              <span className="text-sm text-muted-foreground">{analytics.totalFollowers}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
