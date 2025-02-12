import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from './services/authService';

const ShinyText = ({ text, disabled = false, speed = 5, className = '' }) => {
  const animationDuration = `${speed}s`;
  return (
    <div
      className={`text-[#b5b5b5a4] bg-clip-text inline-block ${disabled ? '' : 'animate-shine'} ${className}`}
      style={{
        backgroundImage: 'linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 60%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        animationDuration: animationDuration,
      }}
    >
      {text}
    </div>
  );
};

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [mot_de_passe, setMotDePasse] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/home');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authService.login(email, mot_de_passe);
      if (response.success) {
        navigate('/home', { replace: true });
      } else {
        setError(response.message || 'Email ou mot de passe incorrect');
        setIsLoading(false);
      }
    } catch (err) {
      setError('Email ou mot de passe incorrect');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[150%] h-[150%] animate-spin-slow">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 opacity-20"
              style={{
                background: `conic-gradient(from ${120 * i}deg, #1F2937, #374151, #4B5563, #6B7280, transparent)`,
                transform: `rotate(${i * 30}deg)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Login form container */}
      <div className="relative w-full max-w-md transform transition-all duration-500 hover:scale-[1.02]">
        <div className="relative bg-gray-900/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8 m-4 transition-all duration-300
                      animate-fade-in-up border border-gray-700/50">
          {/* Header section */}
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <svg className="w-16 h-16 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z" />
              </svg>
            </div>
            <div className="text-4xl font-bold mb-2 flex items-center justify-center">
              <ShinyText
                text="Bienvenue"
                speed={3}
                className="text-4xl font-bold"
              />
            </div>
            <p className="text-gray-400 animate-fade-in-delayed">
              Veuillez vous connecter pour continuer
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email input */}
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail size={20} />
              </div>
              <input
                className="w-full px-12 py-4 bg-gray-900/50 rounded-xl outline-none transition-all duration-300
                         border-2 border-transparent hover:border-gray-600 hover:shadow-[0_0_15px_rgba(156,163,175,0.15)]
                         focus:border-gray-300 focus:bg-gray-800/80 text-white placeholder-gray-400"
                type="email"
                placeholder="Adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password input */}
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={20} />
              </div>
              <input
                className="w-full px-12 py-4 bg-gray-900/50 rounded-xl outline-none transition-all duration-300
                         border-2 border-transparent hover:border-gray-600 hover:shadow-[0_0_15px_rgba(156,163,175,0.15)]
                         focus:border-gray-300 focus:bg-gray-800/80 text-white placeholder-gray-400"
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                value={mot_de_passe}
                onChange={(e) => setMotDePasse(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 
                         transition-all duration-300 hover:scale-110"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Add error message display */}
            {error && (
              <div className="text-red-500 text-sm text-center animate-shake">
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 bg-gradient-to-r from-gray-700 to-gray-500 text-white rounded-xl font-medium 
                       transition-all duration-500 transform hover:translate-y-[-2px] hover:shadow-lg
                       active:translate-y-0 active:shadow-md overflow-hidden relative
                       ${isLoading ? 'animate-pulse' : ''}`}
            >
              <span className={`transition-all duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                Connexion
              </span>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes shine {
          from {
            background-position: 200% center;
          }
          to {
            background-position: -200% center;
          }
        }
        .animate-shine {
          animation: shine linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;