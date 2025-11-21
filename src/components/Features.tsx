import { Users, Target, MessageSquare, Shield, TrendingUp, Zap, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";

const features = [
  {
    icon: Users,
    title: "For Entrepreneurs",
    description: "Showcase your startup ideas, upload pitch decks, and connect with investors ready to fund innovation.",
    gradient: "from-yellow-400 to-amber-500",
    bgGradient: "from-yellow-500/10 to-amber-600/10"
  },
  {
    icon: Target,
    title: "For Investors",
    description: "Discover verified opportunities, filter by industry and stage, and invest in the next unicorn.",
    gradient: "from-amber-400 to-orange-500",
    bgGradient: "from-amber-500/10 to-orange-600/10"
  },
  {
    icon: MessageSquare,
    title: "Secure Communication",
    description: "Built-in messaging system for confidential discussions between entrepreneurs and investors.",
    gradient: "from-yellow-500 to-amber-600",
    bgGradient: "from-yellow-600/10 to-amber-700/10"
  },
  {
    icon: Shield,
    title: "Verified Profiles",
    description: "Admin-verified users ensure authenticity and build trust in every connection.",
    gradient: "from-amber-500 to-orange-600",
    bgGradient: "from-amber-600/10 to-orange-700/10"
  },
  {
    icon: TrendingUp,
    title: "Smart Matching",
    description: "AI-powered recommendations match investors with ideas aligned to their interests.",
    gradient: "from-yellow-600 to-amber-700",
    bgGradient: "from-yellow-700/10 to-amber-800/10"
  },
  {
    icon: Zap,
    title: "Fast & Efficient",
    description: "Streamlined process from idea submission to funding discussion - no unnecessary delays.",
    gradient: "from-amber-600 to-orange-700",
    bgGradient: "from-amber-700/10 to-orange-800/10"
  },
];

const Features = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900/30 overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Floating Gold Particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-40 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 8}s`,
            }}
          />
        ))}
        
        {/* Gradient Orbs */}
        <div className="absolute top-10 left-10 w-60 h-60 bg-yellow-400/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl animate-pulse-slower" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-orange-400/5 rounded-full blur-3xl animate-float-slow" />
      </div>

      <div className="container relative z-10 px-4">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 backdrop-blur-sm rounded-full mb-4 border border-yellow-400/20">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400">Premium Features</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent animate-gradient-x">
            Why Choose{" "}
            <span className="relative inline-block">
              ThriveNation
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse" />
            </span>
            ?
          </h2>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            A complete ecosystem designed to accelerate the journey from idea to investment. 
            Experience the gold standard in startup-investor connections.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`transition-all duration-700 delay-${index * 100} ${
                isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-10'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card 
                className="group relative border border-slate-700 bg-slate-800/40 backdrop-blur-xl hover:border-yellow-400/50 hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2 overflow-hidden"
              >
                {/* Animated Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Gold Shine Effect on Hover */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                
                <CardContent className="relative z-10 p-8">
                  {/* Animated Icon Container */}
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg group-hover:shadow-yellow-500/30`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Floating Sparkles */}
                    <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                    
                    {/* Pulse Ring */}
                    <div className="absolute inset-0 border-2 border-yellow-400/30 rounded-2xl scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-yellow-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-slate-300 leading-relaxed mb-4 group-hover:text-slate-200 transition-colors duration-300">
                    {feature.description}
                  </p>

                  {/* Animated Learn More Link */}
                  <div className="flex items-center gap-2 text-yellow-400 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    <span className="text-sm font-semibold">Learn more</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-yellow-400/5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                </CardContent>

                {/* Corner Accents */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-yellow-400/0 group-hover:border-yellow-400/50 transition-all duration-500 rounded-tr-2xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-yellow-400/0 group-hover:border-yellow-400/50 transition-all duration-500 rounded-bl-2xl" />
              </Card>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-800 ${
          isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-slate-700 hover:border-yellow-400/50 transition-all duration-300 group">
            <Zap className="w-6 h-6 text-yellow-400 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-lg font-semibold text-white">
              Ready to transform your ideas into reality?
            </span>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-900 to-transparent z-0" />
    </section>
  );
};

export default Features;