// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaMapMarkedAlt, FaTemperatureHigh, FaWater, FaChartLine } from "react-icons/fa";

export default function MapSection() {
  const tiles = [
    { icon: <FaMapMarkedAlt />, title: "Pollution heatmaps", desc: "Dynamic toxic plume visualization with scale and cluster details." },
    { icon: <FaTemperatureHigh />, title: "Climate data", desc: "Global temperature and humidity tracing over days, months, and years." },
    { icon: <FaWater />, title: "Disaster monitoring", desc: "Flood, fire and drought alert layers in one unified map pane." },
    { icon: <FaChartLine />, title: "Satellite tracking", desc: "Orbital datasets merged with ground sensors for complete environmental context." },
  ];

  return (
    <section id="map" className="py-24 bg-gradient-to-b from-cyan-50 via-sky-50 to-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">Geospatial insights</p>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900">Environmental Map Visualization</h3>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">Explore pollution, climate, hazard, and satellite layers with smooth map transitions and live telemetry updates.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="grid gap-4">
            {tiles.map((tile, i) => (
              <motion.div
                key={tile.title}
                whileHover={{ x: 6 }}
                className="glass-card border border-white/30 rounded-3xl p-5 shadow-lg"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
              >
                <div className="text-2xl text-teal-500 mb-3">{tile.icon}</div>
                <h4 className="text-xl font-semibold text-slate-900 mb-1">{tile.title}</h4>
                <p className="text-slate-600 text-sm">{tile.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/60 backdrop-blur-xl shadow-2xl h-96"
          >
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(37,99,235,.3),rgba(16,185,129,.2))]" />
            <div className="relative h-full flex flex-col justify-center items-center text-center px-6 text-white">
              <p className="text-lg font-bold">Live Environmental Map</p>
              <p className="mt-3 max-w-xs text-sm">Interactive layers, animated paths, and a full-screen analytics mode for hazard detection.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

