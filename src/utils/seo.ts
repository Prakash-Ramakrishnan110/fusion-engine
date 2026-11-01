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

export const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How fast can you build my MVP?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our 'Launch in 14 Days' program is designed for speed. For most startups, we deliver a fully functional, high-quality MVP in just 10-14 days. More complex enterprise platforms typically take 4-8 weeks."
      }
    },
    {
      "@type": "Question",
      "name": "Do I own the source code and IP?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely. Once the project is completed and handed over, you own 100% of the intellectual property, source code, and digital assets with full legal transfer."
      }
    },
    {
      "@type": "Question",
      "name": "What technology stack do you use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We specialize in modern, scalable stacks like React, Next.js, TypeScript, Tailwind CSS, and Node.js. For AI capabilities, we integrate leading models from OpenAI, Anthropic, and Google Gemini."
      }
    },
    {
      "@type": "Question",
      "name": "How do you handle post-launch support?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We offer comprehensive support packages including ongoing maintenance, cloud scaling assistance, 99.9% uptime monitoring, and continuous feature iterations as your dedicated technical partner."
      }
    },
    {
      "@type": "Question",
      "name": "Can you help with fundraising and pitch decks?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Beyond code, we help with technical architecture diagrams, product roadmaps, and feature prioritization that angel investors and VCs love to see in pitch decks."
      }
    }
  ]
};

export const DEVELOPER_JOB_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "title": "Full-Stack Developer Contractor",
  "description": "<p>Build high-impact web and mobile applications, MVPs, and AI-driven platforms at Fusion Engine Technology. Work with modern technologies including React, TypeScript, Node.js, and cloud backends.</p>",
  "datePosted": "2026-10-01",
  "validThrough": "2027-12-31",
  "employmentType": "CONTRACTOR",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "Fusion Engine Technology",
    "sameAs": "https://www.fusionengine.in",
    "logo": "https://www.fusionengine.in/header-logo.png"
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Palacode",
      "addressLocality": "Dharmapuri",
      "addressRegion": "Tamil Nadu",
      "postalCode": "636808",
      "addressCountry": "IN"
    }
  },
  "jobLocationType": "TELECOMMUTE",
  "applicantLocationRequirements": {
    "@type": "Country",
    "name": "India"
  },
  "directApply": true
};

export const SALES_JOB_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "title": "Telecaller & Inside Sales Executive",
  "description": "<p>Engage prospective startups and enterprise clients, qualify incoming inquiries, explain technical development offerings, and schedule discovery consultations for lead engineering teams.</p>",
  "datePosted": "2026-10-01",
  "validThrough": "2027-12-31",
  "employmentType": "CONTRACTOR",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "Fusion Engine Technology",
    "sameAs": "https://www.fusionengine.in",
    "logo": "https://www.fusionengine.in/header-logo.png"
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Palacode",
      "addressLocality": "Dharmapuri",
      "addressRegion": "Tamil Nadu",
      "postalCode": "636808",
      "addressCountry": "IN"
    }
  },
  "jobLocationType": "TELECOMMUTE",
  "applicantLocationRequirements": {
    "@type": "Country",
    "name": "India"
  },
  "directApply": true
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
      FAQ_SCHEMA,
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
  "/careers": {
    title: "Careers & Opportunities | Join Fusion Engine Technology",
    description: "Explore open developer, engineering, and sales opportunities at Fusion Engine Technology. Fast-track application process, competitive compensation, and remote flexibility.",
    keywords: "developer jobs, software engineer contractor, telecaller sales jobs, remote developer opportunities, Fusion Engine careers, tech jobs India, hiring developers",
    canonical: `${SITE_URL}/careers`,
    ogImage: DEFAULT_OG_IMAGE,
    ogType: "website",
    schemaJsonLd: [
      ORG_SCHEMA,
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
          { "@type": "ListItem", "position": 2, "name": "Careers", "item": `${SITE_URL}/careers` }
        ]
      },
      DEVELOPER_JOB_SCHEMA,
      SALES_JOB_SCHEMA
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
