import { Navbar } from '../components/Navbar';
import { GlowButton } from '../components/GlowButton';
import { GlassCard } from '../components/GlassCard';
import { FloatingBlob } from '../components/FloatingBlob';
import { Link } from 'react-router';
import { Sparkles, Palette, Zap, Download, Heart, Baby, Wine, Crown, Edit, Wand2 } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#FEFDFB] to-[#F5F0FF] overflow-x-hidden">
      {/* Floating background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <FloatingBlob color="linear-gradient(135deg, #FFB5A7 0%, #FFB8D1 100%)" size="400px" top="10%" left="5%" />
        <FloatingBlob color="linear-gradient(135deg, #C7B8EA 0%, #A7D7F0 100%)" size="350px" top="60%" right="10%" delay="delay-1000" />
        <FloatingBlob color="linear-gradient(135deg, #FFF4B8 0%, #FFB5A7 100%)" size="300px" bottom="10%" left="20%" delay="delay-2000" />
        <FloatingBlob color="linear-gradient(135deg, #A7D7F0 0%, #C7B8EA 100%)" size="250px" top="30%" right="25%" delay="delay-3000" />
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="space-y-8">
              <div className="inline-block">
                <div className="backdrop-blur-sm bg-white/50 border border-white/40 rounded-full px-6 py-2 text-sm text-gray-700 shadow-sm">
                  ✨ Create stunning invitations effortlessly
                </div>
              </div>

              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] text-gray-900">
                Create Beautiful
                <span className="block bg-gradient-to-r from-[#C7B8EA] via-[#FFB5A7] to-[#A7D7F0] bg-clip-text text-transparent">
                  Invitations
                </span>
                {/* <span className="block">Effortlessly</span> */}
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl">
                Design wedding, engagement, baby shower and celebration invitations with a modern easy-to-use editor.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <GlowButton to="/editor" variant="primary" size="lg">
                  Start Designing
                </GlowButton>
                <GlowButton to="/templates" variant="secondary" size="lg">
                  Explore Templates
                </GlowButton>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-600">Happy Users</div>
                </div>
                <div className="w-px h-12 bg-gray-200" />
                <div>
                  <div className="text-3xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Templates</div>
                </div>
                <div className="w-px h-12 bg-gray-200" />
                <div>
                  <div className="text-3xl font-bold text-gray-900">4.9★</div>
                  <div className="text-sm text-gray-600">User Rating</div>
                </div>
              </div>
            </div>

            {/* Right: Floating Editor Mockup */}
            <div className="relative">
              <div className="relative animate-float">
                <GlassCard className="p-8">
                  <div className="bg-gradient-to-br from-[#FFB5A7]/20 to-[#C7B8EA]/20 rounded-2xl p-12 text-center">
                    <Heart className="w-20 h-20 mx-auto mb-4 text-[#FFB5A7]" />
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">Sarah & John</h3>
                    <p className="text-gray-600">You're Invited!</p>
                    <div className="mt-6 space-y-2 text-sm text-gray-600">
                      <p>June 15, 2026</p>
                      <p>Garden Venue, California</p>
                    </div>
                  </div>
                </GlassCard>

                {/* Floating decorative elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-br from-[#FFF4B8] to-[#FFB5A7] shadow-lg animate-float delay-1000" />
                <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-gradient-to-br from-[#A7D7F0] to-[#C7B8EA] shadow-lg animate-float delay-2000" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services/Features Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600">Powerful features to create stunning invitations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Edit, title: 'Editable Templates', desc: 'Choose from hundreds of beautiful templates', color: 'from-[#FFB5A7] to-[#FFB8D1]' },
              { icon: Wand2, title: 'Drag & Drop Editor', desc: 'Easy-to-use interface for everyone', color: 'from-[#C7B8EA] to-[#A7D7F0]' },
              { icon: Download, title: 'Instant Download', desc: 'Get your designs in seconds', color: 'from-[#A7D7F0] to-[#C7B8EA]' },
              { icon: Palette, title: 'Premium Fonts', desc: 'Access to beautiful typography', color: 'from-[#FFF4B8] to-[#FFB5A7]' },
              { icon: Sparkles, title: 'Easy Customization', desc: 'Change colors, text, and images', color: 'from-[#FFB8D1] to-[#C7B8EA]' },
              { icon: Zap, title: 'High Quality Export', desc: 'Download in HD quality', color: 'from-[#FFB5A7] to-[#A7D7F0]' },
            ].map((feature, idx) => (
              <GlassCard key={idx} hover className="p-8">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Template Showcase */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Beautiful Templates
            </h2>
            <p className="text-xl text-gray-600">Choose from our curated collection</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: 'Wedding Invitations', color: 'from-pink-300 to-rose-300', bgColor: 'from-pink-50 to-rose-50' },
              { icon: Crown, title: 'Engagement Cards', color: 'from-purple-300 to-violet-300', bgColor: 'from-purple-50 to-violet-50' },
              { icon: Baby, title: 'Baby Shower', color: 'from-blue-300 to-cyan-300', bgColor: 'from-blue-50 to-cyan-50' },
              { icon: Wine, title: 'Reception Cards', color: 'from-amber-300 to-orange-300', bgColor: 'from-amber-50 to-orange-50' },
            ].map((template, idx) => (
              <GlassCard key={idx} hover className="p-6 group cursor-pointer">
                <div className={`w-full aspect-[3/4] rounded-2xl bg-gradient-to-br ${template.bgColor} mb-4 flex items-center justify-center relative overflow-hidden border border-white/60`}>
                  <template.icon className={`w-20 h-20 bg-gradient-to-br ${template.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} />
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <GlowButton to="/editor" variant="primary" size="sm">
                      Customize
                    </GlowButton>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{template.title}</h3>
              </GlassCard>
            ))}
          </div>

          <div className="text-center mt-12">
            <GlowButton to="/templates" variant="primary" size="lg">
              View All Templates
            </GlowButton>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Ready to Create Something Beautiful?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands creating stunning invitations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GlowButton to="/signup" variant="primary" size="lg">
                Get Started Free
              </GlowButton>
              <GlowButton to="/templates" variant="ghost" size="lg">
                Browse Templates
              </GlowButton>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-2xl font-bold font-heading bg-gradient-to-r from-[#C7B8EA] via-[#FFB5A7] to-[#A7D7F0] bg-clip-text text-transparent">
              InviteStudio
            </div>
            <div className="flex gap-8 text-gray-600">
              <Link to="/about" className="hover:text-gray-900 transition-colors">About</Link>
              <Link to="/privacy" className="hover:text-gray-900 transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-gray-900 transition-colors">Terms</Link>
              <Link to="/contact" className="hover:text-gray-900 transition-colors">Contact</Link>
            </div>
            <div className="text-gray-500 text-sm">
              © 2026 InviteStudio. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
