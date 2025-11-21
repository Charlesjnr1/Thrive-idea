import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Rocket, ArrowLeft, Upload, X, Loader2, Save, Send } from "lucide-react";
import { Link } from "react-router-dom";
import type { User } from "@supabase/supabase-js";

const CATEGORIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "E-commerce",
  "Education",
  "Real Estate",
  "Food & Beverage",
  "Manufacturing",
  "Sustainability",
  "Other"
];

const SubmitIdea = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [businessStage, setBusinessStage] = useState<"idea" | "mvp" | "revenue" | "scaling">("idea");
  const [fundingNeeded, setFundingNeeded] = useState("");
  const [fundingType, setFundingType] = useState<"investor" | "crowdfunding">("investor");
  const [location, setLocation] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [pitchDeckFile, setPitchDeckFile] = useState<File | null>(null);
  const [existingPitchDeck, setExistingPitchDeck] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [draftId, setDraftId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      // Check for user type
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("user_id", session.user.id)
        .single();

      if (profile?.user_type !== "entrepreneur") {
        toast.error("Only entrepreneurs can post ideas");
        navigate("/dashboard");
        return;
      }

      // Check for existing draft
      const { data: draft } = await supabase
        .from("ideas")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("status", "draft")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (draft) {
        setDraftId(draft.id);
        setTitle(draft.title || "");
        setDescription(draft.description || "");
        setCategory(draft.category || "");
        setBusinessStage(draft.business_stage);
        setFundingNeeded(draft.funding_needed?.toString() || "");
        setFundingType(draft.funding_type || "investor");
        setLocation(draft.location || "");
        setVideoUrl(draft.video_url || "");
        setExistingPitchDeck(draft.pitch_deck_url);
        toast.info("Continuing from your saved draft");
      }

      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${folder}/${Date.now()}.${fileExt}`;

    const { error: uploadError, data } = await supabase.storage
      .from('pitch-materials')
      .upload(fileName, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('pitch-materials')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handlePitchDeckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a PDF or image file (JPEG, JPG, PNG)");
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB
        toast.error("File size must be less than 10MB");
        return;
      }
      setPitchDeckFile(file);
      setExistingPitchDeck(null);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid image type`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    setImageFiles(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 images
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const saveDraft = async () => {
    if (!user || !title.trim()) {
      toast.error("Please at least provide a title for your idea");
      return;
    }

    setIsSavingDraft(true);

    try {
      let pitchDeckUrl = existingPitchDeck;
      if (pitchDeckFile) {
        pitchDeckUrl = await uploadFile(pitchDeckFile, 'pitch-decks');
      }

      const ideaData = {
        user_id: user.id,
        title: title.trim(),
        description: description.trim() || "Draft in progress",
        category: category || "Other",
        business_stage: businessStage,
        funding_needed: fundingNeeded ? parseInt(fundingNeeded) : 0,
        funding_type: fundingType,
        location: location.trim() || null,
        video_url: videoUrl.trim() || null,
        pitch_deck_url: pitchDeckUrl,
        status: "draft"
      };

      if (draftId) {
        const { error } = await supabase
          .from("ideas")
          .update(ideaData)
          .eq("id", draftId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("ideas")
          .insert(ideaData)
          .select()
          .single();

        if (error) throw error;
        setDraftId(data.id);
      }

      toast.success("Draft saved successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to save draft");
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !category || !fundingNeeded) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      let pitchDeckUrl = existingPitchDeck;
      if (pitchDeckFile) {
        const uploadedUrl = await uploadFile(pitchDeckFile, 'pitch-decks');
        if (!uploadedUrl) {
          toast.error("Failed to upload pitch deck");
          setIsSubmitting(false);
          return;
        }
        pitchDeckUrl = uploadedUrl;
      }

      // Upload images if any
      const imageUrls = [];
      for (const file of imageFiles) {
        const uploadedUrl = await uploadFile(file, 'images');
        if (uploadedUrl) imageUrls.push(uploadedUrl);
      }

      const ideaData = {
        user_id: user!.id,
        title: title.trim(),
        description: description.trim(),
        category,
        business_stage: businessStage,
        funding_needed: parseInt(fundingNeeded),
        funding_type: fundingType,
        location: location.trim() || null,
        video_url: videoUrl.trim() || null,
        pitch_deck_url: pitchDeckUrl,
        status: "published"
      };

      if (draftId) {
        const { error } = await supabase
          .from("ideas")
          .update(ideaData)
          .eq("id", draftId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("ideas")
          .insert(ideaData);

        if (error) throw error;
      }

      toast.success("Idea published successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit idea");
    } finally {
      setIsSubmitting(false);
    }
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
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Dashboard</span>
            </Link>

            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ThriveNation
              </span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Post Your Startup Idea</h1>
          <p className="text-muted-foreground text-lg">
            Share your vision with potential investors around the world
          </p>
        </div>

        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Idea Details</CardTitle>
            <CardDescription>
              Fill in the information about your startup idea. You can save as draft and continue later.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Idea Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Enter a catchy title for your startup idea"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  maxLength={100}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your startup idea, what problem it solves, and why it's unique..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={6}
                  maxLength={2000}
                />
                <p className="text-xs text-muted-foreground">
                  {description.length}/2000 characters
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category <span className="text-destructive">*</span>
                  </Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Business Stage */}
                <div className="space-y-2">
                  <Label htmlFor="stage">
                    Business Stage <span className="text-destructive">*</span>
                  </Label>
                  <Select value={businessStage} onValueChange={(value: any) => setBusinessStage(value)} required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="idea">Idea Stage</SelectItem>
                      <SelectItem value="mvp">MVP</SelectItem>
                      <SelectItem value="revenue">Generating Revenue</SelectItem>
                      <SelectItem value="scaling">Scaling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Funding Needed */}
                <div className="space-y-2">
                  <Label htmlFor="funding">
                    Funding Needed (USD) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="funding"
                    type="number"
                    placeholder="50000"
                    value={fundingNeeded}
                    onChange={(e) => setFundingNeeded(e.target.value)}
                    required
                    min="0"
                  />
                </div>

                {/* Funding Type */}
                <div className="space-y-2">
                  <Label htmlFor="fundingType">
                    Funding Type <span className="text-destructive">*</span>
                  </Label>
                  <Select value={fundingType} onValueChange={(value: any) => setFundingType(value)} required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="investor">Open for Investors</SelectItem>
                      <SelectItem value="crowdfunding">Crowd Funding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="City, Country"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              {/* Video URL */}
              <div className="space-y-2">
                <Label htmlFor="videoUrl">Video Pitch URL (Optional)</Label>
                <Input
                  id="videoUrl"
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Link to your video pitch (YouTube, Vimeo, etc.)
                </p>
              </div>

              {/* Pitch Deck Upload */}
              <div className="space-y-2">
                <Label htmlFor="pitchDeck">Pitch Deck (PDF or Image)</Label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('pitchDeck')?.click()}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {pitchDeckFile ? pitchDeckFile.name : existingPitchDeck ? "Change Pitch Deck" : "Upload Pitch Deck"}
                  </Button>
                  {(pitchDeckFile || existingPitchDeck) && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setPitchDeckFile(null);
                        setExistingPitchDeck(null);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <input
                  id="pitchDeck"
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handlePitchDeckChange}
                />
                <p className="text-xs text-muted-foreground">
                  Upload your pitch deck (PDF, JPEG, PNG - Max 10MB)
                </p>
              </div>

              {/* Image Uploads */}
              <div className="space-y-2">
                <Label htmlFor="images">Additional Images (Optional)</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('images')?.click()}
                  className="w-full"
                  disabled={imageFiles.length >= 5}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Images ({imageFiles.length}/5)
                </Button>
                <input
                  id="images"
                  type="file"
                  className="hidden"
                  accept=".jpg,.jpeg,.png"
                  multiple
                  onChange={handleImageChange}
                />
                {imageFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {imageFiles.map((file, index) => (
                      <div key={index} className="relative">
                        <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center text-xs p-2 text-center">
                          {file.name.substring(0, 15)}...
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6"
                          onClick={() => removeImage(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Upload up to 5 images (JPEG, PNG - Max 5MB each)
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={saveDraft}
                  disabled={isSavingDraft || isSubmitting}
                  className="flex-1"
                >
                  {isSavingDraft ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Draft
                    </>
                  )}
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting || isSavingDraft}
                  className="flex-1 bg-gradient-to-r from-primary to-accent"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Publish Idea
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SubmitIdea;
