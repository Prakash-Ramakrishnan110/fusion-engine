import { motion } from "framer-motion";

const logos = [
  "React", "Next.js", "Flutter", "Node.js", "PostgreSQL", 
  "AWS", "Firebase", "Supabase", "Stripe", "OpenAI",
  "Docker", "Kubernetes", "Redis", "GraphQL", "TypeScript",
];

const LogoStrip = () => {
  return (
    <section className="py-12 border-y border-border/30 overflow-hidden">
      <div className="container mx-auto px-4 mb-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground font-medium"
        >
          Trusted technologies powering our solutions
        </motion.p>
      </div>
      
      {/* Infinite scroll */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
        
        <motion.div
          className="flex gap-12 items-center"
          animate={{ x: [0, -1200] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...logos, ...logos, ...logos].map((logo, i) => (
            <div
              key={`${logo}-${i}`}
              className="flex items-center justify-center shrink-0 px-4 py-2 rounded-lg"
            >
              <span className="text-sm font-semibold text-muted-foreground/60 whitespace-nowrap tracking-wider">
                {logo}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default LogoStrip;
