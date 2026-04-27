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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <img 
                src="/mylogo.png" 
                alt="Fusion Engine Technology" 
                className="h-16 md:h-20 w-auto object-contain drop-shadow-lg"
                loading="lazy"
                decoding="async"
              />
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
                <a href="mailto:fusionenginetechnology@gmail.com" className="hover:text-foreground transition-colors">
                  fusionenginetechnology@gmail.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/916369884331" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  WhatsApp: 63698 84331
                </a>
              </li>
              <li className="text-xs">
                Palacode, Dharamapuri
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
