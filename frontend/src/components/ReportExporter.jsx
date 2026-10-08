import React, { useState } from 'react';
import { Download, FileText, CheckSquare, ListOrdered, ShieldAlert, Sparkles, ExternalLink } from 'lucide-react';

export default function ReportExporter({ gapAnalysis, onDownloadPDF, currentDocumentName }) {
  const [isExporting, setIsExporting] = useState(false);

  if (!gapAnalysis) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
        Run document analysis to generate downloadable PDF reports and exported annotated documents.
      </div>
    );
  }

  const handleDownload = async () => {
    setIsExporting(true);
    await onDownloadPDF();
    setIsExporting(false);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. PDF Download & Action Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">Gap Analysis PDF Report & Fix Plan</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Export a clean PDF gap analysis report containing executive summary metrics, prioritized fix items, and reference links.
          </p>
        </div>

        <button
          onClick={handleDownload}
          disabled={isExporting}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
        >
          {isExporting ? (
            <span>Generating PDF...</span>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download PDF Gap Analysis Report</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Prioritized Fix List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ListOrdered className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white">Prioritized Actionable Fix List ({gapAnalysis.gaps.length} Items)</h3>
          </div>
          <span className="text-xs text-slate-400">Ordered by severity & prerequisite impact</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-3">Priority</th>
                <th className="p-3">Gap Type</th>
                <th className="p-3">Target Concept</th>
                <th className="p-3">Section</th>
                <th className="p-3">Required Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {gapAnalysis.gaps.map((gap, idx) => (
                <tr key={gap.id} className="hover:bg-slate-950/40 transition-colors">
                  <td className="p-3 font-mono font-bold text-slate-400">#{idx + 1}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      gap.severity === 'High' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {gap.gap_type.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-white">{gap.concept_name}</td>
                  <td className="p-3 text-slate-300">{gap.section_title}</td>
                  <td className="p-3 text-slate-400 leading-relaxed">{gap.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
