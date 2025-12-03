import { Rocket, Twitter, Linkedin, Github, Mail, MapPin, Phone, Crown, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black overflow-hidden border-t border-gray-900">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Subtle Accent Orbs */}
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-10 right-10 w-80 h-80 bg-purple-500/3 rounded-full blur-3xl animate-pulse-slower" />
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, #333 1px, transparent 1px),
                             linear-gradient(to bottom, #333 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        {/* Top Border Gradient */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
      </div>

      <div className="container relative z-10 px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <Link
  to="/"
  className="flex items-center"
  onClick={() => setIsMobileMenuOpen(false)}
>
  <img
    src="/images/me.jpeg"   // or your PNG/SVG version
    alt="Logo"
    className="h-16 w-35 object-contain" // increased height from 16 to 20
    style={{ filter: 'brightness(1.3) contrast(1.4)' }} // makes it pop more
  />
</Link>
            
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              Where visionary entrepreneurs meet strategic investors to build the next generation 
              of industry leaders. Join our elite network to transform ideas into reality.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4 mb-6">
              {[
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Mail, href: "#", label: "Email" }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="group p-2 bg-gray-900 rounded-lg border border-gray-800 hover:bg-amber-500/10 hover:border-amber-500/30 transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 text-gray-400 group-hover:text-amber-300 transition-colors duration-300" />
                </a>
              ))}
            </div>

            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 backdrop-blur-sm rounded-full border border-gray-800">
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 text-sm font-medium">Verified Platform</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-bold text-white mb-6 text-lg flex items-center gap-2">
              <span>Platform</span>
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Discover Ideas", href: "/discover" },
                { name: "How It Works", href: "/#how-it-works" },
                { name: "Features", href: "/#features" },
                { name: "Success Stories", href: "/success" }
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href}
                    className="text-gray-400 hover:text-amber-300 transition-all duration-300 hover:translate-x-1 flex items-center gap-2 group"
                  >
                    <div className="w-1 h-1 bg-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-bold text-white mb-6 text-lg flex items-center gap-2">
              <span>Company</span>
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            </h3>
            <ul className="space-y-3">
              {[
                { name: "About Us", href: "/about" },
                { name: "Our Team", href: "/team" },
                { name: "Careers", href: "/careers" },
                { name: "Press Kit", href: "/press" }
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href}
                    className="text-gray-400 hover:text-amber-300 transition-all duration-300 hover:translate-x-1 flex items-center gap-2 group"
                  >
                    <div className="w-1 h-1 bg-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-bold text-white mb-6 text-lg flex items-center gap-2">
              <span>Support</span>
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Help Center", href: "/help" },
                { name: "Contact Us", href: "/contact" },
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Service", href: "/terms" }
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href}
                    className="text-gray-400 hover:text-amber-300 transition-all duration-300 hover:translate-x-1 flex items-center gap-2 group"
                  >
                    <div className="w-1 h-1 bg-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-white mb-6 text-lg flex items-center gap-2">
              <span>Contact</span>
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-sm">Lagos, Nigeria</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-sm">hello@thrivenation.com</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-sm">+234 803 4403 780</span>
              </li>
            </ul>

            {/* Newsletter Signup */}
            <div className="mt-6">
              <p className="text-white text-sm font-medium mb-3">Stay Updated</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-amber-500/40 transition-colors duration-300"
                />
                <Button 
                  size="sm"
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-white border-0 shadow-lg hover:shadow-amber-500/25 transition-all duration-300"
                >
                  Join
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-900 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 text-sm">
              <p>&copy; {currentYear} ThriveNation. All rights reserved. Built with ❤️ for innovators.</p>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <Link to="/privacy" className="text-gray-500 hover:text-amber-300 transition-colors duration-300">
                Privacy
              </Link>
              <Link to="/terms" className="text-gray-500 hover:text-amber-300 transition-colors duration-300">
                Terms
              </Link>
              <Link to="/cookies" className="text-gray-500 hover:text-amber-300 transition-colors duration-300">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(180deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-pulse-slower {
          animation: pulse-slower 6s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
