import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

// Animated Network Globe Canvas
const NetworkGlobe = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const nodesRef = useRef<{ x: number; y: number; vx: number; vy: number; r: number; pulse: number }[]>([]);
  const timeRef = useRef(0);

  const initNodes = useCallback((w: number, h: number) => {
    const nodes: typeof nodesRef.current = [];
    const count = 60;
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
        pulse: Math.random() * Math.PI * 2,
      });
    }
    nodesRef.current = nodes;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      canvas.width = rect?.width || 500;
      canvas.height = rect?.height || 500;
      if (nodesRef.current.length === 0) initNodes(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      timeRef.current += 0.01;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Draw globe circle
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * 0.42;

      // Globe glow
      const glow = ctx.createRadialGradient(cx, cy, radius * 0.3, cx, cy, radius * 1.2);
      glow.addColorStop(0, "hsla(215, 90%, 50%, 0.08)");
      glow.addColorStop(0.5, "hsla(215, 90%, 50%, 0.04)");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // Globe outline
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "hsla(215, 90%, 50%, 0.15)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Globe grid lines (latitude)
      for (let i = 1; i < 6; i++) {
        const lat = (i / 6) * 2 - 1;
        const y = cy + lat * radius;
        const halfWidth = Math.sqrt(1 - lat * lat) * radius;
        ctx.beginPath();
        ctx.ellipse(cx, y, halfWidth, halfWidth * 0.1, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "hsla(215, 90%, 50%, 0.06)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Globe grid lines (longitude) - rotating
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI + timeRef.current * 0.3;
        ctx.beginPath();
        ctx.ellipse(cx, cy, Math.abs(Math.cos(angle)) * radius, radius, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "hsla(215, 90%, 50%, 0.06)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Update and draw nodes
      const nodes = nodesRef.current;
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > w) node.vx *= -1;
        if (node.y < 0 || node.y > h) node.vy *= -1;
        node.pulse += 0.02;
      }

      // Draw connections
      const maxDist = 120;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.3;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `hsla(215, 90%, 50%, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        const pulseR = node.r + Math.sin(node.pulse) * 0.5;
        // Outer glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseR * 3, 0, Math.PI * 2);
        ctx.fillStyle = "hsla(215, 90%, 50%, 0.05)";
        ctx.fill();
        // Core
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseR, 0, Math.PI * 2);
        ctx.fillStyle = "hsla(215, 90%, 60%, 0.6)";
        ctx.fill();
      }

      // Animated data packets traveling along connections
      const t = timeRef.current;
      for (let i = 0; i < Math.min(nodes.length, 10); i++) {
        const j = (i + 3) % nodes.length;
        const progress = ((t * 0.5 + i * 0.37) % 1);
        const px = nodes[i].x + (nodes[j].x - nodes[i].x) * progress;
        const py = nodes[i].y + (nodes[j].y - nodes[i].y) * progress;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = "hsla(215, 90%, 70%, 0.8)";
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initNodes]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ minHeight: 400 }}
    />
  );
};

const highlights = [
  "everywhere",
  "at scale",
  "with AI",
  "securely",
  "faster",
];

const Hero = () => {
  const [highlightIndex, setHighlightIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setHighlightIndex((prev) => (prev + 1) % highlights.length);
    }, 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/30" />
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-l from-primary/5 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              Build, automate,{" "}
              <br className="hidden md:block" />
              and scale{" "}
              <span className="relative inline-block">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={highlightIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="text-primary inline-block"
                  >
                    {highlights[highlightIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed">
              We build high-performance digital systems — apps, AI agents, and platforms — 
              that are faster, smarter, and more secure. Our engineering studio is the best 
              place to build and scale modern products.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20"
              >
                Start for free
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg border border-border text-foreground font-medium text-base hover:bg-secondary transition-all"
              >
                See pricing
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
            style={{ height: 500 }}
          >
            <NetworkGlobe />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
