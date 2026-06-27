import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Founder from "@/components/Founder";
import Hero from "@/components/Hero";
import { LOTTIE_URLS } from "@/components/LottieAnimation";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, HeartHandshake, Code2, Users, Target, Lightbulb, Compass, Wrench, Rocket } from "lucide-react";
import usePageMeta from "@/hooks/usePageMeta";

const AboutPage = () => {
  usePageMeta("About Us", "💡");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main>
        {/* Section 1: The Hook (Hero) */}
        <Hero
          badgeText="Our Story • Technical Co-Founders"
          title1="We are your"
          title2="technical co-founders"
          description={
            <>
              We build scalable software and robust digital platforms for modern businesses and growing enterprises. 
              <span className="font-semibold text-foreground"> No fluff.</span> 
              <span className="text-primary font-semibold"> Just execution.</span>
            </>
          }
          primaryCtaText="Let's build together"
          primaryCtaLink="/contact"
          lottieUrl={LOTTIE_URLS.team}
          features={[
            { icon: Users, title: "Dedicated Team", desc: "Integrated with yours" },
            { icon: Target, title: "Goal Oriented", desc: "Focused on business KPIs" },
            { icon: Code2, title: "Clean Code", desc: "Scalable architectures" },
            { icon: ShieldCheck, title: "Secure", desc: "Enterprise-grade safety" }
          ]}
        />

        {/* Section 2: Vision & Mission */}
        <section className="py-20 bg-secondary/10 border-y border-border/50">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              {/* Vision Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-card border border-border p-10 rounded-3xl shadow-sm text-center md:text-left hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto md:mx-0 mb-6">
                  <Compass size={32} className="text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  To inspire and empower a generation of global business leaders who can solve real-world problems through strategic thinking, digital innovation, and ethical leadership.
                </p>
              </motion.div>

              {/* Mission Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-card border border-border p-10 rounded-3xl shadow-sm text-center md:text-left hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto md:mx-0 mb-6">
                  <Target size={32} className="text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  To build companies, communities, and platforms that make technology more human, leadership more accessible, and success more meaningful.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section 3: My Value Story (The Engine Metaphor) */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">My Value Story</h2>
              <p className="text-muted-foreground text-lg">Building the engine for sustainable growth.</p>
            </div>

            <div className="relative border-l-2 border-primary/20 ml-6 md:mx-auto md:border-l-0 md:before:absolute md:before:left-1/2 md:before:top-0 md:before:bottom-0 md:before:w-0.5 md:before:bg-primary/20 md:before:-ml-[1px]">
              
              {/* Stage 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative pl-8 md:pl-0 md:w-1/2 md:pr-12 md:ml-0 mb-12"
              >
                <div className="absolute left-[-9px] md:right-[-25px] md:left-auto top-0 w-4 h-4 rounded-full bg-primary ring-4 ring-background"></div>
                <div className="bg-card border border-border p-6 rounded-2xl shadow-sm group hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <Lightbulb size={20} className="text-blue-500" />
                    </div>
                    <h3 className="text-xl font-bold">1. The Blueprint Stage</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    It began with curiosity. I was hungry to learn, deconstruct problems, and understand how the best systems are built.
                  </p>
                </div>
              </motion.div>

              {/* Stage 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative pl-8 md:pl-0 md:w-1/2 md:pl-12 md:ml-auto mb-12"
              >
                <div className="absolute left-[-9px] md:left-[-25px] top-0 w-4 h-4 rounded-full bg-primary ring-4 ring-background"></div>
                <div className="bg-card border border-border p-6 rounded-2xl shadow-sm group hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                      <Zap size={20} className="text-orange-500" />
                    </div>
                    <h3 className="text-xl font-bold">2. The Ignition Stage</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    I took the leap and embraced friction. Every misfire or failure wasn't a setback; it was fuel for the next iteration.
                  </p>
                </div>
              </motion.div>

              {/* Stage 3 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative pl-8 md:pl-0 md:w-1/2 md:pr-12 md:ml-0 mb-12"
              >
                <div className="absolute left-[-9px] md:right-[-25px] md:left-auto top-0 w-4 h-4 rounded-full bg-primary ring-4 ring-background"></div>
                <div className="bg-card border border-border p-6 rounded-2xl shadow-sm group hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                      <Wrench size={20} className="text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-bold">3. The Core Stage</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    I focused on strengthening my internal architecture—my technical skills, my network, and my underlying purpose.
                  </p>
                </div>
              </motion.div>

              {/* Stage 4 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative pl-8 md:pl-0 md:w-1/2 md:pl-12 md:ml-auto"
              >
                <div className="absolute left-[-9px] md:left-[-25px] top-0 w-4 h-4 rounded-full bg-primary ring-4 ring-background"></div>
                <div className="bg-card border border-border p-6 rounded-2xl shadow-sm group hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                      <Rocket size={20} className="text-purple-500" />
                    </div>
                    <h3 className="text-xl font-bold">4. The Fusion Stage</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Now, I generate momentum by helping others build their own engines. Real leadership isn't just running fast; it's providing the power for others to scale.
                  </p>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* Section 4: How We Work */}
        <section className="py-20 bg-secondary/10 border-y border-border/50">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How We Work</h2>
              <p className="text-muted-foreground text-lg">The core principles that drive every line of code we write.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Zap,
                  title: "Speed & Scale",
                  desc: "We build fast, but we build it right. Our architectures are designed to gracefully handle 10x growth without crumbling."
                },
                {
                  icon: ShieldCheck,
                  title: "Zero Compromise",
                  desc: "Quality isn't an afterthought. From security to performance, we deliver enterprise-grade code on every project."
                },
                {
                  icon: HeartHandshake,
                  title: "Radical Transparency",
                  desc: "No technical jargon to hide behind. We communicate clearly, honestly, and directly with our partners at all times."
                }
              ].map((value, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-card border border-border p-8 rounded-2xl shadow-sm text-center"
                >
                  <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <value.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: The Founder */}
        <Founder />

      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
