import { ArrowRight, Activity, Users, Cpu } from 'lucide-react';

const LandingPage = ({ onNavigate }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16 bg-background">
      <div className="max-w-5xl w-full text-center space-y-8">
        
        {/* Hero Section */}
        <div className="space-y-4 fade-in">
          <div className="inline-block px-4 py-1.5 rounded-full bg-slate-200/50 border border-slate-300 text-sm font-medium text-slate-700 tracking-wide mb-4">
            CAMPUSEV INTEL 1.0
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900">
            AI-Powered EV Infrastructure <br className="hidden md:block"/> Planning for Universities.
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light">
            Deploy smart charging networks with data-driven precision. We analyze your grid telemetry, student demand, and budget constraints to architect the optimal rollout.
          </p>
        </div>

        {/* CTA */}
        <div className="pt-8 pb-16 fade-in" style={{ animationDelay: '0.1s' }}>
          <button 
            onClick={onNavigate}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-xl font-medium text-lg overflow-hidden transition-all hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/20 hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Launch Campus Assessment</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 text-left fade-in" style={{ animationDelay: '0.2s' }}>
          
          <div className="bg-white/60 backdrop-blur-xl border border-slate-200/60 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 text-emerald-600">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-slate-900">Grid Safety IoT</h3>
            <p className="text-slate-600 leading-relaxed">
              Real-time transformer vitals tracking and voltage monitoring to ensure charging loads never exceed campus grid capacity safely.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-xl border border-slate-200/60 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-slate-900">Community Polling</h3>
            <p className="text-slate-600 leading-relaxed">
              Live geospatial demand mapping powered by interactive student voting to place chargers exactly where the community needs them.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-xl border border-slate-200/60 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 text-purple-600">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-slate-900">AI Procurement</h3>
            <p className="text-slate-600 leading-relaxed">
              Dynamically generated infrastructure recommendations and smart-split budget allocation tailored by AWS Bedrock insights.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default LandingPage;
