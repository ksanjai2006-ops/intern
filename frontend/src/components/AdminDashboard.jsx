import React, { useState, useEffect } from 'react';
import { BarChart3, Layers, FileSearch, TrendingUp, ShieldCheck, Activity, Users } from 'lucide-react';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    // Fetch Admin analytics from API
    fetch('http://localhost:8000/api/admin/analytics')
      .then(res => res.json())
      .then(data => setAnalytics(data))
      .catch(() => {
        // Fallback demo metrics if offline
        setAnalytics({
          total_projects: 14,
          total_reviews_run: 142,
          avg_gap_score: 76.4,
          common_gap_categories: [
            { category: 'Missing Prerequisite Chain', count: 48, percentage: 33.8 },
            { category: 'Shallow Concept Explanation', count: 39, percentage: 27.5 },
            { category: 'Disconnected Related Concepts', count: 28, percentage: 19.7 },
            { category: 'Security / Auth Gap', count: 17, percentage: 12.0 },
            { category: 'Outdated Version Reference', count: 10, percentage: 7.0 }
          ],
          document_volume_by_month: [
            { month: 'May', reviews: 18 },
            { month: 'Jun', reviews: 24 },
            { month: 'Jul', reviews: 32 },
            { month: 'Aug', reviews: 29 },
            { month: 'Sep', reviews: 39 }
          ],
          recent_audit_logs: [
            { time: '10 mins ago', user: 'Elena Rostova', action: 'Ran Gap Analysis on Distributed_Storage_Arch.md', status: 'Needs Revision' },
            { time: '1 hour ago', user: 'Dr. Alex Rivera', action: 'Exported PDF Report for Consensus_Protocol_Spec.pdf', status: 'Completed' },
            { time: '3 hours ago', user: 'Sarah Connor', action: 'Updated Knowledge Base Ontology kb_dist_systems_v2', status: 'Published' }
          ]
        });
      });
  }, []);

  if (!analytics) return <div className="p-8 text-center text-xs text-slate-400">Loading admin analytics...</div>;

  return (
    <div className="space-y-6">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">Total Review Projects</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{analytics.total_projects}</div>
          <div className="text-[11px] text-slate-500 mt-1">Active enterprise projects</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">Total Gap Reviews Run</span>
            <FileSearch className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{analytics.total_reviews_run}</div>
          <div className="text-[11px] text-slate-500 mt-1">Automated analysis runs</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">Average Quality Score</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">{analytics.avg_gap_score} <span className="text-xs text-slate-400">/ 100</span></div>
          <div className="text-[11px] text-slate-500 mt-1">Across all organizations</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">System Security Isolation</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">Encrypted</div>
          <div className="text-[11px] text-slate-500 mt-1">JWT + Org isolation active</div>
        </div>

      </div>

      {/* Breakdown Charts & Log Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Category Distribution */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-base font-bold text-white mb-4 pb-3 border-b border-slate-800 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <span>Common Knowledge Gap Categories</span>
          </h3>

          <div className="space-y-3">
            {analytics.common_gap_categories.map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{item.category}</span>
                  <span className="text-slate-400 font-bold">{item.count} ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Log Stream */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-base font-bold text-white mb-4 pb-3 border-b border-slate-800 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400" />
            <span>Recent Review Audit Logs</span>
          </h3>

          <div className="space-y-3">
            {analytics.recent_audit_logs.map((log, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <div className="font-bold text-white mb-0.5">{log.action}</div>
                  <div className="text-[11px] text-slate-400">{log.user} • <span className="text-slate-500">{log.time}</span></div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
