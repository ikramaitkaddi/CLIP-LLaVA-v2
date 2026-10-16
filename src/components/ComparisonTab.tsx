import React from 'react';
import { COMPARISON_TABLE } from '../data/labData';
import { 
  Layers, 
  Brain, 
  Eye, 
  Zap, 
  Clock, 
  CheckCircle2, 
  HelpCircle, 
  Split 
} from 'lucide-react';

export const ComparisonTab: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Split className="w-4 h-4" />
          <span>Part D &bull; Exercise 13</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          CLIP vs LLaVA: Comparative Architectural Experiment
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-3xl">
          Side-by-side empirical and theoretical comparison of dual-encoder metric learning versus generative multimodal instruction tuning on the identical visual input.
        </p>
      </div>

      {/* Side-by-Side Live Experiment on the Same Image */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <span>Exercise 13 Comparative Experiment on Benchmark Image</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Shared Test Image */}
          <div className="lg:col-span-4 flex flex-col items-center">
            <div className="rounded-2xl overflow-hidden aspect-square w-full max-w-xs border border-slate-800 bg-slate-950 shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80" 
                alt="Benchmark Domestic Cat" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="text-center mt-2.5">
              <span className="text-xs font-bold text-white">Identical Test Input: cat_portrait.jpg</span>
              <p className="text-[11px] text-slate-400">Fed concurrently to CLIP and LLaVA</p>
            </div>
          </div>

          {/* Model Outcomes Comparison */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CLIP Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-sky-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center space-x-2 text-sky-400">
                    <Brain className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">CLIP Response</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                    Latency: 4.8 ms
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  <p className="text-[11px] text-slate-400">
                    Input: 3 candidate prompts (&quot;a photo of a cat&quot;, &quot;a photo of a dog&quot;, &quot;a photo of a horse&quot;)
                  </p>
                  <div className="space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between items-center bg-slate-900 p-2 rounded border border-sky-900/40">
                      <span className="text-sky-300 font-semibold">&quot;a photo of a cat&quot;</span>
                      <span className="text-sky-400 font-bold">89.4% (logit 28.7)</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded text-slate-400">
                      <span>&quot;a photo of a dog&quot;</span>
                      <span>7.1% (logit 26.1)</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded text-slate-400">
                      <span>&quot;a photo of a horse&quot;</span>
                      <span>0.7% (logit 23.8)</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>Deterministic probability vector; cannot generate textual sentences.</span>
              </div>
            </div>

            {/* LLaVA Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center space-x-2 text-indigo-400">
                    <Eye className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">LLaVA Response</span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                    Latency: 1,120 ms
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  <p className="text-[11px] text-slate-400">
                    Question: &quot;What animal is present in the image? Describe its appearance.&quot;
                  </p>
                  <div className="bg-slate-900 p-3 rounded-lg border border-indigo-900/40 text-xs text-slate-200 leading-relaxed font-sans">
                    &quot;The animal present in this photograph is a domestic cat. It exhibits a classic brown and black tabby coat pattern with distinct vertical stripes. It has luminous green irises, long white whiskers, and is resting attentively in soft ambient indoor lighting.&quot;
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Generates open-ended linguistic descriptions and compositional insights.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Completed Exercise 13 Comparison Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
          <Split className="w-5 h-5 text-indigo-400" />
          <span>Full Architectural Property Comparison Matrix (Exercise 13 Table)</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="pb-3 font-semibold uppercase tracking-wider w-1/4">Evaluation Property</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-sky-400 w-3/8">CLIP (Radford et al., 2021)</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-indigo-400 w-3/8">LLaVA (Liu et al., 2023)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {COMPARISON_TABLE.map((row) => (
                <tr key={row.property} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 font-bold text-white text-xs">
                    {row.property}
                  </td>
                  <td className="py-3 text-slate-300 pr-4 leading-relaxed">
                    {row.clip}
                  </td>
                  <td className="py-3 text-slate-300 leading-relaxed">
                    {row.llava}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Questions Q33 - Q36 Solutions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold font-mono">
            <CheckCircle2 className="w-4 h-4" />
            <span>Q33. Which model is better suited to image classification?</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            <strong className="text-sky-300">CLIP</strong> is overwhelmingly superior for classification. It performs classification via a single matrix dot product in ~5ms, scales to thousands of candidate categories with zero decoding overhead, and produces mathematically calibrated probabilities.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold font-mono">
            <CheckCircle2 className="w-4 h-4" />
            <span>Q34. Which model is better for image description?</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            <strong className="text-indigo-300">LLaVA</strong>. CLIP is purely discriminative and cannot generate novel text tokens. LLaVA incorporates an autoregressive language decoder that can compose multi-sentence captions, contextual nuances, and creative scene narratives.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold font-mono">
            <CheckCircle2 className="w-4 h-4" />
            <span>Q35. Which model is better for visual question answering (VQA)?</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            <strong className="text-indigo-300">LLaVA</strong>. It interprets arbitrary natural language questions, engages in multi-turn dialogues, reasons over complex spatial relations, and explains the reasoning behind its answers. CLIP can only score pre-written multiple-choice options.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center space-x-2 text-purple-400 text-xs font-bold font-mono">
            <CheckCircle2 className="w-4 h-4" />
            <span>Q36. Fundamental Difference between CLIP and LLaVA</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            CLIP is a <strong>discriminative dual-encoder</strong> trained via contrastive InfoNCE loss to map images and text to a static metric vector space. LLaVA is a <strong>generative vision-language foundation model</strong> that projects visual tokens into an autoregressive LLM to generate text tokens.
          </p>
        </div>
      </div>
    </div>
  );
};
