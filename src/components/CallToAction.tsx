import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Users, Target, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const CallToAction = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900/20 overflow-hidden"
    >
      {/* Elegant Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #fbbf24 0.5px, transparent 0.5px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Subtle Animated Elements */}
      <div className="absolute inset-0">
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-6 h-6 border border-amber-400/30 rounded-full animate-float opacity-40" />
        <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-amber-400/20 rounded-full animate-float-slow opacity-30" />
        <div className="absolute bottom-1/3 left-1/3 w-8 h-8 border border-amber-400/20 rounded-full animate-pulse-slow opacity-20" />
        
        {/* Gradient Accents */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container px-4 relative z-10">
        <div className={`max-w-5xl mx-auto text-center transition-all duration-1000 ${
          isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-10'
        }`}>
          
          {/* Elegant Header */}
          <div className="mb-12">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Where Vision Meets
              <span className="block bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent mt-2">
                Opportunity
              </span>
            </h2>

            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join the platform where innovative entrepreneurs connect with visionary investors. 
              Transform your ideas into reality with the right partners by your side.
            </p>
          </div>

          
          {/* Trust Metrics */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm">500+ Successful Startups</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-sm">200+ Active Investors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <span className="text-sm">$50M+ Funding Deployed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-900 to-transparent" />
    </section>
  );
};

export default CallToAction;
