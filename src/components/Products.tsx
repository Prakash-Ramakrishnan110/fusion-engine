import { motion } from "framer-motion";
import { Receipt, Package, Truck, GraduationCap, ShoppingCart, Activity, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const products = [
  {
    icon: Receipt,
    title: "GST Billing Systems",
    desc: "Automated invoicing, GST-compliant billing, tax reports, and multi-branch support for retail and wholesale businesses.",
    features: ["Auto GST Calculation", "Multi-Branch Support", "PDF Invoice Generation", "Tax Report Export"],
  },
  {
    icon: Package,
    title: "Inventory & Stock Platforms",
    desc: "Real-time stock tracking, low-stock alerts, purchase order management, and barcode scanning across warehouses.",
    features: ["Real-time Stock Levels", "Barcode Scanning", "Purchase Orders", "Low-Stock Alerts"],
  },
  {
    icon: Truck,
    title: "Fleet Monitoring Systems",
    desc: "GPS tracking, route optimization, driver management, fuel monitoring, and predictive maintenance for logistics companies.",
    features: ["Live GPS Tracking", "Route Optimization", "Fuel Analytics", "Maintenance Alerts"],
  },
  {
    icon: GraduationCap,
    title: "School ERP Systems",
    desc: "Complete school management — admissions, attendance, grading, fee collection, timetable, and parent communication portals.",
    features: ["Online Admissions", "Attendance Tracking", "Grade Management", "Parent Portal"],
  },
  {
    icon: ShoppingCart,
    title: "Multi-Vendor E-commerce",
    desc: "Scalable marketplace platforms with vendor onboarding, product management, payment splits, and buyer dashboards.",
    features: ["Vendor Dashboard", "Payment Splits", "Product Catalog", "Buyer Reviews"],
  },
  {
    icon: Activity,
    title: "AI Monitoring Dashboards",
    desc: "Intelligent dashboards with anomaly detection, predictive insights, real-time alerts, and customizable KPI tracking.",
    features: ["Anomaly Detection", "Predictive Analytics", "Real-time Alerts", "Custom KPIs"],
  },
];

const Products = () => {
  return (
    <section id="products" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">Our Solutions</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">Products & Systems We Create</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Real digital products engineered for real businesses. Each system is custom-built, battle-tested, and designed for scale.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {products.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-8 group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <p.icon className="text-primary" size={26} />
              </div>
              <h3 className="text-xl font-bold mb-3">{p.title}</h3>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{p.desc}</p>
              <ul className="space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="text-sm text-muted-foreground flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-6 text-lg">
            Need a custom product? We'll design and build it from scratch.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:scale-105"
          >
            Request a Custom Build <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Products;
