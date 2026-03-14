import { useState, useEffect, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Features", href: "#features", icon: "🔍" },
  { label: "Dashboard", href: "#dashboard", icon: "📊" },
  { label: "Map", href: "#map", icon: "🗺️" },
  { label: "Technology", href: "#tech", icon: "🛠️" },
  { label: "Use Cases", href: "#usecases", icon: "📌" },
];

function scrollToSection(href) {
  const target = document.querySelector(href);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const bodyOverflow = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = bodyOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const focusableSelectors = "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";
    const drawerEl = drawerRef.current;
    const focusable = drawerEl ? Array.from(drawerEl.querySelectorAll(focusableSelectors)) : [];

    if (focusable.length) {
      focusable[0].focus();
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
      if (event.key === "Tab" && focusable.length) {
        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <header className="fixed top-0 w-full backdrop-blur-xl bg-white/70 border-b border-white/20 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("#top");
          }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-500 shadow-md flex items-center justify-center text-white font-black">
            E
          </div>
          <span className="font-bold text-lg text-slate-900 tracking-tight">Environment A–Z</span>
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => scrollToSection(item.href)}
              className="px-1 py-1 rounded-md hover:text-emerald-600 transition"
              type="button"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            className="hidden md:inline-flex px-5 py-2 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
            type="button"
          >
            Launch Dashboard
          </button>

          <button
            ref={closeButtonRef}
            onClick={() => setOpen((prev) => !prev)}
            className="md:hidden w-11 h-11 rounded-xl border border-slate-300 bg-white shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-100 transition"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            type="button"
          >
            <span className="text-xl">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            <motion.button
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-slate-950/75 backdrop-filter backdrop-blur-sm"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              type="button"
            />

            <motion.div
              ref={drawerRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.28 }}
              className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl border-l border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-5 border-b border-slate-200">
                <div>
                  <p className="text-base font-bold text-slate-900">Environment A–Z</p>
                  <p className="text-xs text-slate-500">Premium dashboard experience</p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                  aria-label="Close mobile menu"
                  type="button"
                >
                  ✕
                </button>
              </div>

              <nav className="px-5 py-6 space-y-3">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => {
                      setOpen(false);
                      scrollToSection(item.href);
                    }}
                    className="flex items-center gap-3 w-full text-left rounded-[18px] px-4 py-4 bg-slate-50 text-slate-800 font-semibold text-base shadow-sm hover:bg-emerald-50 hover:text-emerald-700 transition"
                    type="button"
                  >
                    <span className="text-lg">{item.icon}</span>
                    {item.label}
                  </button>
                ))}

                <button
                  onClick={() => {
                    setOpen(false);
                    window.alert("Launch Dashboard (demo)");
                  }}
                  className="flex items-center justify-center gap-2 w-full rounded-[18px] bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold px-4 py-4 shadow-lg hover:opacity-95 transition"
                  type="button"
                >
                  🚀 Launch Dashboard
                </button>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

