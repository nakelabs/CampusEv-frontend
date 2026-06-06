import { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { ArrowLeft, QrCode, Building2, MapPin, Download } from 'lucide-react';

const CampaignGenerator = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    stationName: '',
    location: ''
  });
  const [generatedCampaign, setGeneratedCampaign] = useState(null);
  const qrRef = useRef();

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!formData.stationName.trim() || !formData.location.trim()) return;

    // Create the deep-link URL that points to the student-portal view
    const origin = window.location.origin;
    const pollingUrl = `${origin}/?view=student-portal&name=${encodeURIComponent(formData.stationName)}&location=${encodeURIComponent(formData.location)}`;
    
    // Save to localStorage so Dashboard can fetch live votes for this poll
    localStorage.setItem('activePollId', formData.stationName);

    setGeneratedCampaign({
      ...formData,
      url: pollingUrl
    });
  };

  const handleDownload = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;
    
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `EV-Campaign-${generatedCampaign.stationName.replace(/\s+/g, '-')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      
      {/* Header Panel */}
      <div className="absolute top-6 left-6 z-10 flex gap-4">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center justify-center w-12 h-12 bg-white border-2 border-slate-900 rounded-lg shadow-[4px_4px_0px_0px_#0f172a] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0px_0px_#0f172a] transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-slate-900" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 pt-24 z-0">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Form Side */}
          <div className="bg-white border-2 border-slate-900 p-8 md:p-10 shadow-[8px_8px_0px_0px_#0f172a] relative">
            <div className="mb-10">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">
                Campaign<br/>Generator.
              </h2>
              <p className="text-slate-600 mt-3 font-medium">Create a location-specific polling portal for student voting.</p>
            </div>

            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Proposed Station Name
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.stationName}
                  onChange={(e) => setFormData({...formData, stationName: e.target.value})}
                  placeholder="e.g. Node A Fast Chargers"
                  className="w-full px-4 py-3 bg-white border-2 border-slate-900 focus:outline-none focus:border-emerald-500 transition-colors font-medium placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Physical Location
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="e.g. Main Library Parking"
                  className="w-full px-4 py-3 bg-white border-2 border-slate-900 focus:outline-none focus:border-emerald-500 transition-colors font-medium placeholder:text-slate-400"
                />
              </div>

              <div className="pt-6">
                <button 
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 text-white font-bold text-sm px-6 py-4 border border-emerald-500 hover:bg-slate-800 tracking-widest uppercase transition-all"
                  style={{ clipPath: 'polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px)' }}
                >
                  <QrCode className="w-5 h-5" />
                  <span>Generate QR Code</span>
                </button>
              </div>
            </form>
          </div>

          {/* QR Code Result Side */}
          <div className="h-full">
            {generatedCampaign ? (
              <div className="bg-white border-2 border-slate-900 p-8 md:p-10 shadow-[8px_8px_0px_0px_#10b981] h-full flex flex-col items-center justify-center animate-[fadeIn_0.5s_ease-out]">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-2 text-center">Scan to Vote</h3>
                <p className="text-slate-500 font-medium mb-8 text-center">{generatedCampaign.stationName} • {generatedCampaign.location}</p>
                
                <div ref={qrRef} className="bg-white p-6 border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] mb-8">
                  <QRCodeCanvas 
                    value={generatedCampaign.url}
                    size={240}
                    level="H"
                    fgColor="#0f172a"
                    bgColor="#ffffff"
                    imageSettings={{
                      src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMTBiOTgxIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBvbHlnb24gcG9pbnRzPSIxMyAyIDMgMTQgMTIgMTQgMTEgMjIgMjEgMTAgMTIgMTAgMTMgMiI+PC9wb2x5Z29uPjwvc3ZnPg==",
                      x: undefined,
                      y: undefined,
                      height: 40,
                      width: 40,
                      excavate: true,
                    }}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <button 
                    onClick={handleDownload}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 font-bold px-4 py-3 border-2 border-emerald-600 hover:bg-emerald-100 transition-colors uppercase text-sm"
                  >
                    <Download className="w-4 h-4" /> Download Poster
                  </button>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(generatedCampaign.url);
                      alert("Direct link copied to clipboard!");
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-50 text-slate-700 font-bold px-4 py-3 border-2 border-slate-300 hover:bg-slate-100 transition-colors uppercase text-sm"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-300 rounded-xl h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                <QrCode className="w-16 h-16 mb-4 opacity-50" />
                <p className="font-medium">Fill out the campaign details to generate the QR code.</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default CampaignGenerator;
