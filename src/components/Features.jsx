// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function Features() {
  const features = [
    { icon: "🌍", title: "Atmosphere Monitoring", items: ["Temperature", "Wind", "Humidity", "Rainfall"] },
    { icon: "🌬️", title: "Air Quality Tracking", items: ["AQI", "PM2.5", "PM10", "Pollution Alerts"] },
    { icon: "💧", title: "Water Monitoring", items: ["Water pH", "Pollution Levels", "Dissolved Oxygen"] },
    { icon: "🌱", title: "Soil Monitoring", items: ["Soil Moisture", "Soil Nutrients", "Soil Temperature"] },
    { icon: "🌳", title: "Ecosystem Monitoring", items: ["Vegetation Index", "Biodiversity", "Forest Coverage"] },
    { icon: "⚡", title: "Natural Hazard Alerts", items: ["Earthquakes", "Flood Risk", "Cyclones"] },
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-white via-emerald-50 to-sky-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold tracking-widest text-emerald-600 uppercase mb-3">Platform features</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Comprehensive Environmental Monitoring Suite</h2>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">Glassmorphism cards, rich telemetry and alerting for atmosphere, water, soil and hazard response.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.article
              key={feature.title}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-card p-6 rounded-3xl border border-white/30 shadow-lg hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
              <ul className="text-slate-600 space-y-2 text-sm">
                {feature.items.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

