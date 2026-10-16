import React from 'react';
import { 
  Sparkles, 
  Bot, 
  Search, 
  Layers, 
  Download, 
  GraduationCap
} from 'lucide-react';

export type MiniProjectMode = 'assistant' | 'bonus' | 'architecture';
export type TabType = 'overview' | 'zeroshot' | 'retrieval' | 'llava' | 'comparison' | 'miniproject' | 'questions' | 'notebook';

interface NavbarProps {
  activeMode: MiniProjectMode;
  setActiveMode: (mode: MiniProjectMode) => void;
  onDownloadNotebook: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeMode,
  setActiveMode,
  onDownloadNotebook,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveMode('assistant')}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-emerald-400 p-0.5 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-sky-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  Student Mini-Project
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-full flex items-center space-x-1">
                  <GraduationCap className="w-3 h-3 inline mr-1" />
                  <span>Multimodal AI</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Simple Vision-Language Assistant &bull; LLaVA + CLIP Demo</p>
            </div>
          </div>

          {/* Action button */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onDownloadNotebook}
              className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium px-3.5 py-2 rounded-xl transition-all cursor-pointer"
              title="Download the complete Jupyter Notebook with all exercises and solutions"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download .ipynb</span>
            </button>
          </div>
        </div>

        {/* Simple Mode Switcher Buttons */}
        <div className="flex space-x-2 py-2 border-t border-slate-800/80 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveMode('assistant')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeMode === 'assistant'
                ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>1. Simple Image AI (VQA)</span>
          </button>

          <button
            onClick={() => setActiveMode('bonus')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeMode === 'bonus'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>2. Bonus: CLIP Image Finder</span>
          </button>

          <button
            onClick={() => setActiveMode('architecture')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeMode === 'architecture'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>3. How It Works (Architecture)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
