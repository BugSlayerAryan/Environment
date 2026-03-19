// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaMobileAlt, FaTabletAlt, FaLaptop, FaDesktop } from "react-icons/fa";

const devices = [
  { icon: <FaMobileAlt />, title: "Mobile" },
  { icon: <FaTabletAlt />, title: "Tablet" },
  { icon: <FaLaptop />, title: "Laptop" },
  { icon: <FaDesktop />, title: "Desktop" },
];

export default function DashboardPreview() {
  return (
    <section id="dashboard" className="py-24 bg-gradient-to-b from-emerald-50 via-cyan-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-sky-600">Interactive demo</p>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900">Interactive Dashboard Mockups</h3>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">Premium device previews for mobile, tablet, laptop and desktop with live chart animations and telemetry overlays.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="relative h-auto min-h-[320px] sm:h-[360px] md:h-[380px] lg:h-[430px] flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.15),transparent_30%),radial-gradient(circle_at_80%_35%,rgba(59,130,246,0.16),transparent_36%)]" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 z-10 w-full">
            {devices.map((device, i) => (
              <motion.div
                key={device.title}
                whileHover={{ y: -8 }}
                className="glass-card border border-white/40 p-5 rounded-3xl shadow-xl cursor-pointer transition"
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <div className="mb-3 text-3xl text-emerald-600">{device.icon}</div>
                <h4 className="text-lg font-semibold text-slate-900">{device.title}</h4>
                <p className="text-sm text-slate-600 mt-2">Adaptive analytics UI, real-time stream, heatmap overlay, and alert widgets.</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="mt-10 p-6 glass-card border border-white/40 rounded-3xl shadow-inner">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
            <div className="text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Immersive telemetry layers</p>
              <p className="mt-2">Switch between pollutant concentration, temperature gradients, and water stress coordinates with one click.</p>
            </div>
            <div className="text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Real-time alerting</p>
              <p className="mt-2">Live push notifications for hazard zones, severe weather, and regulatory thresholds.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

