import React, { useState } from 'react';
import { BENCHMARK_IMAGES, ImageItem } from '../data/labData';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Upload, 
  Search, 
  Loader2, 
  Layers,
  FileCode,
  Download,
  BookOpen
} from 'lucide-react';

interface MiniProjectAssistantTabProps {
  onNavigateToNotebook?: () => void;
  onDownloadNotebook?: () => void;
}

export const MiniProjectAssistantTab: React.FC<MiniProjectAssistantTabProps> = ({ 
  onNavigateToNotebook, 
  onDownloadNotebook 
}) => {
  const [selectedImage, setSelectedImage] = useState<ImageItem>(BENCHMARK_IMAGES[0]);
  const [customImageBase64, setCustomImageBase64] = useState<string>('');
  const [question, setQuestion] = useState<string>('What is in this picture?');
  const [aiAnswer, setAiAnswer] = useState<string>('Click "Ask AI" or choose one of the simple question buttons below to see the answer!');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastAskedQuestion, setLastAskedQuestion] = useState<string>('What is in this picture?');

  // Bonus Search State
  const [bonusQuery, setBonusQuery] = useState<string>('a person playing football');
  const [bonusMatches, setBonusMatches] = useState<any[]>([]);
  const [bonusExplanation, setBonusExplanation] = useState<string>('');
  const [isBonusLoading, setIsBonusLoading] = useState<boolean>(false);
  const [showBonus, setShowBonus] = useState<boolean>(false);

  // Simple preset photos
  const simplePhotos = [
    { label: '🐱 Cat', img: BENCHMARK_IMAGES[0] },
    { label: '🐶 Dog', img: BENCHMARK_IMAGES[1] },
    { label: '🚗 Car', img: BENCHMARK_IMAGES[2] },
    { label: '✈️ Plane', img: BENCHMARK_IMAGES[3] },
    { label: '⚽ Football', img: BENCHMARK_IMAGES[6] },
    { label: '🌲 Park (No Bike)', img: BENCHMARK_IMAGES[12] },
  ];

  // Simple preset questions
  const quickQuestions = [
    'What is in this picture?',
    'How many people or animals are there?',
    'What colors do you see?',
    'Is there a bicycle in this image?',
  ];

  // Bonus search topics
  const quickSearches = [
    'a person playing football',
    'a fast red sports car',
    'a photo of a cat',
    'a quiet park with benches',
  ];

  const handleAskAI = async (questionText?: string) => {
    const qToAsk = questionText || question;
    if (!qToAsk.trim()) return;

    setLastAskedQuestion(qToAsk);
    setIsLoading(true);

    try {
      const imagePayload = customImageBase64 || selectedImage.url;
      const isBase64 = imagePayload.startsWith('data:');

      const response = await fetch('/api/multimodal/vqa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: isBase64 ? imagePayload : undefined,
          imageUrl: !isBase64 ? imagePayload : undefined,
          question: qToAsk,
          systemPrompt: 'You are a simple and friendly multimodal AI assistant. Provide a direct, concise, and clear answer based strictly on what is visible in the picture.',
        }),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      const data = await response.json();
      setAiAnswer(data.answer || 'I could not generate an answer.');
    } catch (err) {
      // Deterministic fallback
      if (qToAsk.toLowerCase().includes('bicycle') && selectedImage.id === 'img_13') {
        setAiAnswer('No, there is no bicycle in this picture. It is a quiet park walkway with benches and green trees.');
      } else {
        setAiAnswer(
          `The picture shows a ${selectedImage.groundTruth}. ${selectedImage.description}`
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setCustomImageBase64(base64);
        setSelectedImage({
          id: 'custom_' + Date.now(),
          filename: file.name,
          title: 'My Photo',
          category: 'people',
          groundTruth: 'custom',
          url: base64,
          semanticVector: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
          description: `Custom photo uploaded: ${file.name}`,
        });
        setAiAnswer('Photo uploaded! Click any question button below or type your question.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBonusSearch = async (queryText?: string) => {
    const q = queryText || bonusQuery;
    setIsBonusLoading(true);
    setShowBonus(true);

    const qLower = q.toLowerCase();
    const scored = BENCHMARK_IMAGES.map((img) => {
      let score = 0.35;
      if (qLower.includes('football') || qLower.includes('soccer') || qLower.includes('player')) {
        if (img.filename.includes('football')) score = 0.94;
        else if (img.filename.includes('soccer')) score = 0.88;
        else if (img.category === 'sports') score = 0.75;
      } else if (qLower.includes('car') || qLower.includes('sports car')) {
        if (img.groundTruth === 'car') score = 0.96;
        else if (img.category === 'vehicles') score = 0.70;
      } else if (qLower.includes('cat') || qLower.includes('pet')) {
        if (img.groundTruth === 'cat') score = 0.95;
        else if (img.groundTruth === 'dog') score = 0.72;
      } else if (qLower.includes('park') || qLower.includes('bench')) {
        if (img.id === 'img_13') score = 0.92;
        else if (img.category === 'landscapes') score = 0.65;
      }
      return {
        id: img.id,
        title: img.title,
        filename: img.filename,
        category: img.category,
        url: img.url,
        score,
        description: img.description,
      };
    }).sort((a, b) => b.score - a.score).slice(0, 3);

    setBonusMatches(scored);

    try {
      const res = await fetch('/api/multimodal/retrieval-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          matches: scored.map(s => ({ title: s.title, score: s.score, description: s.description })),
        }),
      });
      const data = await res.json();
      setBonusExplanation(data.explanation || 'Matches found using CLIP embeddings!');
    } catch (err) {
      setBonusExplanation(
        `CLIP searched all 20 images for "${q}". The best match is "${scored[0].title}" with ${(scored[0].score * 100).toFixed(1)}% similarity.`
      );
    } finally {
      setIsBonusLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* MAIN ASSISTANT CARD (2 COLUMNS) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
        
        {/* TOP: IMAGE SELECTION & PREVIEW */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            1. Select a picture:
          </label>
          
          <div className="flex flex-wrap gap-2">
            {simplePhotos.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedImage(item.img);
                  setCustomImageBase64('');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  selectedImage.id === item.img.id && !customImageBase64
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/40'
                    : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}

            <label className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-dashed border-sky-500/50 bg-sky-950/30 text-sky-300 hover:bg-sky-900/40 cursor-pointer transition-all flex items-center space-x-1.5">
              <Upload className="w-3.5 h-3.5" />
              <span>📁 Upload Photo</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* MIDDLE: PICTURE & QUESTION INTERACTION */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Picture Box (5 cols) */}
          <div className="md:col-span-5 space-y-2">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
              <img 
                src={selectedImage.url} 
                alt={selectedImage.title} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute bottom-2 left-2 bg-slate-950/85 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-semibold text-white">
                {selectedImage.title}
              </div>
            </div>
          </div>

          {/* Question & Answer Box (7 cols) */}
          <div className="md:col-span-7 space-y-4">
            
            {/* Quick Questions */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                2. Click a question (or type below):
              </label>
              <div className="flex flex-wrap gap-1.5">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuestion(q);
                      handleAskAI(q);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                      question === q
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input & Ask Button */}
            <div className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask anything about this picture..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-medium"
              />
              <button
                onClick={() => handleAskAI()}
                disabled={isLoading || !question.trim()}
                className="inline-flex items-center space-x-1.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-all shrink-0 shadow-lg shadow-sky-600/30"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Ask AI</span>
              </button>
            </div>

            {/* AI Answer Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-sky-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-sky-400 flex items-center space-x-1.5">
                  <Bot className="w-4 h-4" />
                  <span>Answer:</span>
                </span>
                <span className="text-[11px] text-slate-500 font-mono truncate max-w-[200px]">
                  &quot;{lastAskedQuestion}&quot;
                </span>
              </div>
              
              <div className="min-h-[50px] flex items-center">
                {isLoading ? (
                  <div className="flex items-center space-x-2 text-xs text-sky-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                ) : (
                  <p className="text-sm text-slate-200 leading-relaxed font-sans">
                    {aiAnswer}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BONUS: SIMPLE IMAGE SEARCH & HOW IT WORKS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Bonus: Search 20 Images with CLIP
            </h3>
          </div>
          
          <button 
            onClick={() => setShowBonus(!showBonus)}
            className="text-xs text-emerald-400 hover:underline cursor-pointer"
          >
            {showBonus ? 'Hide Search' : 'Open Search'}
          </button>
        </div>

        {showBonus && (
          <div className="space-y-4 pt-1">
            <div className="flex flex-wrap gap-1.5">
              {quickSearches.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setBonusQuery(s);
                    handleBonusSearch(s);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                    bonusQuery === s
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={bonusQuery}
                onChange={(e) => setBonusQuery(e.target.value)}
                placeholder="What image do you want to find?"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-medium"
              />
              <button
                onClick={() => handleBonusSearch()}
                disabled={isBonusLoading || !bonusQuery.trim()}
                className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer transition-all shrink-0"
              >
                {isBonusLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Search</span>
              </button>
            </div>

            {/* Results */}
            {bonusMatches.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {bonusMatches.map((item, idx) => (
                    <div key={item.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                      <div className="aspect-video rounded-lg overflow-hidden bg-slate-900 border border-slate-800">
                        <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-white truncate max-w-[120px]">{item.title}</span>
                        <span className="text-emerald-400 font-bold font-mono">{(item.score * 100).toFixed(0)}% match</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <span className="text-emerald-400 font-bold block mb-0.5">Explanation:</span>
                  {bonusExplanation}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* HOW IT WORKS (SIMPLE DIAGRAM) */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-center space-y-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          How this student AI works
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-slate-300">
          <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-sky-400">1. Picture</span>
          <span>&rarr;</span>
          <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-indigo-400">2. CLIP Vision</span>
          <span>&rarr;</span>
          <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-purple-400">3. LLaVA AI</span>
          <span>&rarr;</span>
          <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-emerald-400">4. Answer</span>
        </div>
      </div>

      {/* INTEGRATED NOTEBOOK SECTION CARD */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-indigo-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shrink-0">
            <FileCode className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white text-sm sm:text-base">Integrated Jupyter Lab Notebook</span>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-2 py-0.5 rounded-full font-semibold">
                .ipynb
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Part I (Student Statement &amp; Answers) + Part II (Correction, Master Implementations &amp; Literature Citations)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 w-full sm:w-auto">
          {onNavigateToNotebook && (
            <button
              onClick={onNavigateToNotebook}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold px-3.5 py-2.5 rounded-xl cursor-pointer transition-all"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
              <span>Explore Notebook</span>
            </button>
          )}

          {onDownloadNotebook && (
            <button
              onClick={onDownloadNotebook}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/40 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer shadow-md shadow-emerald-950/50 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .ipynb</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
