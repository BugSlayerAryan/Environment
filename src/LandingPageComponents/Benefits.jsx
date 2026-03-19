// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function Benefits() {
  const benefits = [
    { icon: "📡", title: "Real-time Environmental Insights", desc: "Live sensor streams, AQI, weather and 50+ monitoring metrics." },
    { icon: "🏙️", title: "Smart City Monitoring", desc: "Centralized controls for infrastructure, air quality and hazard response." },
    { icon: "🌍", title: "Climate Awareness", desc: "Long-term trend insights for emissions, temperature and biodiversity." },
    { icon: "🔬", title: "Research & Education", desc: "Accessible datasets for policy makers, researchers and students." },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white via-sky-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-6 text-center mb-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">✓ key advantages</p>
        <h3 className="text-3xl md:text-4xl font-bold text-slate-900">Why Organizations Choose Environment A–Z</h3>
        <p className="text-slate-600 mt-3">Service-level insights, predictive monitoring, and operational readiness across environmental domains.</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map((benefit, i) => (
          <motion.article
            key={benefit.title}
            className="glass-card border border-white/30 rounded-3xl p-5 shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: i * 0.1 }}
          >
            <div className="text-4xl mb-3">{benefit.icon}</div>
            <h4 className="text-lg font-semibold text-slate-900 ">{benefit.title}</h4>
            <p className="text-slate-600 mt-2 text-sm">{benefit.desc}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
