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

  async deposit(data) {
    return this.request("/wallet/deposit", {
      method: "POST",
      body: JSON.stringify({
        amount: data.amount,
        payment_method: data.method,
        phone_number: data.phoneNumber,
      }),
    });
  }

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

  async getTransactions(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/wallet/transactions?${query}`);
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

  // Game endpoints
  async getGameState(gameId) {
    const response = await this.request(`/games/${gameId}/state`);
    return response.state;
  }

  async playCard(gameId, cardData) {
    return this.request(`/games/${gameId}/play-card`, {
      method: "POST",
      body: JSON.stringify({ card: cardData }),
    });
  }

  async forfeitGame(gameId) {
    return this.request(`/games/${gameId}/forfeit`, {
      method: "POST",
    });
  }

  // Stats endpoints
  async getMyStats() {
    const response = await this.request("/stats/my-stats");
    return response.stats;
  }

  async getLeaderboard(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/stats/leaderboard?${query}`);
  }
}

export default new ApiService();
