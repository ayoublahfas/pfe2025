from rest_framework import serializers
from accounts.models.employe import Employe

class EmployeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employe
        fields = ['id_employe', 'id_equipe', 'photo', 'date_naissance', 'adresse', 'telephone', 'date_debut', 'date_fin', 'code_barre', 'id_utilisateur']