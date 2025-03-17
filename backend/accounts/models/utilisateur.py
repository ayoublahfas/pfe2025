from django.db import models

class Utilisateur(models.Model):
    ROLES = [
        ('ADMIN', 'Administrateur'),
        ('EMPLOYE', 'Employé'),
        ('MANAGER', 'Manager'),
        ('RESPONSABLE', 'Responsable')
    ]

    id_utilisateur = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    email = models.EmailField(unique=True, max_length=100)
    date_creation = models.DateTimeField(auto_now_add=True)
    role = models.CharField(max_length=100, choices=ROLES, default='EMPLOYE')
    mot_de_passe = models.CharField(max_length=128, db_column='MOT_DE_PASSE', default='default_password')

    class Meta:
        db_table = 'UTILISATEUR'