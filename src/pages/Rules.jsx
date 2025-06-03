import { Link } from 'react-router-dom';

export default function Rules() {
  return (
    <div className="mobile-container">
      <div className="game-header">
        <Link to="/" className="btn btn-primary btn-menu">
          Accueil
        </Link>
      </div>
      <div className="text-white p-4">
        <h2 className="text-xl font-bold mb-4">Règles du jeu Garame</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Chaque joueur reçoit 5 cartes, allant de 2 à 10, dans l’une des 4 familles : ♥, ♦, ♠, ♣.</li>
          <li>Le joueur qui commence pose une carte sur le tapis.</li>
          <li>Son adversaire doit répondre avec une carte de <strong>même famille</strong> et de <strong>valeur supérieure</strong>.</li>
          <li>Si l’adversaire ne peut pas répondre, il perd la main et le joueur initial garde le contrôle et joue une autre carte.</li>
          <li>Le duel se poursuit ainsi jusqu’à épuisement des cartes. Celui qui garde la main à la fin remporte la manche.</li>
          <li>Une partie se joue en 5 manches. Le premier joueur à remporter 3 manches gagne la partie.</li>
          <li><strong>Pari :</strong> un joueur peut créer une partie avec une mise d’argent. L’autre joueur doit accepter la même mise pour rejoindre.</li>
          <li>La somme est déduite du solde de chaque joueur. Le vainqueur empoche <strong>90%</strong> de la cagnotte, et <strong>10%</strong> vont à la plateforme LaMap241.</li>
          <li>Il est <strong>interdit d’abandonner une partie</strong> contre un autre joueur. Contre l’IA, c’est autorisé.</li>
        </ul>
      </div>
    </div>
  );
}