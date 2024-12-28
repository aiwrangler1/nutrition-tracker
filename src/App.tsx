import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import GlobalErrorBoundary from './components/GlobalErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner';
import { SettingsProvider } from './contexts/SettingsContext';
import { AuthProvider } from './contexts/AuthContext';

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Diary = lazy(() => import('./pages/Diary'));
const Settings = lazy(() => import('./pages/Settings'));

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-100">
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link to="/" className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900">
              Dashboard
            </Link>
            <Link to="/diary" className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900">
              Diary
            </Link>
            <Link to="/settings" className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900">
              Settings
            </Link>
          </div>
        </div>
      </div>
    </nav>
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {children}
    </main>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <GlobalErrorBoundary>
        <AuthProvider>
          <SettingsProvider>
            <Layout>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/diary" element={<Diary />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/" element={<Dashboard />} />
                </Routes>
              </Suspense>
            </Layout>
          </SettingsProvider>
        </AuthProvider>
      </GlobalErrorBoundary>
    </Router>
  );
};

export default App;