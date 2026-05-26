import { Navbar } from '../components/Navbar';
import { GlowButton } from '../components/GlowButton';
import { GlassCard } from '../components/GlassCard';
import { FloatingBlob } from '../components/FloatingBlob';
import { Link } from 'react-router';
import { Heart, Target, Users, Lightbulb, Sparkles, Mail } from 'lucide-react';

const values = [
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'Every feature is crafted with care to make your special moments even more memorable.',
    gradient: 'from-[#FFB5A7] to-[#FFB8D1]',
  },
  {
    icon: Sparkles,
    title: 'Beautiful Design',
    description: 'We believe in the power of beautiful design to create emotional connections.',
    gradient: 'from-[#C7B8EA] to-[#A7D7F0]',
  },
  {
    icon: Users,
    title: 'Community First',
    description: 'Our users are at the heart of everything we do. Your feedback shapes our roadmap.',
    gradient: 'from-[#A7D7F0] to-[#C7B8EA]',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We constantly innovate to bring you the best tools for creating stunning invitations.',
    gradient: 'from-[#FFF4B8] to-[#FFB5A7]',
  },
];

const team = [
  {
    name: 'Sarah Chen',
    role: 'Founder & CEO',
    image: '👩‍💼',
    bio: 'Former designer with a passion for making design accessible to everyone.',
    gradient: 'from-[#FFB5A7] to-[#FFB8D1]',
  },
  {
    name: 'Michael Park',
    role: 'Head of Product',
    image: '👨‍💻',
    bio: 'Building products that people love to use, one pixel at a time.',
    gradient: 'from-[#C7B8EA] to-[#A7D7F0]',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Lead Designer',
    image: '👩‍🎨',
    bio: 'Creating beautiful experiences that bring joy to our users.',
    gradient: 'from-[#A7D7F0] to-[#C7B8EA]',
  },
  {
    name: 'David Kim',
    role: 'Engineering Lead',
    image: '👨‍🔧',
    bio: 'Making sure everything runs smoothly behind the scenes.',
    gradient: 'from-[#FFF4B8] to-[#FFB5A7]',
  },
];

const stats = [
  { number: '100K+', label: 'Happy Users' },
  { number: '500+', label: 'Templates' },
  { number: '1M+', label: 'Invitations Created' },
  { number: '4.9★', label: 'User Rating' },
];

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#FEFDFB] to-[#F5F0FF] overflow-x-hidden">
      {/* Floating background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <FloatingBlob color="linear-gradient(135deg, #FFB5A7 0%, #FFB8D1 100%)" size="400px" top="10%" left="5%" />
        <FloatingBlob color="linear-gradient(135deg, #C7B8EA 0%, #A7D7F0 100%)" size="350px" bottom="10%" right="10%" delay="delay-1000" />
        <FloatingBlob color="linear-gradient(135deg, #FFF4B8 0%, #A7D7F0 100%)" size="300px" top="50%" right="5%" delay="delay-2000" />
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6">
              <div className="backdrop-blur-sm bg-white/50 border border-white/40 rounded-full px-6 py-2 text-sm text-gray-700 shadow-sm">
                ✨ About InviteStudio
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-heading text-gray-900 mb-6">
              Making Every Invitation
              <span className="block bg-gradient-to-r from-[#C7B8EA] via-[#FFB5A7] to-[#A7D7F0] bg-clip-text text-transparent">
                Beautiful & Memorable
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-8">
              We believe that every celebration deserves a stunning invitation. InviteStudio was created to empower anyone to design professional, beautiful invitations without needing design experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GlowButton to="/signup" variant="primary" size="lg">
                Get Started Free
              </GlowButton>
              <GlowButton to="/templates" variant="secondary" size="lg">
                Explore Templates
              </GlowButton>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <GlassCard className="p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold font-heading bg-gradient-to-r from-[#C7B8EA] to-[#FFB5A7] bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C7B8EA] to-[#A7D7F0] flex items-center justify-center shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-4xl font-bold font-heading text-gray-900">Our Mission</h2>
              </div>
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                To democratize beautiful design and make it accessible to everyone, regardless of their design skills or budget.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We started InviteStudio because we saw how expensive and time-consuming it was to create beautiful invitations. We wanted to change that by building a tool that's both powerful and easy to use.
              </p>
            </div>

            <div className="relative">
              <GlassCard className="p-12 animate-float">
                <div className="bg-gradient-to-br from-[#FFB5A7]/20 to-[#C7B8EA]/20 rounded-2xl p-12 text-center">
                  <Heart className="w-24 h-24 mx-auto mb-6 text-[#FFB5A7]" />
                  <h3 className="text-3xl font-bold font-heading text-gray-900 mb-4">
                    Designed with Love
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Every pixel, every feature, every template is crafted with care to make your special moments shine.
                  </p>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600">What drives us every day</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <GlassCard key={idx} hover className="p-8 text-center">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold font-heading text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">The people behind InviteStudio</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, idx) => (
              <GlassCard key={idx} hover className="p-6 text-center">
                <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${member.gradient} flex items-center justify-center mx-auto mb-4 text-5xl shadow-lg`}>
                  {member.image}
                </div>
                <h3 className="text-xl font-bold font-heading text-gray-900 mb-1">{member.name}</h3>
                <p className="text-sm text-[#C7B8EA] font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <GlassCard className="p-12">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C7B8EA] to-[#FFB5A7] flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold font-heading text-gray-900 mb-4">
                Join Our Community
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                We're always looking for talented people who share our passion for beautiful design.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <GlowButton variant="primary" size="lg">
                  <Mail className="w-5 h-5 mr-2" />
                  careers@invitestudio.com
                </GlowButton>
                <GlowButton to="/signup" variant="secondary" size="lg">
                  Start Creating Today
                </GlowButton>
              </div>
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
