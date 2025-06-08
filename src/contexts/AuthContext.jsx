import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger l'utilisateur au démarrage si token existe
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('lamap_token');
      
      if (token) {
        try {
          const userData = await api.getProfile();
          setUser(userData);
        } catch (error) {
          console.error('Erreur lors du chargement du profil:', error);
          // Token invalide, le supprimer
          localStorage.removeItem('lamap_token');
          api.token = null;
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Fonction de connexion
  const login = async (credentials) => {
    try {
      setLoading(true);
      
      const result = await api.login(credentials);
      setUser(result.user);
      
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Fonction d'inscription
  const register = async (userData) => {
    try {
      setLoading(true);
      
      const result = await api.register(userData);
      setUser(result.user);
      
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setUser(null);
    }
  };

  // Mise à jour des données utilisateur
  const updateUser = (updates) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  // Mise à jour du solde
  const updateBalance = (amount) => {
    setUser(prev => prev ? {
      ...prev,
      balance: Math.max(0, prev.balance + amount)
    } : null);
  };

  // Rafraîchir les données utilisateur
  const refreshUser = async () => {
    if (!user) return;
    
    try {
      const userData = await api.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    updateBalance,
    refreshUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};