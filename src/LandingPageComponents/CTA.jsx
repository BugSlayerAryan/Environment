// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";

export default function CTA() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.75 }}
      className="py-20 relative overflow-hidden bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-600 text-white text-center"
    >
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_#ffffff_0%,_transparent_65%)]" />
      <div className="absolute -left-20 top-1/3 w-80 h-80 rounded-full bg-white/20 blur-2xl" />
      <div className="absolute right-10 -bottom-10 w-72 h-72 rounded-full bg-sky-200/30 blur-2xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <h3 className="text-3xl md:text-4xl font-bold mb-4">Start Monitoring the Planet Today</h3>
        <p className="text-gray-100 max-w-2xl mx-auto mb-8">Join Environment A–Z and deploy a production-ready monitoring platform with real-time alerting and analytics.</p>

        <div className="flex flex-wrap justify-center gap-4">
          <button className="glow-btn bg-white text-emerald-700 px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-white/90 transition-all">Launch Dashboard</button>
          <button className="inline-flex items-center justify-center gap-2 border border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/20 transition-all">
            <FaGithub />
            GitHub Repository
          </button>
        </div>
      </div>
    </motion.section>
  );
}

