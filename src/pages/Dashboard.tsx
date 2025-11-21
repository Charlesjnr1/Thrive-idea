import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Rocket, LogOut, PlusCircle, TrendingUp, Heart, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import FundingStatistics from "@/components/FundingStatistics";

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  user_type: "entrepreneur" | "investor";
  bio: string | null;
  avatar_url: string | null;
  location: string | null;
  startup_name: string | null;
  industry: string | null;
  organization: string | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (error) {
        toast.error("Failed to load profile");
        console.error(error);
      } else {
        setProfile(profileData);
      }

      // Check if user has admin role
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      setIsAdmin(!!roles);
      setLoading(false);
    };

    fetchUserData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

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
                <Link to="/discover">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Discover
                </Link>
              </Button>
              {isAdmin && (
                <Button asChild variant="default" className="bg-gradient-to-r from-primary to-accent">
                  <Link to="/admin">
                    <Shield className="w-4 h-4 mr-2" />
                    Admin Panel
                  </Link>
                </Button>
              )}
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
            Welcome back, {profile?.full_name}!
          </h1>
          <p className="text-muted-foreground text-lg">
            {profile?.user_type === "entrepreneur"
              ? "Manage your startup ideas and track investor interest"
              : "Discover and follow exciting startup opportunities"}
          </p>
        </div>

        {user && profile && (
          <FundingStatistics userType={profile.user_type} userId={user.id} />
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profile?.user_type === "entrepreneur" ? (
            <>
              <Card className="border-primary/20 hover:border-primary transition-all hover:shadow-medium group">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <PlusCircle className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>Post New Idea</CardTitle>
                  <CardDescription>
                    Share your startup vision with potential investors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full bg-gradient-to-r from-primary to-accent">
                    <Link to="/submit-idea">Create Idea</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-accent/20 hover:border-accent transition-all hover:shadow-medium">
                <CardHeader>
                  <CardTitle>My Ideas</CardTitle>
                  <CardDescription>View and manage your posted ideas</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/my-ideas">View Ideas</Link>
                  </Button>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card className="border-primary/20 hover:border-primary transition-all hover:shadow-medium group">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>Discover Ideas</CardTitle>
                  <CardDescription>
                    Browse innovative startups seeking investment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full bg-gradient-to-r from-primary to-accent">
                    <Link to="/discover">Explore Now</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-accent/20 hover:border-accent transition-all hover:shadow-medium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Saved Ideas
                  </CardTitle>
                  <CardDescription>View your followed startup ideas</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/saved">View Saved</Link>
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          <Card className="border-border hover:shadow-medium transition-all">
            <CardHeader>
              <CardTitle>My Profile</CardTitle>
              <CardDescription>Update your profile information</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link to="/profile">Edit Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;