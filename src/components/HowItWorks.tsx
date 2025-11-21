import { UserPlus, FileText, Search, HandshakeIcon, Sparkles, ArrowRight, Zap, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  {
    icon: UserPlus,
    title: "Create Profile",
    description: "Sign up as Entrepreneur or Investor and complete your profile",
    color: "from-yellow-400 to-amber-500",
    accent: "bg-yellow-400",
    delay: "100"
  },
  {
    icon: FileText,
    title: "Post & Browse",
    description: "Share your startup or explore investment opportunities",
    color: "from-amber-400 to-orange-500",
    accent: "bg-amber-400",
    delay: "200"
  },
  {
    icon: Search,
    title: "Smart Match",
    description: "AI-powered matching connects you with perfect partners",
    color: "from-orange-400 to-red-500",
    accent: "bg-orange-400",
    delay: "300"
  },
  {
    icon: HandshakeIcon,
    title: "Connect & Fund",
    description: "Secure messaging and deal closing all in one platform",
    color: "from-red-400 to-pink-500",
    accent: "bg-red-400",
    delay: "400"
  },
];

const HowItWorks = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/20 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Geometric Patterns */}
        <div className="absolute top-20 right-20 w-40 h-40 border-2 border-amber-200/30 rounded-3xl rotate-45 animate-pulse-slow" />
        <div className="absolute bottom-40 left-20 w-32 h-32 border-2 border-yellow-200/40 rounded-2xl rotate-12 animate-pulse-slower" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 border border-orange-200/50 rounded-full animate-float" />
        
        {/* Gradient Spots */}
        <div className="absolute top-10 left-10 w-60 h-60 bg-gradient-to-r from-yellow-200/20 to-amber-200/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-r from-amber-200/15 to-orange-200/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-4">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-full mb-4 border border-amber-400/20">
            <Play className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-600">Simple Process</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-800">
            How It Works
          </h2>
          
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Get started in four simple steps and transform your entrepreneurial journey
          </p>
        </div>

        {/* Process Visualization */}
        <div className="relative max-w-6xl mx-auto mb-16">
          {/* Main Process Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-amber-200 via-amber-300 to-orange-200 transform -translate-y-1/2 rounded-full" />
          
          {/* Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`relative transition-all duration-700 delay-${step.delay} ${
                  isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-10'
                }`}
              >
                {/* Step Card */}
                <div 
                  className="group relative bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl border border-amber-100 hover:border-amber-200 transition-all duration-500 hover:transform hover:scale-105 cursor-pointer"
                  onMouseEnter={() => setActiveStep(index)}
                  onMouseLeave={() => setActiveStep(-1)}
                >
                  {/* Step Number */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      activeStep === index 
                        ? `bg-gradient-to-r ${step.color} text-white shadow-lg`
                        : 'bg-amber-100 text-amber-600 group-hover:bg-amber-200'
                    }`}>
                      {index + 1}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                    activeStep === index
                      ? `bg-gradient-to-r ${step.color} shadow-lg`
                      : 'bg-amber-50 group-hover:bg-amber-100'
                  }`}>
                    <step.icon className={`w-8 h-8 transition-colors duration-300 ${
                      activeStep === index ? 'text-white' : 'text-amber-600'
                    }`} />
                  </div>

                  {/* Content */}
                  <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                    activeStep === index ? 'text-amber-600' : 'text-slate-800'
                  }`}>
                    {step.title}
                  </h3>
                  
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Hover Arrow */}
                  <div className={`mt-3 transition-all duration-300 ${
                    activeStep === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}>
                    <ArrowRight className="w-4 h-4 text-amber-500 mx-auto" />
                  </div>
                </div>

                {/* Connection Dots for Mobile */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center mt-4">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <div className="w-1 h-8 bg-gradient-to-b from-amber-200 to-orange-200 rounded-full" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Feature Highlights */}
        <div className={`grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16 transition-all duration-1000 delay-500 ${
          isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-10'
        }`}>
          {[
            { icon: Zap, text: "No hidden fees" },
            { icon: Sparkles, text: "Verified users only" },
            { icon: HandshakeIcon, text: "Secure communication" },
          ].map((feature, index) => (
            <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-amber-50">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <feature.icon className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-sm font-medium text-slate-700">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className={`text-center transition-all duration-1000 delay-700 ${
          isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-10'
        }`}>
          <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-3xl p-8 text-white max-w-2xl mx-auto shadow-lg">
            <h3 className="text-2xl font-bold mb-3">Ready to Get Started?</h3>
            <p className="text-amber-100 mb-6 max-w-md mx-auto">
              Join thousands of entrepreneurs and investors already transforming their futures
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                className="bg-white text-amber-600 hover:bg-amber-50 font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <Link to="/auth">
                  Create Account
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline"
                className="border-white text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-xl transition-all duration-300"
              >
                <Link to="/discover">
                  Browse Ideas
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;