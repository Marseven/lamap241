// src/App.tsx - Version finale avec toutes les routes
import type { ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WalletProvider } from './contexts/WalletContext';
import { GameRoomProvider } from './contexts/GameRoomContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ErrorBoundary from './components/ErrorBoundary';
import AppHeader from './components/AppHeader';
import NotificationManager from './components/NotificationManager';

// Pages principales
import AuthPage from './pages/AuthPage';
import Home from './pages/Home';
import Rules from './pages/Rules';

// Pages de jeu
import GameRoomsPage from './pages/GameRoomsPage';
import CreateRoomPage from './pages/CreateRoomPage';
import GameRoom from './pages/GameRoom';

// Pages portefeuille
import WalletPage from './pages/WalletPage';
import WalletCallback from './pages/WalletCallback';

// Pages utilisateur
import ProfilePage from './pages/ProfilPage';
import HistoryPage from './pages/HistoryPage';
import AchievementsPage from './pages/AchievementsPage';
import SettingsPage from './pages/SettingsPage';
import SupportPage from './pages/SupportPage';

// Pages légales
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <div>Chargement...</div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/auth" />;
}

// Composant pour les pages publiques (sans header)
function PublicRoute({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

// Layout avec header pour les pages protégées
function ProtectedLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  
  return (
    <div className="min-h-screen bg-black text-white">
      <AppHeader user={user} onLogout={logout} />
      <NotificationManager />
      {children}
    </div>
  );
}

// Composant principal de l'app
function AppContent() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <div>Chargement de l'application...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Routes publiques (sans authentification) */}
        <Route 
          path="/auth" 
          element={
            <PublicRoute>
              {user ? <Navigate to="/" /> : <AuthPage />}
            </PublicRoute>
          } 
        />
        
        {/* Pages légales (accessibles sans connexion) */}
        <Route 
          path="/terms" 
          element={
            <PublicRoute>
              <TermsPage />
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/privacy" 
          element={
            <PublicRoute>
              <PrivacyPage />
            </PublicRoute>
          } 
        />

        {/* Routes protégées avec header */}
        <Route path="/" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <Home />
            </ProtectedLayout>
          </ProtectedRoute>
        } />

        {/* Pages de jeu */}
        <Route path="/rules" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <Rules />
            </ProtectedLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/rooms" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <GameRoomsPage />
            </ProtectedLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/create-room" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <CreateRoomPage />
            </ProtectedLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/game/:id" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <GameRoom />
            </ProtectedLayout>
          </ProtectedRoute>
        } />

        {/* Pages portefeuille */}
        <Route path="/wallet" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <WalletPage />
            </ProtectedLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/wallet/callback" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <WalletCallback />
            </ProtectedLayout>
          </ProtectedRoute>
        } />

        {/* Pages utilisateur */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <ProfilePage />
            </ProtectedLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/history" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <HistoryPage />
            </ProtectedLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/achievements" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <AchievementsPage />
            </ProtectedLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <SettingsPage />
            </ProtectedLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/support" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <SupportPage />
            </ProtectedLayout>
          </ProtectedRoute>
        } />

        {/* Route de fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

// Composant App principal avec tous les providers dans le bon ordre
export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <WalletProvider>
            <GameRoomProvider>
              <AppContent />
            </GameRoomProvider>
          </WalletProvider>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}