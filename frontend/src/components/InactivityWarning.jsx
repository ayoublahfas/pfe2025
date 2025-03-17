import React, { useState, useEffect } from 'react';

const InactivityWarning = ({ remainingTime }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (remainingTime <= 60) { 
            setVisible(true);
        }
    }, [remainingTime]);

    if (!visible) return null;

    return (
        <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p className="font-medium">
                Attention : Session inactive
            </p>
            <p className="text-sm">
                Déconnexion dans {Math.ceil(remainingTime)} secondes
            </p>
        </div>
    );
};

export default InactivityWarning; 