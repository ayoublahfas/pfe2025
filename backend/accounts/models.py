from django.db import models

# Create your models here.

class Utilisateur(models.Model):
    id_utilisateur = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    mot_de_passe = models.CharField(max_length=128)
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'utilisateur'
        managed = False  # Car la table existe déjà dans Oracle

    def __str__(self):
        return f"{self.nom} {self.prenom}"
