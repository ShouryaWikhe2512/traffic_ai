"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, ZoomControl, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ForecastDecision } from "@/types/forecastDecision";
import { Activity, MapPin, Zap, Info, Train } from "lucide-react";

// Fix for Leaflet marker icons
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

interface OSMElement {
  type: 'node' | 'way';
  id: number;
  lat?: number;
  lon?: number;
  nodes?: number[];
  tags?: Record<string, string>;
}

function MapEffects({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    map.setView(center, 14, { animate: true });
  }, [map, center]);
  return null;
}

interface Props {
  data: ForecastDecision;
  visibleLayers: {
    motorway: boolean;
    primary: boolean;
    secondary: boolean;
    signals: boolean;
    junctions: boolean;
  };
  onStatsUpdate?: (stats: { routes: number; signals: number; junctions: number }) => void;
}

export default function ForecastMap({ data, visibleLayers, onStatsUpdate }: Props) {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [osmData, setOsmData] = useState<{
    motorway: any[];
    primary: any[];
    secondary: any[];
    signals: any[];
    junctions: any[];
  }>({ motorway: [], primary: [], secondary: [], signals: [], junctions: [] });

  const center: [number, number] = useMemo(() => [
    data.location?.latitude || 18.5204,
    data.location?.longitude || 73.8567
  ], [data.location]);

  const getBBox = (lat: number, lon: number) => {
    const offset = 0.025; 
    return `${lat - offset},${lon - offset},${lat + offset},${lon + offset}`;
  };

  const fetchOSMData = useCallback(async () => {
    try {
      setLoading(true);
      const bbox = getBBox(center[0], center[1]);
      const query = `
        [out:json][timeout:60];
        (
          way["highway"~"^(motorway|motorway_link|trunk|trunk_link)$"](${bbox});
          way["highway"~"^(primary|primary_link)$"](${bbox});
          way["highway"~"^(secondary|secondary_link)$"](${bbox});
          node["highway"="traffic_signals"](${bbox});
          node["highway"~"^(motorway_junction|turning_circle|mini_roundabout|roundabout)$"](${bbox});
          node["junction"](${bbox});
        );
        out body;
        >;
        out skel qt;
      `.trim();

      const response = await fetch(OVERPASS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'data=' + encodeURIComponent(query)
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const osmResult = await response.json();
      
      const nodeMap: Record<number, { lat: number, lon: number }> = {};
      osmResult.elements.forEach((el: OSMElement) => {
        if (el.type === 'node' && el.lat && el.lon) nodeMap[el.id] = { lat: el.lat, lon: el.lon };
      });

      const categorized = {
        motorway: [] as any[],
        primary: [] as any[],
        secondary: [] as any[],
        signals: [] as any[],
        junctions: [] as any[]
      };

      osmResult.elements.forEach((el: OSMElement) => {
        if (el.type === 'way' && el.tags?.highway) {
          const hw = el.tags.highway;
          const coords = (el.nodes || [])
            .map(nid => nodeMap[nid])
            .filter(Boolean)
            .map(n => [n.lat, n.lon] as [number, number]);

          if (coords.length < 2) return;

          const item = { id: el.id, coords, tags: el.tags, type: hw };
          if (hw.startsWith('motorway') || hw.startsWith('trunk')) categorized.motorway.push(item);
          else if (hw.startsWith('primary')) categorized.primary.push(item);
          else categorized.secondary.push(item);
        } else if (el.type === 'node' && el.tags) {
          if (el.tags.highway === 'traffic_signals') {
            categorized.signals.push({ id: el.id, lat: el.lat, lon: el.lon, tags: el.tags });
          } else if (el.tags.highway || el.tags.junction) {
            categorized.junctions.push({ id: el.id, lat: el.lat, lon: el.lon, tags: el.tags });
          }
        }
      });

      setOsmData(categorized);
      onStatsUpdate?.({
        routes: categorized.motorway.length + categorized.primary.length + categorized.secondary.length,
        signals: categorized.signals.length,
        junctions: categorized.junctions.length
      });
      setLoading(false);
    } catch (err) {
      console.error("OSM Fetch Error:", err);
      setLoading(false);
    }
  }, [center, onStatsUpdate]);

  useEffect(() => {
    setIsMounted(true);
    fetchOSMData();
  }, [fetchOSMData]);

  const roadStyles = {
    motorway: { color: '#dc2626', weight: 4, opacity: 0.8 },
    primary: { color: '#f97316', weight: 3, opacity: 0.8 },
    secondary: { color: '#3b82f6', weight: 2, opacity: 0.7 }
  };

  const getSignalIcon = (tags: any) => {
    return L.divIcon({
      className: '',
      html: `<div style="width:10px;height:10px;border-radius:50%;background:#ef4444;border:2px solid #ffffff;box-shadow: 0 2px 4px rgba(0,0,0,0.15);"></div>`,
      iconSize: [10, 10],
      iconAnchor: [5, 5]
    });
  };

  const getJunctionIcon = () => L.divIcon({
    className: '',
    html: `<div style="width:12px;height:12px;background:#a855f7;border:2px solid #ffffff;border-radius:2px;transform:rotate(45deg);box-shadow: 0 2px 4px rgba(0,0,0,0.15);"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });

  if (!isMounted) return <div className="h-full w-full bg-gray-50 flex items-center justify-center text-gray-400 font-black uppercase tracking-[0.3em]">Initializing Map...</div>;

  return (
    <div className="h-full w-full relative">
      <MapContainer 
        center={center} 
        zoom={14} 
        className="h-full w-full"
        zoomControl={false}
      >
        <MapEffects center={center} />
        <ZoomControl position="bottomright" />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* ROAD LAYERS */}
        {visibleLayers.motorway && osmData.motorway.map(way => (
          <Polyline key={way.id} positions={way.coords} pathOptions={roadStyles.motorway}>
            <Popup>
              <div className="text-gray-900 text-[10px] font-bold">{way.tags.name || way.type}</div>
            </Popup>
          </Polyline>
        ))}
        {visibleLayers.primary && osmData.primary.map(way => (
          <Polyline key={way.id} positions={way.coords} pathOptions={roadStyles.primary}>
            <Popup>
               <div className="text-gray-900 text-[10px] font-bold">{way.tags.name || way.type}</div>
            </Popup>
          </Polyline>
        ))}
        {visibleLayers.secondary && osmData.secondary.map(way => (
          <Polyline key={way.id} positions={way.coords} pathOptions={roadStyles.secondary}>
             <Popup>
               <div className="text-gray-900 text-[10px] font-bold">{way.tags.name || way.type}</div>
            </Popup>
          </Polyline>
        ))}

        {/* INFRASTRUCTURE MARKERS */}
        {visibleLayers.signals && osmData.signals.map(node => (
          <Marker key={node.id} position={[node.lat, node.lon]} icon={getSignalIcon(node.tags)}>
            <Popup>
              <div className="p-1">
                <div className="font-bold text-gray-900 mb-1">{node.tags.name || 'Traffic Signal'}</div>
                <div className="text-[9px] text-gray-400">Status: Real-time Optimized</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {visibleLayers.junctions && osmData.junctions.map(node => (
          <Marker key={node.id} position={[node.lat, node.lon]} icon={getJunctionIcon()}>
             <Popup>
              <div className="p-1">
                <div className="font-bold text-gray-900 mb-1">{node.tags.name || 'Major Junction'}</div>
                <div className="text-[9px] text-purple-600 font-bold">Optimization Hub</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Primary Location / Congestion Zone */}
        {data.map_visualization_flags.highlight_congestion && (
          <Circle
            center={center}
            radius={400}
            pathOptions={{
              fillColor: '#ef4444',
              fillOpacity: 0.2,
              color: '#ef4444',
              weight: 2
            }}
          />
        )}

        {/* Venue Marker */}
        <Marker position={center} icon={L.divIcon({
          className: '',
          html: `<div style="background:#f97316; width:12px; height:12px; border-radius:50%; border:3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1);"></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6]
        })}>
          <Popup>
            <div className="p-1">
               <div className="text-orange-600 font-black text-xs uppercase tracking-widest">Forecast Focus</div>
               <div className="text-gray-900 font-bold text-[10px] mt-1">University Road Area</div>
            </div>
          </Popup>
        </Marker>

      </MapContainer>

      {loading && (
        <div className="absolute inset-0 z-[2000] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-6">
          <div className="w-10 h-10 border-2 border-gray-100 border-t-orange-400 rounded-full animate-spin" />
          <div className="text-center">
            <p className="text-gray-900 text-[10px] font-black uppercase tracking-[0.3em]">Querying Network Data</p>
            <p className="text-gray-400 text-[9px] mt-2 font-bold uppercase tracking-widest">Connecting to Overpass @ Pune</p>
          </div>
        </div>
      )}

      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          background: white !important;
          border: 1px solid rgba(0,0,0,0.05) !important;
          border-radius: 4px !important;
          color: #333 !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
        }
        .leaflet-popup-tip { background: white !important; }
        .leaflet-container { background: #f8fafc !important; }
        .leaflet-control-zoom a {
          background: white !important;
          color: #666 !important;
          border: 1px solid rgba(0,0,0,0.1) !important;
        }
        .leaflet-control-zoom a:hover { background: #f8fafc !important; color: #000 !important; }
      `}</style>
    </div>
  );
}
