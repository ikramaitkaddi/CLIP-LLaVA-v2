import React, { useState } from 'react';
import { Navbar, AppTab } from './components/Navbar';
import { MiniProjectAssistantTab } from './components/MiniProjectAssistantTab';
import { NotebookViewerTab, NotebookChoice } from './components/NotebookViewerTab';
import { generateCompleteJupyterNotebook, generateAssessmentNotebook } from './data/notebookExport';
import { GraduationCap, CheckCircle2, Download, FileCode } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('miniproject');
  const [showDownloadToast, setShowDownloadToast] = useState(false);
  const [downloadedFileName, setDownloadedFileName] = useState('05_Assessment.ipynb');

  const handleDownloadNotebook = (
    type: NotebookChoice = 'assessment', 
    customContent?: string, 
    customFilename?: string
  ) => {
    try {
      let notebookJson = '';
      let filename = '05_Assessment.ipynb';

      if (type === 'custom' && customContent) {
        notebookJson = customContent;
        filename = customFilename || 'notebook.ipynb';
      } else if (type === 'clipllava') {
        notebookJson = generateCompleteJupyterNotebook();
        filename = 'CLIP_and_LLaVA_Lab_Complete.ipynb';
      } else {
        notebookJson = generateAssessmentNotebook();
        filename = '05_Assessment.ipynb';
      }

      const blob = new Blob([notebookJson], { type: 'application/x-ipynb+json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadedFileName(filename);
      setShowDownloadToast(true);
      setTimeout(() => setShowDownloadToast(false), 3500);
    } catch (err) {
      console.error('Error downloading notebook:', err);
      // Fallback to server route
      window.location.href = type === 'clipllava' 
        ? '/api/notebook/download?file=clipllava' 
        : '/api/notebook/download?file=assessment';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Toast Notification when downloading */}
      {showDownloadToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center space-x-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{downloadedFileName} downloaded successfully!</span>
        </div>
      )}

      {/* Simple Clean Navbar with tabs and download */}
      <Navbar 
        activeTab={activeTab} 
        onSelectTab={setActiveTab} 
        onDownloadNotebook={() => handleDownloadNotebook('assessment')} 
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-6">
        {activeTab === 'miniproject' ? (
          <MiniProjectAssistantTab 
            onNavigateToNotebook={() => setActiveTab('notebook')} 
            onDownloadNotebook={() => handleDownloadNotebook('assessment')} 
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
            <span className="text-slate-400">Student Multimodal AI &bull; 05_Assessment.ipynb</span>
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
              onClick={() => handleDownloadNotebook('assessment')}
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
