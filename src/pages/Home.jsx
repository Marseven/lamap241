import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="mobile-container">
      {/* Logo centré */}
      <div className="logo mb-8">
        <img src="/logo.png" alt="LaMap241" className="w-40 h-auto" />
      </div>

      {/* Menu d'actions */}
      <div className="w-full space-y-4 text-center">
        <Link to="/game/solo">
          <button className="btn-primary w-full">♠ Jouer une partie</button>
        </Link>

        <Link to="/">
          <button className="btn-primary w-full">♥ S’inscrire</button>
        </Link>

        <button
          className="btn-primary w-full"
          onClick={() => navigator.share?.({
            title: 'LaMap241',
            text: 'Viens jouer une partie sur LaMap241 !',
            url: window.location.href,
          })}
        >
          ♦ Partager
        </button>

        <Link to="/rules">
          <button className="btn-primary w-full">♣ Règles</button>
        </Link>
      </div>
    </div>
  );
}