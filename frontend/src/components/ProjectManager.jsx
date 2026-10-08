import React, { useState } from 'react';
import { Upload, FileText, Sparkles, BookOpen, Layers, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ProjectManager({ onRunAnalysis, loading, currentDocumentName }) {
  const [activeSource, setActiveSource] = useState('sample'); // 'sample' or 'upload' or 'text'
  const [selectedSample, setSelectedSample] = useState('sample_1');
  const [customText, setCustomText] = useState('');
  const [customTitle, setCustomTitle] = useState('My_Technical_Doc.md');
  const [uploadedFile, setUploadedFile] = useState(null);

  const sampleDocs = [
    {
      id: 'sample_1',
      title: 'Enterprise Microservices Architecture',
      desc: 'Complete technical spec covering JWT, Role-Based Access, Raft Consensus, Vector Embeddings & Redis.',
      tag: 'High Coverage'
    },
    {
      id: 'sample_2',
      title: 'Distributed Analytics Engine (Gaps & Prereq Violations)',
      desc: 'Spec missing Consistency Model, introducing Raft Consensus prematurely, and shallow Neo4j ontology.',
      tag: 'Contains Gaps'
    }
  ];

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleTrigger = () => {
    onRunAnalysis({
      type: activeSource,
      sampleId: selectedSample,
      file: uploadedFile,
      text: customText,
      title: customTitle
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">Project & Document Selector</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Select a sample document or upload technical specifications (PDF, DOCX, MD) for gap analysis.</p>
        </div>

        {/* Source Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveSource('sample')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeSource === 'sample' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sample Docs
          </button>
          <button
            onClick={() => setActiveSource('upload')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeSource === 'upload' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Upload PDF/DOCX
          </button>
          <button
            onClick={() => setActiveSource('text')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeSource === 'text' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Paste Markdown Text
          </button>
        </div>
      </div>

      {/* Content Panels */}
      {activeSource === 'sample' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {sampleDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedSample(doc.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedSample === doc.id
                  ? 'bg-blue-600/10 border-blue-500/80 shadow-lg shadow-blue-500/10'
                  : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-blue-400 flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  {doc.title}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  doc.tag === 'High Coverage' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  {doc.tag}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{doc.desc}</p>
            </div>
          ))}
        </div>
      )}

      {activeSource === 'upload' && (
        <div className="mb-6">
          <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl cursor-pointer bg-slate-950/50 hover:bg-slate-950 transition-all p-4">
            <Upload className="w-8 h-8 text-blue-400 mb-2" />
            <span className="text-xs font-semibold text-slate-300">
              {uploadedFile ? uploadedFile.name : 'Click to upload or drag & drop technical document'}
            </span>
            <span className="text-[11px] text-slate-500 mt-1">Supports .pdf, .docx, .md files</span>
            <input type="file" accept=".pdf,.docx,.md,.txt" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      )}

      {activeSource === 'text' && (
        <div className="space-y-3 mb-6">
          <input
            type="text"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            placeholder="Document Title (e.g., API_Gateway_Spec.md)"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Paste your markdown specification content here..."
            rows={5}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 code-font placeholder-slate-600 focus:outline-none focus:border-blue-500 resize-none"
          />
        </div>
      )}

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <BookOpen className="w-4 h-4 text-purple-400" />
          <span>Reference Knowledge Base: <b>Distributed Systems & AI Infrastructure v2.4</b></span>
        </div>

        <button
          onClick={handleTrigger}
          disabled={loading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing Document Gaps...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Run AI Knowledge Gap Analysis</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
