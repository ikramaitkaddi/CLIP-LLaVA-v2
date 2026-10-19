import React from 'react';
import { Bot, Download, FileCode } from 'lucide-react';

export type MiniProjectMode = 'assistant' | 'bonus' | 'architecture';
export type AppTab = 'miniproject' | 'notebook';
export type TabType = 'overview' | 'zeroshot' | 'retrieval' | 'llava' | 'comparison' | 'miniproject' | 'questions' | 'notebook';

interface NavbarProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onDownloadNotebook: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab, onDownloadNotebook }) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 shrink-0">
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
              <p className="text-xs text-slate-400 hidden sm:block">Ask any question about a picture &bull; LLaVA + CLIP</p>
            </div>
          </div>

          {/* Center Tabs: Mini-Project vs Integrated Notebook */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => onSelectTab('miniproject')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'miniproject'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Mini-Project AI</span>
            </button>
            <button
              onClick={() => onSelectTab('notebook')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'notebook'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Notebook (.ipynb)</span>
            </button>
          </div>

          {/* Action button: Download .ipynb */}
          <button
            onClick={onDownloadNotebook}
            className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/40 text-xs font-semibold px-3 sm:px-3.5 py-2 rounded-xl shadow-sm transition-all cursor-pointer shrink-0"
            title="Download the complete Jupyter Notebook (.ipynb)"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download .ipynb</span>
            <span className="sm:hidden">.ipynb</span>
          </button>
        </div>
      </div>
    </header>
  );
};
