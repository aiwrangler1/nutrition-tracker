import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Settings } from 'lucide-react';
import NavLink from './NavLink';
import AuthButton from './AuthButton';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-green-600">
            NutriTrack
          </Link>
          
          <div className="flex items-center space-x-4">
            <NavLink to="/" icon={<Home size={20} />} label="Dashboard" />
            <NavLink to="/diary" icon={<Calendar size={20} />} label="Diary" />
            <NavLink to="/settings" icon={<Settings size={20} />} label="Settings" />
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;