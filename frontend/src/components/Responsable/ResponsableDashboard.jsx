import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, ListTodo, BarChart2, LogOut, 
  Plus, Edit2, Trash2, CheckCircle, XCircle 
} from 'lucide-react';
import { authService } from '../../services/authService';

const ResponsableDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('equipe');
  const [equipe, setEquipe] = useState(null);
  const [membres, setMembres] = useState([]);
  const [taches, setTaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedMembre, setSelectedMembre] = useState(null);
  const [newTask, setNewTask] = useState({
    titre: '',
    description: '',
    priorite: 'NORMALE',
    date_limite: '',
    id_membre: ''
  });
  const [editingTask, setEditingTask] = useState(null);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    fetchEquipeData();
  }, []);

  const fetchEquipeData = async () => {
    try {
      const user = authService.getCurrentUser();
      // Ici, vous devrez implémenter ces endpoints dans votre backend
      const equipeData = await authService.getEquipeDetails(user.id_utilisateur);
      const membresData = await authService.getEquipeMembres(equipeData.id_equipe);
      const tachesData = await authService.getEquipeTaches(equipeData.id_equipe);
      
      setEquipe(equipeData);
      setMembres(membresData);
      setTaches(tachesData);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      setLoading(false);
    }
  };

  const handleEditTask = (tache) => {
    setEditingTask({...tache});
    setShowEditTaskModal(true);
  };

  const handleSaveTask = async () => {
    try {
      await authService.updateTache(editingTask.id_tache, editingTask);
      fetchEquipeData(); // Refresh data
      setShowEditTaskModal(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche:", error);
    }
  };

  const handleDeleteTask = (tacheId) => {
    setTaskToDelete(tacheId);
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteTask = async () => {
    try {
      await authService.deleteTache(taskToDelete);
      fetchEquipeData(); // Refresh data
      setShowDeleteConfirmModal(false);
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche:", error);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/', { replace: true });
  };

  const handleAddTask = async () => {
    try {
      // Ici, vous devrez implémenter cet endpoint dans votre backend
      await authService.createTache({
        ...newTask,
        id_equipe: equipe.id_equipe
      });
      
      setShowAddTaskModal(false);
      setNewTask({
        titre: '',
        description: '',
        priorite: 'NORMALE',
        date_limite: '',
        id_membre: ''
      });
      fetchEquipeData(); // Rafraîchir les données
    } catch (error) {
      console.error("Erreur lors de la création de la tâche:", error);
    }
  };

  const handleUpdateTaskStatus = async (tacheId, newStatus) => {
    try {
      // Ici, vous devrez implémenter cet endpoint dans votre backend
      await authService.updateTacheStatus(tacheId, newStatus);
      fetchEquipeData(); // Rafraîchir les données
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
    }
  };

  // Composant pour la gestion de l'équipe
  const EquipeContent = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Mon Équipe</h2>
        <div className="text-sm text-gray-500">
          {equipe && `${membres.length} membres`}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {membres.map((membre) => (
          <div key={membre.id_employe} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold">{membre.nom} {membre.prenom}</h3>
                <p className="text-sm text-gray-500">{membre.role}</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm text-gray-600">
                Tâches assignées: {taches.filter(t => t.id_membre === membre.id_employe).length}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Composant pour la gestion des tâches
  const TachesContent = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestion des Tâches</h2>
        <button
          onClick={() => setShowAddTaskModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouvelle Tâche
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tâche</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assignée à</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priorité</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date limite</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {taches.map((tache) => (
              <tr key={tache.id_tache}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="font-medium">{tache.titre}</div>
                    <div className="text-sm text-gray-500">{tache.description}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {membres.find(m => m.id_employe === tache.id_membre)?.nom || 'Non assignée'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full
                    ${tache.priorite === 'HAUTE' ? 'bg-red-100 text-red-800' :
                      tache.priorite === 'MOYENNE' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'}`}>
                    {tache.priorite}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(tache.date_limite).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full
                    ${tache.statut === 'TERMINEE' ? 'bg-green-100 text-green-800' :
                      tache.statut === 'EN_COURS' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'}`}>
                    {tache.statut}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdateTaskStatus(tache.id_tache, 'TERMINEE')}
                      className="text-green-600 hover:text-green-900"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleUpdateTaskStatus(tache.id_tache, 'EN_COURS')}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleUpdateTaskStatus(tache.id_tache, 'ANNULEE')}
                      className="text-red-600 hover:text-red-900"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Modal d'ajout de tâche
  const AddTaskModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h3 className="text-xl font-bold mb-4">Nouvelle Tâche</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Titre</label>
            <input
              type="text"
              value={newTask.titre}
              onChange={(e) => setNewTask({...newTask, titre: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows="3"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Priorité</label>
              <select
                value={newTask.priorite}
                onChange={(e) => setNewTask({...newTask, priorite: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="BASSE">Basse</option>
                <option value="NORMALE">Normale</option>
                <option value="HAUTE">Haute</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date limite</label>
              <input
                type="date"
                value={newTask.date_limite}
                onChange={(e) => setNewTask({...newTask, date_limite: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Assigner à</label>
            <select
              value={newTask.id_membre}
              onChange={(e) => setNewTask({...newTask, id_membre: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Sélectionner un membre</option>
              {membres.map((membre) => (
                <option key={membre.id_employe} value={membre.id_employe}>
                  {membre.nom} {membre.prenom}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => setShowAddTaskModal(false)}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={handleAddTask}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Créer la tâche
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'equipe':
        return <EquipeContent />;
      case 'taches':
        return <TachesContent />;
      default:
        return <EquipeContent />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="flex-1 flex">
          {/* Sidebar */}
          <div className="w-64 bg-gray-900">
            <div className="flex flex-col h-full">
              <div className="p-4">
                <h1 className="text-white text-xl font-bold">Espace Responsable</h1>
              </div>

              <nav className="flex-1 px-2 py-4 space-y-2">
                <button
                  onClick={() => setActiveTab('equipe')}
                  className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
                    activeTab === 'equipe' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <Users className="mr-3 h-5 w-5" />
                  Mon Équipe
                </button>

                <button
                  onClick={() => setActiveTab('taches')}
                  className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
                    activeTab === 'taches' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <ListTodo className="mr-3 h-5 w-5" />
                  Gestion des Tâches
                </button>
              </nav>

              <div className="p-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Déconnexion
                </button>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-auto p-8">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </div>
        </div>
      )}

      {/* Modal d'ajout de tâche */}
      {showAddTaskModal && <AddTaskModal />}

      {/* Edit Task Modal */}
      {showEditTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">Modifier la Tâche</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Titre</label>
                <input
                  type="text"
                  value={editingTask?.titre || ''}
                  onChange={(e) => setEditingTask({...editingTask, titre: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={editingTask?.description || ''}
                  onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows="3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priorité</label>
                  <select
                    value={editingTask?.priorite || 'NORMALE'}
                    onChange={(e) => setEditingTask({...editingTask, priorite: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="BASSE">Basse</option>
                    <option value="NORMALE">Normale</option>
                    <option value="HAUTE">Haute</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date limite</label>
                  <input
                    type="date"
                    value={editingTask?.date_limite || ''}
                    onChange={(e) => setEditingTask({...editingTask, date_limite: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Assigner à</label>
                <select
                  value={editingTask?.id_membre || ''}
                  onChange={(e) => setEditingTask({...editingTask, id_membre: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Sélectionner un membre</option>
                  {membres.map((membre) => (
                    <option key={membre.id_employe} value={membre.id_employe}>
                      {membre.nom} {membre.prenom}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowEditTaskModal(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveTask}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Confirmer la suppression</h3>
            <p>Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible.</p>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={confirmDeleteTask}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponsableDashboard; 