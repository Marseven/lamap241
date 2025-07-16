import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import StatsPage from './pages/StatsPage';
import BotManagementPage from './pages/BotManagementPage';
// Pages légales
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    if (loading) {
        return (_jsxs("div", { className: "loading-screen", children: [_jsx("div", { className: "loading-spinner" }), _jsx("div", { children: "Chargement..." })] }));
    }
    return isAuthenticated ? children : _jsx(Navigate, { to: "/auth" });
}
// Composant pour les pages publiques (sans header)
function PublicRoute({ children }) {
    return _jsx(_Fragment, { children: children });
}
// Layout avec header pour les pages protégées
function ProtectedLayout({ children }) {
    const { user, logout } = useAuth();
    return (_jsxs("div", { className: "min-h-screen bg-black text-white", children: [_jsx(AppHeader, { user: user, onLogout: logout }), _jsx(NotificationManager, {}), children] }));
}
// Composant principal de l'app
function AppContent() {
    const { user, logout, loading } = useAuth();
    if (loading) {
        return (_jsxs("div", { className: "loading-screen", children: [_jsx("div", { className: "loading-spinner" }), _jsx("div", { children: "Chargement de l'application..." })] }));
    }
    return (_jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/auth", element: _jsx(PublicRoute, { children: user ? _jsx(Navigate, { to: "/" }) : _jsx(AuthPage, {}) }) }), _jsx(Route, { path: "/terms", element: _jsx(PublicRoute, { children: _jsx(TermsPage, {}) }) }), _jsx(Route, { path: "/privacy", element: _jsx(PublicRoute, { children: _jsx(PrivacyPage, {}) }) }), _jsx(Route, { path: "/", element: _jsx(ProtectedRoute, { children: _jsx(ProtectedLayout, { children: _jsx(Home, {}) }) }) }), _jsx(Route, { path: "/rules", element: _jsx(ProtectedRoute, { children: _jsx(ProtectedLayout, { children: _jsx(Rules, {}) }) }) }), _jsx(Route, { path: "/rooms", element: _jsx(ProtectedRoute, { children: _jsx(ProtectedLayout, { children: _jsx(GameRoomsPage, {}) }) }) }), _jsx(Route, { path: "/create-room", element: _jsx(ProtectedRoute, { children: _jsx(ProtectedLayout, { children: _jsx(CreateRoomPage, {}) }) }) }), _jsx(Route, { path: "/game/:id", element: _jsx(ProtectedRoute, { children: _jsx(ProtectedLayout, { children: _jsx(GameRoom, {}) }) }) }), _jsx(Route, { path: "/wallet", element: _jsx(ProtectedRoute, { children: _jsx(ProtectedLayout, { children: _jsx(WalletPage, {}) }) }) }), _jsx(Route, { path: "/wallet/callback", element: _jsx(ProtectedRoute, { children: _jsx(ProtectedLayout, { children: _jsx(WalletCallback, {}) }) }) }), _jsx(Route, { path: "/profile", element: _jsx(ProtectedRoute, { children: _jsx(ProtectedLayout, { children: _jsx(ProfilePage, {}) }) }) }), _jsx(Route, { path: "/history", element: _jsx(ProtectedRoute, { children: _jsx(ProtectedLayout, { children: _jsx(HistoryPage, {}) }) }) }), _jsx(Route, { path: "/achievements", element: _jsx(ProtectedRoute, { children: _jsx(ProtectedLayout, { children: _jsx(AchievementsPage, {}) }) }) }), _jsx(Route, { path: "/settings", element: _jsx(ProtectedRoute, { children: _jsx(ProtectedLayout, { children: _jsx(SettingsPage, {}) }) }) }), _jsx(Route, { path: "/support", element: _jsx(ProtectedRoute, { children: _jsx(ProtectedLayout, { children: _jsx(SupportPage, {}) }) }) }), _jsx(Route, { path: "/stats", element: _jsx(ProtectedRoute, { children: _jsx(ProtectedLayout, { children: _jsx(StatsPage, {}) }) }) }), _jsx(Route, { path: "/bots", element: _jsx(ProtectedRoute, { children: _jsx(ProtectedLayout, { children: _jsx(BotManagementPage, {}) }) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/" }) })] }) }));
}
// Composant App principal avec tous les providers dans le bon ordre
export default function App() {
    return (_jsx(ErrorBoundary, { children: _jsx(AuthProvider, { children: _jsx(NotificationProvider, { children: _jsx(WalletProvider, { children: _jsx(GameRoomProvider, { children: _jsx(AppContent, {}) }) }) }) }) }));
}
