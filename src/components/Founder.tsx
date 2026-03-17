import { motion } from "framer-motion";
import { Linkedin, Twitter, Github, Instagram, ExternalLink } from "lucide-react";
import LottieAnimation, { LOTTIE_URLS } from "./LottieAnimation";
import ceoImage from "@/assets/prakash-ceo.jpg";

const Founder = () => {
  return (
    <section id="founder" className="py-12 md:py-24 bg-secondary/20">
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
              <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 mx-auto mb-6 overflow-hidden">
                <img 
                  src={ceoImage} 
                  alt="Prakash Ramakrishnan - CEO" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) {
                      fallback.style.display = 'flex';
                    }
                  }}
                />
                <div className="w-full h-full hidden items-center justify-center">
                  <span className="text-2xl font-bold text-primary">PR</span>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-1 text-center">Prakash Ramakrishnan</h3>
              <p className="text-sm text-primary mb-6 text-center">Founder & CEO</p>

              <p className="text-muted-foreground leading-relaxed mb-8 text-center">
                An engineer and product builder focused on creating scalable digital systems. 
                Started Fusion Engine Technology with one goal: help businesses automate, scale, 
                and compete with world-class technology — without the enterprise price tag.
              </p>

              <div className="flex justify-center gap-3">
                {[
                  { icon: ExternalLink, href: "https://prakash-portfolio-alpha.vercel.app/", label: "Portfolio" },
                  { icon: Linkedin, href: "https://www.linkedin.com/in/prakash-ramakrishnan-ba817a2a4?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", label: "LinkedIn" },
                  { icon: Instagram, href: "https://www.instagram.com/prakash_r_1908?igsh=MWhzeHIyNmRpeDVobw==", label: "Instagram" },
                ].map(({ icon: Icon, href, label }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                    title={label}
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
