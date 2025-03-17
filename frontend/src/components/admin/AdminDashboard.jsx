import React, { useState, useEffect } from 'react';
import { 
  Users, Settings, Database, 
  LogOut, Shield, Trash2, Edit,
  Save, RefreshCw, AlertTriangle, UserPlus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import useInactivityTimer from '../../hooks/useInactivityTimer';
import { v4 as uuidv4 } from 'uuid';
import Barcode from 'react-barcode';
import AdminForm from '../form/AdminForm';
import EmployeForm from '../form/EmployeForm';
import ManagerForm from '../form/ManagerForm';
import ResponsableForm from '../form/ResponsableForm';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [pendingChanges, setPendingChanges] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [maintenanceStatus, setMaintenanceStatus] = useState({
    lastBackup: null,
    systemStatus: 'normal', // 'normal', 'warning', 'error'
    backupInProgress: false,
    checkInProgress: false
  });
  const [systemDetails, setSystemDetails] = useState({
    cpu: 0,
    memory: 0,
    disk: 0
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [equipes, setEquipes] = useState([]);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    mot_de_passe: '',
    role: 'EMPLOYE',
    // Champs employé
    photo: '',
    date_naissance: '',
    adresse: '',
    telephone: '',
    date_debut: '',
    date_fin: '',
    code_barre: '',
    id_equipe: ''
  });
  const [selectedForm, setSelectedForm] = useState('EMPLOYE');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    mot_de_passe: '',
    nom: '',
    prenom: '',
    role: 'EMPLOYE',
  });
  const navigate = useNavigate();

  useInactivityTimer();

  // Fetch users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('Tentative de récupération des utilisateurs...');
        const response = await authService.getAllUsers();
        console.log('Réponse reçue:', response);
        if (Array.isArray(response)) {
          setUsers(response);
          console.log('Utilisateurs chargés avec succès:', response.length);
        } else {
          console.error('Format de réponse inattendu:', response);
          setUsers([]);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  // Charger les équipes au montage du composant
  useEffect(() => {
    const fetchEquipes = async () => {
      try {
        console.log('Tentative de récupération des équipes...');
        const response = await authService.getEquipes();
        console.log('Réponse équipes reçue:', response);
        if (Array.isArray(response)) {
          setEquipes(response);
          console.log('Équipes chargées avec succès:', response.length);
        } else {
          console.error('Format de réponse équipes inattendu:', response);
          setEquipes([]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des équipes:', error);
        setEquipes([]);
      }
    };
    fetchEquipes();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await authService.deleteUser(userId);
        setUsers(users.filter(user => user.id_utilisateur !== userId));
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await authService.updateUserRole(userId, newRole);
      setUsers(users.map(user => 
        user.id_utilisateur === userId ? { ...user, role: newRole } : user
      ));
      console.log('Rôle mis à jour avec succès pour l\'utilisateur:', userId);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rôle:', error);
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      for (const [userId, newRole] of Object.entries(pendingChanges)) {
        console.log('Mise à jour du rôle pour userId:', userId, 'nouveau rôle:', newRole);
        await authService.updateUserRole(userId, newRole);
      }
      
      // Rafraîchir la liste des utilisateurs
      const updatedUsers = await authService.getAllUsers();
      setUsers(updatedUsers);
      
      setPendingChanges({});
      alert('Modifications enregistrées avec succès');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde des modifications: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSaving(false);
    }
  };

  // Fonction pour effectuer une sauvegarde
  const handleBackup = async () => {
    setMaintenanceStatus(prev => ({ ...prev, backupInProgress: true }));
    try {
      await authService.createBackup();
      setMaintenanceStatus(prev => ({
        ...prev,
        lastBackup: new Date().toLocaleString(),
        backupInProgress: false
      }));
      alert('Sauvegarde effectuée avec succès');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
      setMaintenanceStatus(prev => ({ ...prev, backupInProgress: false }));
    }
  };

  // Fonction pour vérifier l'état du système
  const checkSystemStatus = async () => {
    setMaintenanceStatus(prev => ({ ...prev, checkInProgress: true }));
    try {
      const response = await authService.checkSystemStatus();
      setMaintenanceStatus(prev => ({
        ...prev,
        systemStatus: response.status,
        checkInProgress: false
      }));
      setSystemDetails(response.details);
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      setMaintenanceStatus(prev => ({
        ...prev,
        systemStatus: 'normal',
        checkInProgress: false
      }));
    }
  };

  // Function to fetch employee details
  const fetchEmployeeDetails = async (userId) => {
    try {
      const response = await authService.getEmployeeDetails(userId);
      if (response.success) {
        setEmployeeDetails(response.data); // Ensure this matches your response structure
      } else {
        throw new Error(response.message || 'Erreur lors de la récupération des détails');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des détails:', error);
    }
  };

  // Ajouter cette fonction pour gérer le clic sur un utilisateur
  const handleUserClick = (userId) => {
    fetchEmployeeDetails(userId);
    setSelectedUser(users.find(user => user.id_utilisateur === userId));
    setShowUserModal(true);
  };

  // Ajouter cette fonction pour sauvegarder les modifications
  const handleSaveDetails = async (updatedData) => {
    try {
      setIsSaving(true);
      
      if (selectedUser.role === 'EMPLOYE') {
        const formData = new FormData();
        
        // Ajouter les données de base
        Object.keys(updatedData).forEach(key => {
          if (key !== 'photo') {
            formData.append(key, updatedData[key]);
          }
        });
        
        // Ajouter la photo si elle existe
        if (updatedData.photo instanceof File) {
          formData.append('photo', updatedData.photo);
        }
        
        await authService.updateEmployeeDetails(selectedUser.id_utilisateur, formData);
      } else {
        await authService.updateUserDetails(selectedUser.id_utilisateur, updatedData);
      }
      
      setIsEditing(false);
      alert('Modifications enregistrées avec succès');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert(error.message || 'Erreur lors de la sauvegarde des modifications');
    } finally {
      setIsSaving(false);
    }
  };

  // Modifier le composant UserModal
  const UserModal = () => {
    const [formData, setFormData] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
      if (selectedUser) {
        setFormData({
          ...selectedUser,
          ...(employeeDetails || {})
        });
        // Initialiser la prévisualisation si une photo existe
        if (employeeDetails?.photo) {
          setPreviewUrl(employeeDetails.photo);
        }
      }
    }, [selectedUser, employeeDetails]);

    const handleInputChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    const handleFileSelect = (event) => {
      const file = event.target.files[0];
      if (file) {
        setSelectedFile(file);
        const fileUrl = URL.createObjectURL(file);
        setPreviewUrl(fileUrl);
        setFormData({
          ...formData,
          photo: file
        });
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              {selectedUser?.role === 'EMPLOYE' ? 'Détails de l\'employé' : 'Détails de l\'utilisateur'}
            </h2>
            <button
              onClick={() => setShowUserModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {/* Informations de base */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>

            {selectedUser?.role === 'EMPLOYE' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Adresse</label>
                  <textarea
                    name="adresse"
                    value={formData.adresse || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                    <input
                      type="text"
                      name="telephone"
                      value={formData.telephone || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
                    <input
                      type="date"
                      name="date_naissance"
                      value={formData.date_naissance || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date de début</label>
                    <input
                      type="date"
                      name="date_debut"
                      value={formData.date_debut || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date de fin</label>
                    <input
                      type="date"
                      name="date_fin"
                      value={formData.date_fin || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Code barre</label>
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="code_barre"
                        value={formData.code_barre}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md"
                        readOnly
                      />
                      <button
                        type="button"
                        onClick={generateBarcode}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Générer
                      </button>
                    </div>
                    {formData.code_barre && (
                      <div className="p-4 border rounded-lg bg-white flex justify-center">
                        <Barcode 
                          value={formData.code_barre}
                          width={1.5}
                          height={50}
                          fontSize={14}
                          margin={10}
                          displayValue={true}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Photo</label>
                  <div className="mt-2 flex items-center space-x-4">
                    {/* Prévisualisation de l'image */}
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                      {previewUrl ? (
                        <img 
                          src={previewUrl} 
                          alt="Prévisualisation" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No photo
                        </div>
                      )}
                    </div>
                    
                    {/* Input file */}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Modifier
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleSaveDetails(formData)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Sauvegarder
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Modifier le rendu de la table dans UserManagementContent
  const UserManagementContent = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestion des Utilisateurs</h2>
        {Object.keys(pendingChanges).length > 0 && (
          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className={`px-4 py-2 rounded-lg text-white ${
              isSaving 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors duration-200 flex items-center space-x-2`}
          >
            {isSaving ? (
              <>
                <span className="animate-spin">⌛</span>
                <span>Enregistrement...</span>
              </>
            ) : (
              'Enregistrer les modifications'
            )}
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {users.map((user) => (
              <tr key={user.id_utilisateur} className="hover:bg-gray-50">
                <td 
                  className="px-6 py-4 whitespace-nowrap cursor-pointer text-blue-600 hover:text-blue-800"
                  onClick={() => handleUserClick(user.id_utilisateur)}
                >
                  {user.nom} {user.prenom}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={pendingChanges[user.id_utilisateur] || user.role}
                    onChange={(e) => handleUpdateRole(user.id_utilisateur, e.target.value)}
                    className={`border rounded px-2 py-1 ${
                      pendingChanges[user.id_utilisateur] ? 'bg-yellow-50 border-yellow-400' : ''
                    }`}
                  >
                    <option value="EMPLOYE">EMPLOYE</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="RESPONSABLE">RESPONSABLE</option>
                    <option value="MANAGER">MANAGER</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDeleteUser(user.id_utilisateur)}
                      className="text-red-600 hover:text-red-800"
                      title="Supprimer"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showUserModal && <UserModal />}
    </div>
  );

  const ConfigurationContent = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Configuration</h2>
      <p>Contenu de configuration à venir...</p>
    </div>
  );

  const MaintenanceContent = () => (
    <div className="space-y-6">
      {/* Carte d'état du système */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <AlertTriangle className="mr-2 h-6 w-6 text-yellow-500" />
          État du Système
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Statut actuel:</span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                maintenanceStatus.systemStatus === 'normal' 
                  ? 'bg-green-100 text-green-800' 
                  : maintenanceStatus.systemStatus === 'warning'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {maintenanceStatus.systemStatus === 'normal' ? 'Normal' :
                 maintenanceStatus.systemStatus === 'warning' ? 'Attention' : 'Erreur'}
              </span>
            </div>
            
            {/* Affichage des métriques */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>CPU:</span>
                <span>{systemDetails.cpu}%</span>
              </div>
              <div className="flex justify-between">
                <span>Mémoire:</span>
                <span>{systemDetails.memory}%</span>
              </div>
              <div className="flex justify-between">
                <span>Disque:</span>
                <span>{systemDetails.disk}%</span>
              </div>
            </div>

            <button
              onClick={checkSystemStatus}
              disabled={maintenanceStatus.checkInProgress}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 
                       disabled:bg-blue-300 flex items-center justify-center"
            >
              {maintenanceStatus.checkInProgress ? (
                <RefreshCw className="animate-spin h-5 w-5 mr-2" />
              ) : (
                <RefreshCw className="h-5 w-5 mr-2" />
              )}
              Vérifier l'état du système
            </button>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Dernière sauvegarde:</span>
              <span className="text-sm text-gray-500">
                {maintenanceStatus.lastBackup || 'Jamais'}
              </span>
            </div>
            <button
              onClick={handleBackup}
              disabled={maintenanceStatus.backupInProgress}
              className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:bg-green-300 flex items-center justify-center"
            >
              {maintenanceStatus.backupInProgress ? (
                <Save className="animate-spin h-5 w-5 mr-2" />
              ) : (
                <Save className="h-5 w-5 mr-2" />
              )}
              Effectuer une sauvegarde
            </button>
          </div>
        </div>
      </div>

      {/* Carte des logs système */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Logs Système</h2>
        <div className="bg-gray-100 p-4 rounded-lg h-64 overflow-auto font-mono text-sm">
          <pre>
            {/* Ici vous pouvez afficher les logs du système */}
            System initialized...
            Checking database connection...
            Database connection successful
            User authentication service started
            File system check completed
            {/* etc... */}
          </pre>
        </div>
      </div>

      {/* Carte des actions de maintenance */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Actions de Maintenance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <h3 className="font-semibold mb-2">Nettoyer le Cache</h3>
            <p className="text-sm text-gray-600">
              Supprime les fichiers temporaires et optimise les performances
            </p>
          </button>
          <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <h3 className="font-semibold mb-2">Optimiser la Base de Données</h3>
            <p className="text-sm text-gray-600">
              Analyse et optimise les tables de la base de données
            </p>
          </button>
        </div>
      </div>
    </div>
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCreateUser = async (formData) => {
    try {
      setIsLoading(true);
      setError('');

      const response = await authService.createUser(formData);
      
      if (response.success) {
        // Rafraîchir la liste des utilisateurs si nécessaire
        // setUsers(await authService.getAllUsers());
        
        // Réinitialiser le formulaire
        setSelectedForm('EMPLOYE');
        
        // Message de succès
        alert('Utilisateur créé avec succès');
      }
    } catch (error) {
      setError(error.message || 'Erreur lors de la création de l\'utilisateur');
    } finally {
      setIsLoading(false);
    }
  };

  const generateBarcode = () => {
    // Générer un code unique basé sur un timestamp et un identifiant aléatoire
    const timestamp = new Date().getTime().toString(36); // Base 36 pour réduire la longueur
    const randomPart = Math.random().toString(36).substr(2, 5);
    const prefix = 'EMP'; // Préfixe pour identifier que c'est un employé
    
    // Combiner pour créer un code-barres unique
    const barcode = `${prefix}-${timestamp}-${randomPart}`.toUpperCase();
    
    // Mettre à jour le formulaire avec le nouveau code-barres
    setFormData(prev => ({
      ...prev,
      code_barre: barcode
    }));
  };

  // Contenu pour la création d'utilisateur
  const CreateUserContent = () => {
    const [selectedForm, setSelectedForm] = useState('EMPLOYE');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCreateUser = async (formData) => {
      try {
        setIsLoading(true);
        setError('');

        const response = await authService.createUser(formData);
        
        if (response.success) {
          // Rafraîchir la liste des utilisateurs si nécessaire
          // setUsers(await authService.getAllUsers());
          
          // Réinitialiser le formulaire
          setSelectedForm('EMPLOYE');
          
          // Message de succès
          alert('Utilisateur créé avec succès');
        }
      } catch (error) {
        setError(error.message || 'Erreur lors de la création de l\'utilisateur');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Créer un nouveau compte</h2>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md">
              {error}
            </div>
          )}
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de compte
            </label>
            <select
              value={selectedForm}
              onChange={(e) => setSelectedForm(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            >
              <option value="EMPLOYE">Employé</option>
              <option value="MANAGER">Manager</option>
              <option value="RESPONSABLE">Responsable</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {selectedForm === 'ADMIN' && (
            <AdminForm 
              onSubmit={handleCreateUser}
              isLoading={isLoading}
            />
          )}
          {selectedForm === 'EMPLOYE' && (
            <EmployeForm 
              onSubmit={handleCreateUser}
              isLoading={isLoading}
            />
          )}
          {selectedForm === 'MANAGER' && (
            <ManagerForm 
              onSubmit={handleCreateUser}
              isLoading={isLoading}
            />
          )}
          {selectedForm === 'RESPONSABLE' && (
            <ResponsableForm 
              onSubmit={handleCreateUser}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    );
  };

  const handleAddUser = async (newUserData) => {
    try {
      const response = await authService.createUser(newUserData);
      if (response.success) {
        setUsers([...users, response.data]);
        alert('Utilisateur ajouté avec succès');
      } else {
        alert('Erreur lors de l\'ajout de l\'utilisateur: ' + response.message);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
      alert('Erreur lors de l\'ajout de l\'utilisateur');
    }
  };

  const toggleAddUserForm = () => {
    setIsAddingUser(!isAddingUser);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagementContent />;
      case 'config':
        return <ConfigurationContent />;
      case 'maintenance':
        return <MaintenanceContent />;
      case 'create':
        return <CreateUserContent />;
      default:
        return <UserManagementContent />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900">
        <div className="flex flex-col h-full">
          <div className="p-4">
            <h1 className="text-white text-xl font-bold">Espace Admin</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-2">
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
                activeTab === 'users'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Users className="mr-3 h-5 w-5" />
              Gestion des Utilisateurs
            </button>

            <button
              onClick={() => setActiveTab('create')}
              className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
                activeTab === 'create'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <UserPlus className="mr-3 h-5 w-5" />
              Créer Compte
            </button>

            <button
              onClick={() => setActiveTab('maintenance')}
              className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
                activeTab === 'maintenance'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Settings className="mr-3 h-5 w-5" />
              Maintenance
            </button>
          </nav>

          {/* Logout button */}
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
          {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard; 