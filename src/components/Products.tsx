import { motion } from "framer-motion";
import { Receipt, Package, Truck, GraduationCap, ShoppingCart, Activity } from "lucide-react";

const products = [
  { icon: Receipt, title: "GST Billing Systems" },
  { icon: Package, title: "Inventory & Stock Platforms" },
  { icon: Truck, title: "Fleet Monitoring Systems" },
  { icon: GraduationCap, title: "School ERP Systems" },
  { icon: ShoppingCart, title: "Multi-Vendor E-commerce" },
  { icon: Activity, title: "AI Monitoring Dashboards" },
];

const Products = () => {
  return (
    <section id="products" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Products & Systems We Create</h2>
          <p className="text-muted-foreground">Real digital products engineered for real businesses.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card gradient-border p-6 flex items-center gap-4 group hover:glow-box transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <p.icon className="text-primary" size={22} />
              </div>
              <h3 className="font-semibold">{p.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
