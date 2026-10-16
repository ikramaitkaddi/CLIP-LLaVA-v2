import React, { useState } from 'react';
import { Navbar, MiniProjectMode } from './components/Navbar';
import { MiniProjectAssistantTab } from './components/MiniProjectAssistantTab';
import { generateCompleteJupyterNotebook } from './data/notebookExport';
import { Bot, GraduationCap } from 'lucide-react';

export default function App() {
  const [activeMode, setActiveMode] = useState<MiniProjectMode>('assistant');

  const handleDownloadNotebook = () => {
    try {
      const notebookJson = generateCompleteJupyterNotebook();
      const blob = new Blob([notebookJson], { type: 'application/x-ipynb+json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'CLIP_and_LLaVA_Lab_Complete.ipynb';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading notebook:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Mini-Project Navbar */}
      <Navbar
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        onDownloadNotebook={handleDownloadNotebook}
      />

      {/* Main Mini-Project Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <MiniProjectAssistantTab
          activeMode={activeMode}
          setActiveMode={setActiveMode}
        />
      </main>

      {/* Student Project Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/60 text-xs text-slate-400 py-5 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-slate-200">Vision-Language Lab &bull; Student Mini-Project</span>
            <span>&bull;</span>
            <span className="text-slate-400">Multimodal Image Assistant</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveMode('architecture')}
              className="text-slate-400 hover:text-sky-300 transition-colors cursor-pointer"
            >
              How it works
            </button>
            <button
              onClick={handleDownloadNotebook}
              className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors cursor-pointer"
            >
              Download Complete Notebook (.ipynb)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
