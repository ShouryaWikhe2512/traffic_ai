"use client";

import React, { useEffect, useState } from "react";
import { 
  History, 
  ArrowLeft, 
  ShieldCheck, 
  Activity, 
  AlertTriangle, 
  ChevronRight, 
  Clock,
  Zap,
  Loader2,
  Navigation
} from "lucide-react";
import Link from "next/link";

export default function ATCSOutputPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/outputs", { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setHistory(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err: any) {
      console.error("History fetch error:", err);
      setError(err.message || "Failed to load decision logs.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const getPriorityStyles = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': return "bg-red-600 text-white";
      case 'medium': return "bg-orange-600 text-white";
      default: return "bg-green-600 text-white";
    }
  };

  const getAlertBorder = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'red': return "border-red-500";
      case 'orange': return "border-orange-500";
      default: return "border-green-500";
    }
  };

  return (
    <main className="min-h-screen bg-[#fcfcfc] text-[#1a1a1a] font-sans overflow-x-hidden pb-20">
      {/* CORPORATE HEADER */}
      <header className="bg-white border-b border-gray-100 px-10 py-5 sticky top-0 z-[110] shadow-sm">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link 
              href="/atcs" 
              className="p-2 border border-gray-100 rounded-sm hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>
            <div className="flex flex-col">
              <h1 className="text-2xl font-black tracking-tighter flex items-center gap-2">
                DECISION
                <span className="text-orange-600 underline decoration-4 decoration-orange-200 underline-offset-4">
                  LOGS
                </span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] bg-gray-900 text-white px-2 py-0.5 rounded-sm tracking-[0.2em] font-black uppercase shadow-sm">
                  AUDIT-UNIT
                </span>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                  Historical Traffic Management Trace
                </p>
              </div>
            </div>
          </div>

          <button 
            onClick={fetchHistory}
            className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 px-4 py-2 rounded-sm transition-all"
          >
            <History className={`w-4 h-4 text-orange-600 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Refresh Audit</span>
          </button>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-10 py-12">
        {loading && history.length === 0 ? (
          <div className="h-[400px] flex flex-col items-center justify-center gap-6">
            <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
            <div className="text-center">
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-900">Retrieving Decision History</p>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-2">Connecting to Intelligence Archive...</p>
            </div>
          </div>
        ) : error ? (
            <div className="bg-white border border-red-100 p-10 rounded-sm shadow-xl text-center max-w-md mx-auto">
              <AlertTriangle className="w-10 h-10 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-black uppercase tracking-tight mb-2">Audit Synchronization Failed</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase mb-6 leading-relaxed">{error}</p>
              <button 
                onClick={fetchHistory}
                className="w-full bg-orange-600 text-white py-3 rounded-sm font-black text-xs uppercase tracking-widest hover:bg-orange-700"
              >
                Retry Connection
              </button>
            </div>
        ) : history.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-sm">
            <ShieldCheck className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">No decisions logged in current session</p>
            <p className="text-[9px] text-gray-300 font-bold uppercase mt-2">History is populated after simulation runs</p>
          </div>
        ) : (
          <div className="space-y-12">
            {history.slice().reverse().map((item, idx) => (
              <div 
                key={idx} 
                className={`bg-white border-l-4 ${getAlertBorder(item.output?.map_visualization_flags?.alert_level)} rounded-sm shadow-sm overflow-hidden border-t border-r border-b border-gray-100`}
              >
                <div className="bg-gray-50/50 border-b border-gray-100 px-8 py-4 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="p-2 bg-white border border-gray-100 rounded-sm shadow-sm">
                         <Navigation className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                         <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-900">
                            {item.input?.venue?.name || "Global Decision"}
                         </h3>
                         <span className="text-[9px] font-bold text-gray-400 uppercase">
                            Audit Reference ID: {(item.output?.confidence * 10000).toFixed(0)}-{idx}
                         </span>
                      </div>
                   </div>
                   <div className="flex items-center gap-6">
                      <div className="flex flex-col items-end">
                         <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1">Impact Level</span>
                         <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-sm ${getPriorityStyles(item.output?.priority_level)}`}>
                            {item.output?.priority_level} PRIORITY
                         </span>
                      </div>
                      <div className="h-8 w-[1px] bg-gray-200" />
                      <div className="flex flex-col items-end">
                         <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1">Execution Time</span>
                         <span className="text-[10px] font-black text-gray-900">{item.input?.event_context?.date} | LIVE</span>
                      </div>
                   </div>
                </div>

                <div className="p-8 grid grid-cols-12 gap-10">
                   {/* SUMMARY SECTION */}
                   <div className="col-span-12 lg:col-span-8 space-y-8">
                      <div>
                         <div className="flex items-center gap-2 mb-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-600" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-900">Intelligence Summary</h4>
                         </div>
                         <p className="text-sm font-bold text-gray-800 leading-relaxed bg-orange-50/30 p-5 border border-orange-100/50 rounded-sm">
                            {item.output?.decision_summary}
                         </p>
                      </div>

                      <div className="grid grid-cols-2 gap-8">
                         <div>
                            <div className="flex items-center gap-2 mb-4">
                               <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                               <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-900">Signal Optimization</h4>
                            </div>
                            <div className="space-y-3">
                               {item.output?.signal_actions?.map((action: any, i: number) => (
                                  <div key={i} className="bg-gray-50 border border-gray-100 p-4 rounded-sm">
                                     <div className="text-[10px] font-black text-gray-900 mb-1">{action.junction_area}</div>
                                     <div className="flex gap-4 mb-2">
                                        <div className="flex flex-col">
                                           <span className="text-[8px] text-gray-400 font-black uppercase">E/W Green</span>
                                           <span className="text-xs font-black text-blue-600">{action.east_west_green_time_sec}s</span>
                                        </div>
                                        <div className="flex flex-col">
                                           <span className="text-[8px] text-gray-400 font-black uppercase">N/S Green</span>
                                           <span className="text-xs font-black text-green-600">{action.north_south_green_time_sec}s</span>
                                        </div>
                                     </div>
                                     <p className="text-[9px] font-medium text-gray-500 italic leading-snug">"{action.reason}"</p>
                                  </div>
                               ))}
                            </div>
                         </div>

                         <div>
                            <div className="flex items-center gap-2 mb-4">
                               <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                               <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-900">Protocols Triggered</h4>
                            </div>
                            <div className="space-y-2">
                               {item.output?.traffic_management_actions?.map((action: string, i: number) => (
                                  <div key={i} className="flex items-start gap-3 p-3 border border-gray-50 rounded-sm hover:border-gray-200 transition-colors">
                                     <ChevronRight className="w-3 h-3 text-purple-600 mt-0.5" />
                                     <span className="text-[10px] font-black text-gray-600 uppercase tracking-tighter">{action}</span>
                                  </div>
                               ))}
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* METRICS SIDEBAR */}
                   <div className="col-span-12 lg:col-span-4 space-y-6 bg-gray-50/50 p-6 rounded-sm border border-gray-100">
                      <div>
                         <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-4">Risk Assessment</span>
                         <div className="space-y-4">
                            {[
                               { label: 'Choke Prob.', val: item.output?.risk_assessment?.choke_probability, color: 'bg-orange-600' },
                               { label: 'Crash Risk', val: item.output?.risk_assessment?.crash_risk, color: 'bg-red-600' }
                            ].map((metric, i) => (
                               <div key={i} className="bg-white p-3 border border-gray-100 rounded-sm">
                                  <div className="flex justify-between items-center mb-2">
                                     <span className="text-[9px] font-black text-gray-900 uppercase">{metric.label}</span>
                                     <span className="text-[11px] font-black text-gray-600">{(metric.val * 100).toFixed(0)}%</span>
                                  </div>
                                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                                     <div 
                                        className={`h-full ${metric.color} transition-all duration-1000`} 
                                        style={{ width: `${metric.val * 100}%` }}
                                     />
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>

                      <div className="pt-6 border-t border-gray-200">
                         <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-4">Core Telemetry</span>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-3 border border-gray-100 rounded-sm flex flex-col items-center">
                               <Zap className="w-4 h-4 text-orange-600 mb-2" />
                               <span className="text-sm font-black text-gray-900">{item.input?.traffic_prediction?.congestion_index}</span>
                               <span className="text-[7px] text-gray-400 uppercase font-black">Congestion Index</span>
                            </div>
                            <div className="bg-white p-3 border border-gray-100 rounded-sm flex flex-col items-center">
                               <ShieldCheck className="w-4 h-4 text-green-600 mb-2" />
                               <span className="text-sm font-black text-gray-900">{(item.output?.confidence * 100).toFixed(0)}%</span>
                               <span className="text-[7px] text-gray-400 uppercase font-black">AI Confidence</span>
                            </div>
                         </div>
                      </div>

                      <div className="pt-6 border-t border-gray-200">
                         <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-3">Public Advisories</span>
                         <div className="space-y-2">
                            {item.output?.public_advisories?.slice(0, 3).map((adv: string, i: number) => (
                               <div key={i} className="text-[9px] font-bold text-gray-500 border-l-2 border-orange-200 pl-3 leading-relaxed">
                                  {adv}
                               </div>
                            ))}
                         </div>
                      </div>

                      {item.output?.map_visualization_flags?.show_metro_option && (
                        <div className="pt-4 mt-6 border-t border-gray-100 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-1 bg-blue-50 border border-blue-100 rounded-sm">
                              <Zap className="w-3 h-3 text-blue-600" />
                            </div>
                            <span className="text-[9px] font-black text-gray-900 uppercase tracking-tighter">Metro Network Integration Active</span>
                          </div>
                          <span className="text-[8px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-sm tracking-widest">ANANDNAGAR GATEWAY</span>
                        </div>
                      )}
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
