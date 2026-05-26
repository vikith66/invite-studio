import { Link } from 'react-router';
import { GlowButton } from './GlowButton';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="backdrop-blur-xl bg-white/60 border border-white/40 rounded-full px-8 py-4 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold font-heading bg-gradient-to-r from-[#C7B8EA] via-[#FFB5A7] to-[#A7D7F0] bg-clip-text text-transparent">
              InviteStudio
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">
                Home
              </Link>
              <Link to="/templates" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">
                Templates
              </Link>
              <Link to="/pricing" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">
                Pricing
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">
                About
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <GlowButton to="/login" variant="ghost" size="sm">
                Login
              </GlowButton>
              <GlowButton to="/signup" variant="primary" size="sm">
                Get Started
              </GlowButton>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
