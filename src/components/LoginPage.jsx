import { useState } from 'react';
import { Zap, Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchCampusProfile } from '../services/api';

const LoginPage = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const { isSignedIn, nextStep } = await login(email, password);
      if (isSignedIn) {
        try {
          const profile = await fetchCampusProfile();
          if (profile && profile.results && profile.results.readiness_score != null) {
            // Re-hydrate localStorage for Dashboard compatibility
            const dashboardData = {
              final_score: profile.results.readiness_score,
              split_budget: profile.results.split_budget_data,
              school_name: profile.school_name || profile.results?.school_name
            };
            localStorage.setItem('assessmentResult', JSON.stringify(dashboardData));
            onNavigate('dashboard');
          } else {
            onNavigate('assess');
          }
        } catch (e) {
          onNavigate('assess');
        }
      } else if (nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
        setError('Please verify your email first. Check your inbox for the confirmation code.');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">

      {/* Left Side (Blank/Decorative) */}
      <div className="hidden lg:block w-1/2 bg-[#f8fafc] relative overflow-hidden border-r border-slate-200">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-slate-200/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-slate-100/50 rounded-full blur-3xl pointer-events-none" />

      </div>

      {/* Right Side (Form) */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 py-12 relative bg-white">

        {/* Subtle background decoration for the form side */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-slate-50 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
            <p className="text-slate-500 mt-2 text-sm">Sign in to your CampusEV Intel account</p>
          </div>

          {/* Form Container */}
          <div className="w-full">

            {/* Error */}
            {error && (
              <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@university.edu"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-xl font-medium text-sm transition-all hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="animate-pulse">Authenticating...</span>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>

          {/* Footer Link */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <button onClick={() => onNavigate('register')} className="font-semibold text-slate-900 hover:underline underline-offset-2 transition-all">
              Create account
            </button>
          </p>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
