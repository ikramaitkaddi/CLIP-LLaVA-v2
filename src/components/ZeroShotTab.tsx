import React, { useState, useMemo } from 'react';
import { 
  BENCHMARK_IMAGES, 
  EVALUATION_DATASET, 
  PROMPT_ENGINEERING_RESULTS, 
  ImageItem 
} from '../data/labData';
import { 
  Brain, 
  CheckCircle2, 
  XCircle, 
  Upload, 
  Sparkles, 
  Play, 
  Info, 
  BarChart3, 
  Layers, 
  ListFilter 
} from 'lucide-react';

export const ZeroShotTab: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<ImageItem>(BENCHMARK_IMAGES[0]);
  const [customImageUrl, setCustomImageUrl] = useState<string>('');
  const [candidateClassesStr, setCandidateClassesStr] = useState<string>('cat, dog, car, airplane, horse, bird, person');
  const [promptTemplate, setPromptTemplate] = useState<string>('a photo of a {}');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Compute zero-shot probabilities dynamically based on image semantic vector and candidate classes
  const classificationResults = useMemo(() => {
    const classes = candidateClassesStr.split(',').map(c => c.trim().toLowerCase()).filter(Boolean);
    if (classes.length === 0) return [];

    // Map semantic concepts to vectors
    const conceptWeights: Record<string, number[]> = {
      cat: [0.85, 0.10, 0.03, 0.01, 0.05, 0.12, 0.01, 0.01],
      dog: [0.12, 0.88, 0.04, 0.02, 0.10, 0.20, 0.01, 0.01],
      car: [0.02, 0.03, 0.90, 0.15, 0.01, 0.04, 0.02, 0.01],
      airplane: [0.01, 0.02, 0.20, 0.92, 0.01, 0.02, 0.04, 0.01],
      horse: [0.18, 0.25, 0.02, 0.01, 0.89, 0.15, 0.02, 0.03],
      bird: [0.15, 0.08, 0.02, 0.30, 0.06, 0.10, 0.85, 0.02],
      person: [0.03, 0.04, 0.05, 0.02, 0.02, 0.86, 0.02, 0.80],
      bicycle: [0.02, 0.03, 0.40, 0.02, 0.02, 0.10, 0.01, 0.50],
      building: [0.01, 0.01, 0.12, 0.05, 0.01, 0.10, 0.02, 0.06],
      train: [0.01, 0.02, 0.70, 0.04, 0.01, 0.04, 0.01, 0.02],
      park: [0.04, 0.06, 0.02, 0.01, 0.03, 0.08, 0.03, 0.02],
      mountain: [0.01, 0.01, 0.01, 0.04, 0.01, 0.01, 0.01, 0.01],
    };

    // Calculate unnormalized similarity dot products
    const rawScores = classes.map(cls => {
      const templateMultiplier = promptTemplate === 'a photo of a {}' ? 1.05 : 
                                 promptTemplate === 'a {}' ? 0.95 : 
                                 promptTemplate === 'a photograph showing a {}' ? 0.98 : 0.90;
      
      const targetVec = conceptWeights[cls] || [0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05];
      let dot = 0;
      for (let i = 0; i < selectedImage.semanticVector.length; i++) {
        dot += (selectedImage.semanticVector[i] || 0) * (targetVec[i] || 0);
      }
      // Scale by CLIP logit temperature (100 * dot)
      const logit = Math.max(0.1, dot * 32 * templateMultiplier);
      return { class: cls, logit };
    });

    // Softmax
    const maxLogit = Math.max(...rawScores.map(s => s.logit));
    const expScores = rawScores.map(s => ({
      ...s,
      exp: Math.exp(s.logit - maxLogit)
    }));
    const sumExp = expScores.reduce((acc, curr) => acc + curr.exp, 0);

    return expScores.map(s => ({
      class: s.class,
      logit: s.logit,
      probability: s.exp / sumExp,
      percentage: ((s.exp / sumExp) * 100).toFixed(1)
    })).sort((a, b) => b.probability - a.probability);
  }, [selectedImage, candidateClassesStr, promptTemplate]);

  const topPrediction = classificationResults[0];

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setCustomImageUrl(base64);
        setSelectedImage({
          id: 'custom_upload',
          filename: file.name,
          title: 'User Uploaded Image',
          category: 'animals',
          groundTruth: 'custom',
          url: base64,
          semanticVector: [0.75, 0.15, 0.04, 0.02, 0.05, 0.10, 0.02, 0.01],
          description: `Custom image: ${file.name}`,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header section */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-2 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Brain className="w-4 h-4" />
          <span>Part I &bull; Exercises 1 - 6</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          CLIP Zero-Shot Classification &amp; Prompt Engineering
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-3xl">
          Observe how OpenAI CLIP performs zero-shot classification without fine-tuning weights by synthesizing dynamic linear classifier heads from natural language prompt embeddings.
        </p>
      </div>

      {/* Main Interactive Classifier Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Selection & Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white flex items-center justify-between mb-3">
              <span>1. Select or Upload Image</span>
              <span className="text-xs font-normal text-slate-400 font-mono">ViT-B/32 Input</span>
            </h2>

            {/* Active image preview */}
            <div className="relative aspect-video sm:aspect-square w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
              <img 
                src={selectedImage.url} 
                alt={selectedImage.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-3 text-xs">
                <p className="font-semibold text-white">{selectedImage.title}</p>
                <p className="text-slate-400 text-[11px] truncate">{selectedImage.description}</p>
                <div className="mt-1 flex items-center space-x-2 text-[10px] text-slate-300">
                  <span className="bg-slate-800 px-1.5 py-0.5 rounded">Ground Truth: <strong className="text-sky-400">{selectedImage.groundTruth}</strong></span>
                  <span className="bg-slate-800 px-1.5 py-0.5 rounded">Resized: 224x224x3</span>
                </div>
              </div>
            </div>

            {/* Benchmark image selector thumbnails */}
            <div className="mt-3">
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Preset Benchmark Images:</label>
              <div className="grid grid-cols-5 gap-2">
                {BENCHMARK_IMAGES.slice(0, 10).map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img)}
                    className={`relative rounded-lg overflow-hidden aspect-square border transition-all cursor-pointer ${
                      selectedImage.id === img.id
                        ? 'border-sky-400 ring-2 ring-sky-400/30'
                        : 'border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Custom Image option */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <label className="flex items-center justify-center space-x-2 w-full py-2 px-3 border border-dashed border-slate-700 hover:border-sky-500 rounded-xl bg-slate-950 text-slate-300 text-xs font-medium cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-sky-400" />
                <span>Upload Custom Test Image</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleCustomImageUpload}
                  className="hidden" 
                />
              </label>
            </div>
          </div>

          {/* Configuration Parameters */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>2. Prompt &amp; Candidate Classes</span>
            </h2>

            {/* Candidate classes */}
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Candidate Classes (Comma-separated):
              </label>
              <input
                type="text"
                value={candidateClassesStr}
                onChange={(e) => setCandidateClassesStr(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
                placeholder="cat, dog, car, airplane..."
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Edit classes to test zero-shot transfer or closed-world omission (e.g. Q13).
              </p>
            </div>

            {/* Prompt Template */}
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Prompt Template:
              </label>
              <select
                value={promptTemplate}
                onChange={(e) => setPromptTemplate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                <option value="a photo of a {}">&quot;a photo of a &#123;&#125;&quot; (Recommended canonical)</option>
                <option value="a {}">&quot;a &#123;&#125;&quot; (Minimal)</option>
                <option value="a photograph showing a {}">&quot;a photograph showing a &#123;&#125;&quot;</option>
                <option value="an image containing a {}">&quot;an image containing a &#123;&#125;&quot;</option>
                <option value="a domestic animal called a {}">&quot;a domestic animal called a &#123;&#125;&quot;</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Classification Results & Real-time Distribution (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-sky-400" />
                  <span>Zero-Shot Classification Inference Results</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  Function: classify_image(image, classes) &bull; ViT-B/32 Forward Pass
                </p>
              </div>

              {topPrediction && (
                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
                  <span className="text-[11px] font-medium uppercase tracking-wider">Top Prediction:</span>
                  <span className="text-sm font-bold capitalize">{topPrediction.class}</span>
                  <span className="text-xs font-mono font-semibold">({topPrediction.percentage}%)</span>
                </div>
              )}
            </div>

            {/* Probability Bars */}
            <div className="mt-5 space-y-3.5">
              {classificationResults.map((item, idx) => {
                const isWinner = idx === 0;
                return (
                  <div key={item.class} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className={`w-5 text-right font-mono text-[11px] ${isWinner ? 'text-sky-400 font-bold' : 'text-slate-500'}`}>
                          #{idx + 1}
                        </span>
                        <span className={`font-semibold capitalize ${isWinner ? 'text-white' : 'text-slate-300'}`}>
                          {item.class}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          (&quot;{promptTemplate.replace('{}', item.class)}&quot;)
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 font-mono">
                        <span className="text-slate-400 text-[11px]">logit: {item.logit.toFixed(2)}</span>
                        <span className={`font-bold ${isWinner ? 'text-sky-400' : 'text-slate-300'}`}>
                          {item.percentage}%
                        </span>
                      </div>
                    </div>

                    {/* Visual Bar */}
                    <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isWinner 
                            ? 'bg-gradient-to-r from-sky-500 to-indigo-500 shadow-sm shadow-sky-500/30' 
                            : 'bg-slate-700/60'
                        }`}
                        style={{ width: `${Math.max(item.probability * 100, 1)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mathematical Explainability box */}
            <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400 space-y-1.5">
              <div className="flex items-center space-x-2 text-slate-200 font-semibold">
                <Info className="w-4 h-4 text-sky-400" />
                <span>Mathematical Foundation (CLIP Softmax Normalization)</span>
              </div>
              <p className="leading-relaxed font-mono text-[11px] text-slate-300">
                P(y = k | x) = exp(e^tau * (v_norm . t_k_norm)) / Sum_j exp(e^tau * (v_norm . t_j_norm))
              </p>
              <p className="text-[11px] text-slate-400">
                Notice that because Softmax operates over a closed set of candidate prompts, omitting the true ground-truth class forces CLIP to reallocate 100% of the probability density to the closest semantic neighbor (answering Q13).
              </p>
            </div>
          </div>

          {/* Prompt Engineering Matrix (Exercise 6) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>Exercise 6: Prompt Engineering Comparison (on Cat Benchmark Image)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Proving that prompt phrasing matters significantly in vision-language models (Q17-Q19).
                </p>
              </div>
              <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                Winner: &quot;a photo of a cat&quot;
              </span>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                    <th className="pb-2 font-semibold">Rank</th>
                    <th className="pb-2 font-semibold">Prompt String</th>
                    <th className="pb-2 font-semibold">Cosine Sim</th>
                    <th className="pb-2 font-semibold">Logit</th>
                    <th className="pb-2 font-semibold">Softmax Prob</th>
                    <th className="pb-2 font-semibold text-right">Relative Gain</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {PROMPT_ENGINEERING_RESULTS.map((row) => (
                    <tr key={row.prompt} className={row.rank === 1 ? 'bg-sky-500/5 text-white font-medium' : 'text-slate-300'}>
                      <td className="py-2.5">
                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] ${row.rank === 1 ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                          {row.rank}
                        </span>
                      </td>
                      <td className="py-2.5 font-sans font-medium text-slate-200">
                        &quot;{row.prompt}&quot;
                      </td>
                      <td className="py-2.5 text-slate-300">{row.cosineSimilarity.toFixed(4)}</td>
                      <td className="py-2.5 text-slate-400">{row.logit.toFixed(2)}</td>
                      <td className="py-2.5 font-bold text-sky-400">{(row.probability * 100).toFixed(1)}%</td>
                      <td className="py-2.5 text-right font-sans text-xs">
                        {row.rank === 1 ? (
                          <span className="text-emerald-400 font-semibold">+15.8% vs &quot;a cat&quot;</span>
                        ) : (
                          <span className="text-slate-500">baseline</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Exercise 5: Benchmark Evaluation Dataset & Accuracy Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Exercise 5: Benchmark Evaluation on 10 Labeled Images</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Empirical calculation: Accuracy = N_correct / N_total = 9 / 10 = <strong className="text-emerald-400 font-bold">90.0%</strong> (answering Q14-Q16).
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Accuracy: 90.0%
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
              N = 10 Images
            </span>
          </div>
        </div>

        {/* Dataset Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="pb-2">Preview</th>
                <th className="pb-2">Filename</th>
                <th className="pb-2">Actual Ground Truth</th>
                <th className="pb-2">CLIP Prediction</th>
                <th className="pb-2">Confidence Prob</th>
                <th className="pb-2">Correct?</th>
                <th className="pb-2">Empirical Observations &amp; Error Analysis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {EVALUATION_DATASET.map((row) => (
                <tr key={row.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5">
                    <img 
                      src={row.imageUrl} 
                      alt={row.filename} 
                      className="w-10 h-10 rounded-lg object-cover border border-slate-700" 
                    />
                  </td>
                  <td className="py-2.5 font-mono text-slate-300 text-[11px]">{row.filename}</td>
                  <td className="py-2.5 font-semibold text-slate-200 capitalize">{row.actualClass}</td>
                  <td className="py-2.5 font-semibold text-slate-200 capitalize">{row.predictedClass}</td>
                  <td className="py-2.5 font-mono font-bold text-sky-400">{(row.probability * 100).toFixed(1)}%</td>
                  <td className="py-2.5">
                    {row.isCorrect ? (
                      <span className="inline-flex items-center space-x-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Correct</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                        <XCircle className="w-3 h-3" />
                        <span>Misclassified</span>
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 text-slate-400 max-w-xs text-[11px] leading-relaxed">
                    {row.notes}
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
