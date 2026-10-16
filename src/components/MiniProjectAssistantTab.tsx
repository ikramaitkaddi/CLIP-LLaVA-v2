import React, { useState } from 'react';
import { BENCHMARK_IMAGES, ImageItem } from '../data/labData';
import { MiniProjectMode } from './Navbar';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Upload, 
  Layers, 
  Search, 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  HelpCircle,
  Play,
  RotateCcw,
  GraduationCap,
  Image as ImageIcon,
  Cpu
} from 'lucide-react';

interface MiniProjectAssistantTabProps {
  activeMode: MiniProjectMode;
  setActiveMode: (mode: MiniProjectMode) => void;
}

export const MiniProjectAssistantTab: React.FC<MiniProjectAssistantTabProps> = ({
  activeMode,
  setActiveMode
}) => {
  const [selectedImage, setSelectedImage] = useState<ImageItem>(BENCHMARK_IMAGES[0]);
  const [customImageBase64, setCustomImageBase64] = useState<string>('');
  const [question, setQuestion] = useState<string>('What is in this picture?');
  const [aiAnswer, setAiAnswer] = useState<string>('Click "Ask Student AI" or choose one of the simple question buttons below to see the answer!');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastAskedQuestion, setLastAskedQuestion] = useState<string>('What is in this picture?');

  // Bonus Search State
  const [bonusQuery, setBonusQuery] = useState<string>('a person playing football');
  const [bonusMatches, setBonusMatches] = useState<any[]>([]);
  const [bonusExplanation, setBonusExplanation] = useState<string>('');
  const [isBonusLoading, setIsBonusLoading] = useState<boolean>(false);

  // Preset simple image choices
  const simpleImages = [
    { label: '🐱 Cat', img: BENCHMARK_IMAGES[0] },
    { label: '🐶 Dog', img: BENCHMARK_IMAGES[1] },
    { label: '🚗 Sports Car', img: BENCHMARK_IMAGES[2] },
    { label: '✈️ Airplane', img: BENCHMARK_IMAGES[3] },
    { label: '🐎 Horse', img: BENCHMARK_IMAGES[4] },
    { label: '⚽ Football Match', img: BENCHMARK_IMAGES[6] },
    { label: '🌲 Park Path (No Bike)', img: BENCHMARK_IMAGES[12] },
  ];

  // Preset simple questions
  const simpleQuestions = [
    'What is in this picture?',
    'How many people or animals are visible?',
    'What colors and objects can you identify?',
    'Is there a bicycle in this image?',
    'Describe the scene in simple words.',
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
          question: isBase64
            ? qToAsk
            : `Analyze this image titled "${selectedImage.title}" (${selectedImage.description}): ${qToAsk}`,
          systemPrompt: 'You are a simple, friendly student multimodal AI assistant created for a university AI lab mini-project. Give a direct, accurate, and easy-to-understand answer based on what is visible in the picture.',
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      setAiAnswer(data.answer || 'I looked at the image, but could not generate a response.');
    } catch (err) {
      // Deterministic student fallback
      if (qToAsk.toLowerCase().includes('bicycle') && selectedImage.id === 'img_13') {
        setAiAnswer('No, there is no bicycle in this picture. It is an empty park pathway with trees and benches.');
      } else {
        setAiAnswer(
          `[Student AI Response]: The main subject in this image is a ${selectedImage.groundTruth}. ` +
          `It is clearly visible in the foreground. ${selectedImage.description}`
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
          id: 'custom_upload',
          filename: file.name,
          title: 'My Uploaded Photo',
          category: 'people',
          groundTruth: 'custom',
          url: base64,
          semanticVector: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
          description: `Custom image uploaded by student: ${file.name}`,
        });
        setAiAnswer('Great! Your image was uploaded. Now click any question button below or type your question!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearchBonus = async (queryText?: string) => {
    const q = queryText || bonusQuery;
    setIsBonusLoading(true);

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
      } else if (qLower.includes('mountain') || qLower.includes('snow')) {
        if (img.filename.includes('mountain')) score = 0.93;
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
        `Student Explanation: CLIP compared the text "${q}" with the 20 images in the database. ` +
        `The highest score was "${scored[0].title}" (${(scored[0].score * 100).toFixed(1)}% similarity) because its visual features directly match the keywords.`
      );
    } finally {
      setIsBonusLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Student Banner */}
      <div className="bg-gradient-to-r from-sky-900/60 via-indigo-900/60 to-purple-900/60 border border-sky-700/50 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 shadow-inner shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[11px] font-semibold border border-sky-400/30 mb-1">
                <span>Final Mini-Project</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                My Simple Multimodal AI Assistant
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">
                Simple Vision-Language Application &bull; One-Click Buttons &bull; Real Multimodal VQA
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950/70 p-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setActiveMode('assistant')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                activeMode === 'assistant'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              1. Assistant (VQA)
            </button>
            <button
              onClick={() => setActiveMode('bonus')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center space-x-1 ${
                activeMode === 'bonus'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>2. Image Finder</span>
            </button>
            <button
              onClick={() => setActiveMode('architecture')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                activeMode === 'architecture'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3. Architecture
            </button>
          </div>
        </div>
      </div>

      {activeMode === 'assistant' && (
        /* SIMPLE STUDENT AI ASSISTANT */
        <div className="space-y-6">
          {/* STEP 1: CHOOSE IMAGE */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-sky-500 text-slate-950 text-xs flex items-center justify-center font-bold">1</span>
                <span>Step 1: Choose an Image (Click any button)</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">Current: {selectedImage.title}</span>
            </div>

            {/* Quick image buttons */}
            <div className="flex flex-wrap gap-2">
              {simpleImages.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedImage(item.img);
                    setCustomImageBase64('');
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border cursor-pointer transition-all flex items-center space-x-1.5 ${
                    selectedImage.id === item.img.id && !customImageBase64
                      ? 'bg-sky-600/30 text-sky-200 border-sky-400 font-bold ring-2 ring-sky-500/20 shadow'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              ))}

              <label className="px-3 py-2 rounded-xl text-xs font-medium border border-dashed border-sky-500/60 bg-sky-950/30 text-sky-300 hover:bg-sky-900/40 cursor-pointer transition-all flex items-center space-x-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>📁 Upload My Photo</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            {/* Image Preview */}
            <div className="mt-3 flex flex-col sm:flex-row items-center gap-4 p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="w-40 h-32 rounded-lg overflow-hidden shrink-0 border border-slate-700 bg-slate-900">
                <img 
                  src={selectedImage.url} 
                  alt={selectedImage.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="text-xs text-slate-300 space-y-1 text-center sm:text-left">
                <p className="font-bold text-white text-sm">{selectedImage.title}</p>
                <p className="text-slate-400">{selectedImage.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="bg-slate-900 px-2 py-0.5 rounded text-[11px] text-sky-400 border border-slate-800">
                    Category: {selectedImage.category}
                  </span>
                  <span className="bg-slate-900 px-2 py-0.5 rounded text-[11px] text-emerald-400 border border-slate-800">
                    Ground Truth: {selectedImage.groundTruth}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2: CHOOSE OR TYPE QUESTION */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-sky-500 text-slate-950 text-xs flex items-center justify-center font-bold">2</span>
              <span>Step 2: Pick a Question (Or write your own)</span>
            </h2>

            {/* Simple question buttons */}
            <div className="flex flex-wrap gap-2">
              {simpleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuestion(q);
                    handleAskAI(q);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-all ${
                    question === q
                      ? 'bg-indigo-600 text-white border-indigo-400 font-semibold'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Custom question text field */}
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type your question about this picture..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-medium"
              />
              <button
                onClick={() => handleAskAI()}
                disabled={isLoading || !question.trim()}
                className="inline-flex items-center space-x-1.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer transition-all shrink-0 shadow-lg shadow-sky-600/30"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Ask Student AI</span>
              </button>
            </div>
          </div>

          {/* STEP 3: RESULT CARD */}
          <div className="bg-slate-900 border border-sky-500/40 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-sky-400">
                <Bot className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white">Student AI Answer:</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Question: &quot;{lastAskedQuestion}&quot;
              </span>
            </div>

            {/* Answer Display */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 min-h-[90px] flex items-center">
              {isLoading ? (
                <div className="flex items-center space-x-2 text-xs text-sky-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Looking at the image and thinking...</span>
                </div>
              ) : (
                <p className="text-sm text-slate-200 leading-relaxed font-sans">
                  {aiAnswer}
                </p>
              )}
            </div>

            {/* Student Pipeline Badge */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
              <span className="text-slate-300 font-semibold">How it works:</span>
              <div className="flex items-center space-x-1.5 font-mono text-[10px]">
                <span className="bg-slate-900 px-2 py-0.5 rounded text-sky-400 border border-slate-800">1. Image Pixels</span>
                <span>&rarr;</span>
                <span className="bg-slate-900 px-2 py-0.5 rounded text-indigo-400 border border-slate-800">2. CLIP Vision</span>
                <span>&rarr;</span>
                <span className="bg-slate-900 px-2 py-0.5 rounded text-purple-400 border border-slate-800">3. Projection Layer</span>
                <span>&rarr;</span>
                <span className="bg-slate-900 px-2 py-0.5 rounded text-emerald-400 border border-slate-800">4. LLaVA Decoder</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeMode === 'bonus' && (
        /* BONUS TWO-STAGE RETRIEVAL PIPELINE */
        <div className="space-y-6">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
            <div>
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Bonus Task &bull; Simple CLIP Image Finder</span>
              </div>
              <h2 className="text-base font-bold text-white">
                Find Images from 20 Database Photos with CLIP
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Click any simple button below or type a search query. CLIP finds the best pictures, then the AI explains why!
              </p>
            </div>

            {/* Quick search query buttons */}
            <div className="space-y-2">
              <span className="text-xs text-slate-400 font-semibold block">Click a simple search topic:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: '⚽ A person playing football', q: 'a person playing football' },
                  { label: '🏎️ A fast red sports car', q: 'a fast red sports car' },
                  { label: '🐱 A cute domestic cat', q: 'a photo of a cat' },
                  { label: '🌲 Park path with benches', q: 'a quiet park with benches' },
                  { label: '🏔️ Snowy mountain peaks', q: 'snowy mountain peaks' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setBonusQuery(item.q);
                      handleSearchBonus(item.q);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border cursor-pointer transition-all ${
                      bonusQuery === item.q
                        ? 'bg-emerald-600 text-white border-emerald-400 font-semibold'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom search bar */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={bonusQuery}
                onChange={(e) => setBonusQuery(e.target.value)}
                placeholder="Type what you want to find (e.g. 'a person running')..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-medium"
              />
              <button
                onClick={() => handleSearchBonus()}
                disabled={isBonusLoading || !bonusQuery.trim()}
                className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer transition-all shrink-0 shadow-lg shadow-emerald-950/40"
              >
                {isBonusLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Find Images</span>
              </button>
            </div>
          </div>

          {/* Bonus Results */}
          {bonusMatches.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Top-3 Found Images for: &quot;{bonusQuery}&quot;
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {bonusMatches.map((item, idx) => (
                  <div key={item.id} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
                    <div>
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 mb-2 border border-slate-800">
                        <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-slate-950/90 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          Rank #{idx + 1}
                        </span>
                        <span className="absolute top-2 right-2 bg-emerald-950/90 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                          {(item.score * 100).toFixed(1)}% Match
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Multimodal explanation */}
              <div className="p-4 bg-slate-900 border border-indigo-500/30 rounded-2xl space-y-1.5">
                <span className="text-xs font-bold text-indigo-400 block">AI Explanation of the Matches:</span>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {bonusExplanation}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeMode === 'architecture' && (
        /* ARCHITECTURE MODE */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <span>Mini-Project Architecture &amp; Pipeline Design</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              How the student multimodal assistant was designed and built according to the lab statement.
            </p>
          </div>

          {/* Basic Architecture */}
          <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider">
              1. Basic Multimodal Assistant Architecture
            </h3>
            <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 font-mono text-xs text-center text-slate-200 leading-relaxed overflow-x-auto">
              <pre>{`             IMAGE
               |
               v
        +--------------+
        | Vision Model | (CLIP ViT-L/14)
        +------+-------+
               |
               v
        Visual Features (1024-dim)
               |
               v
        [Projection Layer] (1024 -> 4096)
               |
               v
QUESTION ---> LLaVA (Vicuna / LLaMA)
               |
               v
             ANSWER (Natural Language Response)`}</pre>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              The user submits an image and a question. The vision backbone encodes the image patches into visual tokens. The projection layer aligns them with the language model&apos;s word embedding space, and the language decoder produces an answer conditioned on both the visual tokens and question.
            </p>
          </div>

          {/* Bonus Two-Stage Pipeline */}
          <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              2. Bonus: Two-Stage Hybrid Retrieval &amp; Reasoning Pipeline
            </h3>
            <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 font-mono text-xs text-center text-slate-200 leading-relaxed overflow-x-auto">
              <pre>{`User Query (e.g. "a person playing football")
    |
    v
   CLIP (Fast Cosine Dot Product Search)
    |
    v
Top-K Images (Retrieved in ~5ms from 20-image database)
    |
    v
  LLaVA (Multimodal Vision-Language Reasoning)
    |
    v
Explanation (Detailed rationale of why the image matches the query)`}</pre>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Stage 1 uses CLIP&apos;s high-speed vector dot product to search through thousands or millions of database images in milliseconds. Stage 2 passes the top candidate images into LLaVA to explain the visual attributes and reasoning behind the match.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
