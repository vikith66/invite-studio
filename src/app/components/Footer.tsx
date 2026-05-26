import { Link } from 'react-router';

export function Footer() {
  return (
    <footer className="relative py-12 px-6 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Link
            to="/"
            className="text-2xl font-bold font-heading bg-gradient-to-r from-[#C7B8EA] via-[#FFB5A7] to-[#A7D7F0] bg-clip-text text-transparent"
          >
            InviteStudio
          </Link>
          <div className="flex gap-8 text-gray-600">
            <Link to="/about" className="hover:text-gray-900 transition-colors">About</Link>
            <Link to="/privacy" className="hover:text-gray-900 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-gray-900 transition-colors">Terms</Link>
            <Link to="/contact" className="hover:text-gray-900 transition-colors">Contact</Link>
          </div>
          <div className="text-gray-500 text-sm">© 2026 InviteStudio. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
