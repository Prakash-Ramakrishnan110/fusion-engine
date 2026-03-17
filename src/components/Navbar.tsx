import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Process", href: "/process" },
  { label: "Products", href: "/products" },
  { label: "Industries", href: "/industries" },
  { label: "Why Us", href: "/why-us" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-lg flex items-center pt-0 pb-0" 
      role="navigation" 
      aria-label="Main navigation"
    >
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <div className="relative p-2">
            <img 
              src="/src/components/mylogo.png" 
              alt="Fusion Engine Technology" 
              className="h-12 sm:h-14 md:h-16 lg:h-16 w-auto object-contain drop-shadow-lg"
              loading="eager" 
              decoding="async"
            />
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden xl:flex items-center gap-2 flex-1 justify-center" role="menubar">
          {navLinks.map((link) => (
            <div key={link.label}>
              <div>
                <Link
                  to={link.href}
                  className={`text-sm px-4 py-2 rounded-lg font-medium transition-all duration-300 block ${
                    location.pathname === link.href
                      ? "text-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm dark:bg-primary/10"
                      : "text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-900"
                  }`}
                  role="menuitem"
                  aria-current={location.pathname === link.href ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Get Started Button */}
        <div className="hidden xl:flex items-center">
          <Link
            to="/contact"
            className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-lg"
            role="menuitem"
            aria-label="Get Started - Contact us"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
