import { motion } from "framer-motion";
import { Cpu, CreditCard, Activity, Megaphone, CheckCircle } from "lucide-react";

const activities = [
  {
    icon: Cpu,
    title: "Google DeepMind Accelerator",
    desc: "Successfully submitted our application for the Google DeepMind Accelerator program (APAC) with GEOMMAND, our AI-powered geospatial land intelligence platform.",
    date: "July 2026",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: CreditCard,
    title: "MemberPay – Now Live",
    desc: "Launched MemberPay, a subscription and membership management platform featuring automated WhatsApp reminders, secure online payments, and dynamic UPI QR payments.",
    date: "July 2026",
    color: "text-green-500",
    bg: "bg-green-500/10",
    link: "https://memberpay.vercel.app",
  },
  {
    icon: Activity,
    title: "HoofCare Development",
    desc: "Continued development of HoofCare, an innovative digital solution focused on livestock and veterinary management.",
    date: "July 2026",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    icon: CheckCircle,
    title: "Google Business Profile Verified",
    desc: "Fusion Engine Technology is now officially verified on Google, enhancing our online presence and customer accessibility.",
    date: "July 2026",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Megaphone,
    title: "Brand Expansion",
    desc: "Enhanced our brand with a new Cyber Phoenix mascot concept, updated company profile, and fresh marketing materials.",
    date: "July 2026",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

const RecentActivities = () => {
  return (
    <section id="recent-activities" className="py-24 bg-secondary/20 border-y border-border/50">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">Company News</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">Recent Activities</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A look at our latest milestones, product launches, and company updates.
          </p>
        </motion.div>

        <div className="space-y-6">
          {activities.map((activity, i) => (
            <motion.div
              key={activity.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border p-6 md:p-8 rounded-2xl shadow-sm flex flex-col md:flex-row gap-6 items-start hover:border-primary/50 transition-colors"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${activity.bg}`}>
                <activity.icon className={`w-7 h-7 ${activity.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                  <h3 className="text-xl font-bold">{activity.title}</h3>
                  <span className="text-sm font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full w-fit">
                    {activity.date}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {activity.desc}
                </p>
                {activity.link && (
                  <a
                    href={activity.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-4 text-primary font-medium hover:underline"
                  >
                    Visit Website →
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentActivities;
