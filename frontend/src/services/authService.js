import axios from 'axios';

const API_URL = 'http://localhost:8000/api/accounts';

export const authService = {
  login: async (email, mot_de_passe) => {
    try {
      console.log('Tentative de connexion:', { email });
      
      const response = await axios.post(`${API_URL}/login/`, {
        email,
        mot_de_passe
      });
      
      console.log('Réponse du serveur:', response.data);
      
      if (response.data.success && response.data.user) {
        const userData = {
          id: response.data.user.id,
          nom: response.data.user.nom || email,
          email: response.data.user.email,
          photo_url: response.data.user.photo_url || null,
          role: response.data.user.role || 'user'
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        return {
          success: true,
          user: userData
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Email ou mot de passe incorrect'
      };
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur de connexion'
      };
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  },

  isAuthenticated: () => {
    return localStorage.getItem('user') !== null;
  },

  logout: () => {
    localStorage.removeItem('user');
  }
}; 