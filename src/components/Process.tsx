import { useState } from "react";
import { motion } from "framer-motion";
import { Search, PenTool, Code2, Workflow, Gauge, Rocket, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    num: "01",
    title: "Discover",
    icon: Search,
    desc: "Understand business goals, user needs, and technical requirements.",
    details: "We start every project with deep discovery sessions. We interview stakeholders, analyze competitor landscapes, map user journeys, and define clear success metrics before writing a single line of code.",
    deliverables: ["Requirements Document", "User Personas", "Competitive Analysis", "Project Roadmap"],
  },
  {
    num: "02",
    title: "Architect",
    icon: PenTool,
    desc: "Design scalable system architecture and define technology stack.",
    details: "Our architects design systems that can handle 10x your current load. We select the right tech stack, design database schemas, plan API contracts, and create high-fidelity prototypes.",
    deliverables: ["System Architecture", "Tech Stack Selection", "Database Design", "UI/UX Prototypes"],
  },
  {
    num: "03",
    title: "Develop",
    icon: Code2,
    desc: "Build with clean code, CI/CD pipelines, and agile sprints.",
    details: "We follow agile methodology with 2-week sprints, daily standups, and continuous integration. Every feature is code-reviewed, tested, and deployed to staging for your review.",
    deliverables: ["Sprint Demos", "Code Reviews", "Staging Deploys", "Progress Reports"],
  },
  {
    num: "04",
    title: "Automate",
    icon: Workflow,
    desc: "Integrate automation for workflows, testing, and deployment.",
    details: "We automate everything — from testing pipelines and deployments to business workflows and notifications. This reduces errors, saves time, and ensures consistency.",
    deliverables: ["CI/CD Pipelines", "Automated Tests", "Workflow Automations", "Monitoring Setup"],
  },
  {
    num: "05",
    title: "Optimize",
    icon: Gauge,
    desc: "Performance tuning, security hardening, and UX refinement.",
    details: "Before launch, we conduct thorough performance audits, security penetration testing, accessibility checks, and UX polishing to ensure a world-class product.",
    deliverables: ["Performance Audit", "Security Review", "UX Polish", "Load Testing"],
  },
  {
    num: "06",
    title: "Scale",
    icon: Rocket,
    desc: "Launch, monitor, and scale infrastructure for growth.",
    details: "We don't just launch and leave. We set up monitoring, alerts, and auto-scaling infrastructure. Our team provides ongoing support and iteration based on real user data.",
    deliverables: ["Production Deploy", "Monitoring & Alerts", "Auto-Scaling", "Ongoing Support"],
  },
];

const Process = () => {
  const [active, setActive] = useState<number>(0);

  return (
    <section id="process" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">Our Methodology</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">How We Build</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A proven 6-step process for delivering scalable digital systems — on time, on budget, and beyond expectations.
          </p>
        </motion.div>

        {/* Step Tabs */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-10 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <motion.button
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`glass-card p-4 text-center cursor-pointer transition-all duration-300 ${
                active === i ? "ring-2 ring-primary shadow-md" : "hover:shadow-md"
              }`}
              onClick={() => setActive(i)}
            >
              <step.icon className={`mx-auto mb-2 ${active === i ? "text-primary" : "text-muted-foreground"} transition-colors`} size={24} />
              <div className="text-lg font-bold text-primary">{step.num}</div>
              <div className="font-semibold text-sm">{step.title}</div>
            </motion.button>
          ))}
        </div>

        {/* Active Step Detail */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-card p-8 md:p-12 max-w-4xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  {(() => { const Icon = steps[active].icon; return <Icon className="text-primary" size={24} />; })()}
                </div>
                <div>
                  <div className="text-sm text-primary font-semibold">Step {steps[active].num}</div>
                  <h3 className="text-2xl font-bold">{steps[active].title}</h3>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">{steps[active].details}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Key Deliverables</h4>
              <ul className="space-y-3">
                {steps[active].deliverables.map((d) => (
                  <li key={d} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    <span className="text-sm font-medium">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-6 text-lg">
            Want to see this process in action? Let's start with a free discovery call.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:scale-105"
          >
            Book a Discovery Call <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Process;
