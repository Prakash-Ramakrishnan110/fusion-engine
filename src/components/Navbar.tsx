import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/98 backdrop-blur-lg border-b border-border shadow-sm" role="navigation" aria-label="Main navigation">
      <div className="container mx-auto flex items-center justify-between h-20 px-4">
        <Link to="/" className="flex items-center shrink-0 hover:scale-105 transition-transform duration-200" aria-label="Fusion Engine Technology homepage">
          <div className="flex flex-col leading-tight">
            <div className="flex items-baseline">
              <span className="text-xl md:text-2xl mega-bold text-blue-500 drop-shadow-lg vibrant" aria-hidden="true">FUSION</span>
              <span className="text-xl md:text-2xl mega-bold text-gray-700 drop-shadow-lg vibrant ml-2" aria-hidden="true">ENGINE</span>
            </div>
            <span className="text-xs md:text-xs mega-bold text-gray-500 tracking-wider vibrant" aria-hidden="true">TECHNOLOGY</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden xl:flex items-center gap-2" role="menubar">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`text-sm px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                location.pathname === link.href
                  ? "text-primary bg-primary/10 shadow-sm"
                  : "text-foreground hover:text-primary hover:bg-secondary/70"
              }`}
              role="menuitem"
              aria-current={location.pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden xl:flex items-center gap-4">
          <Link
            to="/contact"
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-primary/25"
            role="menuitem"
            aria-label="Start a project - contact us"
          >
            Start a Project
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="xl:hidden text-foreground p-4 rounded-xl hover:bg-secondary/80 transition-colors min-h-[48px] min-w-[48px]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle mobile navigation menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-background/95 backdrop-blur-lg border-b border-border shadow-lg"
            id="mobile-menu"
            role="menu"
          >
            <div className="flex flex-col gap-3 px-4 py-6">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`py-5 px-6 rounded-xl font-semibold transition-all duration-200 min-h-[48px] flex items-center justify-center ${
                    location.pathname === link.href
                      ? "text-primary bg-primary/10 shadow-sm"
                      : "text-foreground hover:text-primary hover:bg-secondary/70"
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
                className="mt-4 px-6 py-5 rounded-xl bg-primary text-primary-foreground text-sm font-bold text-center block shadow-lg hover:shadow-xl hover:shadow-primary/25 transition-all duration-200 min-h-[48px] flex items-center justify-center"
                role="menuitem"
                aria-label="Start a project - contact us"
                onClick={() => setOpen(false)}
              >
                Start a Project
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
