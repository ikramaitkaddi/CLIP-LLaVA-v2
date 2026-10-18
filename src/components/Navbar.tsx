import React from 'react';
import { Bot, Download, Sparkles } from 'lucide-react';

export type MiniProjectMode = 'assistant' | 'bonus' | 'architecture';
export type TabType = 'overview' | 'zeroshot' | 'retrieval' | 'llava' | 'comparison' | 'miniproject' | 'questions' | 'notebook';

interface NavbarProps {
  onDownloadNotebook: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onDownloadNotebook }) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base sm:text-lg text-white tracking-tight flex items-center space-x-2">
                <span>Multimodal AI Assistant</span>
                <span className="text-[10px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/30 px-2 py-0.5 rounded-full">
                  Mini-Project
                </span>
              </h1>
              <p className="text-xs text-slate-400">Ask any question about a picture &bull; LLaVA + CLIP</p>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={onDownloadNotebook}
            className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all cursor-pointer"
            title="Download the complete Jupyter Notebook"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Download .ipynb</span>
          </button>
        </div>
      </div>
    </header>
  );
};
