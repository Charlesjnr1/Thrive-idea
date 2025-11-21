import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, Circle, Upload, User, MapPin, Building2, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

interface ProfileData {
  id: string;
  full_name: string;
  user_type: "entrepreneur" | "investor";
  avatar_url: string | null;
  avatar_storage_path: string | null;
  nin: string | null;
  bvn: string | null;
  id_type: string | null;
  id_number: string | null;
  id_document_url: string | null;
  home_address: string | null;
  business_address: string | null;
  contact_phone: string | null;
  whatsapp: string | null;
  linkedin: string | null;
  twitter: string | null;
  facebook: string | null;
  instagram: string | null;
  bank_name: string | null;
  account_number: string | null;
  account_name: string | null;
  kyc_completed: boolean;
  contact_completed: boolean;
  bank_completed: boolean;
}

const NIGERIAN_BANKS = [
  "Access Bank",
  "Citibank Nigeria",
  "Ecobank Nigeria",
  "Fidelity Bank",
  "First Bank of Nigeria",
  "First City Monument Bank (FCMB)",
  "Globus Bank",
  "Guaranty Trust Bank (GTBank)",
  "Heritage Bank",
  "Keystone Bank",
  "Polaris Bank",
  "Providus Bank",
  "Stanbic IBTC Bank",
  "Standard Chartered Bank",
  "Sterling Bank",
  "SunTrust Bank",
  "Union Bank of Nigeria",
  "United Bank for Africa (UBA)",
  "Unity Bank",
  "Wema Bank",
  "Zenith Bank",
];

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [idDocFile, setIdDocFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (error) {
        toast.error("Failed to load profile");
        console.error(error);
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [navigate]);

  const calculateProgress = () => {
    if (!profile) return 0;
    let completed = 0;
    if (profile.kyc_completed) completed++;
    if (profile.contact_completed) completed++;
    if (profile.bank_completed) completed++;
    return (completed / 3) * 100;
  };

  const uploadFile = async (file: File, bucket: string, path: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return publicUrl;
  };

  const handleSaveKYC = async () => {
    if (!profile) return;
    setSaving(true);

    try {
      let avatarUrl = profile.avatar_url;
      let idDocUrl = profile.id_document_url;

      if (avatarFile) {
        const path = `avatars/${profile.id}-${Date.now()}.${avatarFile.name.split('.').pop()}`;
        avatarUrl = await uploadFile(avatarFile, "pitch-materials", path);
      }

      if (idDocFile) {
        const path = `id-documents/${profile.id}-${Date.now()}.${idDocFile.name.split('.').pop()}`;
        idDocUrl = await uploadFile(idDocFile, "pitch-materials", path);
      }

      const kycCompleted = !!(
        avatarUrl &&
        profile.nin &&
        profile.bvn &&
        profile.id_type &&
        profile.id_number &&
        idDocUrl
      );

      const { error } = await supabase
        .from("profiles")
        .update({
          avatar_url: avatarUrl,
          nin: profile.nin,
          bvn: profile.bvn,
          id_type: profile.id_type,
          id_number: profile.id_number,
          id_document_url: idDocUrl,
          kyc_completed: kycCompleted,
        })
        .eq("id", profile.id);

      if (error) throw error;

      setProfile({ ...profile, avatar_url: avatarUrl, id_document_url: idDocUrl, kyc_completed: kycCompleted });
      toast.success("KYC information saved successfully");
    } catch (error: any) {
      toast.error("Failed to save KYC information");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveContact = async () => {
    if (!profile) return;
    setSaving(true);

    try {
      const contactCompleted = !!(
        profile.home_address &&
        profile.business_address &&
        profile.contact_phone
      );

      const { error } = await supabase
        .from("profiles")
        .update({
          home_address: profile.home_address,
          business_address: profile.business_address,
          contact_phone: profile.contact_phone,
          whatsapp: profile.whatsapp,
          linkedin: profile.linkedin,
          twitter: profile.twitter,
          facebook: profile.facebook,
          instagram: profile.instagram,
          contact_completed: contactCompleted,
        })
        .eq("id", profile.id);

      if (error) throw error;

      setProfile({ ...profile, contact_completed: contactCompleted });
      toast.success("Contact details saved successfully");
    } catch (error: any) {
      toast.error("Failed to save contact details");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBank = async () => {
    if (!profile) return;
    setSaving(true);

    try {
      const bankCompleted = !!(
        profile.bank_name &&
        profile.account_number &&
        profile.account_name
      );

      const { error } = await supabase
        .from("profiles")
        .update({
          bank_name: profile.bank_name,
          account_number: profile.account_number,
          account_name: profile.account_name,
          bank_completed: bankCompleted,
        })
        .eq("id", profile.id);

      if (error) throw error;

      setProfile({ ...profile, bank_completed: bankCompleted });
      toast.success("Bank details saved successfully");
    } catch (error: any) {
      toast.error("Failed to save bank details");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile || profile.user_type !== "entrepreneur") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>This section is only available for entrepreneurs.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/dashboard">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container px-4 py-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon">
              <Link to="/dashboard">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Entrepreneur Profile</h1>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 max-w-4xl">
        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Profile Completion</CardTitle>
            <CardDescription>Complete all sections to unlock full platform features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span className="font-medium">{Math.round(calculateProgress())}%</span>
              </div>
              <Progress value={calculateProgress()} />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-lg border border-border">
                {profile.kyc_completed ? (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium">KYC</p>
                  <p className="text-xs text-muted-foreground">
                    {profile.kyc_completed ? "Completed" : "Pending"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg border border-border">
                {profile.contact_completed ? (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium">Contact</p>
                  <p className="text-xs text-muted-foreground">
                    {profile.contact_completed ? "Completed" : "Pending"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg border border-border">
                {profile.bank_completed ? (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium">Bank Details</p>
                  <p className="text-xs text-muted-foreground">
                    {profile.bank_completed ? "Completed" : "Pending"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KYC Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <CardTitle>KYC Information</CardTitle>
            </div>
            <CardDescription>Know Your Customer verification details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="avatar">Profile Picture *</Label>
              <div className="flex items-center gap-4">
                {profile.avatar_url && (
                  <img 
                    src={profile.avatar_url} 
                    alt="Profile" 
                    className="w-20 h-20 rounded-full object-cover border-2 border-border"
                  />
                )}
                <div className="flex-1">
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nin">NIN (National Identity Number) *</Label>
                <Input
                  id="nin"
                  value={profile.nin || ""}
                  onChange={(e) => setProfile({ ...profile, nin: e.target.value })}
                  placeholder="Enter your NIN"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bvn">BVN (Bank Verification Number) *</Label>
                <Input
                  id="bvn"
                  value={profile.bvn || ""}
                  onChange={(e) => setProfile({ ...profile, bvn: e.target.value })}
                  placeholder="Enter your BVN"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="idType">ID Type *</Label>
                <Select
                  value={profile.id_type || ""}
                  onValueChange={(value) => setProfile({ ...profile, id_type: value })}
                >
                  <SelectTrigger id="idType">
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passport">International Passport</SelectItem>
                    <SelectItem value="drivers_license">Driver's License</SelectItem>
                    <SelectItem value="nin_card">NIN Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="idNumber">ID Number *</Label>
                <Input
                  id="idNumber"
                  value={profile.id_number || ""}
                  onChange={(e) => setProfile({ ...profile, id_number: e.target.value })}
                  placeholder="Enter ID number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="idDoc">Upload ID Document *</Label>
              <div className="flex items-center gap-4">
                {profile.id_document_url && (
                  <a 
                    href={profile.id_document_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    <Upload className="w-4 h-4" />
                    View Document
                  </a>
                )}
                <Input
                  id="idDoc"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setIdDocFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>

            <Button onClick={handleSaveKYC} disabled={saving} className="w-full">
              {saving ? "Saving..." : "Save KYC Information"}
            </Button>
          </CardContent>
        </Card>

        {/* Contact Details Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <CardTitle>Contact Details</CardTitle>
            </div>
            <CardDescription>Your address and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="homeAddress">Home Address *</Label>
              <Textarea
                id="homeAddress"
                value={profile.home_address || ""}
                onChange={(e) => setProfile({ ...profile, home_address: e.target.value })}
                placeholder="Enter your home address"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessAddress">Business Address *</Label>
              <Textarea
                id="businessAddress"
                value={profile.business_address || ""}
                onChange={(e) => setProfile({ ...profile, business_address: e.target.value })}
                placeholder="Enter your business address"
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone *</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={profile.contact_phone || ""}
                  onChange={(e) => setProfile({ ...profile, contact_phone: e.target.value })}
                  placeholder="+234 xxx xxx xxxx"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  value={profile.whatsapp || ""}
                  onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                  placeholder="+234 xxx xxx xxxx"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  type="url"
                  value={profile.linkedin || ""}
                  onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter/X</Label>
                <Input
                  id="twitter"
                  type="url"
                  value={profile.twitter || ""}
                  onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                  placeholder="https://twitter.com/..."
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  type="url"
                  value={profile.facebook || ""}
                  onChange={(e) => setProfile({ ...profile, facebook: e.target.value })}
                  placeholder="https://facebook.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  type="url"
                  value={profile.instagram || ""}
                  onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>

            <Button onClick={handleSaveContact} disabled={saving} className="w-full">
              {saving ? "Saving..." : "Save Contact Details"}
            </Button>
          </CardContent>
        </Card>

        {/* Bank Account Details Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              <CardTitle>Bank Account Details</CardTitle>
            </div>
            <CardDescription>Your banking information for fund transfers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name *</Label>
              <Select
                value={profile.bank_name || ""}
                onValueChange={(value) => setProfile({ ...profile, bank_name: value })}
              >
                <SelectTrigger id="bankName">
                  <SelectValue placeholder="Select your bank" />
                </SelectTrigger>
                <SelectContent>
                  {NIGERIAN_BANKS.map((bank) => (
                    <SelectItem key={bank} value={bank}>
                      {bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number *</Label>
                <Input
                  id="accountNumber"
                  value={profile.account_number || ""}
                  onChange={(e) => setProfile({ ...profile, account_number: e.target.value })}
                  placeholder="0123456789"
                  maxLength={10}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountName">Account Name *</Label>
                <Input
                  id="accountName"
                  value={profile.account_name || ""}
                  onChange={(e) => setProfile({ ...profile, account_name: e.target.value })}
                  placeholder="Account holder name"
                />
              </div>
            </div>

            <Button onClick={handleSaveBank} disabled={saving} className="w-full">
              {saving ? "Saving..." : "Save Bank Details"}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
