// src/pages/SupportPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';

export default function SupportPage() {
  const { success, error } = useNotifications();
  const [activeSection, setActiveSection] = useState('faq');
  const [contactForm, setContactForm] = useState({
    subject: '',
    category: 'general',
    message: '',
    email: '',
    urgent: false
  });
  const [loading, setLoading] = useState(false);

  const faqData = [
    {
      category: 'account',
      title: 'Compte et inscription',
      questions: [
        {
          q: 'Comment créer un compte ?',
          a: 'Cliquez sur "S\'inscrire" et remplissez le formulaire avec votre pseudo, email et mot de passe. Vous recevrez un bonus de bienvenue de 1000 FCFA !'
        },
        {
          q: 'J\'ai oublié mon mot de passe',
          a: 'Utilisez le lien "Mot de passe oublié" sur la page de connexion. Vous recevrez un email pour réinitialiser votre mot de passe.'
        },
        {
          q: 'Comment changer mon pseudo ?',
          a: 'Allez dans votre profil > Modifier. Vous pouvez changer votre pseudo une fois par mois gratuitement.'
        }
      ]
    },
    {
      category: 'payment',
      title: 'Paiements et retraits',
      questions: [
        {
          q: 'Quels moyens de paiement acceptez-vous ?',
          a: 'Nous acceptons Airtel Money et Moov Money. Les dépôts sont instantanés et sans frais.'
        },
        {
          q: 'Combien de temps prend un retrait ?',
          a: 'Les retraits sont traités sous 24h. Des frais de 2% s\'appliquent (minimum 100 FCFA).'
        },
        {
          q: 'Quel est le montant minimum pour retirer ?',
          a: 'Le montant minimum de retrait est de 1000 FCFA.'
        },
        {
          q: 'Ma transaction a échoué, que faire ?',
          a: 'Vérifiez votre solde Mobile Money et réessayez. Si le problème persiste, contactez-nous.'
        }
      ]
    },
    {
      category: 'game',
      title: 'Jeu et règles',
      questions: [
        {
          q: 'Comment jouer au Garame ?',
          a: 'Consultez notre page "Règles du jeu" pour un guide complet avec exemples visuels.'
        },
        {
          q: 'Puis-je jouer gratuitement ?',
          a: 'Oui ! Vous pouvez vous entraîner contre l\'IA gratuitement ou regarder d\'autres parties.'
        },
        {
          q: 'Que se passe-t-il si je perds la connexion ?',
          a: 'Vous avez 5 minutes pour vous reconnecter. Sinon, la partie est considérée comme abandonnée.'
        },
        {
          q: 'Comment fonctionnent les niveaux ?',
          a: 'Votre niveau augmente en gagnant des parties et en débloquant des succès. Plus votre niveau est élevé, plus vous débloquez de fonctionnalités.'
        }
      ]
    },
    {
      category: 'technical',
      title: 'Problèmes techniques',
      questions: [
        {
          q: 'L\'app est lente, que faire ?',
          a: 'Fermez les autres applications, vérifiez votre connexion internet et redémarrez l\'app.'
        },
        {
          q: 'Je ne reçois pas les notifications',
          a: 'Vérifiez les paramètres de notification dans votre téléphone et dans l\'app.'
        },
        {
          q: 'Comment signaler un bug ?',
          a: 'Utilisez le formulaire de contact ci-dessous en sélectionnant "Problème technique".'
        }
      ]
    }
  ];

  const contactCategories = [
    { value: 'general', label: 'Question générale' },
    { value: 'payment', label: 'Problème de paiement' },
    { value: 'technical', label: 'Problème technique' },
    { value: 'account', label: 'Problème de compte' },
    { value: 'game', label: 'Problème de jeu' },
    { value: 'suggestion', label: 'Suggestion' },
    { value: 'other', label: 'Autre' }
  ];

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    if (!contactForm.subject || !contactForm.message) {
      error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    
    try {
      // Simuler l'envoi
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      success('Message envoyé ! Nous vous répondrons sous 24h');
      setContactForm({
        subject: '',
        category: 'general',
        message: '',
        email: '',
        urgent: false
      });
    } catch (err) {
      error('Erreur lors de l\'envoi. Réessayez plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field, value) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="support-page">
      {/* Header */}
      <div className="support-header">
        <Link to="/" className="back-btn">
          ← Accueil
        </Link>
        <h1 className="page-title">❓ Aide & Support</h1>
        <div className="support-status">
          <span className="status-indicator online"></span>
          <span className="status-text">En ligne</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="support-nav">
        <button
          onClick={() => setActiveSection('faq')}
          className={`nav-btn ${activeSection === 'faq' ? 'active' : ''}`}
        >
          <span className="nav-icon">📚</span>
          <span className="nav-label">FAQ</span>
        </button>
        
        <button
          onClick={() => setActiveSection('contact')}
          className={`nav-btn ${activeSection === 'contact' ? 'active' : ''}`}
        >
          <span className="nav-icon">📧</span>
          <span className="nav-label">Contact</span>
        </button>
        
        <button
          onClick={() => setActiveSection('guides')}
          className={`nav-btn ${activeSection === 'guides' ? 'active' : ''}`}
        >
          <span className="nav-icon">📖</span>
          <span className="nav-label">Guides</span>
        </button>
      </div>

      {/* Contenu */}
      <div className="support-content">
        
        {/* Section FAQ */}
        {activeSection === 'faq' && (
          <div className="faq-section">
            <div className="section-header">
              <h2 className="section-title">❓ Questions fréquentes</h2>
              <p className="section-subtitle">
                Trouvez rapidement des réponses aux questions les plus courantes
              </p>
            </div>

            <div className="faq-categories">
              {faqData.map(category => (
                <div key={category.category} className="faq-category">
                  <h3 className="category-title">
                    <span className="category-icon">
                      {category.category === 'account' ? '👤' :
                       category.category === 'payment' ? '💰' :
                       category.category === 'game' ? '🎮' : '🔧'}
                    </span>
                    {category.title}
                  </h3>
                  
                  <div className="faq-questions">
                    {category.questions.map((item, index) => (
                      <details key={index} className="faq-item">
                        <summary className="faq-question">
                          <span className="question-text">{item.q}</span>
                          <span className="question-arrow">▼</span>
                        </summary>
                        <div className="faq-answer">
                          <p>{item.a}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="faq-footer">
              <div className="help-card">
                <div className="help-icon">💡</div>
                <div className="help-content">
                  <h4>Vous ne trouvez pas votre réponse ?</h4>
                  <p>Notre équipe support est là pour vous aider</p>
                  <button 
                    onClick={() => setActiveSection('contact')}
                    className="help-btn"
                  >
                    Contactez-nous
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section Contact */}
        {activeSection === 'contact' && (
          <div className="contact-section">
            <div className="section-header">
              <h2 className="section-title">📧 Nous contacter</h2>
              <p className="section-subtitle">
                Envoyez-nous un message, nous répondons sous 24h
              </p>
            </div>

            <form onSubmit={handleContactSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Sujet *</label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => handleFormChange('subject', e.target.value)}
                    className="form-input"
                    placeholder="Décrivez brièvement votre demande"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Catégorie</label>
                  <select
                    value={contactForm.category}
                    onChange={(e) => handleFormChange('category', e.target.value)}
                    className="form-select"
                  >
                    {contactCategories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email (optionnel)</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => handleFormChange('email', e.target.value)}
                  className="form-input"
                  placeholder="Pour une réponse par email"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => handleFormChange('message', e.target.value)}
                  className="form-textarea"
                  rows="6"
                  placeholder="Décrivez votre problème ou question en détail..."
                  required
                />
                <div className="char-count">
                  {contactForm.message.length}/1000
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    checked={contactForm.urgent}
                    onChange={(e) => handleFormChange('urgent', e.target.checked)}
                  />
                  <span className="checkbox-label">Demande urgente</span>
                  <span className="checkbox-help">
                    (Problème de sécurité ou perte d'argent)
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="submit-btn"
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">📧</span>
                    Envoyer le message
                  </>
                )}
              </button>
            </form>

            <div className="contact-info">
              <h3 className="info-title">Autres moyens de nous contacter</h3>
              <div className="contact-methods">
                <div className="contact-method">
                  <span className="method-icon">📧</span>
                  <div className="method-content">
                    <div className="method-label">Email</div>
                    <div className="method-value">support@lamap241.com</div>
                  </div>
                </div>
                
                <div className="contact-method">
                  <span className="method-icon">📱</span>
                  <div className="method-content">
                    <div className="method-label">WhatsApp</div>
                    <div className="method-value">+241 XX XX XX XX</div>
                  </div>
                </div>
                
                <div className="contact-method">
                  <span className="method-icon">⏰</span>
                  <div className="method-content">
                    <div className="method-label">Horaires</div>
                    <div className="method-value">Lun-Dim 8h-22h (GMT+1)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section Guides */}
        {activeSection === 'guides' && (
          <div className="guides-section">
            <div className="section-header">
              <h2 className="section-title">📖 Guides et tutoriels</h2>
              <p className="section-subtitle">
                Apprenez à utiliser toutes les fonctionnalités
              </p>
            </div>

            <div className="guides-grid">
              <Link to="/rules" className="guide-card">
                <div className="guide-icon">🎮</div>
                <div className="guide-content">
                  <h3 className="guide-title">Règles du Garame</h3>
                  <p className="guide-description">
                    Guide complet pour apprendre à jouer au Garame
                  </p>
                  <div className="guide-meta">
                    <span className="guide-time">⏱️ 5 min</span>
                    <span className="guide-level">🌟 Débutant</span>
                  </div>
                </div>
              </Link>

              <div className="guide-card">
                <div className="guide-icon">💰</div>
                <div className="guide-content">
                  <h3 className="guide-title">Gérer son portefeuille</h3>
                  <p className="guide-description">
                    Comment déposer, retirer et gérer votre argent
                  </p>
                  <div className="guide-meta">
                    <span className="guide-time">⏱️ 3 min</span>
                    <span className="guide-level">🌟 Débutant</span>
                  </div>
                </div>
              </div>

              <div className="guide-card">
                <div className="guide-icon">🏆</div>
                <div className="guide-content">
                  <h3 className="guide-title">Stratégies avancées</h3>
                  <p className="guide-description">
                    Techniques pour devenir un expert du Garame
                  </p>
                  <div className="guide-meta">
                    <span className="guide-time">⏱️ 10 min</span>
                    <span className="guide-level">⭐ Avancé</span>
                  </div>
                </div>
              </div>

              <div className="guide-card">
                <div className="guide-icon">🛡️</div>
                <div className="guide-content">
                  <h3 className="guide-title">Sécurité du compte</h3>
                  <p className="guide-description">
                    Protéger votre compte et vos gains
                  </p>
                  <div className="guide-meta">
                    <span className="guide-time">⏱️ 5 min</span>
                    <span className="guide-level">🌟 Important</span>
                  </div>
                </div>
              </div>

              <div className="guide-card">
                <div className="guide-icon">🎯</div>
                <div className="guide-content">
                  <h3 className="guide-title">Débloquer des succès</h3>
                  <p className="guide-description">
                    Conseils pour obtenir tous les trophées
                  </p>
                  <div className="guide-meta">
                    <span className="guide-time">⏱️ 7 min</span>
                    <span className="guide-level">⭐ Intermédiaire</span>
                  </div>
                </div>
              </div>

              <div className="guide-card">
                <div className="guide-icon">⚙️</div>
                <div className="guide-content">
                  <h3 className="guide-title">Personnaliser l'app</h3>
                  <p className="guide-description">
                    Ajuster les paramètres selon vos préférences
                  </p>
                  <div className="guide-meta">
                    <span className="guide-time">⏱️ 4 min</span>
                    <span className="guide-level">🌟 Tous niveaux</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="guides-footer">
              <div className="video-section">
                <h3 className="video-title">📹 Tutoriels vidéo</h3>
                <p className="video-description">
                  Regardez nos vidéos pour mieux comprendre le jeu
                </p>
                <button className="video-btn" disabled>
                  🎥 Voir les vidéos (Bientôt disponible)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}