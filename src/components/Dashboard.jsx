import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, MessageSquare, Zap, Cpu, Map as MapIcon, Smartphone, LogOut, ChevronRight, QrCode, ThumbsUp, ThumbsDown } from 'lucide-react';
import { fetchDashboardMetrics, sendCopilotMessage, fetchPollVotes } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = ({ onNavigate }) => {
  const { logout } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [pollData, setPollData] = useState(null);
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

    // Fetch and poll live active campaign votes
    const fetchLiveVotes = async () => {
      const activePollId = localStorage.getItem('activePollId');
      if (activePollId) {
        const result = await fetchPollVotes(activePollId);
        if (result) setPollData(result);
      }
    };
    fetchLiveVotes();
    const voteInterval = setInterval(fetchLiveVotes, 5000);
    return () => clearInterval(voteInterval);
  }, []);

  useEffect(() => {
    if (metrics && metrics.telemetry) {
      setVoltage(metrics.telemetry.voltage);
    }
  }, [metrics]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInput('');

    const response = await sendCopilotMessage(userMsg);
    setChatMessages(prev => [...prev, { role: 'assistant', content: response.reply }]);
  };

  const handleLogout = async () => {
    await logout();
    onNavigate('login');
  };

  if (!metrics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-emerald-500">
        <Activity className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-slate-900 p-6 lg:p-10 font-sans selection:bg-slate-200 selection:text-slate-900">

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Zap className="text-slate-900 w-8 h-8" />
            CampusEV Intel
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Dashboard Overview</p>
          {metrics.schoolName && (
            <p className="text-emerald-700 font-bold text-base mt-2 bg-emerald-50 inline-block px-3 py-1 rounded-md">
              Welcome to {metrics.schoolName}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate('campaign')}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-lg shadow-md transition-all"
          >
            <QrCode className="w-4 h-4" /> New Campaign
          </button>
          <button
            onClick={() => onNavigate('heatmap')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm text-sm font-bold text-slate-700 rounded-lg transition-all"
          >
            <MapIcon className="w-4 h-4" /> Geospatial Tool
          </button>
          <button
            onClick={() => onNavigate('student-portal')}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold rounded-lg transition-all"
          >
            <Smartphone className="w-4 h-4" /> Mobile Portal
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Left Column */}
        <div className="space-y-8">

          {/* Readiness Score */}
          <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm flex flex-col items-center justify-center relative overflow-hidden transition-colors">
            <h3 className="text-xs font-black text-slate-400 mb-8 uppercase tracking-widest w-full text-left">EV Readiness Score</h3>
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg viewBox="0 0 160 160" className="absolute inset-0 w-full h-full transform -rotate-90 drop-shadow-sm">
                <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="12" className="text-slate-100" />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray="440"
                  strokeDashoffset={440 - (440 * metrics.readinessScore) / 100}
                  className="text-slate-900 transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="flex flex-col items-center justify-center z-10 mt-2">
                <span className="text-6xl font-black text-slate-900 leading-none">{metrics.readinessScore}%</span>
              </div>
            </div>
            <p className="text-center text-sm font-medium text-slate-500 mt-6">Based on grid capacity and student demand</p>
          </div>

          {/* Student Votes & Telemetry Grid */}
          <div className="grid grid-cols-2 gap-4">

            {/* Student Votes / Active Campaign */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm transition-colors">
              {pollData ? (
                <>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 truncate" title={pollData.poll_id}>
                    Live Poll: {pollData.poll_id}
                  </h3>
                  <div className="flex items-end gap-3 mb-4">
                    <div className="text-4xl font-black text-slate-900 leading-none">{pollData.total_votes}</div>
                    <div className="text-sm font-medium text-slate-500 mb-1">Total Votes</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100">
                    <div className="bg-slate-100 rounded-xl p-3 flex items-center justify-between border border-slate-200">
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="w-4 h-4 text-slate-700" />
                        <span className="text-xs font-bold text-slate-800">YES</span>
                      </div>
                      <span className="font-black text-slate-900">{pollData.yes_votes}</span>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between border border-slate-200">
                      <div className="flex items-center gap-2">
                        <ThumbsDown className="w-4 h-4 text-slate-600" />
                        <span className="text-xs font-bold text-slate-700">NO</span>
                      </div>
                      <span className="font-black text-slate-700">{pollData.no_votes}</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Campus Aggregate Demand</h3>
                  <div className="flex items-end gap-3">
                    <div className="text-4xl font-black text-slate-900 leading-none">{metrics.votes.toLocaleString()}</div>
                    <div className="text-sm font-medium text-slate-500 mb-1">Total Votes</div>
                  </div>
                  <div className="mt-4 w-10 h-10 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                </>
              )}
            </div>

            {/* Telemetry */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm transition-colors">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-tight">Grid<br />Telemetry</h3>
                <span className="relative flex h-3 w-3 mt-1">
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-slate-800"></span>
                </span>
              </div>
              <div className="text-3xl font-black text-slate-900 leading-none">{voltage} <span className="text-lg text-slate-500">V</span></div>
              <div className="text-xs font-medium text-slate-400 mt-2 uppercase">Node-A Transformer</div>
            </div>

          </div>
        </div>

        {/* Center & Right Column */}
        <div className="xl:col-span-2 space-y-8">

          {/* Smart-Split Allocation */}
          <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Smart-Split Budget Allocation</h3>
              <div className="text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                Total Budget: ₦{metrics.budgetAllocation.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()}
              </div>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.budgetAllocation} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }} width={120} />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#0f172a', fontWeight: 700 }}
                    formatter={(value) => [`₦${value.toLocaleString()}`, 'Allocation']}
                  />
                  <Bar
                    dataKey="value"
                    fill="#0f172a"
                    radius={[0, 6, 6, 0]}
                    barSize={24}
                    background={{ fill: '#f1f5f9', radius: [0, 6, 6, 0] }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm relative overflow-hidden">
            <h3 className="text-xs font-black text-slate-400 mb-6 uppercase tracking-widest flex items-center gap-2">
              Summary
            </h3>
            <div className="space-y-5 text-slate-700 font-medium leading-relaxed relative z-10 max-w-3xl">
              {metrics.bedrockAnalysis.split('\n\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Floating Copilot */}
      <div className={`fixed bottom-6 right-6 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl transition-transform duration-300 origin-bottom-right z-50 ${chatOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <div className="w-8 h-8 bg-slate-200 text-slate-700 rounded-full flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            Assistant
          </div>
          <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-slate-900 bg-white border border-slate-200 w-8 h-8 rounded-full flex items-center justify-center transition-colors">&times;</button>
        </div>

        <div className="h-80 p-5 overflow-y-auto space-y-4 flex flex-col bg-white">
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`max-w-[85%] p-3.5 rounded-2xl text-sm font-medium leading-relaxed ${msg.role === 'user'
              ? 'bg-slate-800 text-white self-end rounded-tr-sm'
              : 'bg-slate-100 text-slate-800 self-start rounded-tl-sm'
              }`}>
              {msg.content}
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white rounded-b-2xl">
          <div className="relative">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask a question..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-shadow pr-12"
            />
            <button type="submit" disabled={!chatInput.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-lg flex items-center justify-center transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Chat Toggle Button */}
      <button
        onClick={() => setChatOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-xl flex items-center justify-center transition-all z-40 ${chatOpen ? 'scale-0' : 'scale-100 hover:scale-110'}`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

    </div>
  );
};

export default Dashboard;
