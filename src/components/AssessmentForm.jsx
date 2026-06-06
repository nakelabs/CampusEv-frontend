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
      
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-emerald-100/40 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-100/40 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-xl relative z-10">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Campus Parameters</h2>
          <p className="text-slate-500 mt-2">Configure baseline metrics to generate the AI architecture report.</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 p-8 md:p-10 rounded-3xl shadow-xl shadow-slate-200/50">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Student Population */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400" />
                Student Population
              </label>
              <input 
                type="number" 
                name="studentPopulation"
                required
                value={formData.studentPopulation}
                onChange={handleChange}
                placeholder="e.g. 25000"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Total Budget */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <span className="text-slate-400 font-bold">₦</span>
                Total Budget Allocation
              </label>
              <input 
                type="number" 
                name="totalBudget"
                required
                value={formData.totalBudget}
                onChange={handleChange}
                placeholder="e.g. 50000000"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Grid Availability Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-slate-400" />
                  Daily Grid Availability
                </label>
                <span className="text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg text-sm">
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
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-xs font-medium text-slate-400 px-1">
                <span>0h</span>
                <span>12h</span>
                <span>24h</span>
              </div>
            </div>

            {/* Network Status Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Map className="w-4 h-4 text-slate-400" />
                IoT Network Status
              </label>
              <div className="relative">
                <select 
                  name="networkStatus"
                  value={formData.networkStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all appearance-none text-slate-700"
                >
                  <option value="Excellent">Excellent Coverage</option>
                  <option value="Patchy">Patchy / Intermittent</option>
                  <option value="Dead Zone">Dead Zone</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full group relative flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-xl font-medium text-lg overflow-hidden transition-all hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/20 active:scale-[0.98] disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Compiling Report...</span>
                ) : (
                  <>
                    <span>Compile Intelligence Report</span>
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
