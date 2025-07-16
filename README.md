# 🎮 La Map 241 - Frontend React

## 📋 Description

**La Map 241 Frontend** est une application web moderne développée en React/TypeScript avec Vite. Elle offre une interface utilisateur interactive pour le jeu de cartes multijoueur "La Map 241" avec des fonctionnalités avancées de statistiques, gestion des bots IA et temps réel.

## 🎯 Fonctionnalités Principales

### 🃏 Interface de Jeu
- **Jeu de cartes interactif** avec animations fluides
- **Salles multijoueurs** avec codes de rejoindre
- **Mode exhibition** (parties gratuites)
- **Gestion des tours** en temps réel
- **Interface responsive** pour mobile et desktop

### 🤖 Gestion des Bots IA
- **Création de bots** avec 3 niveaux de difficulté
- **Interface de gestion** complète
- **Statistiques des bots** en temps réel
- **Intégration dans les parties** automatique

### 📊 Dashboard Statistiques
- **Métriques personnelles** détaillées
- **6 types de classements** (gains, taux victoire, volume, etc.)
- **25 achievements** avec progression
- **Graphiques interactifs** avec Recharts
- **Comparaisons entre joueurs**

### 💰 Portefeuille Numérique
- **Solde en temps réel** dans le header
- **Dépôts et retraits** via Mobile Money
- **Historique des transactions** complet
- **Notifications** pour les paiements

### 🔄 Temps Réel
- **WebSocket** avec Laravel Echo
- **Notifications push** pour achievements
- **Mises à jour automatiques** des parties
- **Synchronisation** multi-appareils

## 🛠️ Technologies Utilisées

### Core
- **React 19** avec hooks modernes
- **TypeScript** pour la robustesse
- **Vite** pour le build ultra-rapide
- **Tailwind CSS** pour le styling

### UI/UX
- **Headless UI** pour composants accessibles
- **Heroicons** pour icônes cohérentes
- **Framer Motion** pour animations fluides
- **Recharts** pour graphiques interactifs

### État et Données
- **Zustand** pour gestion d'état globale
- **React Query** pour cache API
- **Socket.io Client** pour WebSocket
- **Axios** pour requêtes HTTP

## 📦 Installation

### Prérequis
```bash
- Node.js 18+ 
- npm ou yarn
- API Backend La Map 241 fonctionnelle
```

### Installation
```bash
# Cloner le projet
git clone [repository-url]
cd lamap241

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
```

### Configuration
```env
# .env.local
VITE_API_URL=http://localhost:8000/api
VITE_WS_URL=ws://localhost:8000
VITE_APP_NAME="La Map 241"
```

## 🚀 Démarrage

### Développement
```bash
# Démarrer le serveur de développement
npm run dev

# Ouvrir dans le navigateur
# http://localhost:5173
```

### Production
```bash
# Build pour la production
npm run build

# Prévisualiser le build
npm run preview

# Servir les fichiers statiques
npm run serve
```

## 🏗️ Architecture

### Structure des Dossiers
```
src/
├── components/          # Composants réutilisables
│   ├── AppHeader.jsx   # Header avec navigation
│   ├── GameBoard.jsx   # Plateau de jeu
│   ├── StatsDashboard.jsx  # Dashboard stats
│   ├── BotManager.jsx  # Gestion des bots
│   └── ...
├── pages/              # Pages principales
│   ├── Home.jsx        # Page d'accueil
│   ├── GameRoom.jsx    # Salle de jeu
│   ├── StatsPage.jsx   # Page statistiques
│   └── ...
├── services/           # Services API
│   ├── api.js          # Client API principal
│   └── websocket.js    # WebSocket client
├── stores/             # Stores Zustand
│   └── gameStore.js    # État global du jeu
├── hooks/              # Hooks personnalisés
│   ├── useAuth.js      # Authentification
│   ├── useWebSocket.js # WebSocket
│   └── ...
├── utils/              # Utilitaires
│   ├── cardEngine.js   # Logique des cartes
│   └── gameLogic.js    # Logique du jeu
└── types/              # Types TypeScript
    └── global.d.ts
```

