import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
        }
        catch (err) {
            error('Erreur lors de l\'envoi. Réessayez plus tard.');
        }
        finally {
            setLoading(false);
        }
    };
    const handleFormChange = (field, value) => {
        setContactForm(prev => ({
            ...prev,
            [field]: value
        }));
    };
    return (_jsxs("div", { className: "support-page", children: [_jsxs("div", { className: "support-header", children: [_jsx(Link, { to: "/", className: "back-btn", children: "\u2190 Accueil" }), _jsx("h1", { className: "page-title", children: "\u2753 Aide & Support" }), _jsxs("div", { className: "support-status", children: [_jsx("span", { className: "status-indicator online" }), _jsx("span", { className: "status-text", children: "En ligne" })] })] }), _jsxs("div", { className: "support-nav", children: [_jsxs("button", { onClick: () => setActiveSection('faq'), className: `nav-btn ${activeSection === 'faq' ? 'active' : ''}`, children: [_jsx("span", { className: "nav-icon", children: "\uD83D\uDCDA" }), _jsx("span", { className: "nav-label", children: "FAQ" })] }), _jsxs("button", { onClick: () => setActiveSection('contact'), className: `nav-btn ${activeSection === 'contact' ? 'active' : ''}`, children: [_jsx("span", { className: "nav-icon", children: "\uD83D\uDCE7" }), _jsx("span", { className: "nav-label", children: "Contact" })] }), _jsxs("button", { onClick: () => setActiveSection('guides'), className: `nav-btn ${activeSection === 'guides' ? 'active' : ''}`, children: [_jsx("span", { className: "nav-icon", children: "\uD83D\uDCD6" }), _jsx("span", { className: "nav-label", children: "Guides" })] })] }), _jsxs("div", { className: "support-content", children: [activeSection === 'faq' && (_jsxs("div", { className: "faq-section", children: [_jsxs("div", { className: "section-header", children: [_jsx("h2", { className: "section-title", children: "\u2753 Questions fr\u00E9quentes" }), _jsx("p", { className: "section-subtitle", children: "Trouvez rapidement des r\u00E9ponses aux questions les plus courantes" })] }), _jsx("div", { className: "faq-categories", children: faqData.map(category => (_jsxs("div", { className: "faq-category", children: [_jsxs("h3", { className: "category-title", children: [_jsx("span", { className: "category-icon", children: category.category === 'account' ? '👤' :
                                                        category.category === 'payment' ? '💰' :
                                                            category.category === 'game' ? '🎮' : '🔧' }), category.title] }), _jsx("div", { className: "faq-questions", children: category.questions.map((item, index) => (_jsxs("details", { className: "faq-item", children: [_jsxs("summary", { className: "faq-question", children: [_jsx("span", { className: "question-text", children: item.q }), _jsx("span", { className: "question-arrow", children: "\u25BC" })] }), _jsx("div", { className: "faq-answer", children: _jsx("p", { children: item.a }) })] }, index))) })] }, category.category))) }), _jsx("div", { className: "faq-footer", children: _jsxs("div", { className: "help-card", children: [_jsx("div", { className: "help-icon", children: "\uD83D\uDCA1" }), _jsxs("div", { className: "help-content", children: [_jsx("h4", { children: "Vous ne trouvez pas votre r\u00E9ponse ?" }), _jsx("p", { children: "Notre \u00E9quipe support est l\u00E0 pour vous aider" }), _jsx("button", { onClick: () => setActiveSection('contact'), className: "help-btn", children: "Contactez-nous" })] })] }) })] })), activeSection === 'contact' && (_jsxs("div", { className: "contact-section", children: [_jsxs("div", { className: "section-header", children: [_jsx("h2", { className: "section-title", children: "\uD83D\uDCE7 Nous contacter" }), _jsx("p", { className: "section-subtitle", children: "Envoyez-nous un message, nous r\u00E9pondons sous 24h" })] }), _jsxs("form", { onSubmit: handleContactSubmit, className: "contact-form", children: [_jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Sujet *" }), _jsx("input", { type: "text", value: contactForm.subject, onChange: (e) => handleFormChange('subject', e.target.value), className: "form-input", placeholder: "D\u00E9crivez bri\u00E8vement votre demande", required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Cat\u00E9gorie" }), _jsx("select", { value: contactForm.category, onChange: (e) => handleFormChange('category', e.target.value), className: "form-select", children: contactCategories.map(cat => (_jsx("option", { value: cat.value, children: cat.label }, cat.value))) })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Email (optionnel)" }), _jsx("input", { type: "email", value: contactForm.email, onChange: (e) => handleFormChange('email', e.target.value), className: "form-input", placeholder: "Pour une r\u00E9ponse par email" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Message *" }), _jsx("textarea", { value: contactForm.message, onChange: (e) => handleFormChange('message', e.target.value), className: "form-textarea", rows: "6", placeholder: "D\u00E9crivez votre probl\u00E8me ou question en d\u00E9tail...", required: true }), _jsxs("div", { className: "char-count", children: [contactForm.message.length, "/1000"] })] }), _jsx("div", { className: "form-group", children: _jsxs("label", { className: "checkbox-wrapper", children: [_jsx("input", { type: "checkbox", checked: contactForm.urgent, onChange: (e) => handleFormChange('urgent', e.target.checked) }), _jsx("span", { className: "checkbox-label", children: "Demande urgente" }), _jsx("span", { className: "checkbox-help", children: "(Probl\u00E8me de s\u00E9curit\u00E9 ou perte d'argent)" })] }) }), _jsx("button", { type: "submit", disabled: loading, className: "submit-btn", children: loading ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "loading-spinner" }), "Envoi en cours..."] })) : (_jsxs(_Fragment, { children: [_jsx("span", { className: "btn-icon", children: "\uD83D\uDCE7" }), "Envoyer le message"] })) })] }), _jsxs("div", { className: "contact-info", children: [_jsx("h3", { className: "info-title", children: "Autres moyens de nous contacter" }), _jsxs("div", { className: "contact-methods", children: [_jsxs("div", { className: "contact-method", children: [_jsx("span", { className: "method-icon", children: "\uD83D\uDCE7" }), _jsxs("div", { className: "method-content", children: [_jsx("div", { className: "method-label", children: "Email" }), _jsx("div", { className: "method-value", children: "support@lamap241.com" })] })] }), _jsxs("div", { className: "contact-method", children: [_jsx("span", { className: "method-icon", children: "\uD83D\uDCF1" }), _jsxs("div", { className: "method-content", children: [_jsx("div", { className: "method-label", children: "WhatsApp" }), _jsx("div", { className: "method-value", children: "+241 XX XX XX XX" })] })] }), _jsxs("div", { className: "contact-method", children: [_jsx("span", { className: "method-icon", children: "\u23F0" }), _jsxs("div", { className: "method-content", children: [_jsx("div", { className: "method-label", children: "Horaires" }), _jsx("div", { className: "method-value", children: "Lun-Dim 8h-22h (GMT+1)" })] })] })] })] })] })), activeSection === 'guides' && (_jsxs("div", { className: "guides-section", children: [_jsxs("div", { className: "section-header", children: [_jsx("h2", { className: "section-title", children: "\uD83D\uDCD6 Guides et tutoriels" }), _jsx("p", { className: "section-subtitle", children: "Apprenez \u00E0 utiliser toutes les fonctionnalit\u00E9s" })] }), _jsxs("div", { className: "guides-grid", children: [_jsxs(Link, { to: "/rules", className: "guide-card", children: [_jsx("div", { className: "guide-icon", children: "\uD83C\uDFAE" }), _jsxs("div", { className: "guide-content", children: [_jsx("h3", { className: "guide-title", children: "R\u00E8gles du Garame" }), _jsx("p", { className: "guide-description", children: "Guide complet pour apprendre \u00E0 jouer au Garame" }), _jsxs("div", { className: "guide-meta", children: [_jsx("span", { className: "guide-time", children: "\u23F1\uFE0F 5 min" }), _jsx("span", { className: "guide-level", children: "\uD83C\uDF1F D\u00E9butant" })] })] })] }), _jsxs("div", { className: "guide-card", children: [_jsx("div", { className: "guide-icon", children: "\uD83D\uDCB0" }), _jsxs("div", { className: "guide-content", children: [_jsx("h3", { className: "guide-title", children: "G\u00E9rer son portefeuille" }), _jsx("p", { className: "guide-description", children: "Comment d\u00E9poser, retirer et g\u00E9rer votre argent" }), _jsxs("div", { className: "guide-meta", children: [_jsx("span", { className: "guide-time", children: "\u23F1\uFE0F 3 min" }), _jsx("span", { className: "guide-level", children: "\uD83C\uDF1F D\u00E9butant" })] })] })] }), _jsxs("div", { className: "guide-card", children: [_jsx("div", { className: "guide-icon", children: "\uD83C\uDFC6" }), _jsxs("div", { className: "guide-content", children: [_jsx("h3", { className: "guide-title", children: "Strat\u00E9gies avanc\u00E9es" }), _jsx("p", { className: "guide-description", children: "Techniques pour devenir un expert du Garame" }), _jsxs("div", { className: "guide-meta", children: [_jsx("span", { className: "guide-time", children: "\u23F1\uFE0F 10 min" }), _jsx("span", { className: "guide-level", children: "\u2B50 Avanc\u00E9" })] })] })] }), _jsxs("div", { className: "guide-card", children: [_jsx("div", { className: "guide-icon", children: "\uD83D\uDEE1\uFE0F" }), _jsxs("div", { className: "guide-content", children: [_jsx("h3", { className: "guide-title", children: "S\u00E9curit\u00E9 du compte" }), _jsx("p", { className: "guide-description", children: "Prot\u00E9ger votre compte et vos gains" }), _jsxs("div", { className: "guide-meta", children: [_jsx("span", { className: "guide-time", children: "\u23F1\uFE0F 5 min" }), _jsx("span", { className: "guide-level", children: "\uD83C\uDF1F Important" })] })] })] }), _jsxs("div", { className: "guide-card", children: [_jsx("div", { className: "guide-icon", children: "\uD83C\uDFAF" }), _jsxs("div", { className: "guide-content", children: [_jsx("h3", { className: "guide-title", children: "D\u00E9bloquer des succ\u00E8s" }), _jsx("p", { className: "guide-description", children: "Conseils pour obtenir tous les troph\u00E9es" }), _jsxs("div", { className: "guide-meta", children: [_jsx("span", { className: "guide-time", children: "\u23F1\uFE0F 7 min" }), _jsx("span", { className: "guide-level", children: "\u2B50 Interm\u00E9diaire" })] })] })] }), _jsxs("div", { className: "guide-card", children: [_jsx("div", { className: "guide-icon", children: "\u2699\uFE0F" }), _jsxs("div", { className: "guide-content", children: [_jsx("h3", { className: "guide-title", children: "Personnaliser l'app" }), _jsx("p", { className: "guide-description", children: "Ajuster les param\u00E8tres selon vos pr\u00E9f\u00E9rences" }), _jsxs("div", { className: "guide-meta", children: [_jsx("span", { className: "guide-time", children: "\u23F1\uFE0F 4 min" }), _jsx("span", { className: "guide-level", children: "\uD83C\uDF1F Tous niveaux" })] })] })] })] }), _jsx("div", { className: "guides-footer", children: _jsxs("div", { className: "video-section", children: [_jsx("h3", { className: "video-title", children: "\uD83D\uDCF9 Tutoriels vid\u00E9o" }), _jsx("p", { className: "video-description", children: "Regardez nos vid\u00E9os pour mieux comprendre le jeu" }), _jsx("button", { className: "video-btn", disabled: true, children: "\uD83C\uDFA5 Voir les vid\u00E9os (Bient\u00F4t disponible)" })] }) })] }))] })] }));
}
