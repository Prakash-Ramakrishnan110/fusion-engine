import { useEffect } from "react";

const setFavicon = () => {
  // Remove any existing dynamic favicons
  const existingLinks = document.querySelectorAll("link[rel*='icon']");
  existingLinks.forEach(link => link.remove());
  
  // Add the standard favicon
  const faviconLink = document.createElement("link");
  faviconLink.rel = "icon";
  faviconLink.type = "image/svg+xml";
  faviconLink.href = "/favicon.svg";
  document.head.appendChild(faviconLink);
  
  // Add PNG fallbacks
  const favicon32 = document.createElement("link");
  favicon32.rel = "icon";
  favicon32.type = "image/png";
  favicon32.sizes = "32x32";
  favicon32.href = "/favicon-32x32.png";
  document.head.appendChild(favicon32);
  
  const favicon16 = document.createElement("link");
  favicon16.rel = "icon";
  favicon16.type = "image/png";
  favicon16.sizes = "16x16";
  favicon16.href = "/favicon-16x16.png";
  document.head.appendChild(favicon16);
  
  // Add Apple touch icon
  const appleTouchIcon = document.createElement("link");
  appleTouchIcon.rel = "apple-touch-icon";
  appleTouchIcon.href = "/apple-touch-icon.png";
  document.head.appendChild(appleTouchIcon);
};

const usePageMeta = (title: string, emoji?: string) => {
  useEffect(() => {
    document.title = `${title} | Fusion Engine Technology`;
    setFavicon();

    return () => {
      document.title = "Fusion Engine Technology | Build. Automate. Scale.";
    };
  }, [title]);
};

export default usePageMeta;
