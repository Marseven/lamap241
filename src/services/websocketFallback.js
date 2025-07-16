/**
 * Fallback WebSocket Service pour gérer les cas où Reverb n'est pas disponible
 */
class WebSocketFallbackService {
  constructor() {
    this.connectionState = 'disconnected';
    this.listeners = new Map();
    this.isEnabled = false;
  }

  /**
   * Simuler une connexion WebSocket
   */
  connect(token) {
    console.log('🔄 WebSocket Fallback activé - Mode dégradé');
    this.connectionState = 'connected';
    this.isEnabled = true;
    
    // Simuler une connexion réussie après un délai
    setTimeout(() => {
      this.triggerEvent('websocket-fallback-connected');
    }, 500);
  }

  /**
   * Simuler une déconnexion
   */
  disconnect() {
    console.log('🔌 WebSocket Fallback déconnecté');
    this.connectionState = 'disconnected';
    this.isEnabled = false;
    this.listeners.clear();
  }

  /**
   * Simuler l'écoute d'un canal
   */
  joinRoom(roomCode, callbacks = {}) {
    if (!this.isEnabled) return null;
    
    console.log(`🏠 Fallback: Simulation de connexion à la salle ${roomCode}`);
    
    // Simuler des utilisateurs présents après un délai
    setTimeout(() => {
      if (callbacks.onUsersHere) {
        callbacks.onUsersHere([
          { id: 1, name: 'Utilisateur simulé', avatar: null }
        ]);
      }
    }, 1000);

    return {
      listen: (event, callback) => {
        console.log(`👂 Fallback: Écoute de l'événement ${event}`);
        this.listeners.set(event, callback);
      },
      here: (callback) => callback([]),
      joining: (callback) => {},
      leaving: (callback) => {},
    };
  }

  /**
   * Simuler l'écoute d'un jeu
   */
  joinGame(gameCode, callbacks = {}) {
    if (!this.isEnabled) return null;
    
    console.log(`🎮 Fallback: Simulation de connexion au jeu ${gameCode}`);
    
    return {
      listen: (event, callback) => {
        console.log(`👂 Fallback: Écoute de l'événement de jeu ${event}`);
        this.listeners.set(event, callback);
      },
      here: (callback) => callback([]),
      joining: (callback) => {},
      leaving: (callback) => {},
    };
  }

  /**
   * Simuler quitter un canal
   */
  leaveChannel(channelName) {
    console.log(`🚪 Fallback: Simulation de quitter le canal ${channelName}`);
  }

  /**
   * Simuler quitter une salle
   */
  leaveRoom(roomCode) {
    this.leaveChannel(`room.${roomCode}`);
  }

  /**
   * Simuler quitter un jeu
   */
  leaveGame(gameCode) {
    this.leaveChannel(`game.${gameCode}`);
  }

  /**
   * Vérifier si connecté
   */
  isConnected() {
    return this.connectionState === 'connected' && this.isEnabled;
  }

  /**
   * Obtenir l'état de la connexion
   */
  getConnectionState() {
    return this.connectionState;
  }

  /**
   * Obtenir les canaux actifs (simulés)
   */
  getActiveChannels() {
    return [];
  }

  /**
   * Obtenir les statistiques (simulées)
   */
  getStats() {
    return {
      connectionState: this.connectionState,
      reconnectAttempts: 0,
      activeChannels: 0,
      channels: [],
      isHeartbeatActive: false,
      fallbackMode: true,
    };
  }

  /**
   * Demander la permission de notification
   */
  async requestNotificationPermission() {
    return false; // Désactivé en mode fallback
  }

  /**
   * Déclencher un événement personnalisé
   */
  triggerEvent(eventName, data = {}) {
    window.dispatchEvent(new CustomEvent(eventName, {
      detail: data
    }));
  }
}

export default new WebSocketFallbackService();