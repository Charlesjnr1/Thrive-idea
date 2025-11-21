import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Rocket,
  ArrowLeft,
  DollarSign,
  MapPin,
  Calendar,
  Eye,
  Building2,
  Mail,
  Globe,
  FileText,
  Video,
  TrendingUp,
} from "lucide-react";
import IdeaFollowButton from "@/components/IdeaFollowButton";
import ConfidentialityDialog from "@/components/ConfidentialityDialog";

interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  business_stage: string;
  funding_needed: number;
  funding_type: string;
  location: string | null;
  pitch_deck_url: string | null;
  video_url: string | null;
  views_count: number;
  created_at: string;
  profiles: {
    full_name: string;
    startup_name: string | null;
    bio: string | null;
    website: string | null;
    industry: string | null;
  };
}

const IdeaDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [showAgreement, setShowAgreement] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);
  const [message, setMessage] = useState("");
  const [hasIndicated, setHasIndicated] = useState(false);
  const [indicating, setIndicating] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user && id) {
      checkAgreement();
      checkInterest();
      fetchIdea();
    }
  }, [user, id]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      setProfile(profileData);
    }
  };

  const checkAgreement = async () => {
    if (!user || !id) return;

    const { data } = await supabase
      .from("idea_agreements")
      .select("*")
      .eq("idea_id", id)
      .eq("investor_id", user.id)
      .maybeSingle();

    if (data) {
      setHasAgreed(true);
    } else if (profile?.user_type === "investor") {
      setShowAgreement(true);
    }
  };

  const checkInterest = async () => {
    if (!user || !id) return;

    const { data } = await supabase
      .from("investment_interests")
      .select("*")
      .eq("idea_id", id)
      .eq("investor_id", user.id)
      .maybeSingle();

    setHasIndicated(!!data);
  };

  const fetchIdea = async () => {
    if (!id) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("ideas")
      .select(`
        *,
        profiles (full_name, startup_name, bio, website, industry)
      `)
      .eq("id", id)
      .eq("status", "published")
      .single();

    if (error) {
      toast.error("Failed to load idea details");
      console.error(error);
      navigate("/discover");
    } else {
      setIdea(data);
      incrementViews(id);
    }
    setLoading(false);
  };

  const incrementViews = async (ideaId: string) => {
    // Use RPC function to safely increment views without race conditions
    const { error } = await supabase.rpc('increment_idea_views' as any, { idea_id: ideaId });
    
    if (error) {
      console.error("Error incrementing views:", error);
    }
  };

  const handleAcceptAgreement = async () => {
    if (!user || !id) return;

    const { error } = await supabase
      .from("idea_agreements")
      .insert({
        idea_id: id,
        investor_id: user.id,
      });

    if (error) {
      toast.error("Failed to record agreement");
      console.error(error);
    } else {
      setHasAgreed(true);
      setShowAgreement(false);
      toast.success("Agreement accepted");
    }
  };

  const handleDeclineAgreement = () => {
    toast.info("You must accept the agreement to view details");
    navigate("/discover");
  };

  const handleIndicateInterest = async () => {
    if (!user || !id) {
      toast.error("Please sign in to indicate interest");
      return;
    }

    if (profile?.user_type !== "investor") {
      toast.error("Only investors can indicate interest");
      return;
    }

    setIndicating(true);
    const { error } = await supabase
      .from("investment_interests")
      .insert({
        idea_id: id,
        investor_id: user.id,
        message: message.trim() || null,
      });

    if (error) {
      if (error.code === "23505") {
        toast.error("You've already indicated interest in this idea");
      } else {
        toast.error("Failed to indicate interest");
        console.error(error);
      }
    } else {
      toast.success("Interest indicated successfully!");
      setHasIndicated(true);
      setMessage("");
    }
    setIndicating(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!hasAgreed && profile?.user_type === "investor") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <ConfidentialityDialog
          open={true}
          onAccept={handleAcceptAgreement}
          onDecline={handleDeclineAgreement}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!idea) {
    return null;
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
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Discover
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8 max-w-5xl">
        {/* Title Section */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="secondary" className="text-base px-3 py-1">
                  {idea.category}
                </Badge>
                <Badge variant="outline" className="capitalize text-base px-3 py-1">
                  {idea.business_stage}
                </Badge>
              </div>
              <h1 className="text-4xl font-bold mb-3">{idea.title}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{idea.views_count} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(idea.created_at)}</span>
                </div>
              </div>
            </div>
            {profile?.user_type === "investor" && (
              <IdeaFollowButton ideaId={idea.id} size="lg" showCount={true} />
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Idea</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {idea.description}
                </p>
              </CardContent>
            </Card>

            {/* Materials */}
            {(idea.pitch_deck_url || idea.video_url) && (
              <Card>
                <CardHeader>
                  <CardTitle>Supporting Materials</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {idea.pitch_deck_url && (
                    <Button asChild variant="outline" className="w-full justify-start">
                      <a href={idea.pitch_deck_url} target="_blank" rel="noopener noreferrer">
                        <FileText className="w-4 h-4 mr-2" />
                        View Pitch Deck
                      </a>
                    </Button>
                  )}
                  {idea.video_url && (
                    <Button asChild variant="outline" className="w-full justify-start">
                      <a href={idea.video_url} target="_blank" rel="noopener noreferrer">
                        <Video className="w-4 h-4 mr-2" />
                        Watch Video Pitch
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Indicate Interest */}
            {profile?.user_type === "investor" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Indicate Investment Interest
                  </CardTitle>
                  <CardDescription>
                    Let the entrepreneur know you're interested in learning more
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!hasIndicated ? (
                    <>
                      <Textarea
                        placeholder="Add a message (optional) - introduce yourself or ask initial questions..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="min-h-[120px]"
                      />
                      <Button
                        onClick={handleIndicateInterest}
                        disabled={indicating}
                        className="w-full"
                      >
                        {indicating ? "Submitting..." : "Indicate Interest"}
                      </Button>
                    </>
                  ) : (
                    <div className="p-4 bg-primary/10 rounded-lg text-center">
                      <p className="text-primary font-medium">
                        ✓ You've indicated interest in this idea
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        The entrepreneur will be notified and can reach out to you
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Funding */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Funding Needed
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-3xl font-bold text-primary">
                  {formatCurrency(idea.funding_needed)}
                </p>
                <Badge variant={idea.funding_type === 'crowdfunding' ? 'default' : 'secondary'} className="text-sm">
                  {idea.funding_type === 'crowdfunding' ? 'Crowd Funding' : 'Open for Investors'}
                </Badge>
              </CardContent>
            </Card>

            {/* Location */}
            {idea.location && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{idea.location}</p>
                </CardContent>
              </Card>
            )}

            {/* Entrepreneur Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Entrepreneur
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-semibold">
                    {idea.profiles.startup_name || idea.profiles.full_name}
                  </p>
                  {idea.profiles.startup_name && (
                    <p className="text-sm text-muted-foreground">{idea.profiles.full_name}</p>
                  )}
                </div>
                {idea.profiles.industry && (
                  <div>
                    <p className="text-sm text-muted-foreground">Industry</p>
                    <p className="font-medium">{idea.profiles.industry}</p>
                  </div>
                )}
                {idea.profiles.bio && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {idea.profiles.bio}
                  </p>
                )}
                {idea.profiles.website && (
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <a href={idea.profiles.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="w-4 h-4 mr-2" />
                      Visit Website
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IdeaDetail;
