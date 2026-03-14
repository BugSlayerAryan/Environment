// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaCity, FaFlask, FaUsers, FaLandmark } from "react-icons/fa";

export default function UseCases() {
  const usecases = [
    { icon: <FaCity />, title: "Smart Cities", text: "Optimize urban air quality, traffic pollution, and emergency response." },
    { icon: <FaFlask />, title: "Environmental Researchers", text: "Analyze long-term environmental trends and algorithmic model validation." },
    { icon: <FaUsers />, title: "Climate Activists", text: "Use data-backed insights to build awareness campaigns and policy proposals." },
    { icon: <FaLandmark />, title: "Government Monitoring", text: "Secure, compliance-ready dashboards for regulators and municipal operators." },
  ];

  return (
    <section id="usecases" className="py-24 bg-gradient-to-b from-white via-sky-50 to-cyan-50">
      <div className="max-w-6xl mx-auto px-6 text-center mb-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">Delivering value</p>
        <h3 className="text-3xl md:text-4xl font-bold text-slate-900">Use Cases</h3>
        <p className="text-slate-600 mt-3">Designed for rapid decision-making across stakeholders, policy teams and research labs.</p>
      </div>

      <div className="max-w-5xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {usecases.map((item, i) => (
          <motion.article
            key={item.title}
            className="glass-card border border-white/30 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-transform hover:-translate-y-1"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, delay: i * 0.09 }}
          >
            <div className="text-3xl text-emerald-600 mb-3">{item.icon}</div>
            <h4 className="text-xl font-semibold text-slate-900 mb-2">{item.title}</h4>
            <p className="text-slate-600 text-sm">{item.text}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

