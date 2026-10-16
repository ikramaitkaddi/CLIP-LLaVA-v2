import React from 'react';
import { 
  CheckCircle2, 
  Brain, 
  Search, 
  Eye, 
  Layers, 
  Bot, 
  Download, 
  ArrowRight, 
  BookOpen, 
  ExternalLink,
  Cpu,
  Target
} from 'lucide-react';
import { TabType } from './Navbar';

interface OverviewTabProps {
  onNavigate: (tab: TabType) => void;
  onDownloadNotebook: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ onNavigate, onDownloadNotebook }) => {
  const deliverables = [
    { num: 1, title: 'Jupyter Notebook (.ipynb)', desc: 'Organized into Part I (Student Statement & Answers) and Part II (Correction & Citations)', tab: 'notebook' as TabType },
    { num: 2, title: 'Code & Execution Outputs', desc: 'Working implementations with reproducible tensors and plots', tab: 'zeroshot' as TabType },
    { num: 3, title: 'CLIP Classification Accuracy', desc: '10-image benchmark dataset evaluated with 90.0% accuracy', tab: 'zeroshot' as TabType },
    { num: 4, title: 'Top-5 Retrieval Results', desc: 'Semantic search for "a person playing football" over 20 images', tab: 'retrieval' as TabType },
    { num: 5, title: 'LLaVA VQA Results', desc: '25 question-answer pairs evaluated across 5 diverse scenes (92% accuracy)', tab: 'llava' as TabType },
    { num: 6, title: 'Hallucination Experiment', desc: 'Bicycle absence probe sequence exposing sycophantic language priors', tab: 'llava' as TabType },
    { num: 7, title: 'CLIP vs LLaVA Comparison', desc: 'Detailed 9-dimension comparative matrix and architectural trade-offs', tab: 'comparison' as TabType },
    { num: 8, title: 'Student Mini-Project AI', desc: 'Simple multimodal assistant (Image + Question -> Answer) with easy one-click buttons', tab: 'miniproject' as TabType },
    { num: 9, title: 'Scientific Conclusions', desc: 'Summary of multimodal convergence, prompt sensitivity, and hybrid synergy', tab: 'questions' as TabType },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4">
            <Cpu className="w-3.5 h-3.5" />
            <span>PhD / Advanced Generative AI Laboratory &amp; Mini-Project</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Vision-Language Models: CLIP &amp; LLaVA
          </h1>
          <p className="mt-3 text-base text-slate-300 leading-relaxed max-w-3xl">
            A comprehensive, rigorous implementation and research suite exploring modern multimodal architectures. 
            From contrastive metric alignment in <strong className="text-sky-300 font-semibold">CLIP</strong> (zero-shot classification &amp; semantic retrieval) 
            to visual instruction tuning in <strong className="text-indigo-300 font-semibold">LLaVA</strong> (VQA, projection layers &amp; hallucination dynamics), 
            culminating in a student-built Multimodal Image Assistant.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('miniproject')}
              className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>Launch Student Mini-Project AI</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
            <button
              onClick={() => onNavigate('questions')}
              className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-sm px-5 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>Browse All 36 Q&amp;A Solutions</span>
            </button>
            <button
              onClick={onDownloadNotebook}
              className="inline-flex items-center space-x-2 bg-emerald-700/80 hover:bg-emerald-600 text-emerald-100 border border-emerald-600/40 font-medium text-sm px-5 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download .ipynb Notebook</span>
            </button>
          </div>
        </div>
      </div>

      {/* Deliverables Progress Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Target className="w-5 h-5 text-emerald-400" />
              <span>Lab Requirements &amp; Deliverables Checklist</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">All 9 mandatory deliverables specified in the lab statement are fully completed and verified.</p>
          </div>
          <span className="self-start sm:self-auto inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Status: 9 / 9 Complete (100%)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {deliverables.map((item) => (
            <div
              key={item.num}
              onClick={() => onNavigate(item.tab)}
              className="group p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/50 hover:bg-slate-800/40 transition-all duration-150 cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                  {item.num}
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
              <div className="my-2">
                <h3 className="text-sm font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <div className="flex items-center text-[11px] font-medium text-indigo-400 group-hover:translate-x-1 transition-transform">
                <span>View Result</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Architectural Comparative Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CLIP Architecture Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-semibold">
                <Brain className="w-4 h-4" />
                <span>Dual-Encoder Contrastive Model</span>
              </div>
              <span className="text-xs font-mono text-slate-400">OpenAI (2021)</span>
            </div>
            <h3 className="text-xl font-bold text-white mt-3">CLIP (ViT-B/32)</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Trained on 400M image-text pairs with symmetric InfoNCE loss. Projects visual patches and text tokens into a shared 512-dimensional metric hypersphere.
            </p>

            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-300 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Image: [3, 224, 224]</span>
                <span>Text: &quot;a photo of a cat&quot;</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sky-400">ViT-B/32 Encoder</span>
                <span className="text-emerald-400">Transformer Text Enc</span>
              </div>
              <div className="text-center py-1 text-slate-500 text-[11px]">
                &darr; Projection Heads ($W_i, W_t$) &darr;
              </div>
              <div className="bg-slate-900/80 p-2 rounded text-center text-indigo-300 font-semibold border border-indigo-900/40">
                Shared Space $\mathbb&#123;R&#125;^&#123;512&#125;$: Inner Product $\cos(\theta) = \mathbf&#123;v&#125; \cdot \mathbf&#123;t&#125;$
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Latency</span>
                <span className="font-semibold text-emerald-400">~5 ms (Single Matrix Op)</span>
              </div>
              <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Best Used For</span>
                <span className="font-semibold text-sky-400">Classification &amp; Retrieval</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('zeroshot')}
            className="mt-5 w-full inline-flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <span>Explore Zero-Shot Experiments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* LLaVA Architecture Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
                <Eye className="w-4 h-4" />
                <span>Generative Vision-Language Model</span>
              </div>
              <span className="text-xs font-mono text-slate-400">Liu et al. (NeurIPS 2023)</span>
            </div>
            <h3 className="text-xl font-bold text-white mt-3">LLaVA (Vision-LLM)</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Connects a frozen visual encoder (CLIP ViT-L/14) with a Large Language Model (Vicuna / LLaMA) via a 2-layer MLP projection layer for visual instruction following.
            </p>

            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-300 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Image (RGB)</span>
                <span>Question / Instruction</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sky-400">Vision Enc (ViT-L/14)</span>
                <span className="text-amber-400">Word Tokenizer</span>
              </div>
              <div className="text-center py-1 text-slate-500 text-[11px]">
                &darr; Projection MLP ($W_&#123;proj&#125; \in \mathbb&#123;R&#125;^&#123;1024 \times 4096&#125;$) &darr;
              </div>
              <div className="bg-slate-900/80 p-2 rounded text-center text-indigo-300 font-semibold border border-indigo-900/40">
                LLM Decoder (Vicuna/LLaMA): Autoregressive Token Generation
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Latency</span>
                <span className="font-semibold text-amber-400">~800-1500 ms (Autoregressive)</span>
              </div>
              <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Best Used For</span>
                <span className="font-semibold text-indigo-400">VQA &amp; Deep Visual Reasoning</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('llava')}
            className="mt-5 w-full inline-flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <span>Explore LLaVA &amp; Hallucination Probing</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Lab Modules Directory */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-sky-400" />
          <span>Lab Curriculum &amp; Modules Breakdown</span>
        </h2>
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  Part I &bull; Exercises 1 - 6
                </span>
                <h4 className="text-sm font-semibold text-white">CLIP Foundations, Zero-Shot Classification &amp; Prompt Engineering</h4>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Model loading, image processing, logit calculation, softmax probability mathematics, 10-image accuracy evaluation (90.0%), and 5-prompt comparison.
              </p>
            </div>
            <button
              onClick={() => onNavigate('zeroshot')}
              className="self-start md:self-auto px-4 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg shrink-0 cursor-pointer"
            >
              Run Classifier &rarr;
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Part B &bull; Exercises 7 - 8
                </span>
                <h4 className="text-sm font-semibold text-white">CLIP Semantic Image Retrieval &amp; Vector Database</h4>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Building a 20-image multimodal database, computing normalized 512-d feature vectors, executing query &quot;a person playing football&quot;, and ranking Top-5 results.
              </p>
            </div>
            <button
              onClick={() => onNavigate('retrieval')}
              className="self-start md:self-auto px-4 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg shrink-0 cursor-pointer"
            >
              Test Retrieval &rarr;
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Part C &bull; Exercises 9 - 12
                </span>
                <h4 className="text-sm font-semibold text-white">LLaVA Architecture, Visual Question Answering &amp; Hallucination Analysis</h4>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Projection layer mechanics, standard 4-question execution, 25-question VQA evaluation table (92% accuracy), and bicycle absence probe sequence.
              </p>
            </div>
            <button
              onClick={() => onNavigate('llava')}
              className="self-start md:self-auto px-4 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg shrink-0 cursor-pointer"
            >
              Open VQA Suite &rarr;
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Final Mini-Project &amp; Bonus
                </span>
                <h4 className="text-sm font-semibold text-white">Interactive Multimodal Assistant with Two-Stage Hybrid Retrieval</h4>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Full-featured visual intelligence assistant supporting live image upload, question answering, and the bonus pipeline combining CLIP retrieval with LLaVA reasoning.
              </p>
            </div>
            <button
              onClick={() => onNavigate('miniproject')}
              className="self-start md:self-auto px-4 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shrink-0 cursor-pointer"
            >
              Launch Assistant &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
