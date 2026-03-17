interface PageMetadata {
  title: string;
  description: string;
  keywords?: string;
}

export const pageMetadata: Record<string, PageMetadata> = {
  "/": {
    title: "Fusion Engine Technology - Build, Launch & Scale Startups",
    description: "Technical co-founder for startup success. We build, launch, and scale startups that get funded with cutting-edge technology solutions.",
    keywords: "startup, technology, funding, launch, scale, fusion engine"
  },
  "/services": {
    title: "Technology Services - Fusion Engine",
    description: "Comprehensive technology services including mobile apps, web platforms, SaaS products, AI systems, automation, and cloud solutions.",
    keywords: "technology services, mobile apps, web platforms, SaaS, AI systems, automation, cloud"
  },
  "/process": {
    title: "Our Process - Fusion Engine Technology",
    description: "Our proven process for building and launching successful technology startups from concept to scale.",
    keywords: "startup process, technology development, launch process, scaling strategy"
  },
  "/products": {
    title: "Technology Products - Fusion Engine",
    description: "Innovative technology products designed to accelerate your startup growth and success.",
    keywords: "technology products, startup tools, SaaS products, automation tools"
  },
  "/industries": {
    title: "Industries We Serve - Fusion Engine Technology",
    description: "Technology solutions tailored for various industries including fintech, healthcare, education, and e-commerce.",
    keywords: "industry solutions, technology consulting, fintech, healthcare, education, e-commerce"
  },
  "/why-us": {
    title: "Why Choose Fusion Engine - Technology Partner",
    description: "Learn why Fusion Engine Technology is the perfect technical co-founder for your startup success story.",
    keywords: "technical cofounder, startup partner, technology expertise, fusion engine advantages"
  },
  "/pricing": {
    title: "Pricing Plans - Fusion Engine Technology",
    description: "Transparent pricing plans for our technology services and startup partnership programs.",
    keywords: "technology pricing, startup costs, service pricing, partnership plans"
  },
  "/contact": {
    title: "Contact Fusion Engine Technology",
    description: "Get in touch with our technical team to discuss your startup project or partnership opportunities.",
    keywords: "contact technology team, startup consultation, partnership inquiry, fusion engine contact"
  }
};

export const getPageMetadata = (path: string): PageMetadata => {
  return pageMetadata[path] || pageMetadata["/"];
};
