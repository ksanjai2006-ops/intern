import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProjectManager from './components/ProjectManager';
import DocumentViewer from './components/DocumentViewer';
import HeatmapView from './components/HeatmapView';
import QualityMetrics from './components/QualityMetrics';
import ReportExporter from './components/ReportExporter';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [currentUser, setCurrentUser] = useState({
    name: 'Dr. Alex Rivera',
    role: 'Reviewer',
    email: 'reviewer@techdocs.ai',
    color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
  });

  const [activeTab, setActiveTab] = useState('review'); // 'review', 'graph', 'quality', 'export', 'admin'
  const [loading, setLoading] = useState(false);
  
  const [kbData, setKbData] = useState(null);
  const [parsedDoc, setParsedDoc] = useState(null);
  const [gapAnalysis, setGapAnalysis] = useState(null);
  const [qualityMetrics, setQualityMetrics] = useState(null);

  // Fetch Knowledge Base structure on initial mount
  useEffect(() => {
    fetch('http://localhost:8000/api/kb')
      .then(res => res.json())
      .then(data => setKbData(data))
      .catch(err => console.log('API offline, loading default KB state'));

    // Automatically load sample document 1 on startup
    handleRunAnalysis({ type: 'sample', sampleId: 'sample_1' });
  }, []);

  const handleRunAnalysis = async (sourceConfig) => {
    setLoading(true);
    try {
      if (sourceConfig.type === 'sample') {
        const samplesRes = await fetch('http://localhost:8000/api/samples');
        const samples = await samplesRes.json();
        const target = samples.find(s => s.id === sourceConfig.sampleId) || samples[0];

        const analyzeRes = await fetch('http://localhost:8000/api/analyze/text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: target.filename,
            content: target.content
          })
        });
        const result = await analyzeRes.json();
        setParsedDoc(result.parsed_document);
        setGapAnalysis(result.gap_analysis);
        setQualityMetrics(result.quality_metrics);
      } else if (sourceConfig.type === 'upload' && sourceConfig.file) {
        const formData = new FormData();
        formData.append('file', sourceConfig.file);

        const analyzeRes = await fetch('http://localhost:8000/api/analyze/file', {
          method: 'POST',
          body: formData
        });
        const result = await analyzeRes.json();
        setParsedDoc(result.parsed_document);
        setGapAnalysis(result.gap_analysis);
        setQualityMetrics(result.quality_metrics);
      } else if (sourceConfig.type === 'text') {
        const analyzeRes = await fetch('http://localhost:8000/api/analyze/text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: sourceConfig.title || 'Untitled_Document.md',
            content: sourceConfig.text || '# Sample Specification\n\nNo content provided.'
          })
        });
        const result = await analyzeRes.json();
        setParsedDoc(result.parsed_document);
        setGapAnalysis(result.gap_analysis);
        setQualityMetrics(result.quality_metrics);
      }
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!parsedDoc) return;
    try {
      const textContent = parsedDoc.sections.map(s => `# ${s.title}\n${s.content}`).join('\n\n');
      const response = await fetch('http://localhost:8000/api/export/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: parsedDoc.filename,
          content: textContent
        })
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Gap_Analysis_Report_${parsedDoc.filename.replace(/\.[^/.]+$/, "")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      <Navbar 
        currentUser={currentUser} 
        setCurrentUser={setCurrentUser} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        currentScore={gapAnalysis ? gapAnalysis.total_score : null}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-6">
        
        {/* Top Control Bar: Project & File Upload Manager */}
        <ProjectManager 
          onRunAnalysis={handleRunAnalysis} 
          loading={loading}
          currentDocumentName={parsedDoc?.filename}
        />

        {/* Tab Views */}
        {activeTab === 'review' && (
          <DocumentViewer 
            parsedDoc={parsedDoc} 
            gapAnalysis={gapAnalysis} 
            qualityMetrics={qualityMetrics}
          />
        )}

        {activeTab === 'graph' && (
          <HeatmapView 
            gapAnalysis={gapAnalysis} 
            kbData={kbData}
          />
        )}

        {activeTab === 'quality' && (
          <QualityMetrics 
            qualityMetrics={qualityMetrics}
          />
        )}

        {activeTab === 'export' && (
          <ReportExporter 
            gapAnalysis={gapAnalysis}
            onDownloadPDF={handleDownloadPDF}
            currentDocumentName={parsedDoc?.filename}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 text-xs text-slate-500 py-6 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AI-Based Knowledge Gap Detector for Technical Documents • Spec Compliance v2.4</span>
          <span>Role: <b>{currentUser.role}</b> ({currentUser.name})</span>
        </div>
      </footer>
    </div>
  );
}
