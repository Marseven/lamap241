import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    if (loading) {
        return (_jsxs("div", { className: "loading-screen", children: [_jsx("div", { className: "loading-spinner" }), _jsx("div", { children: "Chargement..." })] }));
    }
    return isAuthenticated ? children : _jsx(Navigate, { to: "/auth" });
}
// Composant principal de l'app
function AppContent() {
    const { user, logout, loading } = useAuth();
    if (loading) {
        return (_jsxs("div", { className: "loading-screen", children: [_jsx("div", { className: "loading-spinner" }), _jsx("div", { children: "Chargement..." })] }));
    }
    return (_jsx(Router, { children: _jsxs("div", { className: "min-h-screen bg-black text-white", children: [user && _jsx(AppHeader, { user: user, onLogout: logout }), _jsxs(Routes, { children: [_jsx(Route, { path: "/auth", element: user ? _jsx(Navigate, { to: "/" }) : _jsx(AuthPage, {}) }), _jsx(Route, { path: "/", element: _jsx(ProtectedRoute, { children: _jsx(Home, {}) }) }), _jsx(Route, { path: "/wallet", element: _jsx(ProtectedRoute, { children: _jsx(WalletPage, {}) }) }), _jsx(Route, { path: "/rooms", element: _jsx(ProtectedRoute, { children: _jsx(GameRoomsPage, {}) }) }), _jsx(Route, { path: "/create-room", element: _jsx(ProtectedRoute, { children: _jsx(CreateRoomPage, {}) }) }), _jsx(Route, { path: "/game/:id", element: _jsx(ProtectedRoute, { children: _jsx(GameRoom, {}) }) }), _jsx(Route, { path: "/rules", element: _jsx(ProtectedRoute, { children: _jsx(Rules, {}) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/" }) })] })] }) }));
}
// Composant App avec tous les providers
export default function App() {
    return (_jsx(AuthProvider, { children: _jsx(WalletProvider, { children: _jsx(GameRoomProvider, { children: _jsx(AppContent, {}) }) }) }));
}
