import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { GlassCard } from '../components/GlassCard';
import { GlowButton } from '../components/GlowButton';
import { FloatingBlob } from '../components/FloatingBlob';
import { Search, Heart, Crown, Baby, Wine, Sparkles } from 'lucide-react';
import elegantWeddingCover from '../../assets/covers/invite-studio-1779694621364.png';

const categories = ['All', 'Wedding', 'Engagement', 'Baby Shower', 'Reception'];

const templates = [
  { id: 1, title: 'Elegant Wedding', category: 'Wedding', icon: Heart, gradient: 'from-pink-200 to-rose-200', bgGradient: 'from-pink-50 to-rose-50', coverImage: elegantWeddingCover, editorTemplate: 'elegant-wedding' },
  { id: 2, title: 'Modern Engagement', category: 'Engagement', icon: Crown, gradient: 'from-purple-200 to-violet-200', bgGradient: 'from-purple-50 to-violet-50', editorTemplate: 'modern-engagement' },
  { id: 3, title: 'Sweet Baby Shower', category: 'Baby Shower', icon: Baby, gradient: 'from-blue-200 to-cyan-200', bgGradient: 'from-blue-50 to-cyan-50', editorTemplate: 'sweet-baby-shower' },
  { id: 4, title: 'Reception Party', category: 'Reception', icon: Wine, gradient: 'from-amber-200 to-orange-200', bgGradient: 'from-amber-50 to-orange-50', editorTemplate: 'reception-party' },
  { id: 5, title: 'Royal Wedding', category: 'Wedding', icon: Heart, gradient: 'from-rose-200 to-pink-200', bgGradient: 'from-rose-50 to-pink-50', editorTemplate: 'royal-wedding' },
  { id: 6, title: 'Diamond Engagement', category: 'Engagement', icon: Crown, gradient: 'from-violet-200 to-purple-200', bgGradient: 'from-violet-50 to-purple-50', editorTemplate: 'diamond-engagement' },
  { id: 7, title: 'Baby Boy Shower', category: 'Baby Shower', icon: Baby, gradient: 'from-cyan-200 to-blue-200', bgGradient: 'from-cyan-50 to-blue-50', editorTemplate: 'baby-boy-shower' },
  { id: 8, title: 'Garden Reception', category: 'Reception', icon: Wine, gradient: 'from-green-200 to-emerald-200', bgGradient: 'from-green-50 to-emerald-50', editorTemplate: 'garden-reception' },
  { id: 9, title: 'Beach Wedding', category: 'Wedding', icon: Heart, gradient: 'from-teal-200 to-cyan-200', bgGradient: 'from-teal-50 to-cyan-50', editorTemplate: 'beach-wedding' },
  { id: 10, title: 'Romantic Engagement', category: 'Engagement', icon: Crown, gradient: 'from-pink-200 to-purple-200', bgGradient: 'from-pink-50 to-purple-50', editorTemplate: 'romantic-engagement' },
  { id: 11, title: 'Baby Girl Shower', category: 'Baby Shower', icon: Baby, gradient: 'from-pink-200 to-rose-200', bgGradient: 'from-pink-50 to-rose-50', editorTemplate: 'baby-girl-shower' },
  { id: 12, title: 'Evening Reception', category: 'Reception', icon: Wine, gradient: 'from-indigo-200 to-purple-200', bgGradient: 'from-indigo-50 to-purple-50', editorTemplate: 'evening-reception' },
];

export function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#FEFDFB] to-[#F5F0FF] overflow-x-hidden">
      {/* Floating background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <FloatingBlob color="linear-gradient(135deg, #FFB5A7 0%, #FFB8D1 100%)" size="400px" top="10%" left="5%" />
        <FloatingBlob color="linear-gradient(135deg, #C7B8EA 0%, #A7D7F0 100%)" size="350px" bottom="10%" right="10%" delay="delay-1000" />
        <FloatingBlob color="linear-gradient(135deg, #FFF4B8 0%, #A7D7F0 100%)" size="300px" top="50%" right="5%" delay="delay-2000" />
      </div>

      <Navbar />

      <div className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold font-heading text-gray-900 mb-4">
              Browse Templates
            </h1>
            <p className="text-xl text-gray-600">Choose from our collection of beautiful invitation templates</p>
          </div>

          {/* Search Bar */}
          <div className="mb-8 max-w-2xl mx-auto">
            <GlassCard className="p-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/50 border-none rounded-2xl focus:bg-white outline-none transition-all placeholder:text-gray-400"
                />
              </div>
            </GlassCard>
          </div>

          {/* Categories */}
          <div className="mb-12">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    px-6 py-3 rounded-full font-medium transition-all font-heading
                    ${selectedCategory === category
                      ? 'bg-gradient-to-r from-[#C7B8EA] to-[#A7D7F0] text-white shadow-[0_4px_20px_rgba(199,184,234,0.3)]'
                      : 'bg-white/50 border border-gray-200 text-gray-700 hover:bg-white hover:border-gray-300'
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map(template => (
              <GlassCard key={template.id} hover className="p-6 group cursor-pointer">
                <div className={`w-full aspect-[3/4] rounded-2xl bg-gradient-to-br ${template.bgGradient} mb-4 flex items-center justify-center relative overflow-hidden border border-white/60`}>
                  {template.coverImage ? (
                    <img src={template.coverImage} alt={template.title} className="w-full h-full object-cover" />
                  ) : (
                    <template.icon className="w-16 h-16 text-gray-400" />
                  )}
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/60 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <GlowButton to={template.editorTemplate ? `/editor?template=${encodeURIComponent(template.editorTemplate)}` : '/editor'} variant="primary" size="sm">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Customize
                    </GlowButton>
                  </div>
                </div>
                <h3 className="text-xl font-bold font-heading text-gray-900 mb-1">{template.title}</h3>
                <p className="text-gray-600 text-sm">{template.category}</p>
              </GlassCard>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-400 font-heading">No templates found</p>
              <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
