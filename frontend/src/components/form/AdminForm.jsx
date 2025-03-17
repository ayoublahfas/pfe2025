import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';

const AdminForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    mot_de_passe: '',
    role: 'ADMIN',
    photo: null
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const formDataToSend = new FormData();
      
      // Ajouter les champs requis
      formDataToSend.append('email', formData.email);
      formDataToSend.append('mot_de_passe', formData.mot_de_passe);
      formDataToSend.append('nom', formData.nom);
      formDataToSend.append('prenom', formData.prenom);
      formDataToSend.append('role', formData.role);

      // Ajouter la photo si elle existe
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo);
      }

      await onSubmit(formDataToSend);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la création de l\'administrateur');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center mb-6">
        <UserPlus className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-2xl font-bold">Créer un compte Admin</h2>
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

        <div className="flex justify-end space-x-3 pt-6">
          <button
            type="button"
            onClick={() => {
              setFormData({
                nom: '',
                prenom: '',
                email: '',
                mot_de_passe: '',
                role: 'ADMIN',
                photo: null
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
            {isLoading ? 'Création...' : 'Ajouter administrateur'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminForm;
