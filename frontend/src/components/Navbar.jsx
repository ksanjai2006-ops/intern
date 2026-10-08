import React from 'react';
import { 
  FileSearch, 
  ShieldCheck, 
  User, 
  BarChart3, 
  FileText, 
  GitFork, 
  Download,
  Sliders
} from 'lucide-react';

export default function Navbar({ currentUser, setCurrentUser, activeTab, setActiveTab, currentScore }) {
  const users = [
    { name: 'Sarah Connor', role: 'Admin', email: 'admin@techdocs.ai', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
    { name: 'Dr. Alex Rivera', role: 'Reviewer', email: 'reviewer@techdocs.ai', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    { name: 'Elena Rostova', role: 'Author', email: 'author@techdocs.ai', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
            <FileSearch className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Knowledge Gap Detector
              </h1>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                AI + NLP Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Technical Document Quality & Ontology Compliance</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('review')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
              activeTab === 'review'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Document Review</span>
          </button>

          <button
            onClick={() => setActiveTab('graph')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
              activeTab === 'graph'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <GitFork className="w-4 h-4" />
            <span>Heatmap & Network</span>
          </button>

          <button
            onClick={() => setActiveTab('quality')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
              activeTab === 'quality'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Readability & Quality</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
              activeTab === 'export'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Reports & Export</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
              activeTab === 'admin'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Admin Analytics</span>
          </button>
        </nav>

        {/* User Role & Score Badge */}
        <div className="flex items-center gap-3">
          {currentScore !== null && (
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium">Gap Score:</span>
              <span className={`text-sm font-bold ${
                currentScore >= 80 ? 'text-emerald-400' : currentScore >= 60 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {currentScore}/100
              </span>
            </div>
          )}

          {/* Role Switcher */}
          <div className="relative group">
            <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${currentUser.color}`}>
              <User className="w-3.5 h-3.5" />
              <div className="text-left">
                <div className="leading-tight">{currentUser.name}</div>
                <div className="text-[10px] opacity-75 font-normal">{currentUser.role}</div>
              </div>
            </div>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 hidden group-hover:block z-50">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Switch Role / User
              </div>
              {users.map((u) => (
                <button
                  key={u.email}
                  onClick={() => setCurrentUser(u)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-left transition-colors ${
                    currentUser.email === u.email ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <div>
                    <div>{u.name}</div>
                    <div className="text-[10px] text-slate-500">{u.role}</div>
                  </div>
                  {currentUser.email === u.email && (
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
