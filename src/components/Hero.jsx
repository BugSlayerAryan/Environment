// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaCloudSun, FaTint, FaLeaf, FaGlobeAmericas, FaWind } from "react-icons/fa";
import dashboardPreview from "../assets/dashboard-preview.png";

const floatingItems = [
  { icon: <FaCloudSun />, label: "Air Quality" },
  { icon: <FaTint />, label: "Water" },
  { icon: <FaLeaf />, label: "Soil" },
  { icon: <FaGlobeAmericas />, label: "Ecosystems" },
  { icon: <FaWind />, label: "Weather" },
];

export default function Hero() {
  return (
    <motion.section
      id="top"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative pt-28 pb-28 overflow-hidden bg-gradient-to-br from-teal-50 via-sky-100 to-blue-100"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(16,185,129,0.24),transparent_38%),radial-gradient(circle_at_85%_40%,rgba(14,118,255,0.18),transparent_42%)]" />
      <div className="absolute left-[-25%] top-[-6%] w-80 h-80 rounded-full bg-emerald-300/30 blur-3xl animate-hue" />
      <div className="absolute right-[-20%] top-1/4 w-96 h-96 rounded-full bg-cyan-300/30 blur-3xl animate-float" />
      <div className="relative z-10 w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-[min(1400px,100vw-2rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12 items-center">
          <div className="space-y-5 sm:space-y-6 text-center lg:text-left">
            <p className="inline-flex items-center gap-2 text-[11px] sm:text-xs md:text-sm text-emerald-700 font-semibold uppercase tracking-widest bg-emerald-100/80 border border-emerald-200 py-1 px-3 rounded-full shadow-sm">
              Premium platform
            </p>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-900"
            >
              Monitor Earth&apos;s Health in Real Time
            </motion.h1>
            <motion.p
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base md:text-lg lg:text-xl text-slate-700 max-w-full sm:max-w-lg xl:max-w-xl mx-auto lg:mx-0"
            >
              A smart environmental monitoring platform tracking atmosphere, air quality, water, soil, ecosystems and natural hazards across the globe.
            </motion.p>

            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-center lg:justify-start gap-3"
            >
              <button className="glow-btn w-full sm:w-auto bg-emerald-600 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:bg-emerald-700 transition">
                View Dashboard
              </button>
              <button className="w-full sm:w-auto border-2 border-emerald-500 text-emerald-700 px-8 py-3 rounded-2xl font-semibold hover:bg-emerald-100 transition">
                Explore Data
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-slate-700"
            >
              {['Real-time alerts', 'AI trend predictions', '100+ data sources', 'Global coverage'].map((item) => (
                <div key={item} className="p-3 bg-white/70 glass-card rounded-xl text-center font-medium">
                  {item}
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative rounded-3xl border border-white/70 bg-white/50 backdrop-blur-xl shadow-2xl overflow-hidden mx-auto w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl"
          >
            <picture>
              <source srcSet={dashboardPreview} type="image/png" />
              <img
                src={dashboardPreview}
                alt="Dashboard preview"
                className="w-full h-auto aspect-video object-cover"
                sizes="(max-width: 640px) 92vw, (max-width: 1280px) 48vw, 34vw"
              />
            </picture>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-4 right-4 p-3 bg-white/40 rounded-full shadow-lg">
                {floatingItems.map((item, idx) => (
                  <motion.span
                    key={item.label}
                    initial={{ y: 0, opacity: 0 }}
                    animate={{ y: [-4, 4, -4], opacity: [0, 1, 0] }}
                    transition={{ duration: 4.2, repeat: Infinity, delay: idx * 0.25 }}
                    className="inline-flex items-center justify-center text-sm text-emerald-700 m-1"
                  >
                    {item.icon}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/70 to-transparent" />
    </motion.section>
  );
}
