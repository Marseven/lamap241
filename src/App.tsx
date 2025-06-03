import type { ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WalletProvider } from './contexts/WalletContext';
import { GameRoomProvider } from './contexts/GameRoomContext';
import AppHeader from './components/AppHeader';
import AuthPage from './pages/AuthPage';
import Home from './pages/Home';
import WalletPage from './pages/WalletPage';
import GameRoomsPage from './pages/GameRoomsPage';
import CreateRoomPage from './pages/CreateRoomPage';
import GameRoom from './pages/GameRoom';
import Rules from './pages/Rules';



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

// Composant principal de l'app
function AppContent() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <div>Chargement...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        {user && <AppHeader user={user} onLogout={logout} />}
        
        <Routes>
          <Route 
            path="/auth" 
            element={user ? <Navigate to="/" /> : <AuthPage />} 
          />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          
          <Route path="/wallet" element={
            <ProtectedRoute>
              <WalletPage />
            </ProtectedRoute>
          } />
          
          <Route path="/rooms" element={
            <ProtectedRoute>
              <GameRoomsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/create-room" element={
            <ProtectedRoute>
              <CreateRoomPage />
            </ProtectedRoute>
          } />
          
          <Route path="/game/:id" element={
            <ProtectedRoute>
              <GameRoom />
            </ProtectedRoute>
          } />
          
          <Route path="/rules" element={
            <ProtectedRoute>
              <Rules />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

// Composant App avec tous les providers
export default function App() {
  return (
    <AuthProvider>
      <WalletProvider>
        <GameRoomProvider>
          <AppContent />
        </GameRoomProvider>
      </WalletProvider>
    </AuthProvider>
  );
}