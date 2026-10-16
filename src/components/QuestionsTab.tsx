import React, { useState, useMemo } from 'react';
import { LAB_QUESTIONS, QuestionAnswer } from '../data/labData';
import { 
  HelpCircle, 
  Search, 
  CheckCircle2, 
  Copy, 
  Check, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Filter 
} from 'lucide-react';

export const QuestionsTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedExercise, setSelectedExercise] = useState<string>('all');
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({
    Q1: true,
    Q9: true,
    Q11: true,
    Q14: true,
    Q24: true,
    Q31: true,
    Q36: true,
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const exercises = useMemo(() => {
    const list = Array.from(new Set(LAB_QUESTIONS.map(q => q.exercise)));
    return ['all', ...list];
  }, []);

  const filteredQuestions = useMemo(() => {
    return LAB_QUESTIONS.filter((item) => {
      const matchesSearch = 
        item.num.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.shortAnswer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.detailedAnswer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesExercise = selectedExercise === 'all' || item.exercise === selectedExercise;

      return matchesSearch && matchesExercise;
    });
  }, [searchQuery, selectedExercise]);

  const toggleExpand = (num: string) => {
    setExpandedQuestions(prev => ({ ...prev, [num]: !prev[num] }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    LAB_QUESTIONS.forEach(q => { allExpanded[q.num] = true; });
    setExpandedQuestions(allExpanded);
  };

  const collapseAll = () => {
    setExpandedQuestions({});
  };

  const handleCopy = (item: QuestionAnswer) => {
    const textToCopy = `${item.num}: ${item.question}\n\nShort Answer: ${item.shortAnswer}\n\nDetailed Scientific Explanation:\n${item.detailedAnswer}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(item.num);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <HelpCircle className="w-4 h-4" />
          <span>Full Academic Reference Solutions</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          All 36 Lab Questions &amp; Detailed Solutions (Q1 - Q36)
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-3xl">
          Exhaustive, rigorous answers to every single question from the laboratory syllabus with underlying mathematical formulas, citations, and empirical observations.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by question, concept (e.g. 'softmax', 'zero-shot', 'projection', 'hallucination')..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-medium"
            />
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All Exercises (Q1 - Q36)</option>
              {exercises.filter(e => e !== 'all').map((ex) => (
                <option key={ex} value={ex}>{ex}</option>
              ))}
            </select>

            <button
              onClick={expandAll}
              className="text-xs px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl cursor-pointer"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="text-xs px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl cursor-pointer"
            >
              Collapse
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span>Showing <strong className="text-white">{filteredQuestions.length}</strong> of 36 questions</span>
          <span className="text-[11px] font-mono text-indigo-400">PhD Level AI Reference Standard</span>
        </div>
      </div>

      {/* Questions Accordion List */}
      <div className="space-y-4">
        {filteredQuestions.map((item) => {
          const isExpanded = !!expandedQuestions[item.num];
          const isCopied = copiedId === item.num;

          return (
            <div
              key={item.num}
              className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden transition-all duration-150"
            >
              {/* Question Header */}
              <div
                onClick={() => toggleExpand(item.num)}
                className="p-5 flex items-start justify-between cursor-pointer hover:bg-slate-800/40 select-none"
              >
                <div className="flex items-start space-x-3.5">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold font-mono shrink-0">
                    {item.num}
                  </span>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-0.5">
                      {item.exercise}
                    </span>
                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-300">
                      {item.question}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-1 font-sans">
                      <strong className="text-emerald-400 font-medium">Answer: </strong>
                      {item.shortAnswer}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(item);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Copy Answer to Clipboard"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <div className="text-slate-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Expanded Detailed Answer */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 bg-slate-950/40 space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-0.5">
                      Executive Summary:
                    </span>
                    <p className="text-emerald-200 font-medium leading-relaxed">
                      {item.shortAnswer}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Detailed Scientific &amp; Empirical Explanation:
                    </span>
                    <div className="text-slate-200 leading-relaxed whitespace-pre-line font-sans space-y-2">
                      {item.detailedAnswer}
                    </div>
                  </div>

                  {item.mathFormula && (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-indigo-300 text-center">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold mb-1">Mathematical Formula</span>
                      $${item.mathFormula}$$
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
