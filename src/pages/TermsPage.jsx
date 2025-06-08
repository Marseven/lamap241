// src/pages/TermsPage.jsx - Conditions Générales d'Utilisation
import React from 'react';
import { Link } from 'react-router-dom';

export default function TermsPage() {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <Link to="/" className="back-btn">
          ← Accueil
        </Link>
        <h1 className="page-title">📋 Conditions Générales d'Utilisation</h1>
        <div className="legal-date">
          Dernière mise à jour : 08 Juin 2025
        </div>
      </div>

      <div className="legal-content">
        <div className="legal-section">
          <h2>1. Présentation du service</h2>
          <p>
            LaMap241 est une plateforme de jeu en ligne proposant le jeu traditionnel gabonais "Garame". 
            Le service est exploité par LaMap241 SARL, société de droit gabonais.
          </p>
          <p>
            En utilisant notre service, vous acceptez ces conditions générales d'utilisation dans leur intégralité.
          </p>
        </div>

        <div className="legal-section">
          <h2>2. Inscription et compte utilisateur</h2>
          <h3>2.1 Conditions d'inscription</h3>
          <ul>
            <li>Vous devez être âgé de 18 ans minimum</li>
            <li>Vous devez résider au Gabon</li>
            <li>Un seul compte par personne physique</li>
            <li>Les informations fournies doivent être exactes et à jour</li>
          </ul>
          
          <h3>2.2 Responsabilités du compte</h3>
          <p>
            Vous êtes responsable de la confidentialité de vos identifiants de connexion. 
            Toute activité sur votre compte sera considérée comme effectuée par vous.
          </p>
        </div>

        <div className="legal-section">
          <h2>3. Règles du jeu</h2>
          <h3>3.1 Jeu équitable</h3>
          <p>
            Tous les jeux sont basés sur les règles traditionnelles du Garame. 
            L'algorithme de distribution des cartes est certifié équitable.
          </p>
          
          <h3>3.2 Interdictions</h3>
          <ul>
            <li>Utilisation de logiciels automatisés (bots)</li>
            <li>Collusion entre joueurs</li>
            <li>Exploitation de bugs ou failles</li>
            <li>Comportement antisportif ou offensant</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>4. Transactions financières</h2>
          <h3>4.1 Dépôts</h3>
          <p>
            Les dépôts sont acceptés via Airtel Money et Moov Money. 
            Le montant minimum est de 500 FCFA, maximum 500,000 FCFA par transaction.
          </p>
          
          <h3>4.2 Retraits</h3>
          <p>
            Les retraits sont traités sous 24h ouvrables. Le montant minimum est de 1,000 FCFA.
            Des frais de 2% s'appliquent (minimum 100 FCFA).
          </p>
          
          <h3>4.3 Vérification d'identité</h3>
          <p>
            Nous nous réservons le droit de demander une vérification d'identité 
            pour les retraits supérieurs à 100,000 FCFA.
          </p>
        </div>

        <div className="legal-section">
          <h2>5. Limitation de responsabilité</h2>
          <p>
            LaMap241 ne peut être tenu responsable des pertes financières liées au jeu. 
            Le jeu doit rester un divertissement et être pratiqué de manière responsable.
          </p>
          <div className="warning-box">
            <h4>⚠️ Jeu responsable</h4>
            <p>
              Le jeu peut créer une dépendance. Jouez avec modération et n'engagez que 
              des sommes que vous pouvez vous permettre de perdre.
            </p>
          </div>
        </div>

        <div className="legal-section">
          <h2>6. Propriété intellectuelle</h2>
          <p>
            Tous les éléments de la plateforme (design, code, marques) sont protégés par 
            le droit d'auteur et appartiennent à LaMap241 SARL.
          </p>
        </div>

        <div className="legal-section">
          <h2>7. Suspension et résiliation</h2>
          <h3>7.1 Suspension du compte</h3>
          <p>
            Nous pouvons suspendre votre compte en cas de violation des présentes conditions 
            ou de comportement suspect.
          </p>
          
          <h3>7.2 Résiliation</h3>
          <p>
            Vous pouvez fermer votre compte à tout moment. Les fonds restants seront remboursés 
            après vérification.
          </p>
        </div>

        <div className="legal-section">
          <h2>8. Modification des conditions</h2>
          <p>
            Ces conditions peuvent être modifiées à tout moment. Les utilisateurs seront 
            informés par notification dans l'application.
          </p>
        </div>

        <div className="legal-section">
          <h2>9. Droit applicable et juridiction</h2>
          <p>
            Ces conditions sont régies par le droit gabonais. 
            Tout litige sera de la compétence exclusive des tribunaux de Libreville.
          </p>
        </div>

        <div className="legal-section">
          <h2>10. Contact</h2>
          <p>
            Pour toute question concernant ces conditions :
          </p>
          <div className="contact-info">
            <p><strong>Email :</strong> legal@lamap241.com</p>
            <p><strong>Adresse :</strong> Libreville, Gabon</p>
            <p><strong>Téléphone :</strong> +241 XX XX XX XX</p>
          </div>
        </div>
      </div>

      {/* Navigation vers autres pages légales */}
      <div className="legal-navigation">
        <Link to="/privacy" className="legal-nav-btn">
          <div className="nav-label">Suivant</div>
          <div className="nav-title">🔒 Politique de Confidentialité</div>
        </Link>
      </div>
    </div>
  );
}