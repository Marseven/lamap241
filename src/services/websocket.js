import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Configuration pour utiliser Reverb
window.Pusher = Pusher;

class WebSocketService {
  constructor() {
    this.echo = null;
    this.channels = new Map();
    this.listeners = new Map();
    this.connectionState = 'disconnected';
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.heartbeatInterval = null;
  }

  /**
   * Initialize WebSocket connection
   */
  connect(token) {
    if (this.echo) {
      this.disconnect();
    }

    this.connectionState = 'connecting';
    
    this.echo = new Echo({
      broadcaster: 'reverb',
      key: import.meta.env.VITE_REVERB_APP_KEY,
      wsHost: import.meta.env.VITE_REVERB_HOST,
      wsPort: import.meta.env.VITE_REVERB_PORT,
      wssPort: import.meta.env.VITE_REVERB_PORT,
      forceTLS: import.meta.env.VITE_REVERB_SCHEME === 'https',
      enabledTransports: ['ws', 'wss'],
      authEndpoint: `${import.meta.env.VITE_API_URL}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    // Écouter les événements de connexion
    this.echo.connector.pusher.connection.bind('connected', () => {
      console.log('🔗 WebSocket connecté avec Reverb');
      this.connectionState = 'connected';
      this.reconnectAttempts = 0;
      this.startHeartbeat();
    });

    this.echo.connector.pusher.connection.bind('disconnected', () => {
      console.log('🔌 WebSocket déconnecté');
      this.connectionState = 'disconnected';
      this.stopHeartbeat();
      this.attemptReconnect(token);
    });

    this.echo.connector.pusher.connection.bind('error', (error) => {
      console.error('❌ Erreur WebSocket:', error);
      this.connectionState = 'error';
    });

    // Écouter les notifications globales
    this.listenToGlobalNotifications();
  }

  /**
   * Disconnect WebSocket
   */
  disconnect() {
    this.stopHeartbeat();
    if (this.echo) {
      this.echo.disconnect();
      this.echo = null;
    }
    this.channels.clear();
    this.listeners.clear();
    this.connectionState = 'disconnected';
    console.log('🔌 WebSocket déconnecté');
  }

  /**
   * Attempt to reconnect
   */
  attemptReconnect(token) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Nombre maximum de tentatives de reconnexion atteint');
      return;
    }

    this.reconnectAttempts++;
    console.log(`🔄 Tentative de reconnexion ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
    
    setTimeout(() => {
      this.connect(token);
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  /**
   * Start heartbeat
   */
  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.echo && this.connectionState === 'connected') {
        // Envoyer un ping simple
        this.echo.connector.pusher.connection.send_event('pusher:ping', {});
      }
    }, 30000); // Ping toutes les 30 secondes
  }

  /**
   * Stop heartbeat
   */
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Listen to global notifications
   */
  listenToGlobalNotifications() {
    if (!this.echo) return;

    const channel = this.echo.channel('notifications');
    
    channel.listen('notification.sent', (event) => {
      console.log('📢 Notification globale reçue:', event);
      this.handleNotification(event.notification);
    });

    // Écouter les mises à jour du classement
    const leaderboardChannel = this.echo.channel('leaderboard');
    
    leaderboardChannel.listen('leaderboard.updated', (event) => {
      console.log('🏆 Classement mis à jour:', event);
      this.handleLeaderboardUpdate(event);
    });
  }

  /**
   * Handle notification
   */
  handleNotification(notification) {
    // Créer une notification visuelle
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
      });
    }

    // Déclencher un événement personnalisé
    window.dispatchEvent(new CustomEvent('websocket-notification', {
      detail: notification
    }));
  }

  /**
   * Handle leaderboard update
   */
  handleLeaderboardUpdate(update) {
    // Déclencher un événement personnalisé
    window.dispatchEvent(new CustomEvent('websocket-leaderboard-update', {
      detail: update
    }));
  }

  /**
   * Join a room channel
   */
  joinRoom(roomCode, callbacks = {}) {
    if (!this.echo) {
      console.error('WebSocket not connected');
      return null;
    }

    const channelName = `room.${roomCode}`;
    const channel = this.echo.join(channelName);

    this.channels.set(channelName, channel);

    // Listen to room events
    channel
      .here((users) => {
        console.log('👥 Utilisateurs dans la salle:', users);
        callbacks.onUsersHere && callbacks.onUsersHere(users);
      })
      .joining((user) => {
        console.log('➕ Utilisateur a rejoint:', user);
        callbacks.onUserJoining && callbacks.onUserJoining(user);
      })
      .leaving((user) => {
        console.log('➖ Utilisateur a quitté:', user);
        callbacks.onUserLeaving && callbacks.onUserLeaving(user);
      })
      .listen('PlayerJoinedRoom', (e) => {
        console.log('🎮 Joueur a rejoint la salle:', e);
        callbacks.onPlayerJoined && callbacks.onPlayerJoined(e);
      })
      .listen('GameStarted', (e) => {
        console.log('🚀 Partie commencée:', e);
        callbacks.onGameStarted && callbacks.onGameStarted(e);
      });

    return channel;
  }

  /**
   * Join a game channel
   */
  joinGame(gameCode, callbacks = {}) {
    if (!this.echo) {
      console.error('WebSocket not connected');
      return null;
    }

    const channelName = `game.${gameCode}`;
    const channel = this.echo.join(channelName);

    this.channels.set(channelName, channel);

    // Listen to game events
    channel
      .here((users) => {
        console.log('🎯 Joueurs dans la partie:', users);
        callbacks.onPlayersHere && callbacks.onPlayersHere(users);
      })
      .joining((user) => {
        console.log('🎮 Joueur a rejoint la partie:', user);
        callbacks.onPlayerJoining && callbacks.onPlayerJoining(user);
      })
      .leaving((user) => {
        console.log('🚪 Joueur a quitté la partie:', user);
        callbacks.onPlayerLeaving && callbacks.onPlayerLeaving(user);
      })
      .listen('CardPlayed', (e) => {
        console.log('🃏 Carte jouée:', e);
        callbacks.onCardPlayed && callbacks.onCardPlayed(e);
      })
      .listen('PlayerPassed', (e) => {
        console.log('⏭️ Joueur a passé:', e);
        callbacks.onPlayerPassed && callbacks.onPlayerPassed(e);
      })
      .listen('GameStateChanged', (e) => {
        console.log('🔄 État du jeu changé:', e);
        callbacks.onGameStateChanged && callbacks.onGameStateChanged(e);
      });

    return channel;
  }

  /**
   * Leave a channel
   */
  leaveChannel(channelName) {
    if (this.channels.has(channelName)) {
      this.echo.leave(channelName);
      this.channels.delete(channelName);
      console.log(`🚪 Quitté le canal: ${channelName}`);
    }
  }

  /**
   * Leave room
   */
  leaveRoom(roomCode) {
    this.leaveChannel(`room.${roomCode}`);
  }

  /**
   * Leave game
   */
  leaveGame(gameCode) {
    this.leaveChannel(`game.${gameCode}`);
  }

  /**
   * Get connection status
   */
  isConnected() {
    return this.connectionState === 'connected' && this.echo !== null;
  }

  /**
   * Get connection state
   */
  getConnectionState() {
    return this.connectionState;
  }

  /**
   * Get all active channels
   */
  getActiveChannels() {
    return Array.from(this.channels.keys());
  }

  /**
   * Get WebSocket statistics
   */
  getStats() {
    return {
      connectionState: this.connectionState,
      reconnectAttempts: this.reconnectAttempts,
      activeChannels: this.getActiveChannels().length,
      channels: this.getActiveChannels(),
      isHeartbeatActive: this.heartbeatInterval !== null,
    };
  }

  /**
   * Request notification permission
   */
  async requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  }
}

export default new WebSocketService();