import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const useInactivityTimer = (timeout = 300000) => { 
    const navigate = useNavigate();

    useEffect(() => {
        let timeoutId;

        const resetTimer = () => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                authService.logout();
                navigate('/login'); // Redirect to login instead of root
                alert('Session expirée. Veuillez vous reconnecter.');
            }, timeout);
        };

        // Events à surveiller
        const events = [
            'mousedown',
            'mousemove',
            'keypress',
            'scroll',
            'touchstart'
        ];

        // Ajouter les event listeners
        events.forEach(event => {
            document.addEventListener(event, resetTimer);
        });

        // Démarrer le timer
        resetTimer();

        // Cleanup
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            events.forEach(event => {
                document.removeEventListener(event, resetTimer);
            });
        };
    }, [timeout, navigate]);
};

export default useInactivityTimer; 