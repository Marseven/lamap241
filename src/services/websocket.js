import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Configuration pour utiliser Reverb
window.Pusher = Pusher;

class WebSocketService {
  constructor() {
    this.echo = null;
    this.channels = new Map();
    this.listeners = new Map();
  }

  /**
   * Initialize WebSocket connection
   */
  connect(token) {
    if (this.echo) {
      this.disconnect();
    }

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

    console.log('🔗 WebSocket connecté avec Reverb');
  }

  /**
   * Disconnect WebSocket
   */
  disconnect() {
    if (this.echo) {
      this.echo.disconnect();
      this.echo = null;
    }
    this.channels.clear();
    this.listeners.clear();
    console.log('🔌 WebSocket déconnecté');
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
    return this.echo !== null;
  }

  /**
   * Get all active channels
   */
  getActiveChannels() {
    return Array.from(this.channels.keys());
  }
}

export default new WebSocketService();