const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://lamap.mebodorichard.com/api";

class ApiService {
  constructor() {
    this.token = localStorage.getItem("lamap_token");
  }

  // Configuration des headers
  getHeaders() {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Méthode générique pour les requêtes
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
    const response = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        login: credentials.pseudo, // Le backend accepte email ou pseudo
        password: credentials.password,
      }),
    });

    if (response.token) {
      this.token = response.token;
      localStorage.setItem("lamap_token", response.token);
    }

    return { success: true, user: response.user };
  }

  async register(userData) {
    const response = await this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: userData.pseudo, // Utiliser le pseudo comme nom
        pseudo: userData.pseudo,
        email: userData.email || `${userData.pseudo}@lamap241.com`, // Email par défaut
        phone: userData.phone,
        password: userData.password,
        password_confirmation: userData.confirmPassword,
      }),
    });

    if (response.token) {
      this.token = response.token;
      localStorage.setItem("lamap_token", response.token);
    }

    return { success: true, user: response.user };
  }

  async logout() {
    try {
      await this.request("/auth/logout", { method: "POST" });
    } finally {
      this.token = null;
      localStorage.removeItem("lamap_token");
    }
  }

  async getProfile() {
    const response = await this.request("/auth/profile");
    return response.user;
  }

  // Wallet endpoints
  async getBalance() {
    return this.request("/wallet/balance");
  }

  /**
   * Initier un dépôt avec la nouvelle logique E-Billing
   */
  async deposit(data) {
    const response = await this.request("/wallet/deposit", {
      method: "POST",
      body: JSON.stringify({
        amount: data.amount,
        payment_method: data.method,
        phone_number: data.phoneNumber,
      }),
    });

    // Si succès, démarrer le polling côté frontend
    if (response.success && response.transaction) {
      this.startTransactionPolling(response.transaction.reference);
    }

    return response;
  }

  /**
   * Démarrer le polling d'une transaction côté frontend
   */
  startTransactionPolling(reference, callbacks = {}) {
    const {
      onStatusUpdate = () => {},
      onSuccess = () => {},
      onFailure = () => {},
      onTimeout = () => {},
    } = callbacks;

    const startTime = Date.now();
    const maxDuration = 65000; // 65 secondes (un peu plus que les 60 du backend)
    const interval = 2000; // Vérifier toutes les 2 secondes

    console.log(`🔄 Démarrage du polling pour la transaction: ${reference}`);

    const pollInterval = setInterval(async () => {
      const elapsed = Date.now() - startTime;

      if (elapsed >= maxDuration) {
        clearInterval(pollInterval);
        console.log("⏰ Timeout du polling côté frontend");
        onTimeout({ reference, elapsed });
        return;
      }

      try {
        const status = await this.getTransactionStatus(reference);

        console.log(
          `📊 Status polling (${Math.round(elapsed / 1000)}s):`,
          status
        );

        // Callback de mise à jour du statut
        onStatusUpdate(status);

        if (status.status === "completed") {
          clearInterval(pollInterval);
          console.log("✅ Transaction complétée via polling");
          onSuccess(status);
        } else if (status.status === "failed") {
          clearInterval(pollInterval);
          console.log("❌ Transaction échouée via polling");
          onFailure(status);
        }
      } catch (error) {
        console.error("🚨 Erreur lors du polling:", error);
        // Ne pas arrêter le polling pour une erreur temporaire
      }
    }, interval);

    // Retourner une fonction pour arrêter le polling manuellement
    return () => clearInterval(pollInterval);
  }

  /**
   * Vérifier le statut d'une transaction
   */
  async getTransactionStatus(reference) {
    return this.request(`/wallet/transaction/${reference}/status`);
  }

  /**
   * Retrait (logique inchangée)
   */
  async withdraw(data) {
    return this.request("/wallet/withdraw", {
      method: "POST",
      body: JSON.stringify({
        amount: data.amount,
        payment_method: data.method,
        phone_number: data.phoneNumber,
      }),
    });
  }

  /**
   * Obtenir l'historique des transactions
   */
  async getTransactions(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/wallet/transactions?${query}`);
  }

  /**
   * Obtenir les détails d'une transaction
   */
  async getTransactionDetails(reference) {
    return this.request(`/wallet/transactions/${reference}`);
  }

  // Game rooms endpoints
  async getRooms(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/rooms?${query}`);
  }

  async createRoom(roomData) {
    return this.request("/rooms", {
      method: "POST",
      body: JSON.stringify({
        name: roomData.name,
        bet_amount: roomData.bet,
        max_players: 2,
        rounds_to_win: roomData.roundsToWin || 3,
        time_limit: roomData.timeLimit || 300,
        allow_spectators: roomData.allowSpectators || false,
      }),
    });
  }

  async joinRoom(roomCode) {
    return this.request(`/rooms/${roomCode}/join`, {
      method: "POST",
    });
  }

  async leaveRoom(roomCode) {
    return this.request(`/rooms/${roomCode}/leave`, {
      method: "POST",
    });
  }

  async getRoom(roomCode) {
    return this.request(`/rooms/${roomCode}`);
  }

  async markPlayerReady(roomCode) {
    return this.request(`/rooms/${roomCode}/ready`, {
      method: "POST",
    });
  }

  // Game endpoints
  async getGameState(gameId) {
    const response = await this.request(`/games/${gameId}/state`);
    return response.state;
  }

  async playCard(gameId, cardData) {
    return this.request(`/games/${gameId}/play`, {
      method: "POST",
      body: JSON.stringify({ card: cardData }),
    });
  }

  async passCard(gameId) {
    return this.request(`/games/${gameId}/pass`, {
      method: "POST",
    });
  }

  async forfeitGame(gameId) {
    return this.request(`/games/${gameId}/forfeit`, {
      method: "POST",
    });
  }

  async getGameMoves(gameId) {
    const response = await this.request(`/games/${gameId}/moves`);
    return response.moves;
  }

  // Stats endpoints
  async getMyStats() {
    const response = await this.request("/stats/me");
    return response.stats;
  }

  async getLeaderboard(params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await this.request(`/stats/leaderboard?${query}`);
    return response;
  }

  async getAchievements() {
    const response = await this.request("/stats/achievements");
    return response;
  }

  async getUserStats(userId) {
    const response = await this.request(`/stats/user/${userId}`);
    return response;
  }

  // Méthodes utilitaires pour le frontend

  /**
   * Valider un numéro de téléphone gabonais
   */
  validateGabonPhone(phone) {
    const gabonPhoneRegex = /^(074|077|076|062|065|066|060)[0-9]{6}$/;
    return gabonPhoneRegex.test(phone);
  }

  /**
   * Déterminer l'opérateur depuis le numéro
   */
  getOperatorFromPhone(phone) {
    if (!this.validateGabonPhone(phone)) {
      return null;
    }

    const prefix = phone.substring(0, 3);

    if (["074", "077", "076"].includes(prefix)) {
      return "airtel";
    }

    if (["062", "065", "066", "060"].includes(prefix)) {
      return "moov";
    }

    return null;
  }

  /**
   * Formater un montant en FCFA
   */
  formatAmount(amount) {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  /**
   * Obtenir le statut de santé de l'API
   */
  async getHealthStatus() {
    try {
      return await this.request("/health");
    } catch (error) {
      return { status: "error", message: error.message };
    }
  }

  /**
   * Tester la connectivité avec les callbacks
   */
  async testCallbackConnectivity() {
    try {
      // Utiliser l'endpoint de test sans authentification
      const response = await fetch(`${API_BASE_URL}/callback/test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          test: "frontend_connectivity",
          timestamp: new Date().toISOString(),
        }),
      });

      return await response.json();
    } catch (error) {
      console.error("Test de connectivité échoué:", error);
      throw error;
    }
  }
}

export default new ApiService();
