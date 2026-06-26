import { motion } from "framer-motion";
import { Facebook, Instagram, Linkedin, MessageCircle } from "lucide-react";
import ceoImage from "@/assets/prakash-ceo.jpg";

const Founder = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Meet the Founder</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            The technical engine and vision behind our agency.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row items-center max-w-4xl mx-auto"
        >
          {/* Image Side */}
          <div className="w-full md:w-2/5 p-6 md:p-8 flex justify-center bg-secondary/30">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-background shadow-lg relative">
              <img 
                src={ceoImage} 
                alt="Prakash Ramakrishnan" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </div>

          {/* Text Side */}
          <div className="w-full md:w-3/5 p-8 md:p-12">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-1">Prakash Ramakrishnan</h3>
              <p className="text-primary font-medium">Founder & CEO</p>
            </div>
            
            <p className="text-muted-foreground leading-relaxed mb-8 italic">
              "I'm a firm believer in the combined power of technology, people, and purpose. 
              My mission is to help businesses not just grow, but scale with clarity, impact, and purpose 
              in today's digital-first world."
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a href="https://www.linkedin.com/in/prakash-ramakrishnan-ba817a2a4" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="https://www.instagram.com/prakash_r_1908" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://prakash-portfolio-alpha.vercel.app/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Founder;
