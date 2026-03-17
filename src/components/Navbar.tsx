import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

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
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location]);

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-lg flex items-center pt-0 pb-0" 
      role="navigation" 
      aria-label="Main navigation"
    >
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <div className="relative p-1 sm:p-2">
            <img 
              src="/mylogo.png" 
              alt="Fusion Engine Technology" 
              className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain drop-shadow-lg"
              loading="eager" 
              decoding="async"
            />
          </div>
        </Link>

        {/* Mobile menu toggle */}
        <div className="xl:hidden flex items-center">
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle mobile navigation menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

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

      {/* Mobile menu */}
      {open && (
        <div className="xl:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 block ${
                    location.pathname === link.href
                      ? "text-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm dark:bg-primary/10"
                      : "text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-900"
                  }`}
                  role="menuitem"
                  aria-current={location.pathname === link.href ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/contact"
                className="px-4 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-lg text-center"
                role="menuitem"
                aria-label="Get Started - Contact us"
                onClick={() => setOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
