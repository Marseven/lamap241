// src/pages/Rules.jsx - Page des règles du Garame améliorée
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';

export default function Rules() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', name: 'Vue d\'ensemble', icon: '🎯' },
    { id: 'cards', name: 'Les cartes', icon: '🃏' },
    { id: 'gameplay', name: 'Comment jouer', icon: '🎮' },
    { id: 'winning', name: 'Conditions de victoire', icon: '🏆' },
    { id: 'betting', name: 'Mises et gains', icon: '💰' },
    { id: 'examples', name: 'Exemples', icon: '📚' }
  ];

  // Cartes d'exemple pour les démonstrations
  const exampleCards = {
    player: [
      { value: 7, suit: '♥' },
      { value: 9, suit: '♠' },
      { value: 5, suit: '♣' },
      { value: 8, suit: '♦' },
      { value: 3, suit: '♥' }
    ],
    autoWin: [
      { value: 3, suit: '♥' },
      { value: 4, suit: '♠' },
      { value: 5, suit: '♣' },
      { value: 6, suit: '♦' },
      { value: 2, suit: '♥' }
    ],
    threeSevens: [
      { value: 7, suit: '♥' },
      { value: 7, suit: '♠' },
      { value: 7, suit: '♣' },
      { value: 8, suit: '♦' },
      { value: 9, suit: '♥' }
    ]
  };

  return (
    <div className="rules-page">
      {/* Header */}
      <div className="rules-header">
        <Link to="/" className="back-btn">
          ← Accueil
        </Link>
        <h1 className="page-title">📋 Règles du Garame</h1>
        <Link to="/game/vs-ai" className="play-btn">
          🎮 Jouer
        </Link>
      </div>

      {/* Navigation des sections */}
      <div className="rules-nav">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
          >
            <span className="nav-icon">{section.icon}</span>
            <span className="nav-label">{section.name}</span>
          </button>
        ))}
      </div>

      {/* Contenu des sections */}
      <div className="rules-content">
        
        {/* Vue d'ensemble */}
        {activeSection === 'overview' && (
          <div className="rules-section">
            <div className="section-header">
              <h2 className="section-title">🎯 Le Garame, c'est quoi ?</h2>
              <p className="section-subtitle">
                Le jeu de cartes traditionnel du Gabon, maintenant en ligne !
              </p>
            </div>

            <div className="overview-grid">
              <div className="overview-card">
                <div className="card-icon">👥</div>
                <div className="card-content">
                  <h3>2 Joueurs</h3>
                  <p>Un duel de stratégie entre deux joueurs</p>
                </div>
              </div>

              <div className="overview-card">
                <div className="card-icon">🃏</div>
                <div className="card-content">
                  <h3>5 Cartes chacun</h3>
                  <p>Valeurs de 3 à 10 (sauf 10♠)</p>
                </div>
              </div>

              <div className="overview-card">
                <div className="card-icon">🎯</div>
                <div className="card-content">
                  <h3>5 Tours maximum</h3>
                  <p>Celui qui contrôle le dernier tour gagne</p>
                </div>
              </div>

              <div className="overview-card">
                <div className="card-icon">⚡</div>
                <div className="card-content">
                  <h3>Parties rapides</h3>
                  <p>3-5 minutes par partie</p>
                </div>
              </div>
            </div>

            <div className="key-principles">
              <h3 className="principles-title">🔑 Principes clés</h3>
              <div className="principles-list">
                <div className="principle-item">
                  <span className="principle-icon">🎲</span>
                  <div className="principle-content">
                    <div className="principle-title">Contrôle de la main</div>
                    <div className="principle-desc">
                      Celui qui joue en premier impose la famille de cartes
                    </div>
                  </div>
                </div>

                <div className="principle-item">
                  <span className="principle-icon">⬆️</span>
                  <div className="principle-content">
                    <div className="principle-title">Cartes croissantes</div>
                    <div className="principle-desc">
                      Pour reprendre la main, jouez une carte plus forte de la même famille
                    </div>
                  </div>
                </div>

                <div className="principle-item">
                  <span className="principle-icon">🎯</span>
                  <div className="principle-content">
                    <div className="principle-title">Stratégie</div>
                    <div className="principle-desc">
                      Gardez vos bonnes cartes pour les moments critiques
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Les cartes */}
        {activeSection === 'cards' && (
          <div className="rules-section">
            <div className="section-header">
              <h2 className="section-title">🃏 Les cartes du Garame</h2>
              <p className="section-subtitle">
                31 cartes au total, de 3 à 10 dans chaque famille
              </p>
            </div>

            <div className="cards-info">
              <div className="cards-deck">
                <h3 className="deck-title">Composition du jeu</h3>
                <div className="deck-families">
                  {['♠', '♥', '♣', '♦'].map(suit => (
                    <div key={suit} className="family-group">
                      <div className="family-header">
                        <span className={`family-icon ${suit === '♥' || suit === '♦' ? 'red' : 'black'}`}>
                          {suit}
                        </span>
                        <span className="family-name">
                          {suit === '♠' ? 'Pique' : 
                           suit === '♥' ? 'Cœur' :
                           suit === '♣' ? 'Trèfle' : 'Carreau'}
                        </span>
                      </div>
                      <div className="family-values">
                        {suit === '♠' ? 
                          '3, 4, 5, 6, 7, 8, 9' : 
                          '3, 4, 5, 6, 7, 8, 9, 10'
                        }
                      </div>
                      {suit === '♠' && (
                        <div className="family-note">* Pas de 10 de pique</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="cards-example">
                <h3 className="example-title">Exemple de main</h3>
                <div className="example-hand">
                  {exampleCards.player.map((card, index) => (
                    <Card 
                      key={index}
                      value={card.value}
                      suit={card.suit}
                      size="small"
                    />
                  ))}
                </div>
                <div className="example-info">
                  <div className="info-item">
                    <span className="info-label">Somme :</span>
                    <span className="info-value">
                      {exampleCards.player.reduce((sum, card) => sum + card.value, 0)}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Familles :</span>
                    <span className="info-value">♥♠♣♦ (variées)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comment jouer */}
        {activeSection === 'gameplay' && (
          <div className="rules-section">
            <div className="section-header">
              <h2 className="section-title">🎮 Comment jouer</h2>
              <p className="section-subtitle">
                Déroulement d'une partie étape par étape
              </p>
            </div>

            <div className="gameplay-steps">
              <div className="step-card">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3 className="step-title">Distribution</h3>
                  <p className="step-description">
                    Chaque joueur reçoit 5 cartes tirées au hasard. 
                    Vérification immédiate des victoires automatiques.
                  </p>
                </div>
              </div>

              <div className="step-card">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3 className="step-title">Premier tour</h3>
                  <p className="step-description">
                    Le joueur qui commence pose n'importe quelle carte. 
                    Cette carte détermine la famille pour ce tour.
                  </p>
                </div>
              </div>

              <div className="step-card">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3 className="step-title">Réponse</h3>
                  <p className="step-description">
                    L'adversaire doit jouer une carte de la même famille et de valeur supérieure 
                    pour reprendre la main, sinon il joue ce qu'il veut.
                  </p>
                </div>
              </div>

              <div className="step-card">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3 className="step-title">Contrôle</h3>
                  <p className="step-description">
                    Celui qui garde la main continue à jouer. 
                    Le duel continue jusqu'à épuisement des cartes.
                  </p>
                </div>
              </div>

              <div className="step-card">
                <div className="step-number">5</div>
                <div className="step-content">
                  <h3 className="step-title">Victoire</h3>
                  <p className="step-description">
                    Celui qui a la main au dernier tour (tour 5) remporte la partie !
                  </p>
                </div>
              </div>
            </div>

            <div className="gameplay-rules">
              <h3 className="rules-title">📜 Règles importantes</h3>
              <div className="rules-grid">
                <div className="rule-card">
                  <div className="rule-icon">🎯</div>
                  <div className="rule-content">
                    <h4>Obligation de famille</h4>
                    <p>Si vous avez des cartes de la famille jouée, vous devez en jouer une</p>
                  </div>
                </div>

                <div className="rule-card">
                  <div className="rule-icon">⬆️</div>
                  <div className="rule-content">
                    <h4>Valeur supérieure</h4>
                    <p>Pour reprendre la main, votre carte doit être plus forte</p>
                  </div>
                </div>

                <div className="rule-card">
                  <div className="rule-icon">🔄</div>
                  <div className="rule-content">
                    <h4>Changement de famille</h4>
                    <p>Si vous n'avez pas la famille, vous pouvez jouer n'importe quoi</p>
                  </div>
                </div>

                <div className="rule-card">
                  <div className="rule-icon">🏁</div>
                  <div className="rule-content">
                    <h4>Tour final décisif</h4>
                    <p>Avoir la main au tour 5 = victoire assurée</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Conditions de victoire */}
        {activeSection === 'winning' && (
          <div className="rules-section">
            <div className="section-header">
              <h2 className="section-title">🏆 Comment gagner</h2>
              <p className="section-subtitle">
                Plusieurs façons de remporter une partie
              </p>
            </div>

            <div className="winning-conditions">
              <div className="condition-card primary">
                <div className="condition-header">
                  <span className="condition-icon">🎯</span>
                  <h3 className="condition-title">Victoire standard</h3>
                </div>
                <div className="condition-content">
                  <p className="condition-description">
                    Avoir la main au tour 5 (dernier tour). C'est la façon la plus courante de gagner.
                  </p>
                  <div className="condition-bonus">
                    <span className="bonus-label">Gain :</span>
                    <span className="bonus-value">Normal (x1)</span>
                  </div>
                </div>
              </div>

              <div className="condition-card special">
                <div className="condition-header">
                  <span className="condition-icon">⚡</span>
                  <h3 className="condition-title">Victoire automatique</h3>
                </div>
                <div className="condition-content">
                  <p className="condition-description">
                    Victoire instantanée dès la distribution des cartes :
                  </p>
                  <div className="auto-win-types">
                    <div className="auto-win-type">
                      <strong>Somme &lt; 21 :</strong> Si vos 5 cartes totalisent moins de 21 points
                    </div>
                    <div className="auto-win-type">
                      <strong>Trois 7 :</strong> Si vous avez 3 cartes de valeur 7
                    </div>
                  </div>
                </div>
              </div>

              <div className="condition-card legendary">
                <div className="condition-header">
                  <span className="condition-icon">👑</span>
                  <h3 className="condition-title">Kora (Bonus)</h3>
                </div>
                <div className="condition-content">
                  <p className="condition-description">
                    Bonus spéciaux en finissant avec un 3 :
                  </p>
                  <div className="kora-types">
                    <div className="kora-type">
                      <strong>Kora Simple (x2) :</strong> Gagner le tour 5 avec un 3
                    </div>
                    <div className="kora-type">
                      <strong>Kora Double (x4) :</strong> Gagner les tours 4 et 5 avec des 3
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="examples-showcase">
              <h3 className="examples-title">💡 Exemples de victoires automatiques</h3>
              
              <div className="example-row">
                <div className="example-case">
                  <h4 className="example-label">Somme &lt; 21</h4>
                  <div className="example-cards">
                    {exampleCards.autoWin.map((card, index) => (
                      <Card 
                        key={index}
                        value={card.value}
                        suit={card.suit}
                        size="small"
                      />
                    ))}
                  </div>
                  <div className="example-result">
                    Somme = {exampleCards.autoWin.reduce((sum, card) => sum + card.value, 0)} &lt; 21 
                    → <strong>Victoire automatique !</strong>
                  </div>
                </div>

                <div className="example-case">
                  <h4 className="example-label">Trois 7</h4>
                  <div className="example-cards">
                    {exampleCards.threeSevens.map((card, index) => (
                      <Card 
                        key={index}
                        value={card.value}
                        suit={card.suit}
                        size="small"
                      />
                    ))}
                  </div>
                  <div className="example-result">
                    Trois cartes de valeur 7 → <strong>Victoire automatique !</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mises et gains */}
        {activeSection === 'betting' && (
          <div className="rules-section">
            <div className="section-header">
              <h2 className="section-title">💰 Mises et gains</h2>
              <p className="section-subtitle">
                Comment fonctionnent les paris sur LaMap241
              </p>
            </div>

            <div className="betting-info">
              <div className="betting-flow">
                <div className="flow-step">
                  <div className="flow-icon">💵</div>
                  <div className="flow-content">
                    <h4>1. Mise de départ</h4>
                    <p>Chaque joueur mise le même montant (minimum 500 FCFA)</p>
                  </div>
                </div>

                <div className="flow-arrow">→</div>

                <div className="flow-step">
                  <div className="flow-icon">🏆</div>
                  <div className="flow-content">
                    <h4>2. Pot total</h4>
                    <p>Les deux mises forment le pot de la partie</p>
                  </div>
                </div>

                <div className="flow-arrow">→</div>

                <div className="flow-step">
                  <div className="flow-icon">📊</div>
                  <div className="flow-content">
                    <h4>3. Commission</h4>
                    <p>LaMap241 prend 10% du pot</p>
                  </div>
                </div>

                <div className="flow-arrow">→</div>

                <div className="flow-step">
                  <div className="flow-icon">🎁</div>
                  <div className="flow-content">
                    <h4>4. Gains</h4>
                    <p>Le gagnant reçoit 90% du pot</p>
                  </div>
                </div>
              </div>

              <div className="betting-calculator">
                <h3 className="calculator-title">🧮 Calculateur de gains</h3>
                <div className="calculator-examples">
                  {[
                    { bet: 1000, pot: 2000, commission: 200, winnings: 1800 },
                    { bet: 5000, pot: 10000, commission: 1000, winnings: 9000 },
                    { bet: 10000, pot: 20000, commission: 2000, winnings: 18000 }
                  ].map(example => (
                    <div key={example.bet} className="calc-row">
                      <div className="calc-input">
                        Mise : {example.bet.toLocaleString()} FCFA
                      </div>
                      <div className="calc-process">
                        Pot : {example.pot.toLocaleString()} FCFA
                        <br />
                        Commission : -{example.commission.toLocaleString()} FCFA
                      </div>
                      <div className="calc-result">
                        <strong>Gains : {example.winnings.toLocaleString()} FCFA</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bonus-multipliers">
                <h3 className="multipliers-title">🎯 Multiplicateurs de gains</h3>
                <div className="multipliers-grid">
                  <div className="multiplier-card">
                    <div className="multiplier-icon">🎯</div>
                    <div className="multiplier-info">
                      <div className="multiplier-name">Victoire normale</div>
                      <div className="multiplier-value">x1</div>
                    </div>
                  </div>

                  <div className="multiplier-card">
                    <div className="multiplier-icon">👑</div>
                    <div className="multiplier-info">
                      <div className="multiplier-name">Kora simple</div>
                      <div className="multiplier-value">x2</div>
                    </div>
                  </div>

                  <div className="multiplier-card legendary">
                    <div className="multiplier-icon">💎</div>
                    <div className="multiplier-info">
                      <div className="multiplier-name">Kora double</div>
                      <div className="multiplier-value">x4</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Exemples */}
        {activeSection === 'examples' && (
          <div className="rules-section">
            <div className="section-header">
              <h2 className="section-title">📚 Exemples de parties</h2>
              <p className="section-subtitle">
                Situations concrètes pour mieux comprendre
              </p>
            </div>

            <div className="examples-container">
              <div className="example-scenario">
                <h3 className="scenario-title">🎯 Scénario 1 : Reprendre la main</h3>
                <div className="scenario-setup">
                  <div className="scenario-step">
                    <strong>Situation :</strong> L'adversaire joue 6♥
                  </div>
                  <div className="scenario-step">
                    <strong>Vos cartes :</strong> 4♥, 8♥, 9♠, 5♣, 3♦
                  </div>
                  <div className="scenario-step">
                    <strong>Choix possibles :</strong>
                    <ul>
                      <li>8♥ → Vous reprenez la main ✅</li>
                      <li>4♥ → Vous perdez la main ❌</li>
                      <li>9♠ → Impossible (pas la bonne famille) ❌</li>
                    </ul>
                  </div>
                  <div className="scenario-result">
                    <strong>Meilleure action :</strong> Jouer 8♥ pour reprendre le contrôle
                  </div>
                </div>
              </div>

              <div className="example-scenario">
                <h3 className="scenario-title">⚡ Scénario 2 : Pas de cartes de la famille</h3>
                <div className="scenario-setup">
                  <div className="scenario-step">
                    <strong>Situation :</strong> L'adversaire joue 7♠
                  </div>
                  <div className="scenario-step">
                    <strong>Vos cartes :</strong> 6♥, 8♥, 9♦, 5♣, 3♦
                  </div>
                  <div className="scenario-step">
                    <strong>Analyse :</strong> Aucune carte ♠ dans votre main
                  </div>
                  <div className="scenario-step">
                    <strong>Action :</strong> Vous pouvez jouer n'importe quelle carte
                  </div>
                  <div className="scenario-result">
                    <strong>Stratégie :</strong> Jouer votre plus petite carte (3♦) pour économiser les fortes
                  </div>
                </div>
              </div>

              <div className="example-scenario">
                <h3 className="scenario-title">👑 Scénario 3 : Opportunité de Kora</h3>
                <div className="scenario-setup">
                  <div className="scenario-step">
                    <strong>Situation :</strong> Tour 5, vous avez la main
                  </div>
                  <div className="scenario-step">
                    <strong>Vos cartes :</strong> 3♥
                  </div>
                  <div className="scenario-step">
                    <strong>Opportunité :</strong> Finir avec un 3 = Kora !
                  </div>
                  <div className="scenario-result success">
                    <strong>Résultat :</strong> Victoire avec bonus x2 ! 🎉
                  </div>
                </div>
              </div>
            </div>

            <div className="tips-section">
              <h3 className="tips-title">💡 Conseils stratégiques</h3>
              <div className="tips-grid">
                <div className="tip-card">
                  <div className="tip-icon">🎯</div>
                  <div className="tip-content">
                    <h4>Contrôlez le timing</h4>
                    <p>Gardez vos cartes fortes pour les tours 4 et 5</p>
                  </div>
                </div>

                <div className="tip-card">
                  <div className="tip-icon">🔍</div>
                  <div className="tip-content">
                    <h4>Observez l'adversaire</h4>
                    <p>Déduisez ses cartes d'après ses choix</p>
                  </div>
                </div>

                <div className="tip-card">
                  <div className="tip-icon">⚖️</div>
                  <div className="tip-content">
                    <h4>Gérez vos familles</h4>
                    <p>Diversifiez pour avoir plus d'options</p>
                  </div>
                </div>

                <div className="tip-card">
                  <div className="tip-icon">👑</div>
                  <div className="tip-content">
                    <h4>Pensez au Kora</h4>
                    <p>Gardez vos 3 pour les moments décisifs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Call to action */}
      <div className="rules-footer">
        <div className="cta-card">
          <div className="cta-content">
            <h3 className="cta-title">🎮 Prêt à jouer ?</h3>
            <p className="cta-description">
              Maintenant que vous connaissez les règles, lancez-vous !
            </p>
          </div>
          <div className="cta-actions">
            <Link to="/game/vs-ai" className="cta-btn primary">
              🤖 Jouer contre l'IA
            </Link>
            <Link to="/rooms" className="cta-btn secondary">
              👥 Trouver un adversaire
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}