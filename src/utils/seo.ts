export interface PageSEO {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogImage: string;
  ogType: string;
  schemaJsonLd: Record<string, any>[];
}

const SITE_URL = "https://www.fusionengine.in";
const DEFAULT_OG_IMAGE = `${SITE_URL}/header-logo.png`;

export const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#organization`,
  "name": "Fusion Engine Technology",
  "legalName": "Fusion Engine Technology",
  "url": SITE_URL,
  "logo": DEFAULT_OG_IMAGE,
  "image": DEFAULT_OG_IMAGE,
  "description": "Fusion Engine Technology is a premier technical partner and software development agency specializing in MVP creation, mobile apps, SaaS platforms, AI automation, and enterprise cloud solutions.",
  "telephone": "+916369884331",
  "email": "fusionenginetechnology@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Palacode",
    "addressLocality": "Dharmapuri",
    "addressRegion": "Tamil Nadu",
    "postalCode": "636808",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "12.3023",
    "longitude": "78.0772"
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    "opens": "09:00",
    "closes": "20:00"
  },
  "sameAs": [
    "https://www.linkedin.com/in/fusion-engine-technology-815b1a403/",
    "https://www.instagram.com/prakash_r_1908",
    "https://github.com/Prakash-Ramakrishnan110"
  ],
  "founder": {
    "@type": "Person",
    "name": "Prakash Ramakrishnan"
  },
  "priceRange": "$$$"
};

