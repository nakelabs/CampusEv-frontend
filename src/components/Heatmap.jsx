import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import { ArrowLeft, Zap, Target } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default leaflet icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const transformerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const chargerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

const Heatmap = ({ onNavigate }) => {
  const [sourceMarker, setSourceMarker] = useState(null);
  const [chargerMarker, setChargerMarker] = useState(null);

  const defaultCenter = [6.5244, 3.3792]; // Lagos

  const handleMapClick = (latlng) => {
    if (!sourceMarker) {
      setSourceMarker(latlng);
    } else if (!chargerMarker) {
      setChargerMarker(latlng);
    } else {
      // Reset logic if both exist and user clicks again
      setSourceMarker(latlng);
      setChargerMarker(null);
    }
  };

  const polylineCoords = (sourceMarker && chargerMarker) 
    ? [[sourceMarker.lat, sourceMarker.lng], [chargerMarker.lat, chargerMarker.lng]]
    : null;

  return (
    <div className="relative h-screen w-full bg-slate-100 flex flex-col font-sans">
      
      {/* Header Panel */}
      <div className="absolute top-6 left-6 z-[1000] flex gap-4">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-lg hover:bg-slate-50 transition-colors border border-slate-200"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <div className="bg-white px-6 py-3 rounded-xl shadow-lg border border-slate-200 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm font-medium text-slate-700">Transformer Source (Click 1)</span>
          </div>
          <div className="w-px h-4 bg-slate-200"></div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-sm font-medium text-slate-700">Proposed Charger (Click 2)</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 z-0">
        <MapContainer center={defaultCenter} zoom={14} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <MapClickHandler onMapClick={handleMapClick} />
          
          {sourceMarker && <Marker position={sourceMarker} icon={transformerIcon} />}
          {chargerMarker && <Marker position={chargerMarker} icon={chargerIcon} />}
          {polylineCoords && <Polyline positions={polylineCoords} color="#3b82f6" weight={3} dashArray="5, 10" />}
        </MapContainer>
      </div>

      {/* Overlay Panel when both markers are placed */}
      {sourceMarker && chargerMarker && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-[1000] bg-slate-900 text-white px-8 py-5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-8 animate-in slide-in-from-bottom-8 fade-in duration-300">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-blue-400" />
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Estimated Distance</div>
              <div className="font-semibold text-lg">142 meters</div>
            </div>
          </div>
          <div className="w-px h-10 bg-slate-700"></div>
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-amber-400" />
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Projected Cabling Cost</div>
              <div className="font-semibold text-lg text-amber-400">₦2,130,000</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Heatmap;
