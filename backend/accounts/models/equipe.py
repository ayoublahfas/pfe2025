from django.db import models

class Equipe(models.Model):
    id_equipe = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'EQUIPE'