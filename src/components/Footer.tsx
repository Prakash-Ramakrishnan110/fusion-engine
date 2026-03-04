import { Link } from "react-router-dom";

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
    <footer className="border-t border-border bg-secondary/30 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex flex-col leading-tight mb-4">
              <div className="flex items-baseline">
                <span className="text-2xl font-black text-blue-500 drop-shadow-md vibrant">FUSION</span>
                <span className="text-2xl font-black text-gray-700 drop-shadow-md vibrant ml-2">ENGINE</span>
              </div>
              <span className="text-xs font-black text-gray-500 tracking-wider vibrant">TECHNOLOGY</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your technical co-founder for startup success. We build, launch, and scale startups that get funded.
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
                <a href="mailto:contact@fusionengine.tech" className="hover:text-foreground transition-colors">
                  contact@fusionengine.tech
                </a>
              </li>
              <li>
                <a href="tel:+919876543210" className="hover:text-foreground transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li>
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/30 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Fusion Engine Technology. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
