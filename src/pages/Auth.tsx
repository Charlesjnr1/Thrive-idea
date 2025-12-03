import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Rocket, Loader2, Sparkles, User, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [mode, setMode] = useState<"login" | "signup">(
    searchParams.get("mode") === "login" ? "login" : "signup"
  );

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [userType, setUserType] = useState<"entrepreneur" | "investor">("entrepreneur");

  useEffect(() => {
    // Simulate loading time for the page
    const loadingTimer = setTimeout(() => {
      setIsLoadingPage(false);
      setIsVisible(true);
    }, 1500);

    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    return () => clearTimeout(loadingTimer);
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !fullName) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
            user_type: userType,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            user_id: authData.user.id,
            full_name: fullName,
            user_type: userType,
          });

        if (profileError) throw profileError;

        toast.success("Account created successfully! Welcome to ThriveNation!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Welcome back to ThriveNation!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading screen
  if (isLoadingPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900/30 p-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          {/* Floating Particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-30 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${8 + Math.random() * 8}s`,
              }}
            />
          ))}
          
          {/* Gradient Orbs */}
          <div className="absolute top-10 left-10 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse-slower" />
        </div>

        {/* Loading Content */}
        <div className="text-center text-white z-10">
          {/* Animated Logo */}
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-yellow-500/30 animate-pulse">
                <Rocket className="w-10 h-10 text-slate-900 animate-bounce" />
              </div>
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-300 animate-ping" />
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 rounded-2xl blur-lg animate-pulse-slow" />
            </div>
            
            <div className="space-y-3">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent animate-gradient-x">
                ThriveNation
              </h1>
              <p className="text-slate-400 text-lg">Preparing your journey...</p>
            </div>

            {/* Loading Progress */}
            <div className="w-48 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full animate-loading-bar" />
            </div>

            {/* Loading Dots */}
            <div className="flex space-x-2">
              {[0, 1, 2].map((dot) => (
                <div
                  key={dot}
                  className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${dot * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900/30 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 8}s`,
            }}
          />
        ))}
        
        {/* Gradient Orbs */}
        <div className="absolute top-10 left-10 w-80 h-80 bg-yellow-400/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse-slower" />
      </div>

      <Card className={`w-full max-w-md bg-slate-800/40 backdrop-blur-xl border-slate-700 shadow-2xl transition-all duration-1000 ${
        isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-10'
      }`}>
      <CardHeader className="text-center relative">
  {/* Logo Container */}
  <div className="flex flex-col items-center mb-6">
    
    
    {/* Brand text */}
    <div className="mt-4">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
        ThriveNation
      </h1>
     
    </div>
  </div>
  
  <CardTitle className="text-2xl text-white">
    {mode === "login" ? "Welcome Back" : "Join ThriveNation"}
  </CardTitle>
  <CardDescription className="text-slate-400">
    {mode === "login"
      ? "Continue your journey to success"
      : "Start your journey to success today"}
  </CardDescription>

  {/* Mode Indicator */}
  <div className="absolute top-4 right-4">
    <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 rounded-full border border-amber-400/20">
      <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
      <span className="text-xs font-medium text-amber-400">
        {mode === "login" ? "Login" : "Sign Up"}
      </span>
    </div>
  </div>
</CardHeader>

        <CardContent>
          <form onSubmit={mode === "login" ? handleLogin : handleSignUp} className="space-y-5">
            {mode === "signup" && (
              <>
                {/* Full Name Field */}
                <div className="space-y-3 group">
                  <Label htmlFor="fullName" className="text-slate-300 font-medium">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-yellow-400 transition-colors duration-300" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-500 focus:border-yellow-400 focus:ring-yellow-400/20 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* User Type Field */}
                <div className="space-y-3">
                  <Label htmlFor="userType" className="text-slate-300 font-medium">I am a...</Label>
                  <Select value={userType} onValueChange={(value: "entrepreneur" | "investor") => setUserType(value)}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white focus:border-yellow-400 focus:ring-yellow-400/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value="entrepreneur" className="focus:bg-yellow-500/10 focus:text-yellow-400">
                        🚀 Entrepreneur
                      </SelectItem>
                      <SelectItem value="investor" className="focus:bg-yellow-500/10 focus:text-yellow-400">
                        💼 Investor
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Email Field */}
            <div className="space-y-3 group">
              <Label htmlFor="email" className="text-slate-300 font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-yellow-400 transition-colors duration-300" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-500 focus:border-yellow-400 focus:ring-yellow-400/20 transition-all duration-300"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-3 group">
              <Label htmlFor="password" className="text-slate-300 font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-yellow-400 transition-colors duration-300" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-500 focus:border-yellow-400 focus:ring-yellow-400/20 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-yellow-400 transition-colors duration-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {mode === "signup" && (
                <p className="text-xs text-slate-500">Password must be at least 6 characters</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 font-semibold py-6 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-yellow-500/25 group relative overflow-hidden"
              disabled={isLoading}
            >
              <span className="relative z-10 flex items-center justify-center">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Please wait...
                  </>
                ) : mode === "login" ? (
                  <>
                    login
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                ) : (
                  <>
                    Launch Your Success
                    <Rocket className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </form>

          {/* Mode Toggle */}
          <div className="mt-6 text-center text-sm">
            {mode === "login" ? (
              <p className="text-slate-400">
                New to ThriveNation?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors duration-300 flex items-center gap-1 mx-auto"
                >
                  Sign up
                  <ArrowRight className="w-4 h-4" />
                </button>
              </p>
            ) : (
              <p className="text-slate-400">
                Already have an account?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors duration-300 flex items-center gap-1 mx-auto"
                >
                  Continue your journey
                  <ArrowRight className="w-4 h-4" />
                </button>
              </p>
            )}
          </div>

          {/* Security Note */}
          <div className="mt-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Sparkles className="w-3 h-3 text-yellow-400" />
              <span>Secure & encrypted authentication</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />
    </div>
  );
};

export default Auth;