export const seoData: Record<string, PageSEO> = {
  "/": {
    title: "Fusion Engine Technology | Build, Launch & Scale Modern Digital Solutions",
    description: "Your premier technical partner for business growth. We engineer MVP products, enterprise web platforms, mobile apps, and AI automation systems that drive measurable ROI.",
    keywords: "technical cofounder, software agency, MVP development, web platform development, mobile app agency, SaaS development, AI automation, cloud architecture, Fusion Engine",
    canonical: `${SITE_URL}/`,
    ogImage: DEFAULT_OG_IMAGE,
    ogType: "website",
    schemaJsonLd: [
      ORG_SCHEMA,
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        "url": SITE_URL,
        "name": "Fusion Engine Technology",
        "publisher": { "@id": `${SITE_URL}/#organization` },
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${SITE_URL}/services?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      }
    ]
  },
  "/services": {
    title: "Technology & Software Engineering Services | Fusion Engine",
    description: "Explore our end-to-end technology services: Custom Web Applications, iOS/Android Mobile Apps, Scalable SaaS Architecture, AI Automation, and Cloud Infrastructure.",
    keywords: "custom web development, mobile app development, SaaS product development, AI workflow automation, DevOps, Cloud infrastructure",
    canonical: `${SITE_URL}/services`,
    ogImage: DEFAULT_OG_IMAGE,
    ogType: "service",
    schemaJsonLd: [
      ORG_SCHEMA,
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
          { "@type": "ListItem", "position": 2, "name": "Services", "item": `${SITE_URL}/services` }
        ]
      }
    ]
  },
  "/process": {
    title: "Our Engineering Process & Methodology | Fusion Engine",
    description: "From rapid discovery and prototyping to production deployment and scaling: discover how our agile 4-stage engineering framework guarantees quality.",
    keywords: "software engineering process, agile development methodology, product discovery phase, MVP sprint process, software deployment",
    canonical: `${SITE_URL}/process`,
    ogImage: DEFAULT_OG_IMAGE,
    ogType: "article",
    schemaJsonLd: [
      ORG_SCHEMA,
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
          { "@type": "ListItem", "position": 2, "name": "Process", "item": `${SITE_URL}/process` }
        ]
      }
    ]
  },
  "/products": {
    title: "Proprietary Software Products & Solutions | Fusion Engine",
    description: "Turnkey software components, pre-built accelerators, and SaaS building blocks designed to cut development time and launch products 3x faster.",
    keywords: "prebuilt software modules, SaaS starter kits, enterprise software tools, tech accelerators",
    canonical: `${SITE_URL}/products`,
    ogImage: DEFAULT_OG_IMAGE,
    ogType: "website",
    schemaJsonLd: [
      ORG_SCHEMA,
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
          { "@type": "ListItem", "position": 2, "name": "Products", "item": `${SITE_URL}/products` }
        ]
      }
    ]
  },
  "/industries": {
    title: "Industry Expertise & Vertical Solutions | Fusion Engine",
    description: "Tailored tech solutions for Fintech, Healthcare, E-Commerce, Logistics, EdTech, and Enterprise SaaS industries.",
    keywords: "fintech software development, healthcare software compliance, ecommerce development, edtech platforms, logistics software",
    canonical: `${SITE_URL}/industries`,
    ogImage: DEFAULT_OG_IMAGE,
    ogType: "website",
    schemaJsonLd: [
      ORG_SCHEMA,
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
          { "@type": "ListItem", "position": 2, "name": "Industries", "item": `${SITE_URL}/industries` }
        ]
      }
    ]
  },
  "/why-us": {
    title: "Why Partner With Fusion Engine | Engineering Excellence",
    description: "Discover why startups and enterprises trust Fusion Engine as their technical co-founder. transparent pricing, production speed, and zero tech debt.",
    keywords: "why choose fusion engine, technical partner advantages, dedicated software development team, software agency trust",
    canonical: `${SITE_URL}/why-us`,
    ogImage: DEFAULT_OG_IMAGE,
    ogType: "website",
    schemaJsonLd: [
      ORG_SCHEMA,
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
          { "@type": "ListItem", "position": 2, "name": "Why Us", "item": `${SITE_URL}/why-us` }
        ]
      }
    ]
  },
  "/pricing": {
    title: "Transparent Service Pricing & Engagement Models | Fusion Engine",
    description: "Clear, predictable pricing plans for fixed-scope MVP launches, monthly dedicated engineering retainers, and enterprise team scaling.",
    keywords: "software development pricing, MVP cost, monthly developer retainer, tech agency cost, engagement models",
    canonical: `${SITE_URL}/pricing`,
    ogImage: DEFAULT_OG_IMAGE,
    ogType: "website",
    schemaJsonLd: [
      ORG_SCHEMA,
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
          { "@type": "ListItem", "position": 2, "name": "Pricing", "item": `${SITE_URL}/pricing` }
        ]
      }
    ]
  },
  "/about": {
    title: "About Fusion Engine Technology | Our Vision & Leadership",
    description: "Learn about Fusion Engine Technology, our core values, leadership, engineering principles, and track record of building successful digital platforms.",
    keywords: "about fusion engine, software leadership, software team, tech agency values",
    canonical: `${SITE_URL}/about`,
    ogImage: DEFAULT_OG_IMAGE,
    ogType: "profile",
    schemaJsonLd: [
      ORG_SCHEMA,
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
          { "@type": "ListItem", "position": 2, "name": "About Us", "item": `${SITE_URL}/about` }
        ]
      }
    ]
  },
  "/contact": {
    title: "Contact Technical Team & Request Consultation | Fusion Engine",
    description: "Schedule a technical discovery call or request a project estimate with our lead engineers. Response guaranteed within 15 minutes.",
    keywords: "contact software agency, request software quote, schedule discovery call, tech consultation",
    canonical: `${SITE_URL}/contact`,
    ogImage: DEFAULT_OG_IMAGE,
    ogType: "website",
    schemaJsonLd: [
      ORG_SCHEMA,
      {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact Fusion Engine Technology",
        "url": `${SITE_URL}/contact`
      }
    ]
  },
  "/privacy": {
    title: "Privacy Policy & Data Security | Fusion Engine Technology",
    description: "Read Fusion Engine Technology's Privacy Policy regarding client data protection, NDA standards, confidentiality, and GDPR compliance.",
    keywords: "privacy policy, data security, NDA confidentiality, GDPR compliance",
    canonical: `${SITE_URL}/privacy`,
    ogImage: DEFAULT_OG_IMAGE,
    ogType: "website",
    schemaJsonLd: [ORG_SCHEMA]
  },
  "/terms": {
    title: "Terms & Conditions | Fusion Engine Technology",
    description: "Terms and Conditions governing technical consulting services, IP ownership, liability terms, and client software agreements.",
    keywords: "terms of service, software terms, IP ownership agreement, client contract",
    canonical: `${SITE_URL}/terms`,
    ogImage: DEFAULT_OG_IMAGE,
    ogType: "website",
    schemaJsonLd: [ORG_SCHEMA]
  },
  "/cookies": {
    title: "Cookie Policy & Privacy Preferences | Fusion Engine Technology",
    description: "Information regarding cookie usage, local storage, analytics measurement, and visitor preference settings under ePrivacy rules.",
    keywords: "cookie policy, tracking consent, ePrivacy compliance, cookie settings",
    canonical: `${SITE_URL}/cookies`,
    ogImage: DEFAULT_OG_IMAGE,
    ogType: "website",
    schemaJsonLd: [ORG_SCHEMA]
  },
  "/refund-policy": {
    title: "Refund & Cancellation Policy | Fusion Engine Technology",
    description: "Clear guidelines on project deposit refunds, milestone sign-offs, subscription retainers, and client satisfaction guarantees.",
    keywords: "refund policy, cancellation policy, service terms, satisfaction guarantee",
    canonical: `${SITE_URL}/refund-policy`,
    ogImage: DEFAULT_OG_IMAGE,
    ogType: "website",
    schemaJsonLd: [ORG_SCHEMA]
  }
};

export const getSEOData = (pathname: string): PageSEO => {
  return seoData[pathname] || seoData["/"];
};
