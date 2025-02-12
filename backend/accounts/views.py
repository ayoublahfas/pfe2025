from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Utilisateur
from .serializers import UtilisateurSerializer
import logging

logger = logging.getLogger(__name__)

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        mot_de_passe = request.data.get('mot_de_passe')
        
        # Log les données reçues (pour le debug)
        logger.info(f"Tentative de connexion pour: {email}")
        
        try:
            # Chercher l'utilisateur par email
            user = Utilisateur.objects.filter(email=email).first()
            
            # Vérification de l'email
            if not user:
                return Response({
                    'success': False,
                    'message': 'Email ou mot de passe incorrect'
                }, status=status.HTTP_200_OK)
            
            # Vérification du mot de passe
            if user.mot_de_passe != mot_de_passe:
                return Response({
                    'success': False,
                    'message': 'Email ou mot de passe incorrect'
                }, status=status.HTTP_200_OK)
            
            # Connexion réussie
            return Response({
                'success': True,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'nom': user.nom,
                    'photo_url': user.photo_url if hasattr(user, 'photo_url') else None,
                    'role': user.role if hasattr(user, 'role') else 'user'
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Erreur lors de la connexion: {str(e)}")
            return Response({
                'success': False,
                'message': 'Une erreur est survenue'
            }, status=status.HTTP_200_OK)  # Changé à 200 pour éviter la redirection