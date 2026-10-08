import React from 'react';
import { Layers, GitCommit, GitPullRequest, Grid, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function HeatmapView({ gapAnalysis, kbData }) {
  if (!gapAnalysis || !gapAnalysis.heatmap) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
        Run document gap analysis first to view the Concept Coverage Heatmap and Dependency Graph.
      </div>
    );
  }

  const getHeatmapColor = (score) => {
    if (score >= 80) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    if (score >= 60) return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
  };

  const kbConcepts = kbData?.concepts ? Object.values(kbData.concepts) : [];

  return (
    <div className="space-y-6">
      
      {/* 1. Section Coverage Heatmap Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Grid className="w-5 h-5 text-blue-400" />
              <h3 className="text-base font-bold text-white">Concept Coverage Heatmap</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Section-by-section concept density, shallow explanation scoring, and quality ratings.</p>
          </div>
          
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-emerald-400 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> High (&gt;80%)</span>
            <span className="flex items-center gap-1 text-amber-400 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Moderate (50-80%)</span>
            <span className="flex items-center gap-1 text-rose-400 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Low (&lt;50%)</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {gapAnalysis.heatmap.map((pt) => (
            <div
              key={pt.section_id}
              className={`p-4 rounded-xl border transition-all ${getHeatmapColor(pt.coverage_score)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold truncate pr-1">{pt.section_title}</span>
                <span className="text-xs font-extrabold">{pt.coverage_score}%</span>
              </div>

              <div className="space-y-1 text-[11px] opacity-90 font-medium">
                <div className="flex justify-between">
                  <span>Detected Concepts:</span>
                  <b className="font-bold">{pt.concept_count}</b>
                </div>
                <div className="flex justify-between">
                  <span>Shallow Explanations:</span>
                  <b className={pt.shallow_count > 0 ? 'text-amber-300 font-bold' : ''}>{pt.shallow_count}</b>
                </div>
                <div className="flex justify-between">
                  <span>Word Count:</span>
                  <b className="font-mono">{pt.word_count}</b>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Prerequisite & Dependency Network Graph */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <GitCommit className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-bold text-white">Prerequisite & Concept Dependency Graph</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Visual network mapping Knowledge Base concept prerequisite chains and document presence.</p>
          </div>
        </div>

        {/* Graph Node Network Renderer */}
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800/80">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kbConcepts.map((c) => {
              const isDetected = gapAnalysis.detected_concepts.includes(c.name);
              const isMissing = gapAnalysis.missing_concepts.includes(c.name);
              const isShallow = gapAnalysis.shallow_concepts.includes(c.name);

              return (
                <div
                  key={c.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isMissing
                      ? 'bg-rose-950/20 border-rose-500/40 text-slate-300'
                      : isShallow
                      ? 'bg-amber-950/20 border-amber-500/40 text-slate-200'
                      : 'bg-slate-900 border-slate-800 text-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <GitPullRequest className="w-3.5 h-3.5 text-blue-400" />
                      {c.name}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isMissing
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : isShallow
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}>
                      {isMissing ? 'Missing' : isShallow ? 'Shallow' : 'Covered'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 mb-3 leading-relaxed">{c.description}</p>

                  <div className="pt-2 border-t border-slate-800/60 text-[10px] text-slate-400 space-y-1">
                    <div>
                      <span className="font-semibold text-slate-500">Prerequisites:</span>{' '}
                      {c.prerequisites.length > 0 ? (
                        <span className="text-purple-300 font-mono">{c.prerequisites.join(', ')}</span>
                      ) : (
                        <span className="text-slate-600">None (Root Concept)</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
