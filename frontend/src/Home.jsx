import React, { useState, useEffect } from 'react';
import { 
  Home as HomeIcon, 
  FileText, 
  BarChart2, 
  User, 
  Menu as MenuIcon, 
  LogOut, 
  Sun, 
  Moon, 
  Bell,
  Calendar 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from './services/authService';
import Profile from './components/Profile';
import TimeSheet from './components/TimeSheet';
import Documents from './components/Documents';

const HomePage = () => {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    } else {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const menuItems = [
    { id: 'dashboard', icon: HomeIcon, label: 'Dashboard' },
    { id: 'team', icon: User, label: 'Team' },
    { id: 'projects', icon: FileText, label: 'Projects' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'documents', icon: FileText, label: 'Documents' },
    { id: 'reports', icon: BarChart2, label: 'Reports' }
  ];

  const handleLogout = () => {
    authService.logout();
    navigate('/', { replace: true });
  };

  const renderContent = () => {
    switch(activeItem) {
      case 'dashboard':
        return <div>Dashboard Content</div>;
      case 'team':
        return <Profile />;
      case 'documents':
        return <Documents />;
      case 'reports':
        return <TimeSheet />;
      default:
        return <div>Sélectionnez une option dans le menu</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`bg-[#1e1e2d] flex flex-col ${isExpanded ? 'w-64' : 'w-20'} transition-all duration-300`}>
        {/* Logo et Toggle */}
        <div className="flex items-center justify-between p-4">
          <img 
            src="/src/assets/employees_logo.svg" 
            alt="Logo" 
            className="h-8 w-8"
          />
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white"
          >
            <MenuIcon size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`w-full flex items-center px-2 py-2 text-sm rounded-lg
                ${activeItem === item.id 
                  ? 'bg-[#2a2a3c] text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-[#2a2a3c]'}`}
            >
              <item.icon size={20} />
              {isExpanded && <span className="ml-3">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center text-gray-400 hover:text-white"
          >
            <LogOut size={20} />
            {isExpanded && <span className="ml-3">Déconnexion</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default HomePage;