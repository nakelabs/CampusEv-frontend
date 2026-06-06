import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, MessageSquare, Zap, Cpu, Map as MapIcon, Smartphone } from 'lucide-react';
import { fetchDashboardMetrics, sendCopilotMessage } from '../services/api';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];

const Dashboard = ({ onNavigate }) => {
  const [metrics, setMetrics] = useState(null);
  const [voltage, setVoltage] = useState(218);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your Procurement Copilot. How can I help you scale this infrastructure?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchDashboardMetrics();
      setMetrics(data);
    };
    loadData();
  }, []);

  useEffect(() => {
    // Simulate live voltage fluctuation
    const interval = setInterval(() => {
      setVoltage(prev => {
        const fluctuation = (Math.random() - 0.5) * 4;
        return Number((218 + fluctuation).toFixed(1));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInput('');

    const response = await sendCopilotMessage(userMsg);
    setChatMessages(prev => [...prev, { role: 'assistant', content: response.reply }]);
  };

  if (!metrics) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-emerald-500">
        <Activity className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 p-6 font-sans selection:bg-emerald-900 selection:text-emerald-100">
      
      {/* Header */}
      <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Zap className="text-emerald-500" />
            CampusEV Intelligence
          </h1>
          <p className="text-slate-500 text-sm mt-1">AWS Bedrock Executive Overview</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => onNavigate('heatmap')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-sm rounded-lg transition-colors text-white"
          >
            <MapIcon className="w-4 h-4" /> Geospatial Tool
          </button>
          <button 
            onClick={() => onNavigate('student-portal')}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600/10 border border-emerald-500/20 hover:bg-emerald-600/20 text-emerald-500 text-sm rounded-lg transition-colors"
          >
            <Smartphone className="w-4 h-4" /> Mobile Portal View
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="space-y-6">
          {/* Readiness Score */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Activity className="w-24 h-24" />
            </div>
            <h3 className="text-sm font-semibold text-slate-400 mb-6 uppercase tracking-wider">EV Readiness Score</h3>
            <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-8 border-slate-800">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-800" />
                <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="351" strokeDashoffset={351 - (351 * metrics.readinessScore) / 100} className="text-emerald-500 transition-all duration-1000" />
              </svg>
              <span className="text-4xl font-bold text-white z-10">{metrics.readinessScore}%</span>
            </div>
          </div>

          {/* Student Votes */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 border border-blue-500/20">
              <MessageSquare className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Live Student Demand</h3>
              <div className="text-3xl font-bold text-white mt-1">{metrics.votes.toLocaleString()} <span className="text-lg text-slate-500 font-normal">Votes</span></div>
            </div>
          </div>

          {/* Telemetry */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Live Grid Telemetry</h3>
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-mono text-emerald-500 uppercase">Live</span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-slate-500 font-mono mb-1">NODE-A / TRANSFORMER VOLTAGE</div>
                <div className="text-4xl font-mono text-emerald-400 font-bold tracking-tight">
                  {voltage} <span className="text-lg text-emerald-600">V</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center & Right Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Smart-Split Allocation */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-sm font-semibold text-slate-400 mb-6 uppercase tracking-wider">Smart-Split Budget Allocation</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.budgetAllocation} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} width={100} />
                  <Tooltip 
                    cursor={{ fill: '#1e293b' }} 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {metrics.budgetAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative">
            <div className="absolute top-6 right-6">
              <Cpu className="w-6 h-6 text-purple-500/50" />
            </div>
            <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider flex items-center gap-2">
              Amazon Bedrock Executive Analysis
            </h3>
            <div className="space-y-4 text-slate-300 leading-relaxed text-sm">
              {metrics.bedrockAnalysis.split('\n\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Floating Copilot */}
      <div className={`fixed bottom-6 right-6 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl transition-transform duration-300 origin-bottom-right ${chatOpen ? 'scale-100' : 'scale-0'}`}>
        <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-800/50 rounded-t-2xl">
          <div className="flex items-center gap-2 font-medium text-white">
            <Cpu className="w-4 h-4 text-purple-400" />
            Procurement Copilot
          </div>
          <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-white">&times;</button>
        </div>
        <div className="h-64 p-4 overflow-y-auto space-y-4 flex flex-col">
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`max-w-[85%] p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-emerald-600/20 text-emerald-100 self-end rounded-tr-sm border border-emerald-500/20' : 'bg-slate-800 text-slate-300 self-start rounded-tl-sm border border-slate-700'}`}>
              {msg.content}
            </div>
          ))}
        </div>
        <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-900 rounded-b-2xl">
          <input 
            type="text" 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask Copilot..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
          />
        </form>
      </div>

      {/* Chat Toggle Button */}
      {!chatOpen && (
        <button 
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-purple-600 hover:bg-purple-500 text-white rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-110"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

    </div>
  );
};

export default Dashboard;
