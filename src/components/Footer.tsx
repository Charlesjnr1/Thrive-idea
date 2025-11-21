import { Rocket, Sparkles, Mail, MapPin, Phone, Twitter, Linkedin, Github, ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900/30 border-t border-amber-500/20 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Floating Gold Particles */}
        {[...Array(8)].map((_, i) => (
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
        <div className="absolute bottom-10 left-10 w-60 h-60 bg-yellow-400/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-10 right-10 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl animate-pulse-slower" />
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-yellow-500/25 transform transition-all duration-300 hover:scale-110 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <ArrowUp className="w-5 h-5 text-slate-900" />
      </button>

      <div className="container relative z-10 px-4 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-lg group-hover:shadow-yellow-500/20">
                  <Rocket className="w-6 h-6 text-slate-900 transform group-hover:rotate-12 transition-transform duration-300" />
                  <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 animate-pulse" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300 opacity-0 group-hover:opacity-100" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent leading-tight">
                  ThriveNation
                </span>
                <span className="text-sm text-slate-400 font-medium tracking-wider">
                  INNOVATE • COLLABORATE • ELEVATE
                </span>
              </div>
            </Link>
            <p className="text-slate-300 mb-6 max-w-md leading-relaxed">
              Connecting visionary entrepreneurs with strategic investors to build the future together. 
              Your journey from idea to investment starts here.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-400 hover:text-yellow-400 transition-colors duration-300">
                <Mail className="w-4 h-4" />
                <span>hello@thrivenation.com</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 hover:text-yellow-400 transition-colors duration-300">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 hover:text-yellow-400 transition-colors duration-300">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-semibold text-white mb-6 text-lg relative inline-block">
              Platform
              <div className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full" />
            </h3>
            <ul className="space-y-3">
              {[
                { to: "/discover", label: "Discover Ideas" },
                { to: "/auth", label: "Sign Up" },
                { to: "/#how-it-works", label: "How It Works" },
                { to: "/#features", label: "Features" },
              ].map((link, index) => (
                <li key={link.to}>
                  <Link 
                    to={link.to}
                    className="text-slate-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1 flex items-center gap-2 group"
                  >
                    <div className="w-1 h-1 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-white mb-6 text-lg relative inline-block">
              Company
              <div className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full" />
            </h3>
            <ul className="space-y-3">
              {[
                { to: "#", label: "About Us" },
                { to: "#", label: "Contact" },
                { to: "#", label: "Privacy Policy" },
                { to: "#", label: "Terms of Service" },
              ].map((link, index) => (
                <li key={link.to}>
                  <Link 
                    to={link.to}
                    className="text-slate-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1 flex items-center gap-2 group"
                  >
                    <div className="w-1 h-1 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Links */}
            <div className="mt-8">
              <h4 className="font-semibold text-white mb-4 text-sm">Follow Us</h4>
              <div className="flex gap-3">
                {[
                  { icon: Twitter, href: "#", color: "hover:bg-blue-400" },
                  { icon: Linkedin, href: "#", color: "hover:bg-blue-600" },
                  { icon: Github, href: "#", color: "hover:bg-gray-700" },
                ].map((social, index) => (
                  <a
                    key={social.href}
                    href={social.href}
                    className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 hover:scale-110 hover:bg-gradient-to-r hover:from-yellow-400 hover:to-amber-500 group backdrop-blur-sm"
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-amber-500/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            &copy; {currentYear} ThriveNation. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              All systems operational
            </span>
            <span>Made for innovators</span>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />
      </div>
    </footer>
  );
};

export default Footer;