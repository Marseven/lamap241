import React, { useEffect, useState } from 'react';
import useGameStore from '../stores/gameStore';

const BotManager = ({ roomCode, onBotAdded }) => {
  const {
    availableBots,
    botsLoading,
    botsError,
    fetchAvailableBots,
    createBot,
    addBotToRoom
  } = useGameStore();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBotData, setNewBotData] = useState({
    name: '',
    difficulty: 'medium',
    avatar: ''
  });
  const [creating, setCreating] = useState(false);
  const [adding, setAdding] = useState(null);

  useEffect(() => {
    fetchAvailableBots();
  }, [fetchAvailableBots]);

  const handleCreateBot = async (e) => {
    e.preventDefault();
    if (!newBotData.name.trim()) return;

    setCreating(true);
    try {
      await createBot({
        ...newBotData,
        name: newBotData.name.trim()
      });
      setNewBotData({ name: '', difficulty: 'medium', avatar: '' });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Erreur lors de la création du bot:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleAddBotToRoom = async (botId) => {
    if (!roomCode) return;

    setAdding(botId);
    try {
      await addBotToRoom(roomCode, botId);
      if (onBotAdded) {
        onBotAdded();
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du bot:', error);
    } finally {
      setAdding(null);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'hard':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'Facile';
      case 'medium':
        return 'Moyen';
      case 'hard':
        return 'Difficile';
      default:
        return difficulty;
    }
  };

  if (botsLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Gestion des Bots</h3>
          <p className="text-sm text-gray-600">
            {roomCode ? 'Ajouter un bot à la partie' : 'Gérer vos bots IA'}
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
        >
          Créer un Bot
        </button>
      </div>

      {botsError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Erreur: {botsError}</p>
        </div>
      )}

      {/* Formulaire de création */}
      {showCreateForm && (
        <div className="bg-gray-50 rounded-lg p-4">
          <form onSubmit={handleCreateBot} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom du Bot</label>
              <input
                type="text"
                value={newBotData.name}
                onChange={(e) => setNewBotData({ ...newBotData, name: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                placeholder="ex: AlphaBot"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Difficulté</label>
              <select
                value={newBotData.difficulty}
                onChange={(e) => setNewBotData({ ...newBotData, difficulty: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
              >
                <option value="easy">Facile</option>
                <option value="medium">Moyen</option>
                <option value="hard">Difficile</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={creating || !newBotData.name.trim()}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
              >
                {creating ? 'Création...' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des bots */}
      <div className="space-y-4">
        {availableBots.length === 0 ? (
          <div className="text-center py-8">
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun bot disponible</h3>
            <p className="mt-1 text-sm text-gray-500">
              Créez votre premier bot IA pour commencer
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableBots.map((bot) => (
              <div key={bot.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {bot.name ? bot.name.charAt(0).toUpperCase() : 'B'}
                      </span>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900">{bot.name}</h4>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(bot.difficulty)}`}>
                        {getDifficultyLabel(bot.difficulty)}
                      </span>
                    </div>
                  </div>

                  {roomCode && (
                    <button
                      onClick={() => handleAddBotToRoom(bot.id)}
                      disabled={adding === bot.id}
                      className="px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      {adding === bot.id ? 'Ajout...' : 'Ajouter'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BotManager;