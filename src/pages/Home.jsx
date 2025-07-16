import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGameRoom } from '../contexts/GameRoomContext';

export default function Home() {
  const { user } = useAuth();
  const { getAvailableRooms } = useGameRoom();
  const availableRooms = Array.isArray(getAvailableRooms()) ? getAvailableRooms() : [];

  return (
    <div className="mobile-container">
      <div className="lamap-home neon-theme">
      <div className="lamap-logo">
        <img src="/logo.png" alt="La Map" />
        <div className="subtitle">🇬🇦 Jeu de cartes</div>
      </div>

      {/* Actions */}
      <div className="action-grid">
        <Link to="/create-room" className="action-card">
          <span>♥</span>
          <p>Créer<br />une partie</p>
        </Link>
        <Link to="/rooms" className="action-card">
          <span>♠</span>
          <p>Rejoindre<br />une partie</p>
          {availableRooms.length > 0 && (
            <div className="notif-badge">{availableRooms.length}</div>
          )}
        </Link>
        <Link to="/game/vs-ai" className="action-card">
          <span>🤖</span>
          <p>Jouer<br/>contre l’IA</p>
        </Link>
        <Link to="/wallet" className="action-card">
          <span>💰</span>
          <p>Portefeuille</p>
        </Link>
      </div>

      {/* Stats */}
      <div className="lamap-section">
        <h3>📊 Tes stats</h3>
        <div className="stats-row">
          <div><strong>{user?.stats?.gamesPlayed || 0}</strong><span>Parties</span></div>
          <div><strong>{user?.stats?.gamesWon || 0}</strong><span>Victoire</span></div>
          <div><strong>{user?.stats?.totalEarnings || 0}</strong><span>FCFA gagnés</span></div>
        </div>
      </div>

      {/* Parties disponibles */}
      {availableRooms.length > 0 && (
        <div className="lamap-section">
          <h3>🎮 Parties disponibles</h3>
          <div className="avatar-row">
            {availableRooms.slice(0, 3).map(room => (
              <div key={room.id} className="avatar-item">
                <div className="avatar-img"></div>
                <div className="avatar-name">{room.creator}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="lamap-section">
        <h3>♠♥♣♦ La Map</h3>
        <p>La première plateforme de jeu Garame du Gabon. Jouez avec vos amis ou contre l’IA, misez de l’argent réel et gagnez !</p>
      </div>
    </div>
    </div>
  );
}