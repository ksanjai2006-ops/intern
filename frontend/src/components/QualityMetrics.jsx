import React from 'react';
import { Sliders, AlertOctagon, Clock, BookOpen, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function QualityMetrics({ qualityMetrics }) {
  if (!qualityMetrics) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
        Run document analysis to inspect readability, Flesch-Kincaid score, contradiction checks, and outdated version flags.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* 1. Readability & Score Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Flesch-Kincaid Ease */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">Flesch-Kincaid Reading Ease</span>
              <BookOpen className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-extrabold text-white mt-1">
              {qualityMetrics.flesch_kincaid_score} <span className="text-xs text-slate-400 font-normal">/ 100</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
            Grade level: <b className="text-blue-400">{qualityMetrics.readability_grade}</b>
          </div>
        </div>

        {/* Gunning Fog Index */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">Gunning Fog Index</span>
              <Sliders className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-extrabold text-white mt-1">
              {qualityMetrics.gunning_fog_index}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
            Target rating: <b className="text-purple-300">Optimal (10.0 - 14.0)</b>
          </div>
        </div>

        {/* Clarity Score */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">Clarity & Style Assessment</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1">
              {qualityMetrics.clarity_rating}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
            Automated NLP structural clarity evaluation
          </div>
        </div>

      </div>

      {/* 2. Contradiction & Inconsistency Detection */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <h3 className="text-base font-bold text-white">Contradiction & Technical Inconsistency Flags</h3>
        </div>

        {qualityMetrics.contradiction_warnings.length === 0 ? (
          <div className="p-6 text-center bg-slate-950/40 rounded-xl border border-slate-800/60 text-xs text-slate-400">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            No technical contradictions detected against the Knowledge Base standard.
          </div>
        ) : (
          <div className="space-y-3">
            {qualityMetrics.contradiction_warnings.map((c, i) => (
              <div key={i} className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/40 text-xs">
                <div className="font-bold text-rose-300 mb-1">{c.term}</div>
                <div className="text-slate-300 leading-relaxed mb-2">{c.issue}</div>
                <div className="text-slate-400 font-medium">Recommendation: <span className="text-slate-200">{c.recommendation}</span></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Outdated Information Flagging */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
          <Clock className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">Outdated Information & Deprecation Flags</h3>
        </div>

        {qualityMetrics.outdated_info_flags.length === 0 ? (
          <div className="p-6 text-center bg-slate-950/40 rounded-xl border border-slate-800/60 text-xs text-slate-400">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            All version standards match latest KB release standards (v2.4.0).
          </div>
        ) : (
          <div className="space-y-3">
            {qualityMetrics.outdated_info_flags.map((o, i) => (
              <div key={i} className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 text-xs">
                <div className="font-bold text-amber-300 mb-1">{o.term}</div>
                <div className="text-slate-300 leading-relaxed mb-2">{o.issue}</div>
                <div className="text-slate-400 font-medium">Action: <span className="text-slate-200">{o.recommendation}</span></div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
