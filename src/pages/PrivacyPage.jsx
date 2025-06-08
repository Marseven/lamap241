// src/pages/PrivacyPage.jsx - Politique de Confidentialité
import React from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPage() {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <Link to="/" className="back-btn">
          ← Accueil
        </Link>
        <h1 className="page-title">🔒 Politique de Confidentialité</h1>
        <div className="legal-date">
          Dernière mise à jour : 08 Juin 2025
        </div>
      </div>

      <div className="legal-content">
        <div className="legal-section">
          <h2>1. Introduction</h2>
          <p>
            LaMap241 s'engage à protéger votre vie privée et vos données personnelles. 
            Cette politique explique comment nous collectons, utilisons et protégeons vos informations.
          </p>
        </div>

        <div className="legal-section">
          <h2>2. Données collectées</h2>
          <h3>2.1 Données d'inscription</h3>
          <ul>
            <li>Pseudo (obligatoire)</li>
            <li>Adresse email (optionnelle)</li>
            <li>Numéro de téléphone (pour les transactions)</li>
            <li>Date de naissance (vérification d'âge)</li>
          </ul>
          
          <h3>2.2 Données de jeu</h3>
          <ul>
            <li>Historique des parties</li>
            <li>Statistiques de performance</li>
            <li>Préférences de jeu</li>
            <li>Messages de chat (modérés)</li>
          </ul>
          
          <h3>2.3 Données techniques</h3>
          <ul>
            <li>Adresse IP</li>
            <li>Type d'appareil et navigateur</li>
            <li>Données de connexion</li>
            <li>Cookies et technologies similaires</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>3. Utilisation des données</h2>
          <h3>3.1 Finalités</h3>
          <ul>
            <li><strong>Service :</strong> Fournir et améliorer nos services</li>
            <li><strong>Sécurité :</strong> Prévenir la fraude et les abus</li>
            <li><strong>Communication :</strong> Vous contacter si nécessaire</li>
            <li><strong>Légal :</strong> Respecter nos obligations légales</li>
          </ul>
          
          <h3>3.2 Base légale</h3>
          <p>
            Le traitement de vos données repose sur votre consentement et l'exécution 
            du contrat de service.
          </p>
        </div>

        <div className="legal-section">
          <h2>4. Partage des données</h2>
          <h3>4.1 Principe de non-partage</h3>
          <p>
            Nous ne vendons, louons ou partageons vos données personnelles avec des tiers 
            à des fins commerciales.
          </p>
          
          <h3>4.2 Exceptions</h3>
          <ul>
            <li><strong>Prestataires de paiement :</strong> Pour traiter les transactions</li>
            <li><strong>Autorités :</strong> Si requis par la loi</li>
            <li><strong>Sécurité :</strong> Pour protéger nos utilisateurs</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>5. Sécurité des données</h2>
          <h3>5.1 Mesures techniques</h3>
          <ul>
            <li>Chiffrement SSL/TLS pour toutes les communications</li>
            <li>Hashage sécurisé des mots de passe</li>
            <li>Accès limité aux données sensibles</li>
            <li>Surveillance 24h/24 des systèmes</li>
          </ul>
          
          <h3>5.2 Mesures organisationnelles</h3>
          <ul>
            <li>Formation du personnel à la protection des données</li>
            <li>Politiques strictes d'accès aux données</li>
            <li>Audits réguliers de sécurité</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>6. Conservation des données</h2>
          <table className="data-retention-table">
            <thead>
              <tr>
                <th>Type de données</th>
                <th>Durée de conservation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Données de compte actif</td>
                <td>Tant que le compte est actif</td>
              </tr>
              <tr>
                <td>Historique des transactions</td>
                <td>5 ans (obligation légale)</td>
              </tr>
              <tr>
                <td>Données de jeu</td>
                <td>2 ans après fermeture du compte</td>
              </tr>
              <tr>
                <td>Logs techniques</td>
                <td>12 mois maximum</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="legal-section">
          <h2>7. Vos droits</h2>
          <h3>7.1 Droits d'accès et de rectification</h3>
          <p>
            Vous pouvez consulter et modifier vos données personnelles dans votre profil 
            ou en nous contactant.
          </p>
          
          <h3>7.2 Droit à l'effacement</h3>
          <p>
            Vous pouvez demander la suppression de vos données, sous réserve de nos 
            obligations légales de conservation.
          </p>
          
          <h3>7.3 Droit à la portabilité</h3>
          <p>
            Vous pouvez récupérer vos données dans un format structuré et lisible.
          </p>
          
          <h3>7.4 Exercer vos droits</h3>
          <p>
            Pour exercer ces droits, contactez-nous à : <strong>privacy@lamap241.com</strong>
          </p>
        </div>

        <div className="legal-section">
          <h2>8. Cookies et technologies similaires</h2>
          <h3>8.1 Types de cookies</h3>
          <ul>
            <li><strong>Essentiels :</strong> Fonctionnement du site</li>
            <li><strong>Préférences :</strong> Mémoriser vos choix</li>
            <li><strong>Statistiques :</strong> Améliorer nos services</li>
          </ul>
          
          <h3>8.2 Gestion des cookies</h3>
          <p>
            Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur 
            ou dans notre centre de préférences.
          </p>
        </div>

        <div className="legal-section">
          <h2>9. Transferts internationaux</h2>
          <p>
            Vos données sont principalement traitées au Gabon. En cas de transfert vers d'autres pays, 
            nous nous assurons d'un niveau de protection adéquat.
          </p>
        </div>

        <div className="legal-section">
          <h2>10. Mineurs</h2>
          <p>
            Notre service est réservé aux personnes de 18 ans et plus. 
            Nous ne collectons pas consciemment de données de mineurs.
          </p>
        </div>

        <div className="legal-section">
          <h2>11. Modifications de la politique</h2>
          <p>
            Cette politique peut être mise à jour. Les changements significatifs vous seront 
            notifiés par email ou notification dans l'application.
          </p>
        </div>

        <div className="legal-section">
          <h2>12. Contact</h2>
          <p>
            Pour toute question sur cette politique de confidentialité :
          </p>
          <div className="contact-info">
            <p><strong>Délégué à la protection des données :</strong> privacy@lamap241.com</p>
            <p><strong>Adresse :</strong> LaMap241 SARL, Libreville, Gabon</p>
            <p><strong>Téléphone :</strong> +241 XX XX XX XX</p>
          </div>
        </div>
      </div>

      {/* Navigation vers autres pages légales */}
      <div className="legal-navigation">
        <Link to="/terms" className="legal-nav-btn">
          <div className="nav-label">Précédent</div>
          <div className="nav-title">📋 Conditions Générales</div>
        </Link>
        <Link to="/support" className="legal-nav-btn">
          <div className="nav-label">Besoin d'aide ?</div>
          <div className="nav-title">❓ Support</div>
        </Link>
      </div>
    </div>
  );
}