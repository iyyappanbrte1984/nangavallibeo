import React from 'react';
import { Award, PlusCircle, ListFilter, ShieldCheck, Users, Building2, Sparkles } from 'lucide-react';
import { TNEmblem } from './TNEmblem';

interface Props {
  activeTab: 'create' | 'list' | 'bulk' | 'verify' | 'preview';
  setActiveTab: (tab: 'create' | 'list' | 'bulk' | 'verify' | 'preview') => void;
  certCount: number;
}

export const Navbar: React.FC<Props> = ({ activeTab, setActiveTab, certCount }) => {
  return (
    <header className="bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-800 text-white shadow-xl sticky top-0 z-50 border-b-4 border-orange-500">
      {/* Top Subtle Tri-color Decorative Line */}
      <div className="w-full h-1.5 flex">
        <div className="w-1/3 h-full bg-orange-500" />
        <div className="w-1/3 h-full bg-white" />
        <div className="w-1/3 h-full bg-emerald-600" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-3">
        
        {/* ROW 1: Heading & Brand Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-white/20">
          
          {/* Logo, Seal & App Title */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Tamil Nadu Seal */}
            <div className="w-12 h-12 bg-white/95 rounded-2xl p-1 shadow-md border-2 border-amber-300 flex items-center justify-center flex-shrink-0">
              <TNEmblem className="w-10 h-10" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-white text-orange-800 px-2.5 py-0.5 rounded-md text-[11px] font-extrabold tracking-wider uppercase shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-orange-600" />
                  <span>80th Independence Day 2026</span>
                </span>
                <span className="bg-emerald-950/60 text-emerald-200 border border-emerald-400/40 px-2 py-0.5 rounded-md text-xs font-bold flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-emerald-300" />
                  <span>நங்கவள்ளி ஒன்றியம், சேலம் மாவட்டம்</span>
                </span>
              </div>

              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white leading-tight mt-1">
                80-ஆவது சுதந்திர தின விழா - 2026 போட்டிகள் சான்றிதழ் தளம்
              </h1>
              <p className="text-orange-100 text-xs font-medium mt-0.5 hidden sm:block">
                தமிழ்நாடு அரசு - தொடக்கக் கல்வித் துறை | நங்கவள்ளி ஒன்றிய 77 அரசுப் பள்ளிகளுக்கான சான்றிதழ் தளம்
              </p>
            </div>
          </div>

          {/* Quick Stats Badges on Top Right */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <div className="bg-black/25 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 text-right">
              <span className="text-[10px] text-slate-200 uppercase font-bold tracking-wider block">உருவாக்கப்பட்டவை</span>
              <span className="text-lg font-black text-amber-300">{certCount} சான்றிதழ்கள்</span>
            </div>
            <div className="bg-black/25 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 text-right">
              <span className="text-[10px] text-slate-200 uppercase font-bold tracking-wider block">நங்கவள்ளி</span>
              <span className="text-lg font-black text-emerald-300">77 பள்ளிகள்</span>
            </div>
          </div>
        </div>

        {/* ROW 2: Navigation Toolbar (In Dedicated Row below header) */}
        <nav className="flex items-center justify-start sm:justify-center md:justify-start space-x-2 overflow-x-auto pt-1 pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-2 whitespace-nowrap shadow-sm ${
              activeTab === 'create'
                ? 'bg-white text-orange-950 shadow-lg ring-2 ring-orange-300 scale-105'
                : 'bg-black/35 text-white hover:bg-black/50 border border-white/10'
            }`}
          >
            <PlusCircle className={`w-4 h-4 ${activeTab === 'create' ? 'text-orange-600' : 'text-orange-300'}`} />
            <span>சான்றிதழ் உருவாக்கு (Create)</span>
          </button>

          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-2 whitespace-nowrap shadow-sm ${
              activeTab === 'list'
                ? 'bg-white text-emerald-950 shadow-lg ring-2 ring-emerald-300 scale-105'
                : 'bg-black/35 text-white hover:bg-black/50 border border-white/10'
            }`}
          >
            <ListFilter className={`w-4 h-4 ${activeTab === 'list' ? 'text-emerald-600' : 'text-emerald-300'}`} />
            <span>சான்றிதழ் பட்டியல் ({certCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('bulk')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-2 whitespace-nowrap shadow-sm ${
              activeTab === 'bulk'
                ? 'bg-white text-blue-950 shadow-lg ring-2 ring-blue-300 scale-105'
                : 'bg-black/35 text-white hover:bg-black/50 border border-white/10'
            }`}
          >
            <Users className={`w-4 h-4 ${activeTab === 'bulk' ? 'text-blue-600' : 'text-blue-300'}`} />
            <span>மொத்தமாக உருவாக்கு (Bulk)</span>
          </button>

          <button
            onClick={() => setActiveTab('verify')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-2 whitespace-nowrap shadow-sm ${
              activeTab === 'verify'
                ? 'bg-white text-amber-950 shadow-lg ring-2 ring-amber-300 scale-105'
                : 'bg-black/35 text-white hover:bg-black/50 border border-white/10'
            }`}
          >
            <ShieldCheck className={`w-4 h-4 ${activeTab === 'verify' ? 'text-amber-600' : 'text-amber-300'}`} />
            <span>சரிபார் (Verify ID)</span>
          </button>
        </nav>

      </div>
    </header>
  );
};
