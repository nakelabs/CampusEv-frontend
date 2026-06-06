import { useState } from 'react';
import LandingPage from './components/LandingPage';
import AssessmentForm from './components/AssessmentForm';
import Dashboard from './components/Dashboard';
import Heatmap from './components/Heatmap';
import StudentPortal from './components/StudentPortal';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import { useAuth } from './context/AuthContext';

import CampaignGenerator from './components/CampaignGenerator';

const ProtectedRoute = ({ children, onNavigate }) => {
  const { user } = useAuth();
  if (!user) return <LoginPage onNavigate={onNavigate} />;
  return children;
};

function App() {
  const [view, setView] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('view') || 'landing';
  });

  const [urlParams, setUrlParams] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return Object.fromEntries(params.entries());
  });

  // Navigation handler
  const navigateTo = (newView, params = {}) => {
    setView(newView);
    setUrlParams(params);
    
    // Update URL without reload to support refreshing/sharing
    const newUrl = new URL(window.location);
    newUrl.search = ''; // clear old
    newUrl.searchParams.set('view', newView);
    Object.keys(params).forEach(key => newUrl.searchParams.set(key, params[key]));
    window.history.pushState({}, '', newUrl);
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
          <Dashboard onNavigate={navigateTo} />
        </ProtectedRoute>
      )}
      
      {view === 'heatmap' && (
        <ProtectedRoute onNavigate={navigateTo}>
          <Heatmap onNavigate={navigateTo} />
        </ProtectedRoute>
      )}

      {view === 'campaign' && (
        <ProtectedRoute onNavigate={navigateTo}>
          <CampaignGenerator onNavigate={navigateTo} />
        </ProtectedRoute>
      )}
      
      {view === 'student-portal' && <StudentPortal params={urlParams} />}
    </div>
  );
}

export default App;
