import React from 'react';
import { User, Mail, Phone, Calendar } from 'lucide-react';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto bg-white/10 rounded-lg shadow-xl backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <User size={40} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.nom} {user.prenom}</h2>
              <p className="text-gray-400">Employé</p>
            </div>
          </div>
          
          <div className="mt-6 space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="text-gray-400" />
              <span>{user.email}</span>
            </div>
            {/* Autres informations du profil */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 