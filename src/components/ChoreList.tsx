import React from 'react';
import { Search, Filter, MoreVertical, Edit, Trash2, CheckCircle, Circle, UserPlus, Clock } from 'lucide-react';
import { Chore, HouseholdMember, FilterOptions, ChoreCategory, Frequency } from '../types';
import { filterChores, getChoreStatus, getStatusColor, getStatusText, formatTime, formatDate, getCompletionProgress } from '../utils/choreUtils';
import { categoryIcons, frequencyColors } from '../data/initialData';

interface ChoreListProps {
  chores: Chore[];
  householdMembers: HouseholdMember[];
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onComplete: (chore: Chore) => void;
  onEdit: (chore: Chore) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onAssignChore: (choreId: string, memberId: string | undefined) => void;
}

const ChoreList: React.FC<ChoreListProps> = ({
  chores,
  householdMembers,
  filters,
  onFiltersChange,
  onComplete,
  onEdit,
  onDelete,
  onToggleStatus,
  onAssignChore
}) => {
  const filteredChores = filterChores(chores, filters);
  
  const getMemberName = (id: string) => {
    const member = householdMembers.find(m => m.id === id);
    return member?.name || 'Unassigned';
  };

  const getMemberColor = (id: string) => {
    const member = householdMembers.find(m => m.id === id);
    return member?.color || '#6B7280';
  };

  const handleAssignmentChange = (choreId: string, memberId: string) => {
    const newMemberId = memberId === 'unassigned' ? undefined : memberId;
    onAssignChore(choreId, newMemberId);
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="mobile-h2 font-bold text-charcoal">Household Chores</h2>
          <p className="mobile-body-sm text-charcoal/70">
            {filteredChores.length} of {chores.length} chores
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-softWhite border border-lightGray rounded-lg p-3 lg:p-4 space-y-3 lg:space-y-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-sage" />
          <span className="mobile-body font-medium text-charcoal">Filters</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
          {/* Search */}
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-charcoal/50" />
            <input
              type="text"
              placeholder="Search chores..."
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="input pl-10 w-full mobile-body"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => onFiltersChange({ ...filters, category: e.target.value as ChoreCategory | 'All' })}
            className="input mobile-body"
          >
            <option value="All">All Categories</option>
            {Object.keys(categoryIcons).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* Frequency Filter */}
          <select
            value={filters.frequency}
            onChange={(e) => onFiltersChange({ ...filters, frequency: e.target.value as Frequency | 'All' })}
            className="input mobile-body"
          >
            <option value="All">All Frequencies</option>
            <option value="Daily">Daily</option>
            <option value="Multiple Daily">Multiple Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Bi-weekly">Bi-weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="As Needed">As Needed</option>
          </select>

          {/* Assignee Filter */}
          <select
            value={filters.assignee}
            onChange={(e) => onFiltersChange({ ...filters, assignee: e.target.value })}
            className="input mobile-body"
          >
            <option value="All">All Members</option>
            <option value="unassigned">Unassigned</option>
            {householdMembers.map(member => (
              <option key={member.id} value={member.id}>{member.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => onFiltersChange({ ...filters, status: e.target.value as FilterOptions['status'] })}
            className="input mobile-body"
          >
            <option value="All">All Status</option>
            <option value="Overdue">Overdue</option>
            <option value="Due Soon">Due Soon</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Chore Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {filteredChores.map(chore => {
          const status = getChoreStatus(chore);
          const memberName = getMemberName(chore.assignee || '');
          const memberColor = getMemberColor(chore.assignee || '');
          const completionProgress = getCompletionProgress(chore);
          
          return (
            <div
              key={chore.id}
              className={`card p-4 lg:p-6 space-y-3 lg:space-y-4 transition-all duration-200 hover:shadow-md ${
                !chore.isActive ? 'opacity-60' : ''
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2 flex-wrap gap-2">
                  <span className="text-xl lg:text-2xl">{categoryIcons[chore.category]}</span>
                  <div className="flex items-center space-x-1 lg:space-x-2 flex-wrap gap-1">
                    <span className={`badge mobile-caption ${frequencyColors[chore.frequency]}`}>
                      {chore.frequency === 'Multiple Daily' && chore.completionsPerDay 
                        ? `${chore.completionsPerDay}x Daily`
                        : chore.frequency
                      }
                    </span>
                    <span className={`badge mobile-caption ${getStatusColor(status)}`}>
                      {getStatusText(status)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onToggleStatus(chore.id)}
                    className="p-1 hover:bg-warmBeige rounded-lg transition-colors"
                  >
                    {chore.isActive ? (
                      <Circle className="w-4 h-4 text-sage" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-mutedBlue" />
                    )}
                  </button>
                  
                  <div className="relative group">
                    <button className="p-1 hover:bg-warmBeige rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-charcoal" />
                    </button>
                    <div className="absolute right-0 top-full mt-1 w-32 bg-softWhite border border-lightGray rounded-lg shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <button
                        onClick={() => onEdit(chore)}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-left mobile-body-sm text-charcoal hover:bg-warmBeige rounded-t-lg"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => onDelete(chore.id)}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-left mobile-body-sm text-gentleRed hover:bg-gentleRed/10 rounded-b-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2 lg:space-y-3">
                <h3 className="mobile-h3 font-semibold text-charcoal">{chore.name}</h3>
                <p className="mobile-body-sm text-charcoal/70">{chore.description}</p>
                
                <div className="flex items-center justify-between mobile-body-sm">
                  <span className="text-charcoal/70">Estimated time:</span>
                  <span className="font-medium text-charcoal">{formatTime(chore.estimatedTime)}</span>
                </div>
                
                {/* Completion Progress for Multiple Daily */}
                {chore.frequency === 'Multiple Daily' && chore.completionsPerDay && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mobile-body-sm">
                      <span className="text-charcoal/70 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Today's Progress</span>
                      </span>
                      <span className="font-medium text-charcoal">
                        {completionProgress.completed}/{completionProgress.total}
                      </span>
                    </div>
                    <div className="w-full bg-lightGray rounded-full h-2">
                      <div 
                        className="bg-sage h-2 rounded-full transition-all duration-300"
                        style={{ width: `${completionProgress.percentage}%` }}
                      ></div>
                    </div>
                    <div className="mobile-caption text-charcoal/70 text-center">
                      {completionProgress.completed >= completionProgress.total 
                        ? '✅ All done for today!' 
                        : `${completionProgress.total - completionProgress.completed} more needed today`
                      }
                    </div>
                  </div>
                )}
                
                {/* Assignment Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between mobile-body-sm">
                    <span className="text-charcoal/70">Assigned to:</span>
                    <div className="flex items-center space-x-2">
                      {chore.assignee ? (
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: memberColor }}
                        />
                      ) : (
                        <UserPlus className="w-3 h-3 text-lightGray" />
                      )}
                      <span className="font-medium text-charcoal">
                        {chore.assignee ? memberName : 'Unassigned'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Assignment Dropdown */}
                  <div className="relative">
                    <select
                      value={chore.assignee || 'unassigned'}
                      onChange={(e) => handleAssignmentChange(chore.id, e.target.value)}
                      className="input mobile-body-sm py-2 w-full"
                      disabled={!chore.isActive}
                    >
                      <option value="unassigned">Unassigned</option>
                      {householdMembers.map(member => (
                        <option key={member.id} value={member.id}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mobile-body-sm">
                  <span className="text-charcoal/70">Due:</span>
                  <span className="font-medium text-charcoal">
                    {chore.lastCompleted ? formatDate(chore.lastCompleted) : 'Not started'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => onComplete(chore)}
                  className="btn btn-primary flex-1 mobile-btn"
                  disabled={!chore.isActive}
                >
                  {chore.frequency === 'Multiple Daily' && chore.completionsPerDay && completionProgress.completed >= completionProgress.total
                    ? 'All Done Today'
                    : 'Mark Complete'
                  }
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredChores.length === 0 && (
        <div className="text-center py-8 lg:py-12">
          <div className="w-12 h-12 lg:w-16 lg:h-16 bg-warmBeige rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 lg:w-8 lg:h-8 text-sage" />
          </div>
          <h3 className="mobile-h3 font-medium text-charcoal mb-2">No chores found</h3>
          <p className="mobile-body-sm text-charcoal/70 px-4">
            Try adjusting your filters or add a new chore to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default ChoreList;
