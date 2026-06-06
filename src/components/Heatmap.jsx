import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { ArrowLeft, MapPin, CheckCircle, Navigation } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { saveChargingStation } from '../services/api';

// Create a custom EV Station icon using a Leaflet DivIcon
const zapIconHtml = `
  <div style="color: #0f172a; display: flex; align-items: center; justify-content: center; filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.3));">
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 22h10" />
      <path d="M6 22V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v18" fill="white" />
      <path d="M14 9h4a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1" />
      <path d="M10 7L8 11h4l-2 4" stroke="#10b981" />
    </svg>
  </div>
`;

const customZapIcon = new L.divIcon({
  html: zapIconHtml,
  className: 'custom-zap-icon',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// User location marker
const userIconHtml = `
  <div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.4);"></div>
`;

const userIcon = new L.divIcon({
  html: userIconHtml,
  className: 'user-location-icon',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// Component to handle map clicks and fly-to logic
const MapController = ({ onMapClick, userLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (userLocation) {
      map.flyTo(userLocation, 16, { duration: 1.5 });
    }
  }, [userLocation, map]);

  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  
  return null;
};

const Heatmap = ({ onNavigate }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [stationMarker, setStationMarker] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [calculationResult, setCalculationResult] = useState(null);

  const defaultCenter = [6.5244, 3.3792]; // Lagos, fallback if geolocation is denied

  const requestLocation = () => {
    setLocationError(false);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.warn("Geolocation denied or failed:", error.message);
          setLocationError(true);
          // If it fails, fallback to default center immediately so user isn't stuck
          setUserLocation(defaultCenter); 
        },
        { timeout: 10000, maximumAge: 60000 } // Removed enableHighAccuracy which often fails on desktop
      );
    } else {
      setLocationError(true);
      setUserLocation(defaultCenter);
    }
  };

  useEffect(() => {
    requestLocation();
  }, []);

  const handleMapClick = (latlng) => {
    if (!success) {
      setStationMarker([latlng.lat, latlng.lng]);
    }
  };

  const handleSubmit = async () => {
    if (!stationMarker) return;
    setIsSubmitting(true);
    const result = await saveChargingStation(stationMarker[0], stationMarker[1]);
    setIsSubmitting(false);
    
    if (result && result.success) {
      setSuccess(true);
      setCalculationResult(result.data);
      
      // Auto-hide success after 5 seconds
      setTimeout(() => {
        setSuccess(false);
        setCalculationResult(null);
        setStationMarker(null);
      }, 5000);
    }
  };

  return (
    <div className="relative h-screen w-full bg-background flex flex-col font-sans">
      
      {/* Header Panel */}
      <div className="absolute top-6 left-6 z-[1000] flex gap-4">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center justify-center w-12 h-12 bg-white border-2 border-slate-900 rounded-lg shadow-[4px_4px_0px_0px_#0f172a] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0px_0px_#0f172a] transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-slate-900" />
        </button>
        <div className="bg-white px-6 py-3 border-2 border-slate-900 rounded-lg shadow-[4px_4px_0px_0px_#0f172a] flex items-center gap-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              EV Station Planning Map
            </span>
          </div>
          <div className="w-px h-6 bg-slate-200"></div>
          <button 
            onClick={requestLocation}
            title="Locate Me"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Navigation className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Find Me</span>
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 z-0 relative">
        {(!userLocation && !locationError) && (
          <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <Navigation className="w-10 h-10 text-emerald-500 animate-bounce mb-4" />
            <p className="text-slate-900 font-bold uppercase tracking-widest">Locating you...</p>
          </div>
        )}

        <MapContainer 
          center={userLocation || defaultCenter} 
          zoom={13} 
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <MapController onMapClick={handleMapClick} userLocation={userLocation} />
          
          {userLocation && <Marker position={userLocation} icon={userIcon} />}
          {stationMarker && <Marker position={stationMarker} icon={customZapIcon} />}
        </MapContainer>
      </div>

      {/* Instructional / Submit Overlay */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-[1000] w-full max-w-md px-4">
        {success ? (
          <div className="bg-white border-2 border-slate-900 px-6 py-5 rounded-xl shadow-[8px_8px_0px_0px_#0f172a] flex items-center gap-4 animate-[fadeIn_0.3s_ease-out]">
            <CheckCircle className="w-8 h-8 text-emerald-500 flex-shrink-0" />
            <div>
              <div className="font-black text-slate-900 uppercase">Station Recorded</div>
              {calculationResult ? (
                 <div className="text-sm font-bold text-slate-600 mt-1">
                   Est. Trenching Cost: <span className="text-red-600">₦{calculationResult.trenching_cost_ngn.toLocaleString()}</span>
                 </div>
              ) : (
                <div className="text-sm font-medium text-slate-600">Coordinates sent to central planning grid.</div>
              )}
            </div>
          </div>
        ) : stationMarker ? (
          <div className="bg-white border-2 border-slate-900 p-6 rounded-xl shadow-[8px_8px_0px_0px_#0f172a] animate-[fadeIn_0.3s_ease-out]">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-slate-900 uppercase tracking-tight">Confirm Location</span>
              <span className="text-xs font-mono bg-slate-100 px-2 py-1 border border-slate-200 text-slate-600 rounded">
                {stationMarker[0].toFixed(4)}, {stationMarker[1].toFixed(4)}
              </span>
            </div>
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 text-white font-bold text-sm px-6 py-3.5 border border-[#10b981] hover:bg-slate-800 tracking-widest uppercase transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ clipPath: 'polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)' }}
            >
              {isSubmitting ? "Transmitting..." : "Lock In Deployment Site"}
            </button>
            <p className="text-center text-xs font-medium text-slate-500 mt-3">Click anywhere else on the map to reposition.</p>
          </div>
        ) : (
          <div className="bg-white border-2 border-slate-900 px-6 py-5 rounded-xl shadow-[8px_8px_0px_0px_#0f172a] flex items-center gap-4 animate-[fadeIn_0.3s_ease-out]">
            <div className="w-10 h-10 bg-emerald-50 flex items-center justify-center border-2 border-emerald-200 flex-shrink-0">
              <MapPin className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="font-black text-slate-900 uppercase">Deployment Map</div>
              <div className="text-sm font-medium text-slate-600">Click anywhere on the map to place an EV charger.</div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Heatmap;
