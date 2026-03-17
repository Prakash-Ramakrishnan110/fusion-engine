import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How fast can you build my MVP?",
    answer: "Our 'Launch in 14 Days' program is designed for speed. For most startups, we can deliver a fully functional, high-quality MVP in just 10-14 days. More complex enterprise platforms typically take 4-8 weeks."
  },
  {
    question: "Do I own the source code and IP?",
    answer: "Absolutely. Once the project is completed and handed over, you own 100% of the intellectual property, source code, and assets. We provide a full transfer of ownership."
  },
  {
    question: "What technology stack do you use?",
    answer: "We specialize in modern, scalable stacks like React, Next.js, TypeScript, Tailwind CSS, and Node.js. For AI features, we integrate leading models from OpenAI, Anthropic, or Google Gemini."
  },
  {
    question: "How do you handle post-launch support?",
    answer: "We don't just build and leave. We offer various support packages including maintenance, scaling assistance, and feature iterations. We're your long-term technical partner."
  },
  {
    question: "Can you help with fundraising and pitch decks?",
    answer: "Yes! Beyond code, we help with technical architecture diagrams, product roadmaps, and feature prioritization that investors love to see in pitch decks."
  }
];

const FAQItem = ({ question, answer, isOpen, onClick }: { question: string; answer: string; isOpen: boolean; onClick: () => void }) => {
  return (
    <div className="border-b border-slate-200 dark:border-slate-800 last:border-0">
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className={`text-lg font-semibold transition-colors ${isOpen ? "text-primary" : "text-slate-900 dark:text-white group-hover:text-primary"}`}>
          {question}
        </span>
        <div className={`p-2 rounded-lg transition-all ${isOpen ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
          {isOpen ? <Minus size={20} /> : <Plus size={20} />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
              <HelpCircle size={14} />
              Support & Clarity
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
              Common <span className="text-primary">Questions</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Everything you need to know about building your startup with Fusion Engine.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-800"
          >
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-slate-500 dark:text-slate-500">
              Still have questions? <a href="/contact" className="text-primary font-bold hover:underline">Get in touch</a> with our team.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
