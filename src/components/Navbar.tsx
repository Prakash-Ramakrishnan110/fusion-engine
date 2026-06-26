import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const primaryLinks = [
  { label: "Why Us", href: "/why-us" },
  { label: "Pricing", href: "/pricing" },
  { label: "About Us", href: "/about" },
];

const solutionsLinks = [
  { label: "Services", href: "/services" },
  { label: "Process", href: "/process" },
  { label: "Products", href: "/products" },
  { label: "Industries", href: "/industries" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
    setSolutionsOpen(false);
  }, [location]);

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm flex items-center" 
      role="navigation" 
    >
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <div className="relative p-2 sm:p-3 lg:p-4">
            <img 
              src="/header-logo.png" 
              alt="Fusion Engine Technology" 
              className="h-8 w-auto sm:h-10 md:h-12 lg:h-14 xl:h-16 object-contain drop-shadow-lg transition-all duration-300 group-hover:scale-105"
              loading="eager" 
              decoding="async"
              style={{ maxWidth: '160px', height: 'auto' }}
            />
          </div>
        </Link>

        {/* Mobile menu toggle */}
        <div className="xl:hidden flex items-center py-4">
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle mobile navigation menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop nav */}
        <div className="hidden xl:flex items-center gap-1 flex-1 justify-center">
          
          {/* Solutions Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setSolutionsOpen(true)}
            onMouseLeave={() => setSolutionsOpen(false)}
          >
            <button
              className={`flex items-center gap-1 text-sm px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                solutionsLinks.some(link => location.pathname === link.href)
                  ? "text-primary bg-primary/5"
                  : "text-slate-600 hover:text-primary hover:bg-slate-50"
              }`}
            >
              Solutions
              <ChevronDown size={16} className={`transition-transform duration-300 ${solutionsOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {solutionsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-48"
                >
                  <div className="bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden py-2">
                    {solutionsLinks.map((link) => (
                      <Link
                        key={link.label}
                        to={link.href}
                        className={`block px-4 py-2 text-sm transition-colors ${
                          location.pathname === link.href
                            ? "text-primary bg-primary/5 font-semibold"
                            : "text-slate-600 hover:text-primary hover:bg-slate-50"
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Regular Links */}
          {primaryLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`text-sm px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                location.pathname === link.href
                  ? "text-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm"
                  : "text-slate-600 hover:text-primary hover:bg-slate-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Get Started Button */}
        <div className="hidden xl:flex items-center">
          <Link
            to="/contact"
            className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-xl z-50 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-2 max-h-[80vh] overflow-y-auto">
              
              <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Solutions</div>
              {solutionsLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                    location.pathname === link.href
                      ? "text-primary bg-primary/5"
                      : "text-slate-600 hover:text-primary hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="h-px bg-gray-100 my-2"></div>
              
              <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Company</div>
              {primaryLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                    location.pathname === link.href
                      ? "text-primary bg-primary/5"
                      : "text-slate-600 hover:text-primary hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link
                  to="/contact"
                  className="block w-full px-4 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors text-center"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
