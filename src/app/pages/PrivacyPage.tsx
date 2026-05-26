import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { GlassCard } from '../components/GlassCard';
import { FloatingBlob } from '../components/FloatingBlob';
import { Shield, Eye, Lock, Database, UserCheck, Globe } from 'lucide-react';

const sections = [
  {
    icon: Database,
    title: 'Information We Collect',
    content: [
      {
        subtitle: 'Account Information',
        text: 'When you create an account, we collect your name, email address, and password. This information is necessary to provide you with access to our services.',
      },
      {
        subtitle: 'Design Content',
        text: 'We store the invitations and designs you create using InviteStudio. This content is encrypted and stored securely on our servers.',
      },
      {
        subtitle: 'Usage Data',
        text: 'We collect information about how you use our service, including pages visited, features used, and time spent on the platform.',
      },
    ],
  },
  {
    icon: Eye,
    title: 'How We Use Your Information',
    content: [
      {
        subtitle: 'Service Delivery',
        text: 'We use your information to provide, maintain, and improve our services, including saving your designs and personalizing your experience.',
      },
      {
        subtitle: 'Communication',
        text: 'We may send you service-related emails, updates about new features, and promotional content (which you can opt out of at any time).',
      },
      {
        subtitle: 'Analytics',
        text: 'We analyze usage patterns to understand how our service is being used and to make improvements.',
      },
    ],
  },
  {
    icon: Lock,
    title: 'Data Security',
    content: [
      {
        subtitle: 'Encryption',
        text: 'All data transmission is encrypted using industry-standard SSL/TLS protocols. Your designs and personal information are stored with encryption at rest.',
      },
      {
        subtitle: 'Access Control',
        text: 'We maintain strict access controls and only authorized personnel can access user data, and only when necessary for support or maintenance.',
      },
      {
        subtitle: 'Regular Audits',
        text: 'We conduct regular security audits and maintain industry-standard security practices to protect your information.',
      },
    ],
  },
  {
    icon: UserCheck,
    title: 'Your Rights',
    content: [
      {
        subtitle: 'Access & Export',
        text: 'You can access, download, and export all of your designs and account information at any time through your account settings.',
      },
      {
        subtitle: 'Deletion',
        text: 'You have the right to delete your account and all associated data. Once deleted, this action cannot be undone.',
      },
      {
        subtitle: 'Opt-Out',
        text: 'You can opt out of promotional emails at any time by clicking the unsubscribe link in any email or updating your preferences.',
      },
    ],
  },
  {
    icon: Globe,
    title: 'Third-Party Services',
    content: [
      {
        subtitle: 'Payment Processing',
        text: 'We use trusted third-party payment processors (Stripe, PayPal) to handle payment information. We do not store your credit card details.',
      },
      {
        subtitle: 'Analytics',
        text: 'We use analytics services to understand how our platform is used. These services may collect anonymous usage data.',
      },
      {
        subtitle: 'Cloud Storage',
        text: 'Your designs are stored on secure cloud infrastructure provided by industry-leading providers with strong security practices.',
      },
    ],
  },
];

export function PrivacyPage() {
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
              <Shield className="w-4 h-4 inline mr-2" />
              Your privacy matters to us
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-heading text-gray-900 mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600">
            Last updated: May 25, 2026
          </p>
          <p className="text-lg text-gray-600 mt-4 leading-relaxed">
            At InviteStudio, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information.
          </p>
        </div>
      </section>

      {/* Content Sections */}
      <section className="relative py-12 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {sections.map((section, idx) => (
            <GlassCard key={idx} className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C7B8EA] to-[#A7D7F0] flex items-center justify-center shadow-lg flex-shrink-0">
                  <section.icon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold font-heading text-gray-900">{section.title}</h2>
              </div>

              <div className="space-y-6">
                {section.content.map((item, itemIdx) => (
                  <div key={itemIdx}>
                    <h3 className="text-xl font-bold font-heading text-gray-900 mb-2">
                      {item.subtitle}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </GlassCard>
          ))}

          {/* Cookies Section */}
          <GlassCard className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFB5A7] to-[#FFB8D1] flex items-center justify-center shadow-lg flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold font-heading text-gray-900">Cookies & Tracking</h2>
            </div>

            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                We use cookies and similar tracking technologies to improve your experience on our platform. Cookies are small files stored on your device that help us remember your preferences and understand how you use our service.
              </p>
              <p>
                <strong className="text-gray-900">Essential Cookies:</strong> These are necessary for the website to function and cannot be disabled.
              </p>
              <p>
                <strong className="text-gray-900">Analytics Cookies:</strong> Help us understand how visitors interact with our website.
              </p>
              <p>
                <strong className="text-gray-900">Marketing Cookies:</strong> Used to show you relevant advertisements (you can opt out of these).
              </p>
            </div>
          </GlassCard>

          {/* Contact Section */}
          <GlassCard className="p-8 text-center">
            <h2 className="text-3xl font-bold font-heading text-gray-900 mb-4">
              Questions About Privacy?
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              If you have any questions or concerns about our privacy policy, please don't hesitate to contact us.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-full font-medium bg-gradient-to-r from-[#C7B8EA] to-[#A7D7F0] text-white shadow-[0_4px_20px_rgba(199,184,234,0.3)] hover:shadow-[0_6px_30px_rgba(199,184,234,0.4)] transition-all"
            >
              Contact Us
            </a>
          </GlassCard>
        </div>
      </section>

      <Footer />
    </div>
  );
}
