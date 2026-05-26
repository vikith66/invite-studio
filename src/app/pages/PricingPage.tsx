import { Navbar } from '../components/Navbar';
import { GlowButton } from '../components/GlowButton';
import { GlassCard } from '../components/GlassCard';
import { FloatingBlob } from '../components/FloatingBlob';
import { Link } from 'react-router';
import { Check, Sparkles, Crown, Rocket } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    icon: Sparkles,
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out InviteStudio',
    gradient: 'from-[#A7D7F0] to-[#C7B8EA]',
    bgGradient: 'from-[#A7D7F0]/10 to-[#C7B8EA]/10',
    features: [
      '5 invitations per month',
      'Basic templates',
      'Standard quality export',
      'Email support',
      'InviteStudio watermark',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    icon: Crown,
    price: '$12',
    period: 'per month',
    description: 'For individuals and small events',
    gradient: 'from-[#C7B8EA] to-[#FFB5A7]',
    bgGradient: 'from-[#C7B8EA]/10 to-[#FFB5A7]/10',
    features: [
      'Unlimited invitations',
      'Premium templates',
      'High quality export (300 DPI)',
      'Priority support',
      'No watermark',
      'Custom fonts',
      'Advanced customization',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Business',
    icon: Rocket,
    price: '$49',
    period: 'per month',
    description: 'For event planners and agencies',
    gradient: 'from-[#FFB5A7] to-[#FFF4B8]',
    bgGradient: 'from-[#FFB5A7]/10 to-[#FFF4B8]/10',
    features: [
      'Everything in Pro',
      'Team collaboration (5 users)',
      'Brand kit & templates',
      'API access',
      'Dedicated support',
      'Custom domain',
      'Analytics dashboard',
      'White-label options',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

const faqs = [
  {
    question: 'Can I change plans later?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes! Pro and Business plans come with a 14-day free trial. No credit card required.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express) and PayPal.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Absolutely! You can cancel your subscription at any time. No questions asked.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Yes! We offer a 30-day money-back guarantee. If you\'re not satisfied, we\'ll refund your purchase.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes! We use industry-standard encryption and security measures to protect your data.',
  },
];

export function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#FEFDFB] to-[#F5F0FF] overflow-x-hidden">
      {/* Floating background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <FloatingBlob color="linear-gradient(135deg, #FFB5A7 0%, #FFB8D1 100%)" size="400px" top="10%" left="5%" />
        <FloatingBlob color="linear-gradient(135deg, #C7B8EA 0%, #A7D7F0 100%)" size="350px" bottom="10%" right="10%" delay="delay-1000" />
        <FloatingBlob color="linear-gradient(135deg, #FFF4B8 0%, #FFB5A7 100%)" size="300px" top="50%" right="5%" delay="delay-2000" />
      </div>

      <Navbar />

      {/* Header */}
      <section className="relative pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block mb-6">
            <div className="backdrop-blur-sm bg-white/50 border border-white/40 rounded-full px-6 py-2 text-sm text-gray-700 shadow-sm">
              ✨ Simple, transparent pricing
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-heading text-gray-900 mb-6">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Start free and upgrade as you grow. All plans include beautiful templates and easy-to-use tools.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, idx) => (
              <div key={idx} className="relative">
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-[#C7B8EA] to-[#FFB5A7] text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}

                <GlassCard
                  className={`p-8 h-full flex flex-col ${plan.popular ? 'ring-2 ring-[#C7B8EA]/30 shadow-2xl scale-105' : ''}`}
                  hover={!plan.popular}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold font-heading text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold font-heading text-gray-900">{plan.price}</span>
                      <span className="text-gray-600">/ {plan.period}</span>
                    </div>
                  </div>

                  <GlowButton
                    to="/signup"
                    variant={plan.popular ? 'primary' : 'ghost'}
                    className="w-full mb-8"
                  >
                    {plan.cta}
                  </GlowButton>

                  <div className="space-y-4 flex-1">
                    <div className="text-sm font-medium text-gray-900 mb-4">What's included:</div>
                    {plan.features.map((feature, featureIdx) => (
                      <div key={featureIdx} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-[#C7B8EA] to-[#A7D7F0] flex items-center justify-center mt-0.5">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="relative py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <GlassCard className="p-12 text-center">
            <h2 className="text-4xl font-bold font-heading text-gray-900 mb-4">
              All Plans Include
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Core features available to everyone
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {[
                { title: 'Easy Editor', desc: 'Intuitive drag-and-drop interface' },
                { title: 'Cloud Storage', desc: 'Your designs saved securely' },
                { title: 'Mobile Ready', desc: 'Design on any device' },
                { title: 'Fast Export', desc: 'Download in seconds' },
                { title: 'Regular Updates', desc: 'New templates monthly' },
                { title: 'Community', desc: 'Join our creator community' },
              ].map((feature, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C7B8EA]/20 to-[#FFB5A7]/20 flex items-center justify-center mx-auto mb-3">
                    <Check className="w-6 h-6 text-[#C7B8EA]" />
                  </div>
                  <h3 className="font-bold font-heading text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">Everything you need to know</p>
          </div>

          <div className="grid gap-4">
            {faqs.map((faq, idx) => (
              <GlassCard key={idx} className="p-6 hover:bg-white/80 transition-all">
                <h3 className="text-lg font-bold font-heading text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </GlassCard>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <GlowButton to="/about" variant="secondary">
              Contact Our Team
            </GlowButton>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Start creating beautiful invitations today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GlowButton to="/signup" variant="primary" size="lg">
                Start Free Trial
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
