import { useEffect } from "react";

const createEmojiFavicon = (emoji: string) => {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.font = "52px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(emoji, 32, 36);
  const link =
    (document.querySelector("link[rel*='icon']") as HTMLLinkElement) ||
    document.createElement("link");
  link.type = "image/png";
  link.rel = "icon";
  link.href = canvas.toDataURL();
  document.head.appendChild(link);
};

const usePageMeta = (title: string, emoji: string) => {
  useEffect(() => {
    document.title = `${title} | Fusion Engine Technology`;
    createEmojiFavicon(emoji);

    return () => {
      document.title = "Fusion Engine Technology | Build. Automate. Scale.";
    };
  }, [title, emoji]);
};

export default usePageMeta;
