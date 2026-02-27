"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { 
  Zap, 
  Activity, 
  Layers, 
  Clock, 
  RefreshCcw, 
  ChevronRight, 
  ShieldAlert, 
  Users, 
  ArrowUpRight,
  Monitor,
  Hexagon,
  Cpu,
  Train,
  CheckCircle2,
  AlertTriangle,
  Info,
  TrendingUp
} from "lucide-react";
import { ForecastDecision } from "@/types/forecastDecision";
import { mockForecastDecision } from "@/mock/forecastDecision";

// Dynamically import Map to avoid SSR issues
const ForecastMap = dynamic(() => import("@/components/forecast/ForecastMap"), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-50 flex items-center justify-center text-gray-400 uppercase tracking-widest font-black text-xs">Initializing Map...</div>
});

const LAYER_CONFIG = [
  { id: 'motorway', label: 'Highways / NHs', color: '#dc2626', type: 'line' },
  { id: 'primary', label: 'Primary Roads', color: '#f97316', type: 'line' },
  { id: 'secondary', label: 'Secondary Roads', color: '#3b82f6', type: 'line' },
  { id: 'signals', label: 'Traffic Signals', color: '#ef4444', type: 'dot' },
  { id: 'junctions', label: 'Major Junctions', color: '#a855f7', type: 'diamond' },
];

