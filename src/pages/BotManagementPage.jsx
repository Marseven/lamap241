import React from 'react';
import BotManager from '../components/BotManager';

const BotManagementPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Bots IA</h1>
          <p className="mt-2 text-gray-600">
            Créez et gérez vos adversaires intelligents
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            À propos des Bots IA
          </h3>
          <div className="text-blue-800 space-y-2">
            <p>
              Les bots IA sont des adversaires intelligents qui peuvent rejoindre vos parties.
              Ils utilisent des algorithmes avancés pour jouer selon les règles de La Map 241.
            </p>
            <ul className="list-disc list-inside space-y-1 mt-3">
              <li><strong>Facile:</strong> Prend des décisions simples, idéal pour débuter</li>
              <li><strong>Moyen:</strong> Analyse les cartes jouées et adapte sa stratégie</li>
              <li><strong>Difficile:</strong> Utilise des stratégies avancées et mémorise les patterns</li>
            </ul>
          </div>
        </div>

        <BotManager />

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-yellow-900 mb-3">
            Conseils d'utilisation
          </h3>
          <div className="text-yellow-800 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Pour l'entraînement:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Commencez avec des bots "Facile" pour apprendre</li>
                  <li>Progressez vers "Moyen" pour améliorer votre stratégie</li>
                  <li>Défiez les bots "Difficile" pour vous perfectionner</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Pour les parties:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Ajoutez des bots pour compléter les parties</li>
                  <li>Mélangez différents niveaux pour varier l'expérience</li>
                  <li>Suivez les statistiques pour évaluer votre progression</li>
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