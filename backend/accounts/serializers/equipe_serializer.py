from rest_framework import serializers
from accounts.models.equipe import Equipe

class EquipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipe
        fields = ['id_equipe', 'nom', 'description', 'date_creation']