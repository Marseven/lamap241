import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGameRoom } from '../contexts/GameRoomContext';

export default function Home() {
  const { user } = useAuth();
  const { getAvailableRooms } = useGameRoom();
  const availableRooms = getAvailableRooms();

  return (
    <div className="mobile-container fade-in">
      {/* Logo centré */}
      <div className="logo">
        <img src="/logo.png" alt="LaMap241" />
        <div className="mt-2 text-sm text-gray-400">
          🇬🇦 Jeu de cartes
        </div>
      </div>

      {/* Menu d'actions amélioré */}
      <div className="space-y-3">
        <Link to="/rooms">
          <button className="btn-primary flex items-center justify-center gap-2">
            ♠ Rejoindre une partie
            {availableRooms.length > 0 && (
              <span className="bg-red-700 px-2 py-1 rounded-full text-xs">
                {availableRooms.length} disponible{availableRooms.length > 1 ? 's' : ''}
              </span>
            )}
          </button>
        </Link>

        <Link to="/create-room">
          <button className="btn-primary">
            ♥ Créer une partie
          </button>
        </Link>

        <Link to="/game/vs-ai">
          <button className="btn-primary">
            🤖 Jouer contre l'IA
          </button>
        </Link>

        <Link to="/wallet">
          <button className="btn-primary flex items-center justify-center gap-2">
            💰 Portefeuille
            <span className="text-green-300 text-sm">
              ({new Intl.NumberFormat('fr-FR').format(user?.balance || 0)} FCFA)
            </span>
          </button>
        </Link>

        <Link to="/rules">
          <button className="btn-primary">
            ♣ Règles du jeu
          </button>
        </Link>

        <button
          className="btn-primary"
          onClick={() => {
            const shareText = "Viens jouer à la carte sur La Map ! 🇬🇦🎴";
            if (navigator.share) {
              navigator.share({
                title: 'La Map',
                text: shareText,
                url: window.location.href,
              });
            } else {
              window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + window.location.href)}`, '_blank');
            }
          }}
        >
          📱 Partager l'app
        </button>
      </div>

      {/* Section info avec statistiques */}
      <div className="mt-8 space-y-4">
        {/* Stats rapides */}
        <div className="bg-gray-800 p-4 rounded-lg border border-red-800">
          <h3 className="font-bold text-yellow-400 mb-3">📊 Tes stats</h3>
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="text-lg font-bold text-blue-400">{user?.stats?.gamesPlayed || 0}</div>
              <div className="text-gray-400">Parties</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-400">{user?.stats?.gamesWon || 0}</div>
              <div className="text-gray-400">Victoires</div>
            </div>
            <div>
              <div className="text-lg font-bold text-yellow-400">
                {new Intl.NumberFormat('fr-FR').format(user?.stats?.totalEarnings || 0)}
              </div>
              <div className="text-gray-400">FCFA gagnés</div>
            </div>
          </div>
        </div>

        {/* Salles actives */}
        {availableRooms.length > 0 && (
          <div className="bg-gray-800 p-4 rounded-lg border border-green-800">
            <h3 className="font-bold text-green-400 mb-3">🎮 Parties disponibles</h3>
            <div className="space-y-2">
              {availableRooms.slice(0, 3).map(room => (
                <div key={room.id} className="flex justify-between items-center bg-gray-700 p-2 rounded">
                  <div>
                    <div className="text-sm font-bold">{room.name}</div>
                    <div className="text-xs text-gray-400">par {room.creator}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-yellow-400">{room.bet} FCFA</div>
                    <Link to="/rooms" className="text-xs text-blue-400">Rejoindre →</Link>
                  </div>
                </div>
              ))}
              {availableRooms.length > 3 && (
                <Link to="/rooms" className="block text-center text-blue-400 text-sm">
                  Voir toutes les salles ({availableRooms.length}) →
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Info app */}
        <div className="bg-gray-800 p-4 rounded-lg border border-red-800">
          <h3 className="font-bold text-yellow-400 mb-2">🎯 La Map</h3>
          <p className="text-sm text-gray-300">
            La première plateforme de jeu Garame du Gabon. 
            Jouez avec vos amis ou contre l'IA, misez de l'argent réel et gagnez !
          </p>
        </div>
      </div>
    </div>
  );
}