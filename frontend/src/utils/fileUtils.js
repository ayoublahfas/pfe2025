export const getPhotoUrl = (photoPath) => {
    if (!photoPath) return '/default-avatar.png';
    
    // Si l'URL est déjà complète
    if (photoPath.startsWith('http')) {
        return photoPath;
    }
    
    // Sinon, construire l'URL complète
    return `http://localhost:8000/media/${photoPath}`;
}; 