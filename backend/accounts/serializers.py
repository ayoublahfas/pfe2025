from rest_framework import serializers
from .models import Utilisateur

class UtilisateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = ['id_utilisateur', 'nom', 'prenom', 'email']
        # On exclut le mot de passe des données sérialisées
        extra_kwargs = {
            'mot_de_passe': {'write_only': True}
        }

    def create(self, validated_data):
        user = Utilisateur.objects.create_user(**validated_data)
        return user