const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

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

      // Gérer les erreurs HTTP
      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
    const response = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.token) {
      this.token = response.token;
      localStorage.setItem("lamap_token", response.token);
    }

    return response;
  }

  async register(userData) {
    const response = await this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    if (response.token) {
      this.token = response.token;
      localStorage.setItem("lamap_token", response.token);
    }

    return response;
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
    return this.request("/auth/profile");
  }

  // Wallet endpoints
  async getBalance() {
    return this.request("/wallet/balance");
  }

  async deposit(data) {
    return this.request("/wallet/deposit", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async withdraw(data) {
    return this.request("/wallet/withdraw", {
      method: "POST",
      body: JSON.stringify(data),
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
      body: JSON.stringify(roomData),
    });
  }

  async joinRoom(roomId) {
    return this.request(`/rooms/${roomId}/join`, {
      method: "POST",
    });
  }

  async leaveRoom(roomId) {
    return this.request(`/rooms/${roomId}/leave`, {
      method: "POST",
    });
  }

  async getRoom(roomId) {
    return this.request(`/rooms/${roomId}`);
  }

  // Game endpoints
  async getGameState(gameId) {
    return this.request(`/games/${gameId}`);
  }

  async playCard(gameId, cardData) {
    return this.request(`/games/${gameId}/play`, {
      method: "POST",
      body: JSON.stringify(cardData),
    });
  }

  async forfeitGame(gameId) {
    return this.request(`/games/${gameId}/forfeit`, {
      method: "POST",
    });
  }

  // WebSocket pour le temps réel
  connectWebSocket(gameId) {
    const wsUrl = API_BASE_URL.replace("http", "ws").replace("/api", "");
    const ws = new WebSocket(`${wsUrl}/game/${gameId}?token=${this.token}`);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return ws;
  }

  async initiateDeposit(data) {
    const response = await this.request("/wallet/deposit", {
      method: "POST",
      body: JSON.stringify(data),
    });

    // Si succès, rediriger vers E-Billing
    if (response.success && response.invoice_number) {
      const form = document.createElement("form");
      form.method = "POST";
      form.action = import.meta.env.VITE_EBILLING_POST_URL;

      const invoiceInput = document.createElement("input");
      invoiceInput.type = "hidden";
      invoiceInput.name = "invoice_number";
      invoiceInput.value = response.invoice_number;

      const callbackInput = document.createElement("input");
      callbackInput.type = "hidden";
      callbackInput.name = "eb_callbackurl";
      callbackInput.value = `${window.location.origin}/wallet/callback`;

      form.appendChild(invoiceInput);
      form.appendChild(callbackInput);
      document.body.appendChild(form);
      form.submit();
    }

    return response;
  }

  async initiateWithdrawal(data) {
    return this.request("/wallet/withdraw", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

export default new ApiService();
