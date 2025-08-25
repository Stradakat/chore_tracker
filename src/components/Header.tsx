import React from 'react';
import { Plus, Home, Sparkles, Users, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onAddChore: () => void;
  onManageMembers: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onAddChore, onManageMembers, onToggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-softWhite border-b border-lightGray shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Title */}
          <div className="flex items-center space-x-3">
            {/* Mobile Menu Button */}
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-warmBeige transition-colors"
              aria-label="Toggle menu"
            >
              {isSidebarOpen ? (
                <X className="w-6 h-6 text-charcoal" />
              ) : (
                <Menu className="w-6 h-6 text-charcoal" />
              )}
            </button>
            
            <div className="flex items-center justify-center w-10 h-10 bg-sage rounded-lg">
              <Home className="w-6 h-6 text-softWhite" />
            </div>
            <div className="hidden sm:block">
              <h1 className="mobile-h1 font-bold text-charcoal">Chore Tracker</h1>
              <p className="mobile-caption text-charcoal/70">Keep your home clean and organized</p>
            </div>
            <div className="sm:hidden">
              <h1 className="mobile-h2 font-bold text-charcoal">Chore Tracker</h1>
            </div>
          </div>
          
          {/* Right side - Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Pet Care Badge - Hidden on very small screens */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-warmBeige rounded-lg">
              <Sparkles className="w-4 h-4 text-sage" />
              <span className="mobile-body-sm font-medium text-charcoal">Pet Care Focus</span>
            </div>
            
            {/* User Info */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-mutedBlue rounded-lg">
              <User className="w-4 h-4 text-softWhite" />
              <span className="mobile-body-sm font-medium text-softWhite">
                {user?.username || 'Admin'}
              </span>
            </div>
            
            {/* Manage Members Button */}
            <button
              onClick={onManageMembers}
              className="btn btn-outline flex items-center space-x-2 px-2 sm:px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline mobile-body-sm">Manage Members</span>
              <span className="sm:hidden mobile-body-sm">Members</span>
            </button>
            
            {/* Add Chore Button */}
            <button
              onClick={onAddChore}
              className="btn btn-primary flex items-center space-x-2 px-2 sm:px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline mobile-body-sm">Add Chore</span>
              <span className="sm:hidden mobile-body-sm">Add</span>
            </button>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="btn btn-outline flex items-center space-x-2 px-2 sm:px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border-gentleRed text-gentleRed hover:bg-gentleRed hover:text-softWhite"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline mobile-body-sm">Logout</span>
              <span className="sm:hidden mobile-body-sm">Exit</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
