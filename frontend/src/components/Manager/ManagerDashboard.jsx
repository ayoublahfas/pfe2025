import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Clock, FileCheck, LogOut, 
  CheckCircle, XCircle, AlertCircle, Download, Edit, Trash 
} from 'lucide-react';
import { authService } from '../../services/authService';
import axios from 'axios';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('equipes');
  const [equipes, setEquipes] = useState([]);
  const [presences, setPresences] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingEquipe, setEditingEquipe] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState('');

  useEffect(() => {
    fetchManagerData();
  }, []);

  const fetchManagerData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user from localStorage
      const user = authService.getCurrentUser();
      console.log('Current manager user:', user);

      if (!user || !user.id) {
        throw new Error('No user data or user ID found');
      }

      // Define API base URL
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      // Adjust these URLs to match your actual backend API structure
      // These are common patterns, but you may need to change them
      const equipesUrl = `${API_BASE}/api/equipes/`;
      const presencesUrl = `${API_BASE}/api/presence/`;
      const documentsUrl = `${API_BASE}/api/documents/`;

      console.log('Fetching equipes from:', equipesUrl);
      
      // Get auth token
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Fetch data (with proper error handling)
      try {
        const equipesResponse = await axios.get(equipesUrl, { 
          headers: { 'Authorization': `Bearer ${token}` } 
        });
        setEquipes(equipesResponse.data || []);
        console.log('Equipes data:', equipesResponse.data);
      } catch (error) {
        console.error("Erreur lors du chargement des équipes:", error);
        setEquipes([]);
      }

      try {
        const presencesResponse = await axios.get(presencesUrl, { 
          headers: { 'Authorization': `Bearer ${token}` } 
        });
        setPresences(presencesResponse.data || []);
        console.log('Presences data:', presencesResponse.data);
      } catch (error) {
        console.error("Erreur lors du chargement des présences:", error);
        setPresences([]);
      }

      try {
        const documentsResponse = await axios.get(documentsUrl, { 
          headers: { 'Authorization': `Bearer ${token}` } 
        });
        setDocuments(documentsResponse.data || []);
        console.log('Documents data:', documentsResponse.data);
      } catch (error) {
        console.error("Erreur lors du chargement des documents:", error);
        setDocuments([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      setError(error.message || "Une erreur est survenue lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/', { replace: true });
  };

  const handleValidateDocument = async (docId) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/documents/${docId}/validate/`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchManagerData(); // Refresh data
    } catch (error) {
      console.error("Erreur lors de la validation du document:", error);
    }
  };

  const handleEditEquipe = (equipe) => {
    setEditingEquipe({...equipe});
    setShowEditModal(true);
  };

  const handleSaveEquipe = async () => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/equipes/${editingEquipe.id}/`, editingEquipe, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchManagerData(); // Refresh data
      setShowEditModal(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'équipe:", error);
    }
  };

  const handleDeleteEquipe = async (equipeId) => {
    setItemToDelete(equipeId);
    setDeleteType('equipe');
    setShowDeleteConfirmModal(true);
  };

  const handleRejectDocument = async (docId) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/documents/${docId}/reject/`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchManagerData(); // Refresh data
    } catch (error) {
      console.error("Erreur lors du rejet du document:", error);
    }
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (deleteType === 'equipe') {
        await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/equipes/${itemToDelete}/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } else if (deleteType === 'document') {
        await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/documents/${itemToDelete}/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      
      fetchManagerData(); // Refresh data
      setShowDeleteConfirmModal(false);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  // Composant pour la gestion des équipes
  const EquipesContent = () => (
    <div className="space-y-6">
      {equipes.length > 0 ? (
        equipes.map((equipe) => (
          <div key={equipe.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{equipe.nom}</h3>
              <div className="flex space-x-2 items-center">
                <span className="text-sm text-gray-500 mr-2">
                  {equipe.membres?.length || 0} membres
                </span>
                <button
                  onClick={() => handleEditEquipe(equipe)}
                  className="p-2 text-blue-600 hover:text-blue-900 rounded-full hover:bg-gray-100"
                  title="Modifier l'équipe"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteEquipe(equipe.id)}
                  className="p-2 text-red-600 hover:text-red-900 rounded-full hover:bg-gray-100"
                  title="Supprimer l'équipe"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {equipe.membres && equipe.membres.length > 0 ? (
                equipe.membres.map((membre) => (
                  <div key={membre.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <Users className="w-6 h-6 text-gray-600" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold">{membre.nom} {membre.prenom}</h4>
                        <p className="text-sm text-gray-500">{membre.role || 'Employé'}</p>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-600">Tâches en cours</p>
                        <p className="font-semibold">{membre.taches_en_cours || 0}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Tâches terminées</p>
                        <p className="font-semibold">{membre.taches_terminees || 0}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center p-4 text-gray-500">
                  Aucun membre dans cette équipe
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-500">Aucune équipe disponible</p>
        </div>
      )}
    </div>
  );

  // Composant pour le suivi des présences
  const PresencesContent = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Suivi des Présences</h2>
      {presences.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employé</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Heure d'arrivée</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Heure de départ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {presences.map((presence) => (
                <tr key={presence.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {presence.employe_nom || 'Inconnu'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {presence.date ? new Date(presence.date).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {presence.heure_arrivee || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {presence.heure_depart || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full
                      ${presence.statut === 'PRESENT' ? 'bg-green-100 text-green-800' :
                        presence.statut === 'RETARD' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'}`}>
                      {presence.statut || 'INCONNU'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center p-4 text-gray-500">
          Aucune donnée de présence disponible
        </div>
      )}
    </div>
  );

  // Composant pour la validation des documents
  const DocumentsContent = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Documents à Valider</h2>
      {documents.length > 0 ? (
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="border rounded-lg p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{doc.titre || 'Document sans titre'}</h3>
                <p className="text-sm text-gray-500">
                  Demandé par: {doc.employe_nom || 'Inconnu'} - {doc.date_demande ? new Date(doc.date_demande).toLocaleDateString() : '-'}
                </p>
                <p className="text-sm text-gray-500">Type: {doc.type || 'Non spécifié'}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleValidateDocument(doc.id)}
                  className="p-2 text-green-600 hover:text-green-900"
                  title="Valider"
                >
                  <CheckCircle className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleRejectDocument(doc.id)}
                  className="p-2 text-red-600 hover:text-red-900"
                  title="Rejeter"
                >
                  <XCircle className="w-5 h-5" />
                </button>
                <button
                  className="p-2 text-blue-600 hover:text-blue-900"
                  title="Télécharger"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-4 text-gray-500">
          Aucun document à valider
        </div>
      )}
    </div>
  );

  // Modal d'édition d'équipe
  const EditEquipeModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">Modifier l'Équipe</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom de l'équipe</label>
            <input
              type="text"
              value={editingEquipe?.nom || ''}
              onChange={(e) => setEditingEquipe({...editingEquipe, nom: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={editingEquipe?.description || ''}
              onChange={(e) => setEditingEquipe({...editingEquipe, description: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows="3"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => setShowEditModal(false)}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSaveEquipe}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );

  // Modal de confirmation de suppression
  const DeleteConfirmModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">Confirmer la suppression</h3>
        <p>Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.</p>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => setShowDeleteConfirmModal(false)}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-white text-xl font-bold">Espace Manager</h1>
        </div>
        
        <nav className="flex-1 py-4">
          <button 
            onClick={() => setActiveTab('equipes')}
            className={`flex items-center w-full px-4 py-3 ${activeTab === 'equipes' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'} transition-colors`}
          >
            <Users className="mr-3 h-5 w-5" />
            <span>Gestion des Équipes</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('presences')}
            className={`flex items-center w-full px-4 py-3 ${activeTab === 'presences' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'} transition-colors`}
          >
            <Clock className="mr-3 h-5 w-5" />
            <span>Suivi des Présences</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('documents')}
            className={`flex items-center w-full px-4 py-3 ${activeTab === 'documents' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'} transition-colors`}
          >
            <FileCheck className="mr-3 h-5 w-5" />
            <span>Documents à Valider</span>
          </button>
        </nav>
        
        <div className="p-4 mt-auto border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="flex items-center text-gray-400 hover:text-white"
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-8">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Erreur!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : (
          <div>
            {activeTab === 'equipes' && <EquipesContent />}
            {activeTab === 'presences' && <PresencesContent />}
            {activeTab === 'documents' && <DocumentsContent />}
          </div>
        )}
      </div>
      
      {/* Modals */}
      {showEditModal && <EditEquipeModal />}
      {showDeleteConfirmModal && <DeleteConfirmModal />}
    </div>
  );
};

export default ManagerDashboard;