import React, { useState } from 'react';
import { Shield, Users, Settings, BarChart3, Database, Activity, Bug, Trash2, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Statistics } from '../types';

interface AdminDashboardProps {
  statistics: Statistics;
  totalMembers: number;
  totalChores: number;
  totalCompletions: number;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  statistics, 
  totalMembers, 
  totalChores, 
  totalCompletions 
}) => {
  const { user, clearAllData } = useAuth();
  const [showDebug, setShowDebug] = useState(false);

  const adminStats = [
    {
      title: 'Total Chores',
      value: totalChores,
      icon: Database,
      color: 'bg-sage',
      description: 'Active chores in the system'
    },
    {
      title: 'Household Members',
      value: totalMembers,
      icon: Users,
      color: 'bg-mutedBlue',
      description: 'Registered family members'
    },
    {
      title: 'Total Completions',
      value: totalCompletions,
      icon: Activity,
      color: 'bg-freshGreen',
      description: 'Chores completed to date'
    },
    {
      title: 'Overdue Tasks',
      value: statistics.overdueChores,
      icon: BarChart3,
      color: 'bg-softCoral',
      description: 'Chores past due date'
    }
  ];

  const handleClearAllData = () => {
    if (window.confirm('⚠️ WARNING: This will permanently delete ALL data including chores, members, and completions. This action cannot be undone. Are you absolutely sure?')) {
      clearAllData();
      window.location.reload(); // Force reload to reset everything
    }
  };

  const getLocalStorageInfo = () => {
    const info: Record<string, any> = {};
    try {
      info.currentUser = localStorage.getItem('currentUser');
      info.chores = localStorage.getItem('chores');
      info.householdMembers = localStorage.getItem('householdMembers');
      info.completions = localStorage.getItem('completions');
      
      // Try to parse and show sizes
      if (info.chores) {
        try {
          const parsed = JSON.parse(info.chores);
          info.choresSize = Array.isArray(parsed) ? parsed.length : 'Invalid';
        } catch {
          info.choresSize = 'Corrupted';
        }
      }
      
      if (info.householdMembers) {
        try {
          const parsed = JSON.parse(info.householdMembers);
          info.membersSize = Array.isArray(parsed) ? parsed.length : 'Invalid';
        } catch {
          info.membersSize = 'Corrupted';
        }
      }
      
      if (info.completions) {
        try {
          const parsed = JSON.parse(info.completions);
          info.completionsSize = Array.isArray(parsed) ? parsed.length : 'Invalid';
        } catch {
          info.completionsSize = 'Corrupted';
        }
      }
    } catch (error) {
      info.error = error.message;
    }
    return info;
  };

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-sage to-mutedBlue rounded-lg p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-white/80">Welcome back, {user?.username || 'Admin'}!</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-sm text-white/80">Last Login</p>
            <p className="text-lg font-semibold">
              {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-sm text-white/80">Role</p>
            <p className="text-lg font-semibold capitalize">{user?.role || 'Admin'}</p>
          </div>
        </div>
      </div>

      {/* Admin Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat, index) => (
          <div key={index} className="bg-softWhite border border-lightGray rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-charcoal">{stat.value}</p>
                <p className="text-sm text-charcoal/70">{stat.title}</p>
              </div>
            </div>
            <p className="text-sm text-charcoal/60">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-softWhite border border-lightGray rounded-lg p-6">
        <h2 className="text-xl font-semibold text-charcoal mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-sage text-white rounded-lg hover:bg-sage/90 transition-colors">
            <Users className="w-5 h-5" />
            <span>Manage Members</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-mutedBlue text-white rounded-lg hover:bg-mutedBlue/90 transition-colors">
            <Database className="w-5 h-5" />
            <span>View All Chores</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-warmBeige text-charcoal rounded-lg hover:bg-warmBeige/80 transition-colors">
            <Settings className="w-5 h-5" />
            <span>System Settings</span>
          </button>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-softWhite border border-lightGray rounded-lg p-6">
        <h2 className="text-xl font-semibold text-charcoal mb-4">System Health</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-freshGreen/10 rounded-lg">
            <span className="text-charcoal">Database Status</span>
            <span className="text-freshGreen font-medium">✓ Healthy</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-amberYellow/10 rounded-lg">
            <span className="text-charcoal">Authentication</span>
            <span className="text-amberYellow font-medium">✓ Active</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-sage/10 rounded-lg">
            <span className="text-charcoal">Local Storage</span>
            <span className="text-sage font-medium">✓ Available</span>
          </div>
        </div>
      </div>

      {/* Debug Tools */}
      <div className="bg-softWhite border border-lightGray rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-charcoal">Debug Tools</h2>
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="flex items-center space-x-2 px-3 py-2 bg-charcoal text-softWhite rounded-lg hover:bg-charcoal/80 transition-colors"
          >
            <Bug className="w-4 h-4" />
            <span>{showDebug ? 'Hide' : 'Show'} Debug</span>
          </button>
        </div>
        
        {showDebug && (
          <div className="space-y-4">
            <div className="bg-lightGray/50 rounded-lg p-4">
              <h3 className="font-medium text-charcoal mb-2">Local Storage Status</h3>
              <div className="text-sm space-y-1">
                {Object.entries(getLocalStorageInfo()).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-charcoal/70">{key}:</span>
                    <span className="font-mono text-xs text-charcoal">
                      {typeof value === 'string' && value.length > 50 
                        ? `${value.substring(0, 50)}...` 
                        : String(value)
                      }
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center space-x-2 px-4 py-2 bg-mutedBlue text-white rounded-lg hover:bg-mutedBlue/90 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh Page</span>
              </button>
              
              <button
                onClick={handleClearAllData}
                className="flex items-center space-x-2 px-4 py-2 bg-gentleRed text-white rounded-lg hover:bg-gentleRed/90 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All Data</span>
              </button>
            </div>
            
            <div className="text-xs text-charcoal/50 bg-warmBeige p-3 rounded-lg">
              <p><strong>Note:</strong> Use these tools only when troubleshooting data issues. Clearing data will permanently delete all app information.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
