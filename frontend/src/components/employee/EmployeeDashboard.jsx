import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Calendar, BarChart2, FileText, 
  LogOut, Clock, Target, Download 
} from 'lucide-react';
import useInactivityTimer from '../../hooks/useInactivityTimer';
import { authService } from '../../services/authService';
import Barcode from 'react-barcode';
import { getPhotoUrl } from '../../utils/fileUtils';
import axios from 'axios';

const EmployeeDashboard = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [employeeDetails, setEmployeeDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    useInactivityTimer();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Get user data directly from localStorage
                const userStr = localStorage.getItem('user');
                console.log('User string from localStorage:', userStr);
                
                if (!userStr) {
                    console.error('No user found in localStorage');
                    throw new Error('Utilisateur non trouvé. Veuillez vous reconnecter.');
                }
                
                const user = JSON.parse(userStr);
                console.log('Current user:', user);
                
                if (!user || !user.id_utilisateur) {
                    console.error('User data is invalid or missing ID', user);
                    throw new Error('Données utilisateur invalides. Veuillez vous reconnecter.');
                }

                // Define API base URL
                const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
                
                // Get auth token
                const token = localStorage.getItem('access_token');
                if (!token) {
                    console.error('No authentication token found');
                    throw new Error('Session expirée. Veuillez vous reconnecter.');
                }

                // Using the ID from the user object in localStorage
                const employeeUrl = `${API_BASE}/api/employees/${user.id_utilisateur}/`;
                console.log('Fetching employee details from:', employeeUrl);

                const response = await axios.get(employeeUrl, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                console.log('Employee details response:', response.data);
                
                if (response.data) {
                    setEmployeeDetails(response.data);
                } else {
                    throw new Error('Données employé invalides');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                
                // More descriptive error messages
                if (error.response?.status === 404) {
                    setError('Profil employé non trouvé. Veuillez contacter l\'administrateur.');
                } else if (error.response?.status === 401) {
                    setError('Session expirée. Veuillez vous reconnecter.');
                    // Token expired or invalid
                    setTimeout(() => {
                        authService.logout();
                        navigate('/login');
                    }, 3000);
                } else {
                    setError(error.message || 'Erreur lors du chargement des données');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        authService.logout();
        navigate('/', { replace: true });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    // Composant pour le profil personnel
    const ProfileContent = () => (
        <div className="bg-white p-6 rounded-lg shadow">
            {error ? (
                <div className="text-red-600 p-4 bg-red-100 rounded-lg mb-4">
                    {error}
                </div>
            ) : (
                <>
                    <h2 className="text-2xl font-bold mb-6">Mon Profil</h2>
                    {employeeDetails && (
                        <div className="space-y-6">
                            {/* Photo de profil et informations de base */}
                            <div className="flex items-center space-x-4">
                                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                    {employeeDetails.photo_url ? (
                                        <img
                                            src={employeeDetails.photo_url}
                                            alt="Photo de profil"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = '/default-avatar.png';
                                            }}
                                        />
                                    ) : (
                                        <User className="w-12 h-12 text-gray-400" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">
                                        {employeeDetails.nom} {employeeDetails.prenom}
                                    </h3>
                                    <p className="text-gray-500">{employeeDetails.email}</p>
                                    <p className="text-gray-500">Role: {employeeDetails.role}</p>
                                </div>
                            </div>

                            {/* Informations détaillées */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Informations Personnelles</h4>
                                        <div className="mt-2 space-y-2">
                                            <p><span className="font-medium">Date de naissance:</span> {formatDate(employeeDetails.date_naissance)}</p>
                                            <p><span className="font-medium">Téléphone:</span> {employeeDetails.telephone || '-'}</p>
                                            <p><span className="font-medium">Adresse:</span> {employeeDetails.adresse || '-'}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Informations Professionnelles</h4>
                                        <div className="mt-2 space-y-2">
                                            <p><span className="font-medium">Date de début:</span> {formatDate(employeeDetails.date_debut)}</p>
                                            <p><span className="font-medium">Date de fin:</span> {formatDate(employeeDetails.date_fin) || 'En cours'}</p>
                                            <p><span className="font-medium">Code barre:</span> {employeeDetails.code_barre || '-'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Équipe</h4>
                                        <div className="mt-2 space-y-2">
                                            {employeeDetails.equipe ? (
                                                <>
                                                    <p><span className="font-medium">Nom de l'équipe:</span> {employeeDetails.equipe.nom_equipe}</p>
                                                    <p><span className="font-medium">Responsable:</span> {employeeDetails.equipe.responsable || '-'}</p>
                                                </>
                                            ) : (
                                                <p>Aucune équipe assignée</p>
                                            )}
                                        </div>
                                    </div>
                                    {employeeDetails.code_barre && (
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Code-barres</h4>
                                            <div className="mt-2">
                                                <Barcode value={employeeDetails.code_barre} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );

    // Composant pour les délais
    const DelaisContent = () => (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Mes Tâches et Délais</h2>
            <div className="space-y-4">
                {/* Liste des tâches avec leurs délais */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tâche</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priorité</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date de fin</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {/* Exemple de tâche */}
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap">Rapport mensuel</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded-full">
                                        Urgent
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">30/03/2024</td>
                                <td className="px-6 py-4 whitespace-nowrap">En cours</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    // Composant pour les performances
    const PerformancesContent = () => (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Mes Performances</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded">
                    <h3 className="text-lg font-semibold mb-3">Objectifs atteints</h3>
                    <div className="flex items-center">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-2xl font-bold text-green-600">85%</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Ce mois-ci</p>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                    <h3 className="text-lg font-semibold mb-3">KPIs</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span>Productivité</span>
                            <span className="font-semibold">90%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Qualité</span>
                            <span className="font-semibold">95%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Composant pour les attestations
    const AttestationsContent = () => (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Mes Attestations</h2>
            <div className="space-y-4">
                <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-semibold">Attestation de présence</h3>
                            <p className="text-sm text-gray-600">Mars 2024</p>
                        </div>
                        <button className="flex items-center text-blue-600 hover:text-blue-800">
                            <Download className="h-5 w-5 mr-1" />
                            Télécharger
                        </button>
                    </div>
                </div>
                <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-semibold">Attestation de travail</h3>
                            <p className="text-sm text-gray-600">2024</p>
                        </div>
                        <button className="flex items-center text-blue-600 hover:text-blue-800">
                            <Download className="h-5 w-5 mr-1" />
                            Télécharger
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileContent />;
            case 'delais':
                return <DelaisContent />;
            case 'performances':
                return <PerformancesContent />;
            case 'attestations':
                return <AttestationsContent />;
            default:
                return <ProfileContent />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-red-600 p-6 bg-red-100 rounded-lg max-w-md text-center">
                    <h3 className="text-xl font-bold mb-2">Erreur</h3>
                    <p>{error}</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Retour à la page de connexion
                    </button>
                </div>
            </div>
        );
    }

    if (!employeeDetails) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-gray-500">
                    Aucune donnée disponible
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-gray-900">
                <div className="flex flex-col h-full">
                    <div className="p-4">
                        <h1 className="text-white text-xl font-bold">Espace Employé</h1>
                    </div>

                    <nav className="flex-1 px-2 py-4 space-y-2">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
                                activeTab === 'profile' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'
                            }`}
                        >
                            <User className="mr-3 h-5 w-5" />
                            Mon Profil
                        </button>

                        <button
                            onClick={() => setActiveTab('delais')}
                            className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
                                activeTab === 'delais' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'
                            }`}
                        >
                            <Clock className="mr-3 h-5 w-5" />
                            Tâches et Délais
                        </button>

                        <button
                            onClick={() => setActiveTab('performances')}
                            className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
                                activeTab === 'performances' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'
                            }`}
                        >
                            <BarChart2 className="mr-3 h-5 w-5" />
                            Performances
                        </button>

                        <button
                            onClick={() => setActiveTab('attestations')}
                            className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
                                activeTab === 'attestations' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'
                            }`}
                        >
                            <FileText className="mr-3 h-5 w-5" />
                            Attestations
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
                <div className="max-w-4xl mx-auto">
                    {/* Photo de profil et informations de base */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <div className="flex items-center mb-6">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mr-6">
                                {employeeDetails?.photo_url ? (
                                    <img
                                        src={employeeDetails.photo_url}
                                        alt="Photo de profil"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            console.error('Erreur de chargement de l\'image');
                                            e.target.src = '/default-avatar.png';
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                        <User className="h-12 w-12 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-2">
                                    {employeeDetails?.nom} {employeeDetails?.prenom}
                                </h2>
                                <p className="text-sm text-gray-600">
                                    {employeeDetails?.role}
                                </p>
                            </div>
                        </div>
                    </div>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;