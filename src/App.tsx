import React, { useState, useEffect } from 'react';
import { Chore, ChoreCompletion, HouseholdMember, FilterOptions } from './types';
import { initialChores, initialHouseholdMembers } from './data/initialData';
import { generateStatistics } from './utils/choreUtils';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChoreList from './components/ChoreList';
import Statistics from './components/Statistics';
import AdminDashboard from './components/AdminDashboard';
import AddChoreModal from './components/AddChoreModal';
import CompleteChoreModal from './components/CompleteChoreModal';
import EditChoreModal from './components/EditChoreModal';
import MemberManagementModal from './components/MemberManagementModal';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Separate component that uses hooks
const AppContent: React.FC = () => {
  const [chores, setChores] = useState<Chore[]>([]);
  const [householdMembers, setHouseholdMembers] = useState<HouseholdMember[]>([]);
  const [completions, setCompletions] = useState<ChoreCompletion[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  const [currentView, setCurrentView] = useState<'chores' | 'statistics' | 'admin'>('chores');
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    category: 'All',
    frequency: 'All',
    assignee: 'All',
    status: 'All'
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMemberManagementModalOpen, setIsMemberManagementModalOpen] = useState(false);
  const [selectedChore, setSelectedChore] = useState<Chore | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load data from localStorage with error handling
  const loadData = () => {
    try {
      console.log('📱 AppContent: Starting data load...');
      setIsDataLoading(true);
      setDataError(null);

      // Load chores
      const savedChores = localStorage.getItem('chores');
      if (savedChores) {
        try {
          const parsedChores = JSON.parse(savedChores);
          if (Array.isArray(parsedChores)) {
            // Validate and clean chore data to prevent Date errors
            const cleanedChores = parsedChores.map(chore => ({
              ...chore,
              createdAt: chore.createdAt ? new Date(chore.createdAt) : new Date(),
              nextDueDate: chore.nextDueDate ? new Date(chore.nextDueDate) : new Date(),
              lastCompleted: chore.lastCompleted ? new Date(chore.lastCompleted) : null
            }));
            setChores(cleanedChores);
            console.log('📱 AppContent: Loaded', cleanedChores.length, 'chores from localStorage');
          } else {
            throw new Error('Invalid chores data structure');
          }
        } catch (error) {
          console.warn('📱 AppContent: Corrupted chores data, using defaults');
          setChores(initialChores);
        }
      } else {
        console.log('📱 AppContent: No saved chores found, using defaults');
        setChores(initialChores);
      }

      // Load household members
      const savedMembers = localStorage.getItem('householdMembers');
      if (savedMembers) {
        try {
          const parsedMembers = JSON.parse(savedMembers);
          if (Array.isArray(parsedMembers)) {
            setHouseholdMembers(parsedMembers);
            console.log('📱 AppContent: Loaded', parsedMembers.length, 'members from localStorage');
          } else {
            throw new Error('Invalid members data structure');
          }
        } catch (error) {
          console.warn('📱 AppContent: Corrupted members data, using defaults');
          setHouseholdMembers(initialHouseholdMembers);
        }
      } else {
        console.log('📱 AppContent: No saved members found, using defaults');
        setHouseholdMembers(initialHouseholdMembers);
      }

      // Load completions
      const savedCompletions = localStorage.getItem('completions');
      if (savedCompletions) {
        try {
          const parsedCompletions = JSON.parse(savedCompletions);
          if (Array.isArray(parsedCompletions)) {
            // Validate and clean completion data to prevent Date errors
            const cleanedCompletions = parsedCompletions.map(completion => ({
              ...completion,
              completedAt: completion.completedAt ? new Date(completion.completedAt) : new Date()
            }));
            setCompletions(cleanedCompletions);
            console.log('📱 AppContent: Loaded', cleanedCompletions.length, 'completions from localStorage');
          } else {
            throw new Error('Invalid completions data structure');
          }
        } catch (error) {
          console.warn('📱 AppContent: Corrupted completions data, using defaults');
          setCompletions([]);
        }
      } else {
        console.log('📱 AppContent: No saved completions found, starting with empty array');
        setCompletions([]);
      }

      setIsDataLoading(false);
      console.log('📱 AppContent: Data loading complete');
    } catch (error) {
      console.error('📱 AppContent: Error loading data:', error);
      setDataError('Failed to load application data. Please refresh or try logging in again.');
      setIsDataLoading(false);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    loadData();
  }, []);

  const statistics = generateStatistics(chores, completions, householdMembers);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (chores.length > 0) {
      try {
        localStorage.setItem('chores', JSON.stringify(chores));
      } catch (error) {
        console.error('Error saving chores:', error);
      }
    }
  }, [chores]);

  useEffect(() => {
    if (householdMembers.length > 0) {
      try {
        localStorage.setItem('householdMembers', JSON.stringify(householdMembers));
      } catch (error) {
        console.error('Error saving members:', error);
      }
    }
  }, [householdMembers]);

  useEffect(() => {
    try {
      localStorage.setItem('completions', JSON.stringify(completions));
    } catch (error) {
      console.error('Error saving completions:', error);
    }
  }, [completions]);

  const addChore = (choreData: Omit<Chore, 'id' | 'createdAt' | 'nextDueDate' | 'completedToday'>) => {
    const newChore: Chore = {
      ...choreData,
      id: Date.now().toString(),
      createdAt: new Date(),
      nextDueDate: new Date(),
      completedToday: 0
    };
    setChores(prev => [...prev, newChore]);
    setIsAddModalOpen(false);
  };

  const editChore = (id: string, updates: Partial<Chore>) => {
    setChores(prev => prev.map(chore => 
      chore.id === id ? { ...chore, ...updates } : chore
    ));
    setIsEditModalOpen(false);
    setSelectedChore(null);
  };

  const deleteChore = (id: string) => {
    setChores(prev => prev.filter(chore => chore.id !== id));
    setCompletions(prev => prev.filter(completion => completion.choreId !== id));
  };

  const completeChore = (choreId: string, completion: Omit<ChoreCompletion, 'id'>) => {
    const newCompletion: ChoreCompletion = {
      ...completion,
      id: Date.now().toString(),
      completedAt: new Date()
    };
    
    setCompletions(prev => [...prev, newCompletion]);
    
    // Update chore's lastCompleted, nextDueDate, and completedToday
    setChores(prev => prev.map(chore => {
      if (chore.id === choreId) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const lastCompleted = chore.lastCompleted;
        
        let completedToday = chore.completedToday || 0;
        let nextDueDate = chore.nextDueDate;
        
        // Check if this is a new day
        if (lastCompleted && lastCompleted < today) {
          // New day, reset completedToday
          completedToday = 1;
        } else if (lastCompleted && lastCompleted >= today) {
          // Same day, increment completedToday
          completedToday += 1;
        } else {
          // First completion ever
          completedToday = 1;
        }
        
        // Calculate next due date based on frequency
        if (chore.frequency === 'Multiple Daily' && chore.completionsPerDay) {
          if (completedToday >= chore.completionsPerDay) {
            // All completions done for today, next due is tomorrow
            nextDueDate = new Date(today.getTime() + 24 * 60 * 60 * 1000);
          } else {
            // More completions needed today
            const hoursBetweenCompletions = 24 / chore.completionsPerDay;
            nextDueDate = new Date(now.getTime() + (hoursBetweenCompletions * 60 * 60 * 1000));
          }
        } else {
          // Regular frequency calculation
          nextDueDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        }
        
        return {
          ...chore,
          lastCompleted: now,
          nextDueDate,
          completedToday
        };
      }
      return chore;
    }));
    
    setIsCompleteModalOpen(false);
    setSelectedChore(null);
  };

  const toggleChoreStatus = (id: string) => {
    setChores(prev => prev.map(chore => 
      chore.id === id ? { ...chore, isActive: !chore.isActive } : chore
    ));
  };

  // Chore assignment function
  const assignChore = (choreId: string, memberId: string | undefined) => {
    setChores(prev => prev.map(chore => 
      chore.id === choreId ? { ...chore, assignee: memberId } : chore
    ));
  };

  // Member management functions
  const addMember = (name: string) => {
    const colors = ['#87A96B', '#6B9DC2', '#E07A5F', '#FFB74D', '#81C784', '#E57373', '#FFB74D'];
    const colorIndex = householdMembers.length % colors.length;
    
    const newMember: HouseholdMember = {
      id: Date.now().toString(),
      name: name.trim(),
      color: colors[colorIndex],
      isActive: true
    };
    
    setHouseholdMembers(prev => [...prev, newMember]);
  };

  const removeMember = (id: string) => {
    const hasAssignedChores = chores.some(chore => chore.assignee === id);
    
    if (hasAssignedChores) {
      setChores(prev => prev.map(chore => 
        chore.assignee === id ? { ...chore, assignee: undefined } : chore
      ));
    }
    
    setHouseholdMembers(prev => prev.filter(member => member.id !== id));
    setCompletions(prev => prev.filter(completion => completion.completedBy !== id));
  };

  const openCompleteModal = (chore: Chore) => {
    setSelectedChore(chore);
    setIsCompleteModalOpen(true);
  };

  const openEditModal = (chore: Chore) => {
    setSelectedChore(chore);
    setIsEditModalOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleRetryDataLoad = () => {
    loadData();
  };

  const handleResetData = () => {
    if (window.confirm('This will reset all data to defaults. Are you sure?')) {
      // Clear all app data from localStorage
      localStorage.removeItem('chores');
      localStorage.removeItem('householdMembers');
      localStorage.removeItem('completions');
      
      // Reset state
      setChores(initialChores);
      setHouseholdMembers(initialHouseholdMembers);
      setCompletions([]);
      setDataError(null);
      setIsDataLoading(false);
    }
  };

  const renderMainContent = () => {
    try {
      // Show loading state
      if (isDataLoading) {
        return (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-sage border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-charcoal mb-2">Loading...</h2>
              <p className="text-charcoal/70">Please wait while we load your data</p>
            </div>
          </div>
        );
      }

      // Show error state
      if (dataError) {
        return (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-gentleRed/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-gentleRed" />
              </div>
              <h2 className="text-xl font-semibold text-charcoal mb-2">Data Loading Error</h2>
              <p className="text-charcoal/70 mb-6">{dataError}</p>
              <div className="space-y-3">
                <button
                  onClick={handleRetryDataLoad}
                  className="btn btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retry Loading</span>
                </button>
                <button
                  onClick={handleResetData}
                  className="btn btn-outline w-full"
                >
                  Reset to Defaults
                </button>
              </div>
            </div>
          </div>
        );
      }

      // Show main content
      switch (currentView) {
        case 'chores':
          return (
            <ChoreList
              chores={chores}
              householdMembers={householdMembers}
              filters={filters}
              onFiltersChange={setFilters}
              onComplete={openCompleteModal}
              onEdit={openEditModal}
              onDelete={deleteChore}
              onToggleStatus={toggleChoreStatus}
              onAssignChore={assignChore}
            />
          );
        case 'statistics':
          return (
            <Statistics 
              statistics={statistics}
              chores={chores}
              completions={completions}
              householdMembers={householdMembers}
            />
          );
        case 'admin':
          return (
            <AdminDashboard
              statistics={statistics}
              totalMembers={householdMembers.length}
              totalChores={chores.length}
              totalCompletions={completions.length}
            />
          );
        default:
          return (
            <ChoreList
              chores={chores}
              householdMembers={householdMembers}
              filters={filters}
              onFiltersChange={setFilters}
              onComplete={openCompleteModal}
              onEdit={openEditModal}
              onDelete={deleteChore}
              onToggleStatus={toggleChoreStatus}
              onAssignChore={assignChore}
            />
          );
      }
    } catch (error) {
      console.error('📱 AppContent: Error rendering main content:', error);
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-gentleRed/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-gentleRed" />
            </div>
            <h2 className="text-xl font-semibold text-charcoal mb-2">Rendering Error</h2>
            <p className="text-charcoal/70 mb-6">Something went wrong while displaying the content. Please try refreshing the page.</p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="btn btn-primary w-full flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh Page</span>
              </button>
              <button
                onClick={handleResetData}
                className="btn btn-outline w-full"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-softWhite">
      <Header 
        onAddChore={() => setIsAddModalOpen(true)}
        onManageMembers={() => setIsMemberManagementModalOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />
      
      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={closeSidebar}
          />
        )}
        
        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <Sidebar 
            currentView={currentView}
            onViewChange={(view) => {
              setCurrentView(view);
              closeSidebar();
            }}
            statistics={statistics}
            memberCount={householdMembers.length}
            onClose={closeSidebar}
          />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 w-full lg:ml-0">
          {renderMainContent()}
        </main>
      </div>

      {/* Modals */}
      <AddChoreModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addChore}
        householdMembers={householdMembers}
      />

      <CompleteChoreModal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        chore={selectedChore}
        onComplete={completeChore}
        householdMembers={householdMembers}
      />

      <EditChoreModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        chore={selectedChore}
        onEdit={editChore}
        householdMembers={householdMembers}
      />

      <MemberManagementModal
        isOpen={isMemberManagementModalOpen}
        onClose={() => setIsMemberManagementModalOpen(false)}
        members={householdMembers}
        onAddMember={addMember}
        onRemoveMember={removeMember}
        chores={chores}
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <AppContent />
      </ProtectedRoute>
    </AuthProvider>
  );
}

export default App;
