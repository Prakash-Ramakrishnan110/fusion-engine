import { motion } from "framer-motion";
import { Linkedin, Twitter, Github } from "lucide-react";
import LottieAnimation, { LOTTIE_URLS } from "./LottieAnimation";

const Founder = () => {
  return (
    <section id="founder" className="py-24 bg-secondary/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Behind the Engine</h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="glass-card p-8 md:p-12">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">FE</span>
              </div>

              <h3 className="text-xl font-bold mb-1 text-center">Founder & CEO</h3>
              <p className="text-sm text-primary mb-6 text-center">Fusion Engine Technology</p>

              <p className="text-muted-foreground leading-relaxed mb-8 text-center">
                An engineer and product builder focused on creating scalable digital systems. 
                Started Fusion Engine Technology with one goal: help businesses automate, scale, 
                and compete with world-class technology — without the enterprise price tag.
              </p>

              <div className="flex justify-center gap-3">
                {[
                  { icon: Linkedin, href: "#" },
                  { icon: Twitter, href: "#" },
                  { icon: Github, href: "#" },
                ].map(({ icon: Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="hidden md:block"
            >
              <LottieAnimation
                url={LOTTIE_URLS.team}
                className="w-full max-w-sm mx-auto"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Founder;
