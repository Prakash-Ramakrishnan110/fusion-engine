import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const announcements = [
  {
    tag: "Limited",
    title: "3 Spots Left This Month",
    desc: "14-day startup launch program",
    link: "/contact",
  },
  {
    tag: "Funding",
    title: "Seed-Ready MVP Package",
    desc: "Build what investors want to see",
    link: "/pricing",
  },
];

const AnnouncementStrip = () => {
  return (
    <section className="py-4 border-y border-border/50 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-3">
          {announcements.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={a.link}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles size={20} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold text-primary-foreground bg-primary px-2 py-0.5 rounded-full uppercase">
                      {a.tag}
                    </span>
                    <span className="text-sm font-semibold text-foreground truncate">{a.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                </div>
                <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnnouncementStrip;
