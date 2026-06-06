import { useState, useEffect } from 'react';
import { Zap, MapPin, Users } from 'lucide-react';

const StudentPortal = () => {
  const [votes, setVotes] = useState(1204);
  const [hasVoted, setHasVoted] = useState(false);
  const [animating, setAnimating] = useState(false);

  const handleVote = () => {
    if (hasVoted) return;
    
    setAnimating(true);
    setVotes(prev => prev + 1);
    setHasVoted(true);
    
    setTimeout(() => {
      setAnimating(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans selection:bg-emerald-200">
      
      {/* Mobile Device Container Mockup */}
      <div className="w-full max-w-md bg-white min-h-[80vh] rounded-[2.5rem] shadow-2xl border-8 border-slate-900 overflow-hidden relative flex flex-col">
        
        {/* Notch Area */}
        <div className="absolute top-0 inset-x-0 h-7 bg-slate-900 rounded-b-3xl w-1/2 mx-auto z-50"></div>

        {/* Content */}
        <div className="flex-1 p-8 flex flex-col">
          
          <div className="text-center mt-8 mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mb-4">
              <MapPin className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">CampusEV Intel</h2>
            <p className="text-slate-500 mt-2 text-sm">Where do you need the next EV charger?</p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            
            {/* The Big Button */}
            <button 
              onClick={handleVote}
              disabled={hasVoted}
              className={`
                relative group flex flex-col items-center justify-center w-64 h-64 rounded-full transition-all duration-300
                ${hasVoted ? 'bg-slate-100 border-2 border-slate-200 scale-95' : 'bg-emerald-500 hover:bg-emerald-600 active:scale-95 shadow-2xl shadow-emerald-500/30'}
                ${animating ? 'animate-ping duration-1000' : ''}
              `}
            >
              <Zap className={`w-16 h-16 mb-4 ${hasVoted ? 'text-slate-400' : 'text-white'}`} />
              <span className={`font-bold text-xl ${hasVoted ? 'text-slate-400' : 'text-white'}`}>
                {hasVoted ? 'Demand Logged' : 'Demand Charger'}
              </span>
              {!hasVoted && <span className="text-emerald-100 text-sm mt-1">at My Location</span>}
            </button>

          </div>

          <div className="mt-auto text-center pt-8 border-t border-slate-100">
            <div className="flex items-center justify-center gap-2 text-slate-600 mb-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="font-bold text-3xl text-slate-900 tracking-tight">{votes.toLocaleString()}</span>
            </div>
            <p className="text-sm font-medium text-slate-500">Students have voted on this campus</p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default StudentPortal;
