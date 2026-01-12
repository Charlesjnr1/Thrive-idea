import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Rocket, Menu, X, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { path: "/discover", label: "Discover Ideas" },
    { path: "/#how-it-works", label: "How It Works" },
    { path: "/#features", label: "Features" },
  ];

  const isActivePath = (path: string) => {
    if (path.startsWith("/#")) return false;
    return location.pathname === path;
  };

  return (
    <>
      <nav
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-500 ease-out",
          isScrolled
            ? "bg-black border-b border-black/30 shadow-md"
            : "bg-black"
        )}
      >

        <div className="container px-4 md:px-6">
  <div className="flex items-center justify-between h-17">
    {/* Logo */}
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


            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "relative font-medium transition-all duration-300 group text-white ",
                    isActivePath(item.path) && "text-yellow-500"
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 transition-all duration-300 group-hover:w-full",
                      isActivePath(item.path) && "w-full"
                    )}
                  />
                </Link>
              ))}
            </div>

            {/* Auth Buttons - Desktop */}
            <div className="hidden lg:flex items-center gap-3">
              <Button
                asChild
                variant="ghost"
                className="font-medium text-white  hover:bg-yellow-400/10 transition-all duration-300"
              >
                <Link to="/auth?mode=login">Login</Link>
              </Button>
              <Button
                asChild
                className="relative bg-yellow-600  hover:shadow-lg hover:shadow-yellow-500/25 transform hover:scale-105 transition-all duration-300 font-medium group overflow-hidden"
              >
                <Link to="/auth?mode=signup">
                  <span className="relative z-10">Sign up</span>
                  <div className="absolute inset-0 bg-yellow-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-accent/10 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden bg-background/95 backdrop-blur-xl transition-all duration-500 ease-in-out",
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        <div className="container px-4 md:px-6 pt-20 pb-8">
          <div className="flex flex-col space-y-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-2xl font-semibold py-3 px-4 rounded-xl transition-all duration-300 border-l-4 text-white hover:text-yellow-400 hover:bg-yellow-400/10",
                  isActivePath(item.path)
                    ? "text-yellow-500 bg-yellow-400/10 border-yellow-500"
                    : "border-transparent hover:border-yellow-400/30"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="flex flex-col gap-4 pt-8 border-t border-border/40">
              <Button
                asChild
                variant="ghost"
                className="justify-center py-6 text-lg font-medium text-white hover:text-yellow-500"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link to="/auth?mode=login">Login</Link>
              </Button>
              <Button
                asChild
                className="justify-center py-6 text-lg font-medium bg-yellow-700 hover:bg-yellow-600 hover:shadow-lg hover:shadow-yellow-500/25"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link to="/auth?mode=signup">Sign up</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
