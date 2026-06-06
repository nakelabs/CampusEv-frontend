import { useState } from 'react';
import { Zap, Mail, Lock, User, ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ---- Step 1: Registration Form ----
const RegisterForm = ({ onSuccess }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({ schoolName: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    setIsLoading(true);
    try {
      await register(formData.email, formData.password, formData.schoolName);
      onSuccess(formData.email); // Pass email to OTP step
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700">School Name</label>
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text" name="schoolName" required
            value={formData.schoolName} onChange={handleChange}
            placeholder="Enter your university name"
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="email" name="email" required
            value={formData.email} onChange={handleChange}
            placeholder="you@university.edu"
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700">Password</label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type={showPassword ? 'text' : 'password'} name="password" required
            value={formData.password} onChange={handleChange}
            placeholder="Min. 8 characters"
            className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700">Confirm Password</label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type={showPassword ? 'text' : 'password'} name="confirmPassword" required
            value={formData.confirmPassword} onChange={handleChange}
            placeholder="Repeat password"
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit" disabled={isLoading}
          className="group w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-xl font-medium text-sm transition-all hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? <span className="animate-pulse">Creating account...</span> : (
            <><span>Create Account</span><ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></>
          )}
        </button>
      </div>
    </form>
  );
};

// ---- Step 2: OTP Confirmation Form ----
const OtpForm = ({ email, onSuccess }) => {
  const { confirmRegister } = useAuth();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await confirmRegister(email, code);
      onSuccess(); // Confirmed — trigger success state
    } catch (err) {
      setError(err.message || 'Invalid code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
        <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
        <p className="text-sm text-emerald-800 font-medium">Verification code sent to</p>
        <p className="text-sm font-bold text-emerald-900 mt-1">{email}</p>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700">Confirmation Code</label>
        <input
          type="text" required maxLength={6}
          value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          placeholder="Enter 6-digit code"
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-center tracking-[0.4em] font-mono text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:tracking-normal placeholder:text-slate-400"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit" disabled={isLoading || code.length < 6}
          className="group w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 text-white rounded-xl font-medium text-sm transition-all hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/20 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? <span className="animate-pulse">Verifying...</span> : (
            <><span>Verify Account</span><ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></>
          )}
        </button>
      </div>
    </form>
  );
};

// ---- Step 3: Success Screen ----
const SuccessScreen = ({ onNavigate }) => (
  <div className="text-center space-y-6 py-6">
    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
      <CheckCircle className="w-10 h-10 text-emerald-600" />
    </div>
    <div>
      <h3 className="text-2xl font-bold text-slate-900">You're in!</h3>
      <p className="text-slate-500 mt-2 text-sm">Your account has been verified. You can now sign in.</p>
    </div>
    <button
      onClick={() => onNavigate('login')}
      className="group inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-xl font-medium text-sm transition-all hover:bg-slate-800 hover:shadow-lg"
    >
      <span>Go to Sign In</span>
      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
    </button>
  </div>
);

// ---- Main Export ----
const RegisterPage = ({ onNavigate }) => {
  // step: 'register' | 'otp' | 'success'
  const [step, setStep] = useState('register');
  const [registeredEmail, setRegisteredEmail] = useState('');

  const stepTitles = {
    register: { title: 'Create an account', subtitle: 'Join CampusEV Intel to get started' },
    otp: { title: 'Verify your email', subtitle: 'Enter the 6-digit code we sent you' },
    success: { title: 'Account verified', subtitle: '' },
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#f5f4f0] relative overflow-hidden">

      <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-900 rounded-2xl mb-5 shadow-xl">
            <Zap className="w-7 h-7 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{stepTitles[step].title}</h1>
          {stepTitles[step].subtitle && (
            <p className="text-slate-500 mt-2 text-sm">{stepTitles[step].subtitle}</p>
          )}
        </div>

        {/* Step Progress */}
        {step !== 'success' && (
          <div className="flex items-center gap-2 mb-6">
            {['register', 'otp'].map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${step === s ? 'bg-slate-900 text-white border-slate-900' : step === 'otp' && i === 0 ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-400 border-slate-200'}`}>
                  {step === 'otp' && i === 0 ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
                </div>
                {i === 0 && <div className={`flex-1 h-0.5 rounded-full transition-all ${step === 'otp' ? 'bg-emerald-500' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>
        )}

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-8 shadow-xl shadow-slate-200/50">
          {step === 'register' && (
            <RegisterForm onSuccess={(email) => { setRegisteredEmail(email); setStep('otp'); }} />
          )}
          {step === 'otp' && (
            <OtpForm email={registeredEmail} onSuccess={() => setStep('success')} />
          )}
          {step === 'success' && <SuccessScreen onNavigate={onNavigate} />}
        </div>

        {step === 'register' && (
          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <button onClick={() => onNavigate('login')} className="font-semibold text-slate-900 hover:underline underline-offset-2 transition-all">
              Sign in
            </button>
          </p>
        )}

      </div>
    </div>
  );
};

export default RegisterPage;
