import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const quickLinks = [
  { label: "Services", href: "/services" },
  { label: "Process", href: "/process" },
  { label: "Products", href: "/products" },
  { label: "Industries", href: "/industries" },
  { label: "Why Us", href: "/why-us" },
];

const serviceLinks = ["Mobile Apps", "Web Platforms", "SaaS Products", "AI Systems", "Automation", "Cloud"];

const Footer = () => {
  return (
    <footer className="border-t border-border bg-secondary/30 py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <img src={logo} alt="Fusion Engine Technology" className="w-44 h-auto mb-4" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Building high-performance digital systems for businesses that want to scale.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Services</h4>
            <ul className="space-y-2">
              {serviceLinks.map((l) => (
                <li key={l}>
                  <span className="text-sm text-muted-foreground">{l}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="mailto:hello@fusionengine.dev" className="hover:text-foreground transition-colors">
                  hello@fusionengine.dev
                </a>
              </li>
              <li>
                <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  WhatsApp Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/30 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Fusion Engine Technology. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
