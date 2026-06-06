import { useState } from 'react';
import LandingPage from './components/LandingPage';
import AssessmentForm from './components/AssessmentForm';
import Dashboard from './components/Dashboard';
import Heatmap from './components/Heatmap';
import StudentPortal from './components/StudentPortal';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children, onNavigate }) => {
  const { user } = useAuth();
  if (!user) return <LoginPage onNavigate={onNavigate} />;
  return children;
};

function App() {
  const [view, setView] = useState('landing');

  // Navigation handler
  const navigateTo = (newView) => {
    setView(newView);
  };

  return (
    <div className="min-h-screen w-full bg-background font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {view === 'landing' && <LandingPage onNavigate={() => navigateTo('assess')} />}
      {view === 'login' && <LoginPage onNavigate={navigateTo} />}
      {view === 'register' && <RegisterPage onNavigate={navigateTo} />}
      
      {view === 'assess' && (
        <ProtectedRoute onNavigate={navigateTo}>
          <AssessmentForm onNavigate={() => navigateTo('dashboard')} />
        </ProtectedRoute>
      )}
      
      {view === 'dashboard' && (
        <ProtectedRoute onNavigate={navigateTo}>
          <Dashboard onNavigate={(v) => navigateTo(v)} />
        </ProtectedRoute>
      )}
      
      {view === 'heatmap' && (
        <ProtectedRoute onNavigate={navigateTo}>
          <Heatmap onNavigate={(v) => navigateTo(v)} />
        </ProtectedRoute>
      )}
      
      {view === 'student-portal' && <StudentPortal />}
    </div>
  );
}

export default App;
