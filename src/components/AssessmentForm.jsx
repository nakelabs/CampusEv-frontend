import { useState } from 'react';
import { ChevronRight, Building2, Map, ShieldAlert } from 'lucide-react';
import { submitAssessment } from '../services/api';

const AssessmentForm = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    studentPopulation: '',
    totalBudget: '',
    gridAvailability: 12,
    networkStatus: 'Patchy',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await submitAssessment(formData);
    setIsSubmitting(false);
    onNavigate();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background relative overflow-hidden">
      
      <div className="w-full max-w-xl relative z-10">
        
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase">
            Campus <br/> Parameters.
          </h2>
          <p className="text-slate-600 mt-4 font-medium">Configure baseline metrics to generate the AI architecture report.</p>
        </div>

        <div className="bg-white border-2 border-slate-900 p-8 md:p-10 shadow-[8px_8px_0px_0px_#0f172a]">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Student Population */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Student Population
              </label>
              <input 
                type="number" 
                name="studentPopulation"
                required
                value={formData.studentPopulation}
                onChange={handleChange}
                placeholder="e.g. 25000"
                className="w-full px-4 py-3 bg-white border-2 border-slate-900 focus:outline-none focus:border-emerald-500 transition-colors font-medium placeholder:text-slate-400"
              />
            </div>

            {/* Total Budget */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <span className="font-semibold text-lg leading-none">₦</span>
                Total Budget Allocation
              </label>
              <input 
                type="number" 
                name="totalBudget"
                required
                value={formData.totalBudget}
                onChange={handleChange}
                placeholder="e.g. 50000000"
                className="w-full px-4 py-3 bg-white border-2 border-slate-900 focus:outline-none focus:border-emerald-500 transition-colors font-medium placeholder:text-slate-400"
              />
            </div>

            {/* Grid Availability Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  Daily Grid Availability
                </label>
                <span className="text-emerald-600 font-medium bg-emerald-50 border border-emerald-200 px-3 py-1 text-sm">
                  {formData.gridAvailability} Hours
                </span>
              </div>
              <input 
                type="range" 
                name="gridAvailability"
                min="0" 
                max="24" 
                value={formData.gridAvailability}
                onChange={handleChange}
                className="w-full h-2 bg-slate-900 appearance-none cursor-pointer accent-emerald-500 rounded-none"
              />
              <div className="flex justify-between text-xs font-medium text-slate-500 px-1">
                <span>0h</span>
                <span>12h</span>
                <span>24h</span>
              </div>
            </div>

            {/* Network Status Dropdown */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Map className="w-4 h-4" />
                IoT Network Status
              </label>
              <div className="relative">
                <select 
                  name="networkStatus"
                  value={formData.networkStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-900 focus:outline-none focus:border-emerald-500 transition-colors font-medium appearance-none text-slate-900 cursor-pointer"
                >
                  <option value="Excellent">Excellent Coverage</option>
                  <option value="Patchy">Patchy / Intermittent</option>
                  <option value="Dead Zone">Dead Zone</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-900 border-l-2 border-slate-900">
                  <ChevronRight className="w-5 h-5 rotate-90" />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 text-white font-bold text-sm px-7 py-4 border border-[#10b981] hover:bg-slate-800 tracking-widest uppercase transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ clipPath: 'polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px)' }}
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Compiling Report...</span>
                ) : (
                  <>
                    <span>Compile Report</span>
                    <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AssessmentForm;
