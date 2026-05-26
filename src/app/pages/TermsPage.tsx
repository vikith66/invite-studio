import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { GlassCard } from '../components/GlassCard';
import { FloatingBlob } from '../components/FloatingBlob';
import { FileText, Users, CreditCard, Copyright, AlertTriangle, Scale } from 'lucide-react';

const sections = [
  {
    icon: Users,
    title: 'Acceptance of Terms',
    content: [
      {
        text: 'By accessing and using InviteStudio, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our service.',
      },
      {
        text: 'We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the modified terms.',
      },
    ],
  },
  {
    icon: FileText,
    title: 'Use of Service',
    content: [
      {
        subtitle: 'Account Responsibility',
        text: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately of any unauthorized use.',
      },
      {
        subtitle: 'Acceptable Use',
        text: 'You agree to use InviteStudio only for lawful purposes and in accordance with these Terms. You may not use our service to create content that is offensive, illegal, or infringes on others\' rights.',
      },
      {
        subtitle: 'Age Requirement',
        text: 'You must be at least 13 years old to use InviteStudio. If you are under 18, you must have parental consent to use our service.',
      },
    ],
  },
  {
    icon: Copyright,
    title: 'Intellectual Property',
    content: [
      {
        subtitle: 'Your Content',
        text: 'You retain all rights to the designs and invitations you create using InviteStudio. By using our service, you grant us a license to store, display, and process your content solely to provide the service.',
      },
      {
        subtitle: 'Our Content',
        text: 'All templates, fonts, graphics, and other materials provided by InviteStudio are our property or licensed to us. You may use these materials to create your designs but may not redistribute them.',
      },
      {
        subtitle: 'Watermarks',
        text: 'Free plan users must keep the InviteStudio watermark on exported designs. Paid plan users may remove the watermark.',
      },
    ],
  },
  {
    icon: CreditCard,
    title: 'Subscription & Billing',
    content: [
      {
        subtitle: 'Payment',
        text: 'Paid subscriptions are billed in advance on a monthly or annual basis. You authorize us to charge your payment method for all fees incurred.',
      },
      {
        subtitle: 'Cancellation',
        text: 'You may cancel your subscription at any time. Cancellations take effect at the end of the current billing period. No refunds for partial months.',
      },
      {
        subtitle: 'Price Changes',
        text: 'We may change our pricing with 30 days\' notice. Price changes will not affect your current billing cycle.',
      },
      {
        subtitle: 'Refunds',
        text: 'We offer a 30-day money-back guarantee for new subscriptions. Contact support to request a refund within 30 days of your initial purchase.',
      },
    ],
  },
  {
    icon: AlertTriangle,
    title: 'Limitation of Liability',
    content: [
      {
        text: 'InviteStudio is provided "as is" without any warranties, express or implied. We do not guarantee that the service will be uninterrupted, error-free, or completely secure.',
      },
      {
        text: 'We are not liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.',
      },
      {
        text: 'Our total liability to you for any claims related to the service is limited to the amount you paid us in the 12 months preceding the claim.',
      },
    ],
  },
  {
    icon: Scale,
    title: 'Termination',
    content: [
      {
        text: 'We reserve the right to suspend or terminate your account if you violate these Terms or engage in activities that harm our service or other users.',
      },
      {
        text: 'You may terminate your account at any time through your account settings. Upon termination, your access to the service will cease.',
      },
      {
        text: 'We will retain your data for 30 days after termination, after which it will be permanently deleted unless otherwise required by law.',
      },
    ],
  },
];

export function TermsPage() {
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
              <FileText className="w-4 h-4 inline mr-2" />
              Please read carefully
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-heading text-gray-900 mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600">
            Last updated: May 25, 2026
          </p>
          <p className="text-lg text-gray-600 mt-4 leading-relaxed">
            These terms govern your use of InviteStudio and outline the rights and responsibilities of both parties.
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
                    {item.subtitle && (
                      <h3 className="text-xl font-bold font-heading text-gray-900 mb-2">
                        {item.subtitle}
                      </h3>
                    )}
                    <p className="text-gray-600 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </GlassCard>
          ))}

          {/* Additional Important Notes */}
          <GlassCard className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFB5A7] to-[#FFB8D1] flex items-center justify-center shadow-lg flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold font-heading text-gray-900">Governing Law</h2>
            </div>

            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.
              </p>
              <p>
                Any disputes arising from these Terms or your use of InviteStudio shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
              </p>
            </div>
          </GlassCard>

          {/* Contact Section */}
          <GlassCard className="p-8 text-center">
            <h2 className="text-3xl font-bold font-heading text-gray-900 mb-4">
              Questions About These Terms?
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              If you have any questions about our Terms of Service, please contact us.
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
