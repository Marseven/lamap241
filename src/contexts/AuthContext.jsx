import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Charger l'utilisateur depuis localStorage au démarrage
  useEffect(() => {
    const savedUser = localStorage.getItem('lamap_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur:', error);
        localStorage.removeItem('lamap_user');
      }
    }
    setLoading(false);
  }, []);

  // Sauvegarder l'utilisateur dans localStorage à chaque changement
  useEffect(() => {
    if (user) {
      localStorage.setItem('lamap_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('lamap_user');
    }
  }, [user]);

  // Fonction de connexion (sera remplacée par l'API Laravel)
  const login = async (credentials) => {
    try {
      setLoading(true);
      
      // Simulation d'appel API - À remplacer par l'appel réel
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Créer l'utilisateur fictif
      const userData = {
        id: Math.random().toString(36).substring(2, 9),
        pseudo: credentials.pseudo,
        email: credentials.email || '',
        phone: credentials.phone || '',
        balance: 10000, // Bonus de bienvenue
        avatar: null,
        createdAt: new Date().toISOString(),
        stats: {
          gamesPlayed: 0,
          gamesWon: 0,
          totalEarnings: 0
        }
      };
      
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return { success: false, error: 'Erreur de connexion' };
    } finally {
      setLoading(false);
    }
  };

  // Fonction d'inscription (sera remplacée par l'API Laravel)
  const register = async (userData) => {
    try {
      setLoading(true);
      
      // Validation basique
      if (!userData.pseudo || userData.pseudo.length < 3) {
        throw new Error('Le pseudo doit contenir au moins 3 caractères');
      }
      
      if (!userData.password || userData.password.length < 6) {
        throw new Error('Le mot de passe doit contenir au moins 6 caractères');
      }

      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newUser = {
        id: Math.random().toString(36).substring(2, 9),
        pseudo: userData.pseudo,
        email: userData.email || '',
        phone: userData.phone || '',
        balance: 10000, // Bonus de bienvenue
        avatar: null,
        createdAt: new Date().toISOString(),
        stats: {
          gamesPlayed: 0,
          gamesWon: 0,
          totalEarnings: 0
        }
      };
      
      setUser(newUser);
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    setUser(null);
    localStorage.removeItem('lamap_user');
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

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    updateBalance,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};