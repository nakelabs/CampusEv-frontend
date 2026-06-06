import { useState, useEffect } from 'react';
import { MapPin, ThumbsUp, ThumbsDown, CheckCircle } from 'lucide-react';
import { submitStudentDemand } from '../services/api';

const StudentPortal = ({ params }) => {
  const stationName = params?.name || 'Proposed EV Station';
  const location = params?.location || 'Campus Center';
  
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voteChoice, setVoteChoice] = useState(null);

  const handleVote = async (support) => {
    if (hasVoted) return;
    setIsSubmitting(true);
    setVoteChoice(support ? 'yes' : 'no');
    
    // Call the API endpoint
    await submitStudentDemand({ name: stationName, location, support });
    
    setIsSubmitting(false);
    setHasVoted(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 font-sans selection:bg-emerald-200">
      
      {/* Mobile Device Container Mockup */}
      <div className="w-full max-w-sm bg-white min-h-[700px] rounded-[3rem] shadow-2xl border-8 border-slate-900 overflow-hidden relative flex flex-col">
        
        {/* Notch Area */}
        <div className="absolute top-0 inset-x-0 h-7 bg-slate-900 rounded-b-3xl w-1/2 mx-auto z-50"></div>

        {/* Header Image Area */}
        <div className="h-48 bg-slate-100 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-transparent to-transparent"></div>
          <MapPin className="w-16 h-16 text-slate-300" />
        </div>

        {/* Content */}
        <div className="flex-1 p-8 flex flex-col bg-white rounded-t-3xl -mt-8 relative z-10 shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
          
          {hasVoted ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center animate-[fadeIn_0.5s_ease-out]">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border-2 border-emerald-200">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">Vote Recorded</h2>
              <p className="text-slate-600 font-medium">Thank you! Your feedback on the <span className="font-bold text-slate-900">{stationName}</span> deployment has been logged.</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-widest rounded-full mb-6">
                  Student Polling
                </div>
                <h2 className="text-2xl font-black text-slate-900 uppercase leading-tight tracking-tight mb-3">
                  {stationName}
                </h2>
                <p className="text-slate-500 text-sm font-medium flex items-center justify-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {location}
                </p>
              </div>

              <div className="flex-1 flex flex-col justify-center gap-6">
                <p className="text-center text-slate-900 font-bold mb-2">Do you support deploying an EV charging station here?</p>
                
                <button 
                  onClick={() => handleVote(true)}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-between bg-emerald-50 border-2 border-emerald-500 p-5 shadow-[4px_4px_0px_0px_#10b981] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#10b981] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <span className="font-black text-emerald-900 uppercase tracking-widest text-lg">Yes</span>
                  <div className="w-10 h-10 bg-emerald-500 text-white flex items-center justify-center rounded-full group-hover:scale-110 transition-transform">
                    <ThumbsUp className="w-5 h-5" />
                  </div>
                </button>

                <button 
                  onClick={() => handleVote(false)}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-between bg-white border-2 border-slate-900 p-5 shadow-[4px_4px_0px_0px_#0f172a] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#0f172a] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <span className="font-black text-slate-900 uppercase tracking-widest text-lg">No</span>
                  <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center rounded-full group-hover:scale-110 transition-transform">
                    <ThumbsDown className="w-5 h-5" />
                  </div>
                </button>

                {isSubmitting && <p className="text-center text-sm font-bold text-slate-500 animate-pulse mt-2">Transmitting vote...</p>}
              </div>
            </>
          )}

        </div>
      </div>

    </div>
  );
};

export default StudentPortal;
