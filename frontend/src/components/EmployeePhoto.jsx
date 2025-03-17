import { getPhotoUrl } from '../utils/fileUtils';

const EmployeePhoto = ({ photoPath, onPhotoChange }) => {
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/employees/upload-photo/`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      onPhotoChange(data.photo);
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  return (
    <div className="relative">
      <img 
        src={photoPath ? getPhotoUrl(photoPath) : '/default-avatar.png'} 
        alt="Employee photo"
        className="w-32 h-32 rounded-full object-cover"
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
    </div>
  );
};

export default EmployeePhoto; 