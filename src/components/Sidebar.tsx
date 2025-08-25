import React from 'react';
import { ListTodo, BarChart3, CheckCircle, Clock, AlertTriangle, Users, X, Shield } from 'lucide-react';
import { Statistics } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  currentView: 'chores' | 'statistics' | 'admin';
  onViewChange: (view: 'chores' | 'statistics' | 'admin') => void;
  statistics: Statistics;
  memberCount?: number;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, statistics, memberCount = 0, onClose }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <aside className="w-80 bg-softWhite border-r border-lightGray p-4 lg:p-6 space-y-6 h-screen overflow-y-auto">
      {/* Mobile Close Button */}
      {onClose && (
        <div className="flex justify-between items-center lg:hidden">
          <h2 className="text-lg font-semibold text-charcoal">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-warmBeige rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-charcoal" />
          </button>
        </div>
      )}
      
      {/* Navigation */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-charcoal">Navigation</h3>
        <button
          onClick={() => onViewChange('chores')}
          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
            currentView === 'chores'
              ? 'bg-sage text-softWhite shadow-md'
              : 'text-charcoal hover:bg-warmBeige'
          }`}
        >
          <ListTodo className="w-5 h-5" />
          <span>Chores</span>
        </button>
        
        <button
          onClick={() => onViewChange('statistics')}
          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
            currentView === 'statistics'
              ? 'bg-sage text-softWhite shadow-md'
              : 'text-charcoal hover:bg-warmBeige'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span>Statistics</span>
        </button>

        {/* Admin Dashboard - Only show for admin users */}
        {isAdmin && (
          <button
            onClick={() => onViewChange('admin')}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
              currentView === 'admin'
                ? 'bg-mutedBlue text-softWhite shadow-md'
                : 'text-charcoal hover:bg-warmBeige'
            }`}
          >
            <Shield className="w-5 h-5" />
            <span>Admin Dashboard</span>
          </button>
        )}
      </div>
      
      {/* Quick Stats */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-charcoal">Quick Stats</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-sage text-softWhite p-3 rounded-lg text-center">
            <div className="text-2xl font-bold">{statistics.totalChores}</div>
            <div className="text-xs opacity-90">Total Chores</div>
          </div>
          <div className="bg-mutedBlue text-softWhite p-3 rounded-lg text-center">
            <div className="text-2xl font-bold">{memberCount}</div>
            <div className="text-xs opacity-90">Members</div>
          </div>
        </div>
      </div>
      
      {/* Status Overview */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-charcoal">Status Overview</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-freshGreen/10 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-freshGreen" />
              <span className="text-sm text-charcoal">Completed Today</span>
            </div>
            <span className="text-sm font-medium text-freshGreen">{statistics.completedToday}</span>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-softCoral/10 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-softCoral" />
              <span className="text-sm text-charcoal">Overdue</span>
            </div>
            <span className="text-sm font-medium text-softCoral">{statistics.overdueChores}</span>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-amberYellow/10 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amberYellow" />
              <span className="text-sm text-charcoal">Due Soon</span>
            </div>
            <span className="text-sm font-medium text-amberYellow">{statistics.dueSoonChores}</span>
          </div>
        </div>
      </div>

      {/* User Info */}
      {isAdmin && (
        <div className="border-t border-lightGray pt-4">
          <div className="flex items-center space-x-3 p-3 bg-mutedBlue/10 rounded-lg">
            <div className="w-8 h-8 bg-mutedBlue rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-charcoal">{user?.username}</p>
              <p className="text-xs text-charcoal/70 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;

