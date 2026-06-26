import { useEffect } from "react";

const setFavicon = () => {
  // Remove any existing dynamic favicons
  const existingLinks = document.querySelectorAll("link[rel*='icon']");
  existingLinks.forEach(link => link.remove());
  
  // Add the standard SVG favicon
  const faviconLink = document.createElement("link");
  faviconLink.rel = "icon";
  faviconLink.type = "image/svg+xml";
  faviconLink.href = "/favicon.svg";
  document.head.appendChild(faviconLink);
};

const updateMetaTag = (name: string, content: string, isProperty = false) => {
  const attribute = isProperty ? "property" : "name";
  let element = document.querySelector(`meta[${attribute}="${name}"]`);
  
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  
  element.setAttribute("content", content);
};

const usePageMeta = (title: string, emoji?: string, description?: string) => {
  useEffect(() => {
    const fullTitle = `${title} | Fusion Engine Technology`;
    const fallbackDesc = "We build scalable software and robust digital platforms for modern startups and growing enterprises. No fluff. Just execution.";
    const activeDesc = description || fallbackDesc;
    
    document.title = fullTitle;
    setFavicon();

    // Advanced SEO Tags
    updateMetaTag("description", activeDesc);
    updateMetaTag("og:title", fullTitle, true);
    updateMetaTag("og:description", activeDesc, true);
    updateMetaTag("og:type", "website", true);
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", fullTitle);
    updateMetaTag("twitter:description", activeDesc);

    return () => {
      document.title = "Fusion Engine Technology | Build. Automate. Scale.";
      updateMetaTag("description", fallbackDesc);
    };
  }, [title, description]);
};

export default usePageMeta;
