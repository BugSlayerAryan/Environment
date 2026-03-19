// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function Technology() {
  const tech = [
    { name: "React", color: "bg-cyan-500" },
    { name: "Tailwind CSS", color: "bg-emerald-500" },
    { name: "Chart.js", color: "bg-orange-400" },
    { name: "Recharts", color: "bg-sky-500" },
    { name: "Mapbox", color: "bg-violet-500" },
    { name: "OpenWeather API", color: "bg-blue-500" },
    { name: "Leaflet", color: "bg-teal-500" },
    { name: "Open API Data", color: "bg-lime-400 text-slate-900" },
  ];

  return (
    <section id="tech" className="py-24 bg-gradient-to-b from-white via-emerald-50 to-cyan-50">
      <div className="max-w-6xl mx-auto px-6 text-center mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-sky-600">Tech foundation</p>
        <h3 className="text-3xl md:text-4xl font-bold text-slate-900">Built on modern, scalable tech</h3>
        <p className="text-slate-600 mt-3">A cloud-ready stack built for low-latency real-time analytics and full spatial visualization.</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {tech.map((item, idx) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, delay: idx * 0.08 }}
            className={`glass-card border border-white/30 ${item.color} bg-opacity-90 text-white font-semibold px-4 py-3 rounded-2xl text-center shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all`}
          >
            {item.name}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