export default function ForecastDashboard() {
  const [data, setData] = useState<ForecastDecision>(mockForecastDecision);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [visibleLayers, setVisibleLayers] = useState({
    motorway: true,
    primary: true,
    secondary: true,
    signals: true,
    junctions: true
  });
  const [stats, setStats] = useState({ routes: 0, signals: 0, junctions: 0 });

  const toggleLayer = (id: string) => {
    setVisibleLayers(prev => ({ ...prev, [id]: !prev[id as keyof typeof prev] }));
  };

  const simulateUpdate = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setData(prev => ({
        ...prev,
        confidence: Math.min(98, Math.max(70, prev.confidence + (Math.random() - 0.5) * 5)),
        risk_assessment: {
          ...prev.risk_assessment,
          choke_probability: Math.min(1, Math.max(0, prev.risk_assessment.choke_probability + (Math.random() - 0.5) * 0.1))
        }
      }));
      setIsRefreshing(false);
    }, 1000);
  };

  const getPriorityColor = (level: string) => {
    switch (level) {
      case "high": return "bg-red-50 text-red-600 border-red-200";
      case "medium": return "bg-orange-50 text-orange-400 border-orange-200";
      default: return "bg-green-50 text-green-700 border-green-200";
    }
  };

  const getRiskColor = (prob: number) => {
    if (prob < 0.3) return "text-green-700";
    if (prob < 0.6) return "text-orange-400";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans pb-20">
      
      {/* ── HEADER ── */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-[1001] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-orange-50 border border-orange-100 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                City Congestion Forecast Intelligence
              </h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black mt-0.5">
                30-Minute Predictive Risk Assessment • ICCC AI-Module-V2
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-gray-50 border border-gray-100 p-1 rounded-lg">
                {[
                  { label: 'Routes', val: stats.routes, color: 'text-gray-900' },
                  { label: 'Signals', val: stats.signals, color: 'text-red-500' }
                ].map((s, i) => (
                  <div key={i} className="flex flex-col items-center px-4 py-1 border-r border-gray-200 last:border-0 border-dashed">
                    <span className={`text-md font-black ${s.color}`}>{s.val || '—'}</span>
                    <span className="text-[7px] text-gray-400 font-bold uppercase tracking-tighter">{s.label}</span>
                  </div>
                ))}
            </div>

            <button 
              onClick={simulateUpdate}
              disabled={isRefreshing}
              className="p-2.5 bg-gray-50 border border-gray-100 rounded-full hover:bg-orange-50 hover:border-orange-100 transition-all group"
            >
              <RefreshCcw className={`w-4 h-4 text-gray-400 group-hover:text-orange-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 lg:p-10">
        
        {/* ── TOP SECTION: BRIEFING ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            
            {/* AI SUMMARY CARD */}
            <div className="lg:col-span-8">
                <section className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group border-t-4 border-t-orange-400">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-orange-400 flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4" /> Neural Forecast Summary
                        </h3>
                        <div className="flex items-center gap-3">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${getPriorityColor(data.priority_level)}`}>
                            {data.priority_level} Priority
                            </span>
                            <div className="bg-gray-50 border border-gray-100 px-4 py-1.5 rounded-full flex items-center gap-2">
                            <Activity className="w-3 h-3 text-green-700" />
                            <span className="text-[10px] font-black text-gray-600 uppercase">
                                Confidence: {data.confidence.toFixed(1)}%
                            </span>
                            </div>
                        </div>
                    </div>
                    <p className="text-2xl font-bold leading-tight text-gray-900 mb-8 max-w-3xl">
                        {data.decision_summary}
                    </p>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-xs text-gray-400 font-black uppercase tracking-widest">
                            <Clock className="w-4 h-4" />
                            Next Review in: <span className="text-gray-900 font-black">{data.next_review_in_minutes} Minutes</span>
                        </div>
                        <div className="h-4 w-[1px] bg-gray-200" />
                        <div className="flex items-center gap-2 text-xs text-gray-400 font-black uppercase tracking-widest">
                            <Monitor className="w-4 h-4" />
                            System Node: <span className="text-gray-900 font-black">Pune_ICCC_Grid</span>
                        </div>
                    </div>
                </section>
            </div>

            {/* QUICK RISK INDICES */}
            <div className="lg:col-span-4 grid grid-cols-1 gap-4">
                <div className="bg-white border border-gray-100 p-6 rounded-3xl flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Choke Probability</span>
                        <span className={`text-4xl font-black ${getRiskColor(data.risk_assessment.choke_probability)}`}>
                            {(data.risk_assessment.choke_probability * 100).toFixed(0)}%
                        </span>
                    </div>
                    <AlertTriangle className={`w-12 h-12 opacity-10 ${getRiskColor(data.risk_assessment.choke_probability)}`} />
                </div>
                <div className="bg-white border border-gray-100 p-6 rounded-3xl flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Crash Risk Index</span>
                        <span className={`text-4xl font-black ${getRiskColor(data.risk_assessment.crash_risk)}`}>
                            {(data.risk_assessment.crash_risk * 100).toFixed(0)}%
                        </span>
                    </div>
                    <ShieldAlert className={`w-12 h-12 opacity-10 ${getRiskColor(data.risk_assessment.crash_risk)}`} />
                </div>
            </div>
        </div>

        {/* ── CENTER SECTION: MAP & CONTROLS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
             
             {/* MAP WINDOW */}
             <div className="lg:col-span-9">
                <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xl">
                    <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-white">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-orange-50 rounded text-orange-400">
                                <Hexagon className="w-4 h-4 fill-orange-400/20" />
                            </div>
                            <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Geospatial Awareness Window</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-[10px] font-black text-gray-400 uppercase">Live Network Feed</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[500px] w-full relative">
                        <ForecastMap 
                            data={data} 
                            visibleLayers={visibleLayers} 
                            onStatsUpdate={setStats}
                        />
                    </div>
                </div>
             </div>

             {/* SIDEBAR: MAP CONTROLS & DIRECTIVES */}
             <div className="lg:col-span-3 space-y-8">
                 <section className="bg-gray-50 border border-gray-100 p-6 rounded-3xl">
                     <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                         <Layers className="w-3 h-3 text-orange-400" /> Layer Management
                     </h4>
                     <div className="space-y-4">
                        {LAYER_CONFIG.map(layer => (
                            <div 
                                key={layer.id} 
                                onClick={() => toggleLayer(layer.id)}
                                className={`flex items-center justify-between cursor-pointer group transition-all ${visibleLayers[layer.id as keyof typeof visibleLayers] ? 'opacity-100' : 'opacity-40'}`}
                            >
                                <div className="flex items-center gap-3">
                                    {layer.type === 'line' && <div className="w-4 h-1 rounded-full" style={{ backgroundColor: layer.color }} />}
                                    {layer.type === 'dot' && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: layer.color }} />}
                                    {layer.type === 'diamond' && <div className="w-2 h-2 rotate-45 rounded-[1px]" style={{ backgroundColor: layer.color }} />}
                                    <span className="text-[10px] font-black text-gray-500 group-hover:text-gray-900 transition-colors uppercase tracking-tight">{layer.label}</span>
                                </div>
                                <div className={`w-7 h-3.5 rounded-full relative transition-all ${visibleLayers[layer.id as keyof typeof visibleLayers] ? 'bg-orange-100' : 'bg-gray-200'}`}>
                                    <div className={`absolute top-0.5 w-2.5 h-2.5 rounded-full transition-all ${visibleLayers[layer.id as keyof typeof visibleLayers] ? 'right-0.5 bg-orange-400' : 'left-0.5 bg-gray-400'}`} />
                                </div>
                            </div>
                        ))}
                     </div>
                 </section>

                 <section className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                        <Users className="w-3 h-3 text-gray-900" /> Crowd Context
                    </h4>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-gray-500">Density Level</span>
                        <span className="text-sm font-black text-gray-900 uppercase underline decoration-2 decoration-orange-400 underline-offset-4">
                            {data.risk_assessment.pedestrian_density}
                        </span>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-relaxed font-medium italic">
                        Crowd monitoring active at focus locations. Automated warnings will trigger if threshold is exceeded.
                    </p>
                 </section>
             </div>
        </div>

        {/* ── BOTTOM SECTION: DIRECTIVES & SIGNALS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* SIGNAL ACTIONS TABLE */}
            <div className="lg:col-span-8">
                <section className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Cpu className="w-4 h-4 text-gray-900" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Adaptive Signal Overrides</h3>
                        </div>
                        {data.signal_actions.length > 0 && (
                        <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[9px] font-black uppercase">
                            {data.signal_actions.length} Adjustments Pending
                        </span>
                        )}
                    </div>
                    <div className="p-0">
                        {data.signal_actions.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                                <th className="px-8 py-5">Junction Node</th>
                                <th className="px-8 py-5">E-W Green (s)</th>
                                <th className="px-8 py-5">N-S Green (s)</th>
                                <th className="px-8 py-5">Optimization Logic</th>
                                </tr>
                            </thead>
                            <tbody className="text-[13px] font-bold">
                                {data.signal_actions.map((action, i) => (
                                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-5 text-gray-900 uppercase tracking-tight">{action.junction_area}</td>
                                    <td className="px-8 py-5 text-orange-400 tabular-nums">{action.east_west_green_time_sec}</td>
                                    <td className="px-8 py-5 text-green-700 tabular-nums">{action.north_south_green_time_sec}</td>
                                    <td className="px-8 py-5 text-gray-500 font-medium italic">{action.reason}</td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                        ) : (
                        <div className="p-16 text-center flex flex-col items-center">
                            <CheckCircle2 className="w-12 h-12 text-green-100 mb-4" />
                            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">No adaptive signal adjustments required.</p>
                        </div>
                        )}
                    </div>
                </section>
            </div>

            {/* COMMAND DIRECTIVES & ADVISORIES */}
            <div className="lg:col-span-4 space-y-8">
                <section className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8 flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-gray-900" /> Operational Directives
                    </h4>
                    <div className="space-y-6">
                        {data.traffic_management_actions.map((action, i) => (
                        <div key={i} className="flex gap-4 items-start group">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                            <p className="text-[13px] font-bold text-gray-800 leading-snug">
                                {action}
                            </p>
                        </div>
                        ))}
                    </div>
                </section>

                <section className="bg-green-50/50 border border-green-100 p-8 rounded-3xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-white rounded-lg border border-green-100 shadow-sm text-green-700">
                            <Train className="w-5 h-5" />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-green-700">Transit Alternatives</h4>
                    </div>
                    <div className="space-y-4">
                        {data.public_advisories.map((advisory, i) => (
                        <div key={i} className="flex gap-3 items-start">
                            <div className="mt-1 flex-shrink-0">
                                <ChevronRight className="w-4 h-4 text-green-300" />
                            </div>
                            <p className="text-[13px] font-bold text-gray-700 leading-snug">
                                {advisory}
                            </p>
                        </div>
                        ))}
                    </div>
                </section>
            </div>

        </div>

      </main>

      <footer className="max-w-7xl mx-auto px-6 pt-10 border-t border-gray-50 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.4em] text-gray-300">
        <div>Integrated Command Centre Hub</div>
        <div className="flex gap-8">
            <span>Grid Status: Online</span>
            <span>Latency: 24ms</span>
        </div>
        <div>Forecast Mode 001</div>
      </footer>
    </div>
  );
}
