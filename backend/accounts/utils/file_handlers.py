import os
from django.conf import settings

def handle_uploaded_file(instance, filename):
    """
    Gère le téléchargement des fichiers et crée les dossiers nécessaires
    """
    upload_path = f'photos/user_{instance.id_utilisateur.id_utilisateur}'
    full_path = os.path.join(settings.MEDIA_ROOT, upload_path)
    
    if not os.path.exists(full_path):
        os.makedirs(full_path)
    
    return os.path.join(upload_path, filename)

def delete_user_files(user_id):
    """
    Supprime tous les fichiers associés à un utilisateur
    """
    user_path = os.path.join(settings.MEDIA_ROOT, f'photos/user_{user_id}')
    if os.path.exists(user_path):
        for file in os.listdir(user_path):
            file_path = os.path.join(user_path, file)
            try:
                os.remove(file_path)
            except Exception as e:
                print(f"Erreur lors de la suppression du fichier {file_path}: {e}")
        os.rmdir(user_path)