import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Products", href: "#products" },
  { label: "Industries", href: "#industries" },
  { label: "Why Us", href: "#why-us" },
  { label: "Contact", href: "/contact", isRoute: true },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/30">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <a href="/" className="flex items-center shrink-0">
          <img
            src={logo}
            alt="Fusion Engine Technology"
            className="h-14 w-64 object-cover object-center"
          />
        </a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) =>
            link.isRoute ? (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm text-muted-foreground hover:text-primary font-medium transition-colors"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-primary font-medium transition-colors"
              >
                {link.label}
              </a>
            )
          )}
          <a
            href="#cta"
            className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all hover:scale-105 glow-box"
          >
            Start a Project
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-foreground p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
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
            className="lg:hidden bg-card border-b border-border/50"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {navLinks.map((link) =>
                link.isRoute ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="text-foreground hover:text-primary transition-colors py-3 px-3 rounded-lg hover:bg-secondary/50 font-medium"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-foreground hover:text-primary transition-colors py-3 px-3 rounded-lg hover:bg-secondary/50 font-medium"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                )
              )}
              <a
                href="#cta"
                className="mt-2 px-5 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold text-center"
                onClick={() => setOpen(false)}
              >
                Start a Project
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
