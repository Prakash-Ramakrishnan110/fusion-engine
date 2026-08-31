import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getSEOData } from "@/utils/seo";

const updateMetaTag = (name: string, content: string, isProperty = false) => {
  if (!content) return;
  const attribute = isProperty ? "property" : "name";
  let element = document.querySelector(`meta[${attribute}="${name}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
};

const updateLinkTag = (rel: string, href: string, hreflang?: string) => {
  if (!href) return;
  let selector = `link[rel="${rel}"]`;
  if (hreflang) selector += `[hreflang="${hreflang}"]`;
  
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    if (hreflang) element.setAttribute("hreflang", hreflang);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
};

const injectJsonLdSchema = (schemas: Record<string, any>[]) => {
  // Remove previously injected dynamic schema scripts
  document.querySelectorAll("script[data-schema='dynamic-seo']").forEach((el) => el.remove());

  schemas.forEach((schemaObj, index) => {
    const script = document.createElement("script");
    script.setAttribute("type", "application/ld+json");
    script.setAttribute("data-schema", "dynamic-seo");
    script.setAttribute("data-schema-index", index.toString());
    script.textContent = JSON.stringify(schemaObj);
    document.head.appendChild(script);
  });
};

const usePageMeta = (customTitle?: string, emoji?: string, customDescription?: string) => {
  const location = useLocation();

  useEffect(() => {
    const seo = getSEOData(location.pathname);
    const activeTitle = customTitle
      ? `${customTitle} | Fusion Engine Technology`
      : seo.title;
    const activeDesc = customDescription || seo.description;

    // 1. Document Title
    document.title = activeTitle;

    // 2. Core Meta Tags
    const isNoIndex = customTitle?.toLowerCase().includes("not found") || customTitle?.toLowerCase().includes("500") || customTitle?.toLowerCase().includes("maintenance");
    const robotsContent = isNoIndex
      ? "noindex, follow"
      : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

    updateMetaTag("description", activeDesc);
    updateMetaTag("keywords", seo.keywords);
    updateMetaTag("robots", robotsContent);
    updateMetaTag("googlebot", isNoIndex ? "noindex, follow" : "index, follow");
    updateMetaTag("author", "Fusion Engine Technology");

    // 3. OpenGraph Tags (Facebook, WhatsApp, LinkedIn)
    updateMetaTag("og:title", activeTitle, true);
    updateMetaTag("og:description", activeDesc, true);
    updateMetaTag("og:url", seo.canonical, true);
    updateMetaTag("og:type", seo.ogType, true);
    updateMetaTag("og:image", seo.ogImage, true);
    updateMetaTag("og:image:alt", activeTitle, true);
    updateMetaTag("og:site_name", "Fusion Engine Technology", true);
    updateMetaTag("og:locale", "en_US", true);

    // 4. Twitter Card Tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:site", "@FusionEngineTech");
    updateMetaTag("twitter:creator", "@FusionEngineTech");
    updateMetaTag("twitter:title", activeTitle);
    updateMetaTag("twitter:description", activeDesc);
    updateMetaTag("twitter:image", seo.ogImage);

    // 5. Geo-Targeting & Enterprise B2B Tags
    updateMetaTag("geo.region", "IN-TN");
    updateMetaTag("geo.placename", "Dharmapuri, Tamil Nadu, India");
    updateMetaTag("geo.position", "12.3023;78.0772");
    updateMetaTag("ICBM", "12.3023, 78.0772");

    // 6. Canonical & Alternate Hreflang Tags
    updateLinkTag("canonical", seo.canonical);
    updateLinkTag("alternate", seo.canonical, "en");
    updateLinkTag("alternate", seo.canonical, "en-IN");
    updateLinkTag("alternate", seo.canonical, "x-default");

    // 7. Dynamic JSON-LD Structured Data Injection
    if (seo.schemaJsonLd && seo.schemaJsonLd.length > 0) {
      injectJsonLdSchema(seo.schemaJsonLd);
    }
  }, [location.pathname, customTitle, customDescription]);
};

export default usePageMeta;
