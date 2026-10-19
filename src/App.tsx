import React, { useState } from 'react';
import { Navbar, AppTab } from './components/Navbar';
import { MiniProjectAssistantTab } from './components/MiniProjectAssistantTab';
import { NotebookViewerTab } from './components/NotebookViewerTab';
import { generateCompleteJupyterNotebook } from './data/notebookExport';
import { GraduationCap, CheckCircle2, Download, FileCode } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('miniproject');
  const [showDownloadToast, setShowDownloadToast] = useState(false);

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

      setShowDownloadToast(true);
      setTimeout(() => setShowDownloadToast(false), 3500);
    } catch (err) {
      console.error('Error downloading notebook:', err);
      // Fallback to server route
      window.location.href = '/api/notebook/download';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Toast Notification when downloading */}
      {showDownloadToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center space-x-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>CLIP_and_LLaVA_Lab_Complete.ipynb downloaded!</span>
        </div>
      )}

      {/* Simple Clean Navbar with tabs and download */}
      <Navbar 
        activeTab={activeTab} 
        onSelectTab={setActiveTab} 
        onDownloadNotebook={handleDownloadNotebook} 
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-6">
        {activeTab === 'miniproject' ? (
          <MiniProjectAssistantTab 
            onNavigateToNotebook={() => setActiveTab('notebook')} 
            onDownloadNotebook={handleDownloadNotebook} 
          />
        ) : (
          <NotebookViewerTab onDownloadNotebook={handleDownloadNotebook} />
        )}
      </main>

      {/* Clean Minimalist Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/60 text-xs text-slate-400 py-4 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-slate-200">Vision-Language Models Mini-Project</span>
            <span>&bull;</span>
            <span className="text-slate-400">Student Multimodal AI &bull; Part I &amp; Part II</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveTab(activeTab === 'miniproject' ? 'notebook' : 'miniproject')}
              className="text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center space-x-1"
            >
              <FileCode className="w-3.5 h-3.5 text-indigo-400" />
              <span>{activeTab === 'miniproject' ? 'View Integrated Notebook' : 'Back to Mini-Project AI'}</span>
            </button>

            <button
              onClick={handleDownloadNotebook}
              className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors cursor-pointer flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .ipynb</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