### Composants Principaux

#### StatsDashboard
- **Vue d'ensemble** des performances
- **Graphiques** avec Recharts
- **Achievements** avec progression
- **Fallbacks** pour API indisponible

#### BotManager
- **Création de bots** avec formulaire
- **Liste des bots** avec actions
- **Intégration** dans les parties
- **Statistiques** des bots

#### GameBoard
- **Plateau de jeu** interactif
- **Animations** des cartes
- **Gestion des tours** en temps réel
- **Interface responsive**

## 🔗 Intégration API

### Endpoints Utilisés
```javascript
// Authentification
POST /api/auth/login
GET  /api/auth/profile

// Jeu
GET  /api/rooms
POST /api/rooms/{code}/join
POST /api/games/{id}/play

// Statistiques (avec fallbacks)
GET  /api/enhanced-stats/me/detailed
GET  /api/enhanced-stats/leaderboards
GET  /api/enhanced-stats/me/achievements

// Bots
GET  /api/bots
POST /api/bots
POST /api/bots/rooms/{code}/add

// Portefeuille
GET  /api/wallet/balance
POST /api/wallet/deposit
```

### Système de Fallbacks
```javascript
// Exemple de fallback automatique
try {
  const stats = await api.getEnhancedStats();
} catch (error) {
  // Fallback vers API de base
  const stats = await api.getBasicStats();
}
```

## 🎨 Design System

### Palette de Couleurs
```css
/* Couleurs principales */
--primary: #DC2626;     /* Rouge principal */
--secondary: #1F2937;   /* Gris foncé */
--accent: #F59E0B;      /* Jaune accent */
--success: #10B981;     /* Vert succès */
--warning: #F59E0B;     /* Orange warning */
--error: #EF4444;       /* Rouge erreur */
```

### Composants UI
- **Boutons** : Variantes primary, secondary, ghost
- **Cards** : Avec shadows et borders cohérents
- **Inputs** : Styling uniforme avec validation
- **Modales** : Avec Headless UI pour accessibilité

## 🔄 Gestion d'État

### Zustand Store
```javascript
// gameStore.js
const useGameStore = create((set, get) => ({
  // État
  stats: null,
  bots: [],
  loading: false,
  
  // Actions
  fetchStats: async () => {
    set({ loading: true });
    const stats = await api.getStats();
    set({ stats, loading: false });
  },
  
  // Fallbacks automatiques
  fetchWithFallback: async (endpoint) => {
    try {
      return await api.enhanced[endpoint]();
    } catch {
      return await api.basic[endpoint]();
    }
  }
}));
```

### Contextes React
- **AuthContext** : Gestion utilisateur
- **GameRoomContext** : État des salles
- **WalletContext** : Portefeuille
- **NotificationContext** : Notifications

## 📱 Responsive Design

### Breakpoints
```css
/* Tailwind breakpoints */
sm: 640px    /* Mobile large */
md: 768px    /* Tablet */
lg: 1024px   /* Desktop */
xl: 1280px   /* Large desktop */
2xl: 1536px  /* Extra large */
```

### Adaptations Mobile
- **Navigation** : Menu burger pour mobile
- **Cartes** : Taille adaptée tactile
- **Tableaux** : Défilement horizontal
- **Modales** : Plein écran sur mobile

## 🔐 Sécurité

### Authentification
```javascript
// Token JWT dans localStorage
const token = localStorage.getItem('lamap_token');

// Headers automatiques
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

### Validation
- **Inputs** : Validation côté client
- **Formulaires** : Sanitisation des données
- **API** : Gestion des erreurs 401/403
- **Routes** : Protection par authentification

## 🎯 Performance

### Optimisations
```javascript
// Lazy loading des pages
const StatsPage = lazy(() => import('./pages/StatsPage'));
const BotManagementPage = lazy(() => import('./pages/BotManagementPage'));

