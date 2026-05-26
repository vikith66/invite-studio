import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { GlowButton } from '../components/GlowButton';
import { GlassCard } from '../components/GlassCard';
import { FloatingBlob } from '../components/FloatingBlob';
import { Mail, MessageCircle, HelpCircle, FileText, Phone, MapPin } from 'lucide-react';

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Us',
    description: 'Get a response within 24 hours',
    contact: 'hello@invitestudio.com',
    gradient: 'from-[#C7B8EA] to-[#A7D7F0]',
  },
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Available Mon-Fri, 9am-5pm PST',
    contact: 'Start a conversation',
    gradient: 'from-[#FFB5A7] to-[#FFB8D1]',
  },
  {
    icon: Phone,
    title: 'Call Us',
    description: 'Speak with our support team',
    contact: '+1 (555) 123-4567',
    gradient: 'from-[#A7D7F0] to-[#C7B8EA]',
  },
];

const departments = [
  {
    icon: HelpCircle,
    title: 'General Support',
    email: 'support@invitestudio.com',
    description: 'Questions about using InviteStudio',
  },
  {
    icon: FileText,
    title: 'Business Inquiries',
    email: 'business@invitestudio.com',
    description: 'Partnerships and collaborations',
  },
  {
    icon: MessageCircle,
    title: 'Feedback',
    email: 'feedback@invitestudio.com',
    description: 'Share your thoughts and ideas',
  },
];

export function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#FEFDFB] to-[#F5F0FF] overflow-x-hidden">
      {/* Floating background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <FloatingBlob color="linear-gradient(135deg, #FFB5A7 0%, #FFB8D1 100%)" size="400px" top="10%" left="5%" />
        <FloatingBlob color="linear-gradient(135deg, #C7B8EA 0%, #A7D7F0 100%)" size="350px" bottom="10%" right="10%" delay="delay-1000" />
        <FloatingBlob color="linear-gradient(135deg, #FFF4B8 0%, #A7D7F0 100%)" size="300px" top="50%" right="5%" delay="delay-2000" />
      </div>

      <Navbar />

      {/* Header */}
      <section className="relative pt-32 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6">
            <div className="backdrop-blur-sm bg-white/50 border border-white/40 rounded-full px-6 py-2 text-sm text-gray-700 shadow-sm">
              ✨ We're here to help
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-heading text-gray-900 mb-6">
            Get in Touch
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
            Have a question or need help? We'd love to hear from you. Our team is ready to assist you.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="relative py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {contactMethods.map((method, idx) => (
              <GlassCard key={idx} hover className="p-8 text-center">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${method.gradient} flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <method.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold font-heading text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-600 mb-4">{method.description}</p>
                <p className="text-lg font-medium text-[#C7B8EA]">{method.contact}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="relative py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <GlassCard className="p-8">
              <h2 className="text-3xl font-bold font-heading text-gray-900 mb-6">Send Us a Message</h2>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      placeholder="John"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:border-[#C7B8EA] focus:ring-2 focus:ring-[#C7B8EA]/20 outline-none transition-all placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      placeholder="Doe"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:border-[#C7B8EA] focus:ring-2 focus:ring-[#C7B8EA]/20 outline-none transition-all placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:border-[#C7B8EA] focus:ring-2 focus:ring-[#C7B8EA]/20 outline-none transition-all placeholder:text-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Subject</label>
                  <input
                    type="text"
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:border-[#C7B8EA] focus:ring-2 focus:ring-[#C7B8EA]/20 outline-none transition-all placeholder:text-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    rows={6}
                    placeholder="Tell us more about your question or feedback..."
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:border-[#C7B8EA] focus:ring-2 focus:ring-[#C7B8EA]/20 outline-none transition-all placeholder:text-gray-400 resize-none"
                  />
                </div>

                <GlowButton type="submit" variant="primary" className="w-full">
                  Send Message
                </GlowButton>
              </form>
            </GlassCard>

            {/* Additional Info */}
            <div className="space-y-8">
              {/* Departments */}
              <GlassCard className="p-8">
                <h2 className="text-3xl font-bold font-heading text-gray-900 mb-6">Contact by Department</h2>

                <div className="space-y-6">
                  {departments.map((dept, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#C7B8EA]/20 to-[#A7D7F0]/20 flex items-center justify-center">
                        <dept.icon className="w-6 h-6 text-[#C7B8EA]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold font-heading text-gray-900 mb-1">{dept.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{dept.description}</p>
                        <a href={`mailto:${dept.email}`} className="text-[#C7B8EA] hover:text-[#B8A8DA] transition-colors font-medium">
                          {dept.email}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Office Location */}
              <GlassCard className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFB5A7] to-[#FFB8D1] flex items-center justify-center shadow-lg">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold font-heading text-gray-900">Our Office</h2>
                </div>

                <div className="space-y-3 text-gray-600">
                  <p className="leading-relaxed">
                    <strong className="text-gray-900">InviteStudio HQ</strong><br />
                    123 Creative Avenue<br />
                    San Francisco, CA 94103<br />
                    United States
                  </p>
                  <p className="text-sm pt-4 border-t border-gray-200">
                    <strong className="text-gray-900">Office Hours:</strong><br />
                    Monday - Friday: 9:00 AM - 6:00 PM PST<br />
                    Saturday - Sunday: Closed
                  </p>
                </div>
              </GlassCard>

              {/* FAQ Link */}
              <GlassCard className="p-8 text-center bg-gradient-to-br from-[#C7B8EA]/10 to-[#FFB5A7]/10">
                <HelpCircle className="w-12 h-12 mx-auto mb-4 text-[#C7B8EA]" />
                <h3 className="text-2xl font-bold font-heading text-gray-900 mb-3">
                  Looking for Quick Answers?
                </h3>
                <p className="text-gray-600 mb-6">
                  Check out our FAQ section for common questions
                </p>
                <GlowButton to="/pricing" variant="secondary">
                  View FAQs
                </GlowButton>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-gray-900 mb-4">
              Join Our Community
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Follow us on social media for updates, tips, and inspiration
            </p>
            <div className="flex gap-4 justify-center">
              {['Twitter', 'Instagram', 'Facebook', 'LinkedIn'].map((platform, idx) => (
                <button
                  key={idx}
                  className="w-12 h-12 rounded-xl bg-white/50 border border-gray-200 hover:bg-white hover:border-[#C7B8EA] transition-all flex items-center justify-center"
                >
                  <span className="text-xl">{platform[0]}</span>
                </button>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      <Footer />
    </div>
  );
}
