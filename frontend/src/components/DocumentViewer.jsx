import React, { useState } from 'react';
import { 
  AlertTriangle, 
  HelpCircle, 
  GitBranch, 
  Clock, 
  ExternalLink, 
  CheckCircle, 
  Filter,
  Eye,
  ChevronRight,
  Info
} from 'lucide-react';

export default function DocumentViewer({ parsedDoc, gapAnalysis, qualityMetrics }) {
  const [selectedSectionId, setSelectedSectionId] = useState(
    parsedDoc?.sections[0]?.id || 'sec_1'
  );
  const [selectedGap, setSelectedGap] = useState(null);
  const [filterType, setFilterType] = useState('all'); // 'all', 'missing', 'shallow', 'prerequisite_violation', 'disconnected'
  const [filterSeverity, setFilterSeverity] = useState('all'); // 'all', 'High', 'Medium', 'Low'

  if (!parsedDoc || !gapAnalysis) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-3 opacity-80" />
        <h3 className="text-base font-bold text-white">No Document Loaded</h3>
        <p className="text-xs text-slate-400 mt-1">Select a sample document above or upload your technical specification to run gap analysis.</p>
      </div>
    );
  }

  // Filter Gaps
  const filteredGaps = gapAnalysis.gaps.filter(g => {
    if (filterType !== 'all' && g.gap_type !== filterType) return false;
    if (filterSeverity !== 'all' && g.severity !== filterSeverity) return false;
    return true;
  });

  const activeSection = parsedDoc.sections.find(s => s.id === selectedSectionId) || parsedDoc.sections[0];
  const sectionGaps = filteredGaps.filter(g => g.section_id === activeSection?.id);

  // Helper badge styles
  const getGapBadgeClass = (type) => {
    switch (type) {
      case 'missing':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'shallow':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'prerequisite_violation':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'disconnected':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    }
  };

  const getSeverityClass = (sev) => {
    switch (sev) {
      case 'High': return 'bg-rose-500 text-white';
      case 'Medium': return 'bg-amber-500 text-slate-950';
      case 'Low': return 'bg-cyan-500 text-slate-950';
      default: return 'bg-slate-700 text-white';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Overview & Gap Filter Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Document Stats */}
        <div className="flex items-center gap-4">
          <div className={`h-14 w-14 rounded-2xl flex flex-col items-center justify-center font-extrabold text-lg border ${
            gapAnalysis.total_score >= 80 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : gapAnalysis.total_score >= 60
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
          }`}>
            <span>{gapAnalysis.total_score}</span>
            <span className="text-[9px] uppercase font-bold text-slate-400">Score</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">{parsedDoc.filename}</h3>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                gapAnalysis.overall_status === 'Production Ready' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}>
                {gapAnalysis.overall_status}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
              <span>Words: <b>{parsedDoc.total_words}</b></span>
              <span>Sections: <b>{parsedDoc.sections.length}</b></span>
              <span>KB Coverage: <b className="text-blue-400">{gapAnalysis.coverage_percentage}%</b></span>
              <span>Total Gaps: <b className="text-rose-400">{gapAnalysis.gaps.length}</b></span>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs">
          <Filter className="w-4 h-4 text-slate-400 ml-1" />
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Gap Type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Types ({gapAnalysis.gaps.length})</option>
              <option value="missing">Missing Concepts</option>
              <option value="shallow">Shallow Explanations</option>
              <option value="prerequisite_violation">Prerequisite Violations</option>
              <option value="disconnected">Disconnected Concepts</option>
            </select>
          </div>

          <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
            <span className="text-slate-400 font-medium">Severity:</span>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Severities</option>
              <option value="High">High Severity</option>
              <option value="Medium">Medium Severity</option>
              <option value="Low">Low Severity</option>
            </select>
          </div>
        </div>

      </div>

      {/* Split Main Viewer Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Section Index & Gap Annotations List */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Section Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">
              Document Outline & Sections
            </h4>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {parsedDoc.sections.map((sec) => {
                const secGapsCount = filteredGaps.filter(g => g.section_id === sec.id).length;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setSelectedSectionId(sec.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs text-left transition-all ${
                      selectedSectionId === sec.id
                        ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                        : 'bg-slate-950/50 text-slate-300 hover:bg-slate-950 hover:text-white border border-slate-800/60'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="truncate">{sec.title}</div>
                      <div className="text-[10px] opacity-70 font-mono mt-0.5">{sec.word_count} words</div>
                    </div>
                    {secGapsCount > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        selectedSectionId === sec.id ? 'bg-white/20 text-white' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {secGapsCount} gap{secGapsCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Inline Gap List for Active Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3 px-1">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Gaps in Selected Section ({sectionGaps.length})
              </h4>
            </div>

            {sectionGaps.length === 0 ? (
              <div className="p-6 text-center bg-slate-950/40 rounded-xl border border-slate-800/60">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                <p className="text-xs text-slate-300 font-medium">No Gaps Detected</p>
                <p className="text-[11px] text-slate-500 mt-0.5">This section meets knowledge base quality standards.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {sectionGaps.map((gap) => (
                  <div
                    key={gap.id}
                    onClick={() => setSelectedGap(gap)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      selectedGap?.id === gap.id
                        ? 'bg-blue-600/20 border-blue-500 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getGapBadgeClass(gap.gap_type)}`}>
                        {gap.gap_type.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${getSeverityClass(gap.severity)}`}>
                        {gap.severity}
                      </span>
                    </div>

                    <h5 className="text-xs font-bold text-white mb-1">{gap.concept_name}</h5>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{gap.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Interactive Annotated Document Reader */}
        <div className="lg:col-span-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">Section View: {activeSection?.title}</h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">ID: {activeSection?.id}</span>
            </div>

            {/* Document Content Renderer */}
            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800/80 min-h-[300px] text-xs leading-relaxed text-slate-300 whitespace-pre-wrap code-font">
              {activeSection?.content}
            </div>

            {/* Selected Gap Action & AI Recommendation Panel */}
            {selectedGap && (
              <div className="mt-4 p-5 rounded-xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/30 shadow-2xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-400" />
                    <h4 className="text-xs font-bold text-white">AI Fix Recommendation & KB Reference</h4>
                  </div>
                  <button 
                    onClick={() => setSelectedGap(null)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Close
                  </button>
                </div>

                <p className="text-xs text-slate-300 font-medium mb-3 leading-relaxed">
                  {selectedGap.recommendation}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] text-slate-400">
                    Target Concept: <b className="text-blue-400">{selectedGap.concept_name}</b>
                  </span>
                  <a
                    href={selectedGap.reference_link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    <span>Knowledge Base Standard Spec</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
