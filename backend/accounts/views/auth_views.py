from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from accounts.models.utilisateur import Utilisateur
from rest_framework_simplejwt.tokens import RefreshToken
import logging

logger = logging.getLogger(__name__)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            email = request.data.get('email')
            mot_de_passe = request.data.get('mot_de_passe')

            logger.info(f"Tentative de connexion pour: {email}")

            if not email or not mot_de_passe:
                logger.warning(f"Tentative de connexion sans email ou mot de passe")
                return Response({
                    'success': False,
                    'message': 'Email et mot de passe requis'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Authentification directe avec le modèle Utilisateur
            try:
                user = get_object_or_404(Utilisateur, email=email)
                
                # Vérification simple du mot de passe (en texte brut)
                if user.mot_de_passe != mot_de_passe:
                    logger.warning(f"Échec de connexion pour {email}: mot de passe incorrect")
                    return Response({
                        'success': False,
                        'message': 'Email ou mot de passe incorrect'
                    }, status=status.HTTP_401_UNAUTHORIZED)
                
            except Utilisateur.DoesNotExist:
                logger.warning(f"Échec de connexion pour {email}: utilisateur inexistant")
                return Response({
                    'success': False,
                    'message': 'Email ou mot de passe incorrect'
                }, status=status.HTTP_401_UNAUTHORIZED)

            # Vérifier que le rôle est valide
            valid_roles = [role[0] for role in Utilisateur.ROLES]
            normalized_role = user.role.upper()
            if normalized_role not in valid_roles:
                logger.error(f"Rôle invalide détecté: {normalized_role}")
                return Response({
                    'success': False,
                    'message': f'Rôle non autorisé. Rôles valides: {", ".join(valid_roles)}'
                }, status=status.HTTP_403_FORBIDDEN)

            # Générer les tokens JWT manuellement
            refresh = RefreshToken()
            refresh['user_id'] = user.id_utilisateur
            refresh['email'] = user.email
            refresh['role'] = normalized_role
            
            access_token = str(refresh.access_token)

            # Préparer les données de réponse
            response_data = {
                'success': True,
                'message': 'Connexion réussie',
                'user': {
                    'id_utilisateur': user.id_utilisateur,
                    'email': user.email,
                    'nom': user.nom,
                    'prenom': user.prenom,
                    'role': normalized_role,
                },
                'access_token': access_token,
                'refresh_token': str(refresh)
            }

            logger.info(f"Connexion réussie pour l'utilisateur: {user.email} avec le rôle: {normalized_role}")
            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Erreur lors de la connexion: {str(e)}")
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)