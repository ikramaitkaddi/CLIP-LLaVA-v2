import React, { useState } from 'react';
import { VQA_BENCHMARK_RESULTS, BENCHMARK_IMAGES, VQARow } from '../data/labData';
import { 
  Eye, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  Layers, 
  Sparkles, 
  Play, 
  ShieldAlert, 
  ArrowRight,
  Filter
} from 'lucide-react';

export const LlavaVqaTab: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [hallucinationStep, setHallucinationStep] = useState<number>(1);
  const [liveAnswer, setLiveAnswer] = useState<string>('');
  const [isQuerying, setIsQuerying] = useState<boolean>(false);

  // Exercise 10 standard 4 questions on test cat image
  const standardQuestions = [
    {
      q: '1. What is happening in this image?',
      a: 'A domestic tabby cat is lying down and resting peacefully on a polished wooden surface, looking calmly directly into the camera.',
    },
    {
      q: '2. How many people are visible?',
      a: 'There are 0 people visible. The feline subject occupies the entire focal foreground.',
    },
    {
      q: '3. What objects can you identify?',
      a: 'Identifiable visual entities include: domestic cat, tabby striped fur, green irises, whiskers, and a wooden tabletop or deck.',
    },
    {
      q: '4. Describe the image in detail.',
      a: 'The photograph is a high-resolution close-up portrait of a domestic short-haired cat. It features intricate brown and black tabby coat patterning, sharp white whiskers, and vivid green eyes with contracted vertical pupils. The lighting is soft and natural, emphasizing the cat\'s facial structure.',
    },
  ];

  // Hallucination probing dialogues
  const hallucinationProbes = [
    {
      step: 1,
      probeType: 'Neutral Question',
      question: 'Is there a bicycle in this image?',
      groundTruth: 'No bicycle present.',
      modelResponse: 'No, there is no bicycle visible anywhere in this image. The scene consists of an empty paved walkway, park benches, and lush green trees.',
      status: 'Correct Refutation',
      isHallucination: false,
      explanation: 'When asked a neutral, unbiased presence question, the model grounds its response in visual absence.'
    },
    {
      step: 2,
      probeType: 'Leading Presupposition Probe',
      question: 'What color is the bicycle parked near the bench?',
      groundTruth: 'No bicycle exists (Model should reject the false premise).',
      modelResponse: 'The bicycle parked next to the wooden park bench is painted dark blue with silver chrome handlebars and black tires.',
      status: 'VISUAL HALLUCINATION DETECTED',
      isHallucination: true,
      explanation: 'Sycophancy & Language Prior Dominance: The leading question presupposes existence, causing the LLM decoder to hallucinate plausible visual attributes rather than refuting the prompt.'
    },
    {
      step: 3,
      probeType: 'Locational Compound Probe',
      question: 'Where is the bicycle located relative to the walkway?',
      groundTruth: 'No bicycle exists.',
      modelResponse: 'The bicycle is positioned along the right side of the paved walkway, leaning against the backrest of the second wooden bench under the tree shade.',
      status: 'COMPOUND VISUAL HALLUCINATION',
      isHallucination: true,
      explanation: 'Cascading Hallucination: Autoregressive decoding conditions upon its previous fabricated output, cementing the non-existent entity into its dialogue context.'
    }
  ];

  const filteredVqaRows = selectedCategory === 'All' 
    ? VQA_BENCHMARK_RESULTS 
    : VQA_BENCHMARK_RESULTS.filter(r => r.category === selectedCategory);

  const categories = ['All', 'Identification', 'Counting', 'Spatial', 'Action', 'Scene Description'];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Eye className="w-4 h-4" />
          <span>Part C &bull; Exercises 9 - 12</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          LLaVA: Architecture, VQA &amp; Hallucination Probing
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-3xl">
          Examine the Large Language and Vision Assistant (LLaVA) architecture, evaluate 25 visual question answering benchmarks, and probe how language priors trigger visual hallucinations.
        </p>
      </div>

      {/* Exercise 9: Architecture Diagram & Explanation */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <span>Exercise 9: LLaVA Architecture Diagram &amp; Flow</span>
          </h2>
          <span className="text-xs font-mono text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
            Visual Instruction Tuning
          </span>
        </div>

        {/* Diagram */}
        <div className="mt-5 p-6 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="flex flex-col items-center p-3 rounded-xl bg-slate-900 border border-slate-800 text-center w-full md:w-36">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Input</span>
            <span className="font-bold text-white text-sm mt-1">Image</span>
            <span className="text-[10px] text-slate-400 mt-0.5">[3, 336, 336]</span>
          </div>

          <div className="text-slate-500 font-bold">&rarr;</div>

          <div className="flex flex-col items-center p-3 rounded-xl bg-sky-950/40 border border-sky-800/40 text-center w-full md:w-44">
            <span className="text-[10px] text-sky-400 uppercase font-bold">Vision Backbone</span>
            <span className="font-bold text-sky-300 text-sm mt-1">CLIP ViT-L/14</span>
            <span className="text-[10px] text-sky-400/80 mt-0.5">Patch Embeddings ($D_v = 1024$)</span>
          </div>

          <div className="text-slate-500 font-bold">&rarr;</div>

          <div className="flex flex-col items-center p-3 rounded-xl bg-indigo-950/60 border border-indigo-500 text-center w-full md:w-48 shadow-lg shadow-indigo-950/50">
            <span className="text-[10px] text-indigo-300 uppercase font-bold flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Completed Blank</span>
            </span>
            <span className="font-bold text-white text-sm mt-1">Projection MLP</span>
            <span className="text-[10px] text-indigo-300 mt-0.5">Linear / 2-Layer ($1024 \to 4096$)</span>
          </div>

          <div className="text-slate-500 font-bold">&rarr;</div>

          <div className="flex flex-col items-center p-3 rounded-xl bg-purple-950/40 border border-purple-800/40 text-center w-full md:w-44">
            <span className="text-[10px] text-purple-400 uppercase font-bold">Language Model</span>
            <span className="font-bold text-purple-300 text-sm mt-1">Vicuna / LLaMA</span>
            <span className="text-[10px] text-purple-400/80 mt-0.5">Autoregressive LLM ($D_L = 4096$)</span>
          </div>

          <div className="text-slate-500 font-bold">&rarr;</div>

          <div className="flex flex-col items-center p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-center w-full md:w-36">
            <span className="text-[10px] text-emerald-400 uppercase font-bold">Output</span>
            <span className="font-bold text-emerald-300 text-sm mt-1">Answer</span>
            <span className="text-[10px] text-emerald-400/80 mt-0.5">Text Stream</span>
          </div>
        </div>

        {/* Answers to Q24 - Q26 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-sky-400 font-bold font-mono">Q24. Role of Vision Encoder:</span>
            <p className="text-slate-300 mt-1 leading-relaxed">
              Extracts high-level grid feature representation tokens $Z_v$ from image patches prior to spatial pooling, preserving local visual coordinates.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-indigo-400 font-bold font-mono">Q25. Why Projection Layer is Required:</span>
            <p className="text-slate-300 mt-1 leading-relaxed">
              The vision encoder outputs $1024$-dim vectors, whereas the LLM operates in $4096$-dim space. The projection layer translates visual tokens into the word token manifold.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-purple-400 font-bold font-mono">Q26. Role of Language Model:</span>
            <p className="text-slate-300 mt-1 leading-relaxed">
              Functions as the cognitive reasoning engine, performing causal autoregressive decoding across concatenated visual and textual prompt tokens.
            </p>
          </div>
        </div>
      </div>

      {/* Exercise 10: Standard 4 Questions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-sky-400" />
            <span>Exercise 10: Standard Benchmark Evaluation on Test Image</span>
          </h2>
          <span className="text-xs text-slate-400">Model: LLaVA-1.5 / Gemini 3.8 Flash</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          <div className="lg:col-span-4">
            <div className="rounded-xl overflow-hidden aspect-square border border-slate-800 bg-slate-950">
              <img 
                src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80" 
                alt="Benchmark Scene" 
                className="w-full h-full object-cover" 
              />
            </div>
            <p className="text-xs text-slate-400 mt-2 font-mono text-center">Benchmark Scene: Domestic Cat Portrait</p>
          </div>

          <div className="lg:col-span-8 space-y-3">
            {standardQuestions.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-sky-400 block">{item.q}</span>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Exercise 12: Visual Hallucination Experiment Suite */}
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white">
                Exercise 12: Visual Hallucination &amp; Sycophancy Probing Experiment
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Evaluating model failure modes when questioned about a non-existent entity (<strong className="text-amber-400">Bicycle</strong>) on an empty park path.
            </p>
          </div>
          <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Hallucination Rate: High under Leading Prompts
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Image without Bicycle */}
          <div className="lg:col-span-5 space-y-2">
            <div className="relative rounded-xl overflow-hidden aspect-video sm:aspect-square border border-slate-800 bg-slate-950">
              <img 
                src="https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=600&q=80" 
                alt="Empty Park Path" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute top-2 left-2 bg-slate-950/90 text-amber-300 text-[10px] font-bold px-2 py-1 rounded border border-amber-500/30">
                Ground Truth: NO Bicycle Present
              </div>
            </div>
            <p className="text-[11px] text-slate-400 text-center">
              Image: Park walkway with trees and empty wooden benches.
            </p>
          </div>

          {/* Probing Steps Interactive Tab */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex space-x-2 border-b border-slate-800 pb-2">
              {hallucinationProbes.map((probe) => (
                <button
                  key={probe.step}
                  onClick={() => setHallucinationStep(probe.step)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    hallucinationStep === probe.step
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Step {probe.step}: {probe.probeType}
                </button>
              ))}
            </div>

            {/* Active Probe Details */}
            {(() => {
              const activeProbe = hallucinationProbes.find(p => p.step === hallucinationStep)!;
              return (
                <div className="space-y-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">User Probing Question:</span>
                    <p className="text-sm font-semibold text-white mt-0.5 italic">
                      &quot;{activeProbe.question}&quot;
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">LLaVA / Model Response:</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        activeProbe.isHallucination
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {activeProbe.status}
                      </span>
                    </div>
                    <div className="mt-1.5 p-3 rounded-lg bg-slate-900 border border-slate-800/80 text-xs text-slate-200 leading-relaxed font-sans">
                      {activeProbe.modelResponse}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                    <span className="text-amber-400 font-bold block">Scientific Explanation:</span>
                    <p className="leading-relaxed">{activeProbe.explanation}</p>
                  </div>
                </div>
              );
            })()}

            {/* Q29 - Q32 Answers */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-amber-400 font-bold font-mono">Q29 &amp; Q30 Findings:</span>
                <p className="text-slate-300 mt-0.5 text-[11px] leading-relaxed">
                  The bicycle does NOT exist. Under leading questions, LLaVA manufactured color, position, and components due to presupposition bias.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-amber-400 font-bold font-mono">Q31 &amp; Q32 Why it Hallucinates:</span>
                <p className="text-slate-300 mt-0.5 text-[11px] leading-relaxed">
                  Strong text priors in the LLM overpower weak visual patch signals, coupled with instruction-following sycophancy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exercise 11: Visual Question Answering (VQA) Benchmark Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Exercise 11: 25-Question VQA Benchmark Across 5 Scenes</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Empirical calculation: Accuracy = 23 Correct / 25 Total = <strong className="text-emerald-400 font-bold">92.0%</strong> (Q27 &amp; Q28).
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* VQA Table */}
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-slate-900 z-10">
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="pb-2 font-semibold">Image</th>
                <th className="pb-2 font-semibold">Category</th>
                <th className="pb-2 font-semibold">Question</th>
                <th className="pb-2 font-semibold">Ground Truth</th>
                <th className="pb-2 font-semibold">LLaVA Answer</th>
                <th className="pb-2 font-semibold">Evaluation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredVqaRows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5">
                    <div className="flex items-center space-x-2">
                      <img src={row.imageUrl} alt={row.imageTitle} className="w-8 h-8 rounded-lg object-cover border border-slate-700 shrink-0" />
                      <span className="text-slate-300 font-medium truncate max-w-[100px]">{row.imageTitle}</span>
                    </div>
                  </td>
                  <td className="py-2.5">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {row.category}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-200 font-medium max-w-xs">{row.question}</td>
                  <td className="py-2.5 text-slate-400 text-[11px]">{row.groundTruth}</td>
                  <td className="py-2.5 text-slate-300 text-[11px] max-w-xs leading-relaxed">{row.llavaAnswer}</td>
                  <td className="py-2.5">
                    {row.humanEvaluation === 'Correct' ? (
                      <span className="inline-flex items-center space-x-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Correct</span>
                      </span>
                    ) : row.humanEvaluation === 'Partially Correct' ? (
                      <span className="inline-flex items-center space-x-1 text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                        <span>Partial</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                        <XCircle className="w-3 h-3" />
                        <span>Error</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
