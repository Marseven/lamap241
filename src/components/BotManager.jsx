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
                marginBottom: '1rem' 
              }}>
                🎯 Niveau de Difficulté
              </label>
              
              {/* Sélecteur de difficulté amélioré */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {[
                  { 
                    value: 'easy', 
                    label: 'Facile', 
                    icon: '🟢',
                    description: 'Bot débutant, idéal pour apprendre',
                    color: '#4ade80',
                    bgColor: 'rgba(74, 222, 128, 0.1)',
                    borderColor: 'rgba(74, 222, 128, 0.3)'
                  },
                  { 
                    value: 'medium', 
                    label: 'Moyen', 
                    icon: '🟡',
                    description: 'Bot expérimenté, bon défi',
                    color: '#fbbf24',
                    bgColor: 'rgba(251, 191, 36, 0.1)',
                    borderColor: 'rgba(251, 191, 36, 0.3)'
                  },
                  { 
                    value: 'hard', 
                    label: 'Difficile', 
                    icon: '🔴',
                    description: 'Bot expert, très challenging',
                    color: '#ef4444',
                    bgColor: 'rgba(239, 68, 68, 0.1)',
                    borderColor: 'rgba(239, 68, 68, 0.3)'
                  }
                ].map((difficulty) => (
                  <div
                    key={difficulty.value}
                    onClick={() => setNewBotData({ ...newBotData, difficulty: difficulty.value })}
                    style={{
                      background: newBotData.difficulty === difficulty.value 
                        ? `linear-gradient(135deg, ${difficulty.bgColor}, rgba(255, 255, 255, 0.05))`
                        : 'rgba(255, 255, 255, 0.05)',
                      border: newBotData.difficulty === difficulty.value 
                        ? `2px solid ${difficulty.color}`
                        : '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textAlign: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: newBotData.difficulty === difficulty.value 
                        ? `0 0 20px ${difficulty.color}30`
                        : 'none',
                      transform: newBotData.difficulty === difficulty.value ? 'translateY(-2px)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (newBotData.difficulty !== difficulty.value) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.borderColor = difficulty.borderColor;
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (newBotData.difficulty !== difficulty.value) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.transform = 'none';
                      }
                    }}
                  >
                    {/* Effet de glow pour l'option sélectionnée */}
                    {newBotData.difficulty === difficulty.value && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(45deg, transparent, ${difficulty.color}10, transparent)`,
                        animation: 'shimmer 2s infinite',
                        pointerEvents: 'none'
                      }} />
                    )}
                    
                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <div style={{ 
                        fontSize: '2rem', 
                        marginBottom: '0.5rem',
                        filter: newBotData.difficulty === difficulty.value 
                          ? `drop-shadow(0 0 8px ${difficulty.color})`
                          : 'none'
                      }}>
                        {difficulty.icon}
                      </div>
                      <div style={{ 
                        fontSize: '0.9rem', 
                        fontWeight: 'bold', 
                        color: newBotData.difficulty === difficulty.value ? difficulty.color : 'var(--lamap-white)',
                        marginBottom: '0.25rem',
                        textShadow: newBotData.difficulty === difficulty.value 
                          ? `0 0 10px ${difficulty.color}`
                          : 'none'
                      }}>
                        {difficulty.label}
                      </div>
                      <div style={{ 
                        fontSize: '0.7rem', 
                        color: newBotData.difficulty === difficulty.value ? '#ccc' : '#888',
                        lineHeight: '1.2',
                        height: '2.4rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {difficulty.description}
                      </div>
                    </div>
                    
                    {/* Indicateur de sélection */}
                    {newBotData.difficulty === difficulty.value && (
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '20px',
                        height: '20px',
                        background: difficulty.color,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        color: 'white',
                        fontWeight: 'bold',
                        boxShadow: `0 0 10px ${difficulty.color}`
                      }}>
                        ✓
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Informations supplémentaires sur la difficulté sélectionnée */}
              <div style={{
                marginTop: '1rem',
                padding: '0.8rem',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1rem' }}>ℹ️</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--lamap-white)' }}>
                    Difficulté sélectionnée: {getDifficultyLabel(newBotData.difficulty)}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#ccc', lineHeight: '1.3' }}>
                  {newBotData.difficulty === 'easy' && "Ce bot commet quelques erreurs et joue de manière prévisible. Parfait pour débuter !"}
                  {newBotData.difficulty === 'medium' && "Ce bot joue intelligemment avec une stratégie équilibrée. Un bon défi pour progresser."}
                  {newBotData.difficulty === 'hard' && "Ce bot utilise des stratégies avancées et fait très peu d'erreurs. Pour les joueurs expérimentés !"}
                </div>
              </div>
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