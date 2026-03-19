export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200 py-14">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        <div>
          <h4 className="text-white font-semibold mb-3">Environment A–Z</h4>
          <p className="text-slate-300 text-sm">Enterprise-grade environmental risk analytics and monitoring dashboard.</p>
          <p className="text-slate-400 text-xs mt-3">Email: <a href="mailto:hello@env-az.com" className="text-emerald-300 hover:text-emerald-100">hello@env-az.com</a></p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Product</h4>
          <a href="#features" className="block text-slate-300 text-sm hover:text-white">Features</a>
          <a href="#dashboard" className="block text-slate-300 text-sm hover:text-white">Dashboard</a>
          <a href="#map" className="block text-slate-300 text-sm hover:text-white">Map</a>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Resources</h4>
          <a href="#tech" className="block text-slate-300 text-sm hover:text-white">Technology</a>
          <a href="#usecases" className="block text-slate-300 text-sm hover:text-white">Use Cases</a>
          <a href="#" className="block text-slate-300 text-sm hover:text-white">API docs</a>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Legal</h4>
          <a href="#" className="block text-slate-300 text-sm hover:text-white">Privacy Policy</a>
          <a href="#" className="block text-slate-300 text-sm hover:text-white">Terms of Service</a>
          <a href="#" className="block text-slate-300 text-sm hover:text-white">Cookie settings</a>
        </div>

      </div>

      <div className="border-t border-slate-700 mt-10 pt-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Environment A–Z. All rights reserved.
      </div>
    </footer>
  );
}

