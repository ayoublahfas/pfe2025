from django.db import models
from .utilisateur import Utilisateur
from .equipe import Equipe

class Employe(models.Model):
    id_employe = models.AutoField(primary_key=True)
    id_equipe = models.ForeignKey(Equipe, on_delete=models.SET_NULL, null=True, db_column='id_equipe')
    photo = models.ImageField(upload_to='photos/', null=True, blank=True)
    date_naissance = models.DateField(null=True)
    adresse = models.TextField(null=True)
    telephone = models.CharField(max_length=20, null=True)
    date_debut = models.DateField(null=True)
    date_fin = models.DateField(null=True, blank=True)
    code_barre = models.CharField(max_length=50, unique=True, db_index=True)
    id_utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, db_column='id_utilisateur')

    class Meta:
        db_table = 'EMPLOYE'