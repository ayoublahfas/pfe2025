import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';

const ResponsableForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    mot_de_passe: '',
    role: 'RESPONSABLE',
    service: '',
    niveau_acces: '',
    date_debut: '',
    telephone: '',
  });

  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Validation des champs requis
      if (!formData.email || !formData.mot_de_passe || !formData.nom || !formData.prenom) {
        setError('Veuillez remplir tous les champs obligatoires');
        return;
      }

      // Création de l'objet utilisateur
      const userData = {
        email: formData.email,
        mot_de_passe: formData.mot_de_passe,
        nom: formData.nom,
        prenom: formData.prenom,
        role: 'RESPONSABLE'
      };

      await onSubmit(userData);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center mb-6">
        <UserPlus className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-2xl font-bold">Créer un compte Responsable</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
            onClick={() => setFormData({
              nom: '',
              prenom: '',
              email: '',
              mot_de_passe: '',
              role: 'RESPONSABLE',
              service: '',
              niveau_acces: '',
              date_debut: '',
              telephone: '',
            })}
            className="px-4 py-2 border rounded-md hover:bg-gray-100 transition-colors"
          >
            Réinitialiser
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Ajouter responsable
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResponsableForm;
