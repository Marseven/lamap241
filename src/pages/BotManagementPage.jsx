import React from 'react';
import BotManager from '../components/BotManager';

const BotManagementPage = () => {
  return (
    <div className="mobile-container neon-theme">
      <div className="lamap-section">
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--lamap-white)', textAlign: 'center', marginBottom: '1rem' }}>
          🤖 Gestion des Bots IA
        </h1>
        <p style={{ color: '#888', textAlign: 'center', marginBottom: '2rem' }}>
          Créez et gérez vos adversaires intelligents
        </p>
      </div>

      <div className="lamap-section">
        <div style={{
          background: '#111',
          border: '2px solid var(--lamap-red)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 0 15px rgba(198, 40, 40, 0.3)'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--lamap-red)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🧠</span>
            À propos des Bots IA
          </h3>
          <div style={{ color: 'var(--lamap-white)', lineHeight: '1.6' }}>
            <p style={{ marginBottom: '1rem' }}>
              Les bots IA sont des adversaires intelligents qui peuvent rejoindre vos parties.
              Ils utilisent des algorithmes avancés pour jouer selon les règles de La Map 241.
            </p>
            <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ 
                  background: '#4ade80', 
                  color: '#000', 
                  padding: '0.2rem 0.5rem', 
                  borderRadius: '8px', 
                  fontSize: '0.7rem', 
                  fontWeight: 'bold' 
                }}>
                  FACILE
                </span>
                <span style={{ fontSize: '0.9rem' }}>Prend des décisions simples, idéal pour débuter</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ 
                  background: '#f59e0b', 
                  color: '#000', 
                  padding: '0.2rem 0.5rem', 
                  borderRadius: '8px', 
                  fontSize: '0.7rem', 
                  fontWeight: 'bold' 
                }}>
                  MOYEN
                </span>
                <span style={{ fontSize: '0.9rem' }}>Analyse les cartes jouées et adapte sa stratégie</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ 
                  background: '#ef4444', 
                  color: '#fff', 
                  padding: '0.2rem 0.5rem', 
                  borderRadius: '8px', 
                  fontSize: '0.7rem', 
                  fontWeight: 'bold' 
                }}>
                  DIFFICILE
                </span>
                <span style={{ fontSize: '0.9rem' }}>Utilise des stratégies avancées et mémorise les patterns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BotManager />

      <div className="lamap-section">
        <div style={{
          background: '#111',
          border: '1px solid #fbbf24',
          borderRadius: '12px',
          padding: '1.5rem',
          marginTop: '2rem',
          boxShadow: '0 0 10px rgba(251, 191, 36, 0.2)'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fbbf24', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>💡</span>
            Conseils d'utilisation
          </h3>
          <div style={{ color: 'var(--lamap-white)' }}>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fbbf24', marginBottom: '0.5rem' }}>
                  🎯 Pour l'entraînement:
                </h4>
                <ul style={{ fontSize: '0.9rem', lineHeight: '1.5', paddingLeft: '1rem' }}>
                  <li style={{ marginBottom: '0.25rem' }}>• Commencez avec des bots "Facile" pour apprendre</li>
                  <li style={{ marginBottom: '0.25rem' }}>• Progressez vers "Moyen" pour améliorer votre stratégie</li>
                  <li style={{ marginBottom: '0.25rem' }}>• Défiez les bots "Difficile" pour vous perfectionner</li>
                </ul>
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fbbf24', marginBottom: '0.5rem' }}>
                  🎮 Pour les parties:
                </h4>
                <ul style={{ fontSize: '0.9rem', lineHeight: '1.5', paddingLeft: '1rem' }}>
                  <li style={{ marginBottom: '0.25rem' }}>• Ajoutez des bots pour compléter les parties</li>
                  <li style={{ marginBottom: '0.25rem' }}>• Mélangez différents niveaux pour varier l'expérience</li>
                  <li style={{ marginBottom: '0.25rem' }}>• Suivez les statistiques pour évaluer votre progression</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotManagementPage;