import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket, TrendingUp, Sparkles, Users, Zap, Target } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/afr.jpg";
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
      className="relative min-h-screen flex items-center bg-white overflow-hidden"
    >
      {/* Background Image - Full opacity */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Entrepreneurs and investors collaborating" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content - Aligned to left */}
      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-3xl"> {/* Reduced max-width for left-aligned content */}
         
          {/* Main Heading with Staggered Animation */}
          <div className="space-y-4 mb-8">
            <h1 className={`text-4xl text-white drop-shadow-lg md:text-5xl font-black  mb-3 leading-tight transition-all duration-1000 delay-200 ${
              isVisible ? 'animate-fade-in-up ' : 'opacity-0 translate-y-10'
            }`}>
              Connect Your{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-gray-900 via-[#d46337] to-yellow-700 bg-clip-text text-transparent animate-gradient-x">
                  Vision
                </span>
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent animate-pulse" />
              </span>
            </h1>
            
            <h2 className={`text-5xl md:text-4xl font-bold bg-gradient-to-r from-[#fcfcfa] via-yellow-400 to-[#fcfbf7] bg-clip-text text-transparent animate-gradient-x transition-all duration-1000 delay-400 ${
              isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-10'
            }`}>
              With Capital
            </h2>
          </div>

          {/* Subtitle */}
          <p className={`text-xl md:text-2xl mb-12 text-white leading-relaxed font-medium transition-all duration-1000 delay-600 ${
            isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-10'
          }`}>
            ThriveNation is the premier platform where groundbreaking entrepreneurs connect with visionary investors. 
            Post your startup, discover transformative ideas, and build the future together through strategic partnerships.
          </p>

          {/* CTA Buttons - Aligned to left */}
          <div
            className={`flex flex-col sm:flex-row gap-6 items-start mb-16 transition-all duration-1000 delay-800 ${
              isVisible ? "animate-fade-in-up opacity-100" : "opacity-0 translate-y-10"
            }`}
          >
            {/* Primary Gold Button */}
            <Button
              asChild
              size="lg"
              className="group relative text-lg px-10 py-7 bg-gradient-to-r bg-orange-600 text-black font-bold  "
            >
              <Link to="/auth">
                <span className="relative z-10 flex items-center">
                  Launch Your Journey
                  <ArrowRight className="ml-3 w-5 h-5 text-black group-hover:translate-x-2 transition-transform duration-300" />
                </span>

                {/* Hover shine layer */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#fbe7a1] to-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Top shine line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-white/80 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </Link>
            </Button>

            {/* Secondary Button */}
            <Button
              asChild
              size="lg"
              variant="outline"
              className="group text-lg px-10 py-7 bg-white/90 backdrop-blur-xl border-2  text-gray-800"
            >
              <Link to="/discover">
                <TrendingUp className="mr-3 w-5 h-5  group-hover:scale-110 transition-transform duration-300" />
                Explore Innovations
              </Link>
            </Button>
          </div>

          {/* Enhanced Stats Section - Aligned to left */}
          <div className={`grid grid-cols-1  md:grid-cols-3 gap-8 max-w-3xl transition-all duration-1000 delay-1000 ${
            isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-10'
          }`}>
            {[
              { 
                icon: Zap, 
                value: startupCount, 
                suffix: "+", 
                label: "Innovative Startups", 
                 
              },
              { 
                icon: Users, 
                value: investorCount, 
                suffix: "+", 
                label: "Active Investors", 
                
              },
              { 
                icon: Target, 
                value: fundingCount, 
                suffix: "M+", 
                prefix: "$",
                label: "Funding Deployed", 
                 
              },
            ].map((stat, index) => (
              <div 
                key={stat.label}
                className="group text-left  p-4 bg-black/30 backdrop-blur-lg rounded-2xl border border-gray-200 hover:border-[#D4AF37]/30 transition-all duration-500 hover:transform hover:scale-105 hover:bg-white shadow-lg"
                style={{ animationDelay: `${1200 + index * 200}ms` }}
              >
               
                <div className="text-3xl text-white md:text-4xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-[#D4AF37] bg-clip-text text-transparent">
                  {stat.prefix || ""}{stat.value}{stat.suffix}
                </div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  {stat.label}
                </div>
                <div className="w-0 group-hover:w-1/2 h-0.5 bg-gradient-to-r from-[#D4AF37] to-transparent mt-3 transition-all duration-500" />
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
