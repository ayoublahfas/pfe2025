from rest_framework import serializers
from accounts.models.utilisateur import Utilisateur

class UtilisateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = ['id_utilisateur', 'nom', 'prenom', 'email', 'date_creation', 'role', 'mot_de_passe']
        extra_kwargs = {
            'mot_de_passe': {'write_only': True}
        }