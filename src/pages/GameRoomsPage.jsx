import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGameRoom } from '../contexts/GameRoomContext';
import { useNotifications } from '../hooks/useNotifications';
import NotificationToast from '../components/NotificationToast';

export default function GameRoomsPage() {
  const { user } = useAuth();
  const { 
    getAvailableRooms, 
    getUserRooms, 
    searchRooms, 
    joinRoom, 
    loading 
  } = useGameRoom();
  const { notifications, addNotification, removeNotification } = useNotifications();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('available');
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [joinLoading, setJoinLoading] = useState(null);

  // Mettre à jour les salles filtrées
  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredRooms(searchRooms(searchQuery));
    } else {
      switch (activeTab) {
        case 'available':
          setFilteredRooms(getAvailableRooms());
          break;
        case 'my-rooms':
          setFilteredRooms(getUserRooms());
          break;
        default:
          setFilteredRooms(getAvailableRooms());
      }
    }
  }, [searchQuery, activeTab, getAvailableRooms, getUserRooms, searchRooms]);

  const handleJoinRoom = async (roomId) => {
    setJoinLoading(roomId);
    
    try {
      const result = await joinRoom(roomId);
      
      if (result.success) {
        addNotification('success', 'Salle rejointe avec succès !');
        navigate(`/game/${roomId}`);
      } else {
        addNotification('error', result.error);
      }
    } catch (error) {
      addNotification('error', 'Erreur lors de la connexion');
    } finally {
      setJoinLoading(null);
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    
    return `Il y a ${Math.floor(diffHours / 24)}j`;
  };

  const getBetColor = (bet) => {
    if (bet <= 1000) return 'text-green-400';
    if (bet <= 5000) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRoomStatusBadge = (room) => {
    switch (room.status) {
      case 'waiting':
        return (
          <span className="status-badge waiting">
            🟡 En attente ({room.players.length}/{room.maxPlayers})
          </span>
        );
      case 'playing':
        return (
          <span className="status-badge playing">
            🟢 En cours
          </span>
        );
      case 'finished':
        return (
          <span className="status-badge finished">
            ⚫ Terminée
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="game-rooms-page">
      <NotificationToast notifications={notifications} onRemove={removeNotification} />
      
      {/* Header */}
      <div className="rooms-header">
        <Link to="/" className="back-btn">
          ← Accueil
        </Link>
        <h1 className="page-title">🎮 Salles de jeu</h1>
        <Link to="/create-room" className="create-btn">
          + Créer
        </Link>
      </div>

      {/* Barre de recherche */}
      <div className="search-bar">
        <div className="search-input-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Rechercher une salle ou un joueur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="clear-search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Onglets */}
      <div className="rooms-tabs">
        <button
          onClick={() => setActiveTab('available')}
          className={`rooms-tab ${activeTab === 'available' ? 'active' : ''}`}
        >
          <span className="tab-icon">🎯</span>
          <span className="tab-label">Disponibles</span>
          <span className="tab-count">{getAvailableRooms().length}</span>
        </button>
        
        <button
          onClick={() => setActiveTab('my-rooms')}
          className={`rooms-tab ${activeTab === 'my-rooms' ? 'active' : ''}`}
        >
          <span className="tab-icon">👤</span>
          <span className="tab-label">Mes salles</span>
          <span className="tab-count">{getUserRooms().length}</span>
        </button>
      </div>

      {/* Liste des salles */}
      <div className="rooms-list">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <div>Chargement des salles...</div>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              {searchQuery ? '🔍' : activeTab === 'my-rooms' ? '👤' : '🎮'}
            </div>
            <div className="empty-title">
              {searchQuery ? 'Aucun résultat' : 
               activeTab === 'my-rooms' ? 'Aucune salle' : 'Aucune salle disponible'}
            </div>
            <div className="empty-message">
              {searchQuery ? 'Essayez avec d\'autres mots-clés' :
               activeTab === 'my-rooms' ? 'Vous n\'avez pas encore créé de salle' :
               'Soyez le premier à créer une salle !'}
            </div>
            {!searchQuery && (
              <Link to="/create-room" className="empty-action">
                <button className="btn-primary">Créer une salle</button>
              </Link>
            )}
          </div>
        ) : (
          filteredRooms.map(room => (
            <div key={room.id} className="room-card">
              <div className="room-header">
                <div className="room-info">
                  <h3 className="room-name">{room.name}</h3>
                  <div className="room-creator">
                    <span className="creator-icon">👤</span>
                    {room.creator}
                    {room.isDemo && <span className="demo-badge">DÉMO</span>}
                  </div>
                </div>
                {getRoomStatusBadge(room)}
              </div>

              <div className="room-details">
                <div className="room-bet">
                  <span className="bet-icon">💰</span>
                  <span className={`bet-amount ${getBetColor(room.bet)}`}>
                    {new Intl.NumberFormat('fr-FR').format(room.bet)} FCFA
                  </span>
                </div>
                
                <div className="room-pot">
                  <span className="pot-icon">🏆</span>
                  <span className="pot-amount">
                    Pot: {new Intl.NumberFormat('fr-FR').format(room.pot || room.bet * 2)} FCFA
                  </span>
                </div>

                <div className="room-time">
                  <span className="time-icon">⏰</span>
                  <span className="time-text">{formatTimeAgo(room.createdAt)}</span>
                </div>
              </div>

              <div className="room-players">
                <div className="players-list">
                  {room.players.map((player, index) => (
                    <div key={index} className="player-badge">
                      <span className="player-avatar">
                        {player.charAt(0).toUpperCase()}
                      </span>
                      <span className="player-name">{player}</span>
                      {player === room.creator && (
                        <span className="creator-crown">👑</span>
                      )}
                    </div>
                  ))}
                  
                  {/* Emplacements vides */}
                  {Array.from({ length: room.maxPlayers - room.players.length }).map((_, index) => (
                    <div key={`empty-${index}`} className="player-badge empty">
                      <span className="player-avatar empty">?</span>
                      <span className="player-name">En attente...</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="room-actions">
                {room.status === 'waiting' && !room.players.includes(user?.pseudo) && (
                  <button
                    onClick={() => handleJoinRoom(room.id)}
                    disabled={joinLoading === room.id || room.bet > (user?.balance || 0)}
                    className="join-btn"
                  >
                    {joinLoading === room.id ? (
                      <>
                        <span className="loading-spinner small"></span>
                        Connexion...
                      </>
                    ) : room.bet > (user?.balance || 0) ? (
                      <>
                        <span className="btn-icon">💸</span>
                        Solde insuffisant
                      </>
                    ) : (
                      <>
                        <span className="btn-icon">🎮</span>
                        Rejoindre
                      </>
                    )}
                  </button>
                )}

                {room.players.includes(user?.pseudo) && (
                  <Link to={`/game/${room.id}`} className="continue-btn">
                    <span className="btn-icon">🎯</span>
                    {room.status === 'playing' ? 'Continuer' : 'Entrer'}
                  </Link>
                )}

                {room.status === 'finished' && (
                  <div className="finished-info">
                    <span className="winner-icon">🏆</span>
                    Gagnant: {room.winner}
                  </div>
                )}
              </div>

              {/* Info rapide de la salle */}
              <div className="room-quick-info">
                <div className="quick-info-item">
                  <span className="info-icon">⏱️</span>
                  <span className="info-text">
                    {room.gameSettings?.timeLimit ? 
                      `${Math.floor(room.gameSettings.timeLimit / 60)} min` : 
                      'Pas de limite'
                    }
                  </span>
                </div>
                <div className="quick-info-item">
                  <span className="info-icon">🎯</span>
                  <span className="info-text">
                    Premier à {room.gameSettings?.roundsToWin || 3}
                  </span>
                </div>
                <div className="quick-info-item">
                  <span className="info-icon">👥</span>
                  <span className="info-text">
                    {room.gameSettings?.allowSpectators ? 'Spectateurs OK' : 'Privée'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bouton flottant pour créer une salle */}
      <Link to="/create-room" className="floating-create-btn">
        <span className="fab-icon">+</span>
      </Link>
    </div>
  );
}
