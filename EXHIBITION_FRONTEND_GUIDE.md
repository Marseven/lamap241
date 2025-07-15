# Guide Frontend - Parties d'Exhibition

## 🎯 Fonctionnalités ajoutées

### 1. Sélecteur de type de partie
- **Emplacement** : `src/pages/CreateRoomPage.jsx`
- **Fonctionnalité** : Toggle entre "Partie officielle" et "Partie d'exhibition"
- **Interface** : Cartes sélectionnables avec radio buttons

### 2. Validation conditionnelle
- **Pari** : Requis seulement pour les parties officielles
- **Solde** : Vérifié seulement pour les parties avec mise
- **Bouton** : Texte adapté selon le type de partie

### 3. Affichage des salles
- **Badge d'exhibition** : Identificateur visuel "🎮 EXHIBITION"
- **Affichage du pari** : "Partie gratuite - Sans mise" pour les exhibitions
- **Logique de participation** : Pas de vérification de solde pour les exhibitions

### 4. Styles CSS
- **Fichier** : `src/styles/exhibition.css`
- **Couleurs** : Dégradé violet pour l'exhibition
- **Responsive** : Adaptation mobile incluse

## 📋 Modifications des composants

### CreateRoomPage.jsx
```javascript
// Nouvelle propriété dans le state
const [formData, setFormData] = useState({
  // ... autres propriétés
  isExhibition: false
});

// Validation conditionnelle
if (!formData.isExhibition) {
  // Validation du pari seulement pour les parties officielles
}

// Données envoyées à l'API
const roomData = {
  // ... autres données
  isExhibition: formData.isExhibition,
  bet: formData.isExhibition ? 0 : parseInt(formData.bet)
};
```

### GameRoomsPage.jsx
```javascript
// Logique de participation mise à jour
const canJoinRoom = (room) => {
  return room.status === 'waiting' && 
         !room.players.includes(user?.pseudo) &&
         room.players.length < room.maxPlayers &&
         (room.isExhibition || room.bet <= (user?.balance || 0));
};

// Affichage conditionnel
{room.isExhibition ? (
  <div className="room-exhibition">
    <span className="exhibition-icon">🎮</span>
    <span className="exhibition-text">Partie gratuite - Sans mise</span>
  </div>
) : (
  // Affichage normal du pari
)}
```

### api.js
```javascript
async createRoom(roomData) {
  const requestData = {
    name: roomData.name,
    max_players: 2,
    rounds_to_win: roomData.roundsToWin || 3,
    time_limit: roomData.timeLimit || 300,
    allow_spectators: roomData.allowSpectators || false,
    is_exhibition: roomData.isExhibition || false,
  };

  // Ajouter bet_amount seulement si ce n'est pas une exhibition
  if (!roomData.isExhibition) {
    requestData.bet_amount = roomData.bet;
  }

  return this.request("/rooms", {
    method: "POST",
    body: JSON.stringify(requestData),
  });
}
```

## 🎨 Interface utilisateur

### Sélecteur de type de partie
- **Design** : Deux cartes côte à côte
- **Parti officielle** : Icône 💰, couleur normale
- **Partie d'exhibition** : Icône 🎮, couleur violette
- **État actif** : Bordure colorée et élévation

### Badges et indicateurs
- **Badge "🎮 EXHIBITION"** : Affiché à côté du nom du créateur
- **Section pari** : Remplacée par "Partie gratuite - Sans mise"
- **Bouton création** : Texte adapté selon le type

### Couleurs et thème
- **Exhibition** : Dégradé violet (#4f46e5 → #7c3aed)
- **Officielle** : Couleurs standards du thème
- **Consistance** : Même palette dans tous les composants

## 🔧 Utilisation

### Créer une partie d'exhibition
1. Aller sur "Créer une salle"
2. Sélectionner "Partie d'exhibition"
3. Remplir le nom et les paramètres
4. Cliquer sur "Créer la partie d'exhibition (Gratuit)"

### Rejoindre une partie d'exhibition
1. Identifier les salles avec le badge "🎮 EXHIBITION"
2. Voir "Partie gratuite - Sans mise"
3. Cliquer sur "Rejoindre" (pas de vérification de solde)

## 📱 Responsive Design

- **Mobile** : Une seule colonne pour les sélecteurs
- **Tablette** : Deux colonnes conservées
- **Desktop** : Interface complète

## 🧪 Tests suggérés

1. **Création** : Tester les deux types de parties
2. **Validation** : Vérifier la validation conditionnelle
3. **Affichage** : Contrôler les badges et indicateurs
4. **Participation** : Rejoindre sans vérification de solde
5. **Responsive** : Tester sur différentes tailles d'écran

## 📚 Fichiers modifiés

- `src/pages/CreateRoomPage.jsx` - Interface de création
- `src/pages/GameRoomsPage.jsx` - Affichage des salles
- `src/services/api.js` - Communication avec l'API
- `src/styles/exhibition.css` - Styles spécifiques
- `EXHIBITION_FRONTEND_GUIDE.md` - Cette documentation

## 🚀 Prochaines étapes

1. Tester l'interface complète
2. Ajuster les styles si nécessaire
3. Optimiser les performances
4. Ajouter des animations de transition
5. Intégrer avec le système de notifications