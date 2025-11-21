import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket, TrendingUp, Sparkles, Users, Zap, Target } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";
import { useEffect, useRef, useState } from "react";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [startupCount, setStartupCount] = useState(0);
  const [investorCount, setInvestorCount] = useState(0);
  const [fundingCount, setFundingCount] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Start counting animations
          animateNumber(0, 500, 5000, setStartupCount);
          animateNumber(0, 200, 5000, setInvestorCount);
          animateNumber(0, 50, 5000, setFundingCount);
        }
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const animateNumber = (start, end, duration, setter) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      setter(value);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-primary/20 to-accent/30"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Main Background Image with Parallax Effect */}
        <div className="absolute inset-0 transform scale-110">
          <img 
            src={heroImage} 
            alt="Entrepreneurs and investors collaborating" 
            className="w-full h-full object-cover transform scale-105"
            style={{ 
              filter: 'brightness(0.7) contrast(1.1)',
              transform: 'scale(1.1)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-accent/90 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/80" />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-accent rounded-full opacity-40 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 10}s`,
              }}
            />
          ))}
        </div>

        {/* Animated Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full blur-3xl animate-pulse-slow transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-3xl animate-pulse-slower transform translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-gradient-to-r from-primary/25 to-accent/25 rounded-full blur-3xl animate-float-slow" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-6xl mx-auto text-center text-white">
          {/* Animated Badge */}
          <div className={`inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 mb-8 transition-all duration-1000 ${
            isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-10'
          }`}>
            <div className="relative">
              <Rocket className="w-5 h-5 text-accent animate-bounce" />
              <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400 animate-ping" />
            </div>
            <span className="text-base font-semibold bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
              Where Visionary Ideas Meet Strategic Investment
            </span>
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          </div>

          {/* Main Heading with Staggered Animation */}
          <div className="space-y-4 mb-8">
            <h1 className={`text-6xl md:text-8xl font-black mb-4 leading-tight transition-all duration-1000 delay-200 ${
              isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-10'
            }`}>
              Connect Your{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-white via-accent to-yellow-400 bg-clip-text text-transparent animate-gradient-x">
                  Vision
                </span>
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent animate-pulse" />
              </span>
            </h1>
            
            <h2 className={`text-5xl md:text-7xl font-bold bg-gradient-to-r from-accent via-yellow-400 to-accent bg-clip-text text-transparent animate-gradient-x transition-all duration-1000 delay-400 ${
              isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-10'
            }`}>
              With Capital
            </h2>
          </div>

          {/* Subtitle */}
          <p className={`text-xl md:text-2xl mb-12 text-white/90 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-600 ${
            isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-10'
          }`}>
            ThriveNation is the premier platform where groundbreaking entrepreneurs connect with visionary investors. 
            Post your startup, discover transformative ideas, and build the future together through strategic partnerships.
          </p>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 transition-all duration-1000 delay-800 ${
            isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-10'
          }`}>
            <Button 
              asChild 
              size="lg" 
              className="group relative text-lg px-10 py-7 bg-gradient-to-r from-accent to-yellow-500 hover:from-yellow-500 hover:to-accent text-slate-900 font-bold rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/30 overflow-hidden"
            >
              <Link to="/auth">
                <span className="relative z-10 flex items-center">
                  Launch Your Journey
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-0 left-0 w-full h-1 bg-white/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </Link>
            </Button>

            <Button 
              asChild 
              size="lg" 
              variant="outline"
              className="group text-lg px-10 py-7 bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white hover:bg-white/20 hover:border-accent/50 rounded-2xl transform hover:scale-105 transition-all duration-300 font-semibold"
            >
              <Link to="/discover">
                <TrendingUp className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Explore Innovations
              </Link>
            </Button>
          </div>

          {/* Enhanced Stats Section with Counting Animation */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto transition-all duration-1000 delay-1000 ${
            isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-10'
          }`}>
            {[
              { 
                icon: Zap, 
                value: startupCount, 
                suffix: "+", 
                label: "Innovative Startups", 
                color: "from-blue-400 to-cyan-400" 
              },
              { 
                icon: Users, 
                value: investorCount, 
                suffix: "+", 
                label: "Active Investors", 
                color: "from-green-400 to-emerald-400" 
              },
              { 
                icon: Target, 
                value: fundingCount, 
                suffix: "M+", 
                prefix: "$",
                label: "Funding Deployed", 
                color: "from-yellow-400 to-orange-400" 
              },
            ].map((stat, index) => (
              <div 
                key={stat.label}
                className="group text-center p-6 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 hover:border-accent/30 transition-all duration-500 hover:transform hover:scale-105 hover:bg-white/10"
                style={{ animationDelay: `${1200 + index * 200}ms` }}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-r ${stat.color} transform group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
                  {stat.prefix || ""}{stat.value}{stat.suffix}
                </div>
                <div className="text-sm font-medium text-white/80 uppercase tracking-wider">
                  {stat.label}
                </div>
                <div className="w-0 group-hover:w-1/2 h-0.5 bg-gradient-to-r from-accent to-transparent mx-auto mt-3 transition-all duration-500" />
              </div>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className={`mt-16 transition-all duration-1000 delay-1200 ${
            isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex flex-col items-center gap-2 text-white/60">
              <span className="text-sm font-medium tracking-wider">DISCOVER MORE</span>
              <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-accent rounded-full mt-2 animate-bounce" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-900 to-transparent z-20" />
    </section>
  );
};

export default Hero;