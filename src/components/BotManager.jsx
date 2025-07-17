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
      <div style={{ marginTop: '2rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '1.5rem' 
        }}>
          <h3 style={{ 
            fontSize: '1.1rem', 
            fontWeight: 'bold', 
            color: 'var(--lamap-white)',
            margin: 0 
          }}>
            🤖 Mes Bots IA ({availableBots.length})
          </h3>
          {availableBots.length > 0 && (
            <div style={{ 
              fontSize: '0.8rem', 
              color: '#888',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>⚡</span>
              <span>Prêts au combat</span>
            </div>
          )}
        </div>

        {availableBots.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            border: '2px dashed rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🤖</div>
            <h3 style={{ 
              fontSize: '1.1rem', 
              fontWeight: 'bold', 
              color: 'var(--lamap-white)', 
              marginBottom: '0.5rem' 
            }}>
              Aucun bot disponible
            </h3>
            <p style={{ 
              fontSize: '0.9rem', 
              color: '#888',
              marginBottom: '1.5rem'
            }}>
              Créez votre premier bot IA pour commencer à jouer contre l'intelligence artificielle
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              style={{
                background: 'linear-gradient(135deg, var(--lamap-red), #a32222)',
                color: 'var(--lamap-white)',
                border: '2px solid var(--lamap-red)',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(198, 40, 40, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span>✨</span>
              Créer mon premier bot
            </button>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {availableBots.map((bot) => {
              const difficultyConfig = {
                easy: { 
                  color: '#4ade80', 
                  bgColor: 'rgba(74, 222, 128, 0.15)', 
                  icon: '🟢',
                  label: 'Facile'
                },
                medium: { 
                  color: '#fbbf24', 
                  bgColor: 'rgba(251, 191, 36, 0.15)', 
                  icon: '🟡',
                  label: 'Moyen'
                },
                hard: { 
                  color: '#ef4444', 
                  bgColor: 'rgba(239, 68, 68, 0.15)', 
                  icon: '🔴',
                  label: 'Difficile'
                }
              };

              const config = difficultyConfig[bot.difficulty] || difficultyConfig.medium;

              return (
                <div 
                  key={bot.id} 
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: roomCode ? 'default' : 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Badge de statut en haut à droite */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: config.bgColor,
                    border: `1px solid ${config.color}`,
                    borderRadius: '20px',
                    padding: '4px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    color: config.color
                  }}>
                    <span>{config.icon}</span>
                    <span>{config.label}</span>
                  </div>

                  {/* Contenu principal */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                    {/* Avatar du bot */}
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${config.color}, ${config.color}aa)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      color: 'white',
                      border: '3px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: `0 4px 12px ${config.color}30`,
                      position: 'relative'
                    }}>
                      <span style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}>
                        {bot.name ? bot.name.charAt(0).toUpperCase() : 'B'}
                      </span>
                      {/* Indicateur de statut actif */}
                      <div style={{
                        position: 'absolute',
                        bottom: -2,
                        right: -2,
                        width: '14px',
                        height: '14px',
                        background: '#4ade80',
                        borderRadius: '50%',
                        border: '2px solid #111',
                        boxShadow: '0 0 8px rgba(74, 222, 128, 0.6)'
                      }} />
                    </div>

                    {/* Informations du bot */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ 
                        fontSize: '1.1rem', 
                        fontWeight: 'bold', 
                        color: 'var(--lamap-white)', 
                        marginBottom: '0.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <span>🤖</span>
                        {bot.name}
                      </h4>
                      <div style={{ 
                        fontSize: '0.8rem', 
                        color: '#888',
                        marginBottom: '0.5rem',
                        lineHeight: '1.3'
                      }}>
                        {bot.difficulty === 'easy' && "Stratégie basique • Quelques erreurs • Idéal pour débuter"}
                        {bot.difficulty === 'medium' && "Stratégie équilibrée • Bon challenge • Pour progresser"}
                        {bot.difficulty === 'hard' && "Stratégie avancée • Très peu d'erreurs • Expert uniquement"}
                      </div>
                      
                      {/* Statistiques du bot */}
                      <div style={{ 
                        display: 'flex', 
                        gap: '1rem', 
                        fontSize: '0.7rem',
                        color: '#ccc'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>🎯</span>
                          <span>Créé récemment</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>⚡</span>
                          <span>Prêt</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {roomCode && (
                    <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem' }}>
                      <button
                        onClick={() => handleAddBotToRoom(bot.id)}
                        disabled={adding === bot.id}
                        style={{
                          width: '100%',
                          background: adding === bot.id 
                            ? '#666' 
                            : 'linear-gradient(135deg, var(--lamap-red), #a32222)',
                          color: 'var(--lamap-white)',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '12px 16px',
                          fontSize: '0.9rem',
                          fontWeight: 'bold',
                          cursor: adding === bot.id ? 'not-allowed' : 'pointer',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          opacity: adding === bot.id ? 0.7 : 1
                        }}
                        onMouseEnter={(e) => {
                          if (adding !== bot.id) {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 20px rgba(198, 40, 40, 0.4)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        {adding === bot.id ? (
                          <>
                            <LoadingSpinner size="small" color="white" />
                            <span>Ajout en cours...</span>
                          </>
                        ) : (
                          <>
                            <span>🚀</span>
                            <span>Ajouter à la partie</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Effet de glow subtil */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(45deg, transparent, ${config.color}05, transparent)`,
                    pointerEvents: 'none',
                    opacity: 0.5
                  }} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BotManager;