// Memoization des composants
const ExpensiveComponent = memo(({ data }) => {
  return useMemo(() => {
    return <ComplexCalculation data={data} />;
  }, [data]);
});
```

### Métriques
- **Bundle size** : 537KB (151KB gzippé)
- **Load time** : < 2s sur 3G
- **Lighthouse** : 90+ performance
- **Core Web Vitals** : Tous verts

## 📊 Monitoring

### Erreurs
```javascript
// Error boundary pour capturer les erreurs
<ErrorBoundary>
  <App />
</ErrorBoundary>

// Logging des erreurs API
const logError = (error, context) => {
  console.error(`[${context}]`, error);
  // Envoyer vers service de monitoring
};
```

### Analytics
- **Événements** : Tracking des actions utilisateur
- **Performance** : Temps de chargement
- **Erreurs** : Suivi automatique
- **Conversion** : Funnel de jeu

## 🚀 Déploiement

### Build Production
```bash
# Optimiser pour production
npm run build

# Vérifier la taille du bundle
npm run analyze

# Tester le build
npm run preview
```

### Serveur Statique
```nginx
# Nginx configuration
server {
    listen 80;
    server_name frontend.lamap241.com;
    root /path/to/lamap241/dist;
    index index.html;
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Variables d'Environnement
```env
# Production
VITE_API_URL=https://api.lamap241.com/api
VITE_WS_URL=wss://api.lamap241.com
VITE_APP_ENV=production
```

## 🧪 Tests

### Tests Unitaires
```bash
# Lancer les tests
npm run test

# Tests avec coverage
npm run test:coverage

# Tests en watch mode
npm run test:watch
```

### Tests E2E
```bash
# Cypress tests
npm run cypress:open

# Tests headless
npm run cypress:run
```

## 📝 Scripts Disponibles

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:coverage": "vitest --coverage"
  }
}
```

## 🤝 Contribution

### Standards de Code
- **ESLint** avec configuration React
- **Prettier** pour formatage automatique
- **Husky** pour hooks git
- **Conventional commits** pour messages

### Workflow
```bash
# Créer une branche feature
git checkout -b feature/nouvelle-fonctionnalite

# Développer avec hot reload
npm run dev

# Tester et linter
npm run test
npm run lint

# Commit et push
git add .
git commit -m "feat: ajouter dashboard achievements"
git push origin feature/nouvelle-fonctionnalite
```

## 📞 Support

### Debug Mode
```bash
# Développement avec debug
VITE_DEBUG=true npm run dev

# Logs détaillés
localStorage.setItem('debug', 'lamap:*');
```

### Problèmes Courants
1. **Build fails** : Vérifier les types TypeScript
2. **API errors** : Vérifier la connectivité backend
3. **WebSocket issues** : Vérifier les CORS
4. **Performance** : Analyser le bundle size

## 🎉 Fonctionnalités Uniques

### Fallback System
- **Resilience** : Fonctionne même si API partielle
- **Graceful degradation** : Pas de crashes
- **Mock data** : Données simulées si nécessaire

### Real-time Features
- **WebSocket** : Parties en temps réel
- **Notifications** : Achievements instantanés
- **Sync** : État partagé entre onglets

### Accessibility
- **ARIA labels** : Screen reader support
- **Keyboard navigation** : Tab navigation
- **Focus management** : Pour modales
- **Color contrast** : WCAG AA compliant

## 🏆 Statistiques du Projet

- **React Components** : 25+ composants
- **Pages** : 12 pages principales
- **Hooks personnalisés** : 8 hooks
- **Store actions** : 20+ actions Zustand
- **API endpoints** : 30+ endpoints intégrés
- **Fallbacks** : 100% des fonctionnalités

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

**La Map 241 Frontend** - Version 1.0.0  
Développé avec ❤️ en React + TypeScript