import React, { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import Barcode from 'react-barcode';
import { authService } from '../../services/authService';

const EmployeForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    mot_de_passe: '',
    role: 'EMPLOYE',
    photo: null,
    date_naissance: '',
    adresse: '',
    telephone: '',
    date_debut: '',
    date_fin: '',
    code_barre: '',
    id_equipe: ''
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [equipes, setEquipes] = useState([]);
  const [error, setError] = useState('');

  // Charger les équipes au chargement du composant
  useEffect(() => {
    const fetchEquipes = async () => {
      try {
        const response = await authService.getEquipes();
        setEquipes(response);
      } catch (err) {
        console.error('Erreur lors du chargement des équipes:', err);
        setError('Erreur lors du chargement des équipes');
      }
    };
    fetchEquipes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB max
        setError('La taille de l\'image ne doit pas dépasser 5MB');
        return;
      }
      setFormData(prev => ({
        ...prev,
        photo: file
      }));
      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateBarcode = () => {
    const timestamp = new Date().getTime().toString(36);
    const randomPart = Math.random().toString(36).substr(2, 5);
    const prefix = 'EMP';
    const barcode = `${prefix}-${timestamp}-${randomPart}`.toUpperCase();
    setFormData(prev => ({
      ...prev,
      code_barre: barcode
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const formDataToSend = new FormData();
      
      // Ajouter les champs requis en premier
      formDataToSend.append('email', formData.email);
      formDataToSend.append('mot_de_passe', formData.mot_de_passe);
      formDataToSend.append('nom', formData.nom);
      formDataToSend.append('prenom', formData.prenom);
      formDataToSend.append('role', formData.role);

      // Ajouter les autres champs
      Object.keys(formData).forEach(key => {
        if (!['email', 'mot_de_passe', 'nom', 'prenom', 'role'].includes(key) && formData[key]) {
          if (key === 'photo' && formData[key] instanceof File) {
            formDataToSend.append('photo', formData[key]);
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      await onSubmit(formDataToSend);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la création de l\'employé');
    }
  };

  const validateForm = (data) => {
    const requiredFields = ['nom', 'prenom', 'email', 'role'];
    const errors = {};
    
    requiredFields.forEach(field => {
      if (!data[field]) {
        errors[field] = 'Ce champ est requis';
      }
    });
    
    return errors;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center mb-6">
        <UserPlus className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-2xl font-bold">Créer un compte Employé</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md">
            {error}
          </div>
        )}

        {/* Photo upload */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Photo de profil
          </label>
          <div className="flex items-center space-x-4">
            {previewImage && (
              <div className="w-20 h-20 rounded-full overflow-hidden">
                <img
                  src={previewImage}
                  alt="Aperçu"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Informations de base */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              name="mot_de_passe"
              value={formData.mot_de_passe}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Informations employé */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informations employé</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
              <input
                type="date"
                name="date_naissance"
                value={formData.date_naissance}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <textarea
              name="adresse"
              value={formData.adresse}
              onChange={handleInputChange}
              rows="3"
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
              <input
                type="date"
                name="date_debut"
                value={formData.date_debut}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
              <input
                type="date"
                name="date_fin"
                value={formData.date_fin}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Ajouter le champ de sélection d'équipe avant la section du code-barres */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Équipe</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sélectionner une équipe
            </label>
            <select
              name="id_equipe"
              value={formData.id_equipe}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Sélectionner une équipe</option>
              {equipes.map((equipe) => (
                <option key={equipe.id_equipe} value={equipe.id_equipe}>
                  {equipe.nom}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Section code-barres */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Code-barres Employé</h3>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                name="code_barre"
                value={formData.code_barre}
                readOnly
                className="w-full p-2 border rounded-md bg-gray-50"
                placeholder="Cliquez sur générer pour créer un code-barres"
              />
              <button
                type="button"
                onClick={generateBarcode}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                {formData.code_barre ? 'Régénérer' : 'Générer'}
              </button>
            </div>
            {formData.code_barre && (
              <div className="flex flex-col items-center p-4 bg-white border rounded-md">
                <Barcode 
                  value={formData.code_barre}
                  width={2}
                  height={100}
                  fontSize={16}
                  margin={10}
                  background="#ffffff"
                  lineColor="#000000"
                  textAlign="center"
                  textPosition="bottom"
                  textMargin={6}
                  format="CODE128"
                  displayValue={true}
                />
                <p className="mt-2 text-sm text-gray-600">
                  Code-barres généré pour: {formData.nom} {formData.prenom}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6">
          <button
            type="button"
            onClick={() => {
              setFormData({
                nom: '',
                prenom: '',
                email: '',
                mot_de_passe: '',
                role: 'EMPLOYE',
                photo: null,
                date_naissance: '',
                adresse: '',
                telephone: '',
                date_debut: '',
                date_fin: '',
                code_barre: '',
                id_equipe: ''
              });
              setPreviewImage(null);
            }}
            className="px-4 py-2 border rounded-md hover:bg-gray-100 transition-colors"
            disabled={isLoading}
          >
            Réinitialiser
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 ${
              isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            } text-white rounded-md transition-colors`}
          >
            {isLoading ? 'Création...' : 'Ajouter employé'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeForm;
