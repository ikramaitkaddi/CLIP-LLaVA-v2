import React from 'react';
import { Navbar } from './components/Navbar';
import { MiniProjectAssistantTab } from './components/MiniProjectAssistantTab';
import { generateCompleteJupyterNotebook } from './data/notebookExport';
import { GraduationCap } from 'lucide-react';

export default function App() {
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
      {/* Simple Clean Navbar */}
      <Navbar onDownloadNotebook={handleDownloadNotebook} />

      {/* Main Content: Simple Multimodal AI Assistant */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-6">
        <MiniProjectAssistantTab />
      </main>

      {/* Clean Minimalist Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/60 text-xs text-slate-400 py-4 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-slate-200">Vision-Language Models Mini-Project</span>
            <span>&bull;</span>
            <span className="text-slate-400">Simple Multimodal AI</span>
          </div>

          <button
            onClick={handleDownloadNotebook}
            className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors cursor-pointer"
          >
            Download Complete Notebook (.ipynb)
          </button>
        </div>
      </footer>
    </div>
  );
}
