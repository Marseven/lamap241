import React, { useEffect, useState } from 'react';
import useGameStore from '../stores/gameStore';
import LoadingSpinner from './LoadingSpinner';

const BotManager = ({ roomCode, onBotAdded }) => {
  const {
    availableBots,
    botsLoading,
    botsError,
    fetchAvailableBots,
    createBot,
    addBotToRoom
  } = useGameStore();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBotData, setNewBotData] = useState({
    name: '',
    difficulty: 'medium',
    avatar: ''
  });
  const [creating, setCreating] = useState(false);
  const [adding, setAdding] = useState(null);

  useEffect(() => {
    fetchAvailableBots();
  }, [fetchAvailableBots]);

  const handleCreateBot = async (e) => {
    e.preventDefault();
    if (!newBotData.name.trim()) return;

    setCreating(true);
    try {
      await createBot({
        ...newBotData,
        name: newBotData.name.trim()
      });
      setNewBotData({ name: '', difficulty: 'medium', avatar: '' });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Erreur lors de la création du bot:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleAddBotToRoom = async (botId) => {
    if (!roomCode) return;

    setAdding(botId);
    try {
      await addBotToRoom(roomCode, botId);
      if (onBotAdded) {
        onBotAdded();
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du bot:', error);
    } finally {
      setAdding(null);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'hard':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'Facile';
      case 'medium':
        return 'Moyen';
      case 'hard':
        return 'Difficile';
      default:
        return difficulty;
    }
  };

  if (botsLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '8rem' }}>
        <LoadingSpinner size="medium" color="primary" text="Chargement des bots..." />
      </div>
    );
  }

  return (
    <div className="lamap-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--lamap-white)', marginBottom: '0.5rem' }}>
            ⚙️ Gestion des Bots
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#888' }}>
            {roomCode ? 'Ajouter un bot à la partie' : 'Gérer vos bots IA'}
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{
            background: 'linear-gradient(135deg, var(--lamap-red), #a32222)',
            color: 'var(--lamap-white)',
            border: '2px solid var(--lamap-red)',
            borderRadius: '12px',
            padding: '12px 20px',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(198, 40, 40, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(198, 40, 40, 0.5)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(198, 40, 40, 0.3)';
          }}
        >
          <span>🤖</span>
          Créer un Bot
        </button>
      </div>

      {botsError && (
        <div style={{
          background: '#1a1a1a',
          border: '1px solid #ef4444',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '2rem',
          boxShadow: '0 0 10px rgba(239, 68, 68, 0.2)'
        }}>
          <p style={{ color: '#ef4444', fontSize: '0.9rem' }}>❌ Erreur: {botsError}</p>
        </div>
      )}

      {/* Formulaire de création */}
      {showCreateForm && (
        <div style={{
          background: '#111',
          border: '1px solid var(--lamap-red)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 0 10px rgba(198, 40, 40, 0.2)'
        }}>
          <form onSubmit={handleCreateBot} style={{ display: 'grid', gap: '1.5rem' }}>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.9rem', 
                fontWeight: 'bold', 
                color: 'var(--lamap-white)', 
                marginBottom: '0.5rem' 
              }}>
                🤖 Nom du Bot
              </label>
              <input
                type="text"
                value={newBotData.name}
                onChange={(e) => setNewBotData({ ...newBotData, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #444',
                  background: '#1a1a1a',
                  color: 'var(--lamap-white)',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                placeholder="ex: AlphaBot"
                required
                onFocus={(e) => e.target.style.borderColor = 'var(--lamap-red)'}
                onBlur={(e) => e.target.style.borderColor = '#444'}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.9rem', 
                fontWeight: 'bold', 
                color: 'var(--lamap-white)', 
                marginBottom: '0.5rem' 
              }}>
                🎯 Difficulté
              </label>
              <select
                value={newBotData.difficulty}
                onChange={(e) => setNewBotData({ ...newBotData, difficulty: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #444',
                  background: '#1a1a1a',
                  color: 'var(--lamap-white)',
                  fontSize: '1rem',
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--lamap-red)'}
                onBlur={(e) => e.target.style.borderColor = '#444'}
              >
                <option value="easy" style={{ background: '#1a1a1a', color: 'var(--lamap-white)' }}>🟢 Facile</option>
                <option value="medium" style={{ background: '#1a1a1a', color: 'var(--lamap-white)' }}>🟡 Moyen</option>
                <option value="hard" style={{ background: '#1a1a1a', color: 'var(--lamap-white)' }}>🔴 Difficile</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                style={{
                  background: '#2A2A2A',
                  color: 'var(--lamap-white)',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#444';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#2A2A2A';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                ❌ Annuler
              </button>
              <button
                type="submit"
                disabled={creating || !newBotData.name.trim()}
                style={{
                  background: creating || !newBotData.name.trim() 
                    ? '#666' 
                    : 'linear-gradient(135deg, var(--lamap-red), #a32222)',
                  color: 'var(--lamap-white)',
                  border: '2px solid var(--lamap-red)',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  cursor: creating || !newBotData.name.trim() ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: creating || !newBotData.name.trim() ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseOver={(e) => {
                  if (!creating && newBotData.name.trim()) {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 15px rgba(198, 40, 40, 0.3)';
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {creating ? (
                  <>
                    <LoadingSpinner size="small" color="white" />
                    <span>Création...</span>
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>Créer</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des bots */}
      <div className="space-y-4">
        {availableBots.length === 0 ? (
          <div className="text-center py-8">
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun bot disponible</h3>
            <p className="mt-1 text-sm text-gray-500">
              Créez votre premier bot IA pour commencer
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableBots.map((bot) => (
              <div key={bot.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {bot.name ? bot.name.charAt(0).toUpperCase() : 'B'}
                      </span>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900">{bot.name}</h4>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(bot.difficulty)}`}>
                        {getDifficultyLabel(bot.difficulty)}
                      </span>
                    </div>
                  </div>

                  {roomCode && (
                    <button
                      onClick={() => handleAddBotToRoom(bot.id)}
                      disabled={adding === bot.id}
                      className="px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      {adding === bot.id ? 'Ajout...' : 'Ajouter'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BotManager;