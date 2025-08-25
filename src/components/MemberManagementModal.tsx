import React, { useState } from 'react';
import { X, Plus, Trash2, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { HouseholdMember, Chore } from '../types';

interface MemberManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: HouseholdMember[];
  onAddMember: (name: string) => void;
  onRemoveMember: (id: string) => void;
  chores: Chore[];
}

const MemberManagementModal: React.FC<MemberManagementModalProps> = ({
  isOpen,
  onClose,
  members,
  onAddMember,
  onRemoveMember,
  chores
}) => {
  const [newMemberName, setNewMemberName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [memberToRemove, setMemberToRemove] = useState<HouseholdMember | null>(null);

  if (!isOpen) return null;

  const validateNewMember = () => {
    const newErrors: Record<string, string> = {};
    
    if (!newMemberName.trim()) {
      newErrors.name = 'Member name is required';
    } else if (members.some(member => member.name.toLowerCase() === newMemberName.trim().toLowerCase())) {
      newErrors.name = 'A member with this name already exists';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateNewMember()) {
      onAddMember(newMemberName);
      setNewMemberName('');
      setErrors({});
    }
  };

  const handleRemoveMember = (member: HouseholdMember) => {
    setMemberToRemove(member);
  };

  const confirmRemoveMember = () => {
    if (memberToRemove) {
      onRemoveMember(memberToRemove.id);
      setMemberToRemove(null);
    }
  };

  const getMemberStats = (memberId: string) => {
    const assignedChores = chores.filter(chore => chore.assignee === memberId).length;
    const completedChores = chores.filter(chore => 
      chore.assignee === memberId && chore.lastCompleted
    ).length;
    
    return { assignedChores, completedChores };
  };

  const getMemberColor = (color: string) => {
    return color;
  };

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 bg-charcoal/50 flex items-center justify-center z-50 p-4">
        <div className="bg-softWhite rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-lightGray">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-sage rounded-lg">
                <Users className="w-5 h-5 text-softWhite" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-charcoal">Manage Household Members</h2>
                <p className="text-sm text-charcoal/70">Add, remove, and manage family members</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-warmBeige rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-charcoal" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Add New Member Form */}
            <div className="bg-warmBeige rounded-lg p-6">
              <h3 className="text-lg font-semibold text-charcoal mb-4">Add New Member</h3>
              <form onSubmit={handleAddMember} className="flex space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className={`input ${errors.name ? 'border-gentleRed' : ''}`}
                    placeholder="Enter member name (e.g., Mom, Dad, Teen, Child)"
                  />
                  {errors.name && (
                    <p className="text-sm text-gentleRed mt-1">{errors.name}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="btn btn-primary flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Member</span>
                </button>
              </form>
            </div>

            {/* Current Members List */}
            <div>
              <h3 className="text-lg font-semibold text-charcoal mb-4">Current Members</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map(member => {
                  const stats = getMemberStats(member.id);
                  const hasAssignedChores = stats.assignedChores > 0;
                  
                  return (
                    <div
                      key={member.id}
                      className="card p-4 space-y-3"
                    >
                      {/* Member Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-softWhite font-semibold text-sm"
                            style={{ backgroundColor: getMemberColor(member.color) }}
                          >
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-medium text-charcoal">{member.name}</h4>
                            <p className="text-xs text-charcoal/70">
                              {member.isActive ? 'Active' : 'Inactive'}
                            </p>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveMember(member)}
                          className="p-2 hover:bg-gentleRed/10 rounded-lg transition-colors text-gentleRed hover:text-gentleRed/80"
                          title="Remove member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Member Stats */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-charcoal/70">Assigned Chores:</span>
                          <span className="font-medium text-charcoal">{stats.assignedChores}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-charcoal/70">Completed:</span>
                          <span className="font-medium text-charcoal">{stats.completedChores}</span>
                        </div>
                      </div>

                      {/* Warning for assigned chores */}
                      {hasAssignedChores && (
                        <div className="flex items-center space-x-2 p-2 bg-amberYellow/10 border border-amberYellow/20 rounded-lg">
                          <AlertTriangle className="w-4 h-4 text-amberYellow" />
                          <span className="text-xs text-amberYellow/80">
                            Has {stats.assignedChores} assigned chore{stats.assignedChores !== 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {members.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-16 h-16 text-lightGray mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-charcoal mb-2">No Members Yet</h4>
                  <p className="text-charcoal/70">
                    Add your first household member to get started with chore assignments.
                  </p>
                </div>
              )}
            </div>

            {/* Tips Section */}
            <div className="bg-mutedBlue/10 border border-mutedBlue/20 rounded-lg p-4">
              <h4 className="font-medium text-charcoal mb-2 flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-mutedBlue" />
                <span>Tips for Managing Members</span>
              </h4>
              <ul className="text-sm text-charcoal/70 space-y-1">
                <li>• Each member gets a unique color for easy identification</li>
                <li>• Members with assigned chores will have them unassigned when removed</li>
                <li>• You can always add members back if needed</li>
                <li>• Consider using descriptive names like "Mom", "Dad", "Teen", "Child"</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Removing Member */}
      {memberToRemove && (
        <div className="fixed inset-0 bg-charcoal/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-softWhite rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gentleRed rounded-lg">
                <AlertTriangle className="w-5 h-5 text-softWhite" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-charcoal">Remove Member</h3>
                <p className="text-sm text-charcoal/70">This action cannot be undone</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-charcoal mb-3">
                Are you sure you want to remove <strong>{memberToRemove.name}</strong>?
              </p>
              
              {(() => {
                const stats = getMemberStats(memberToRemove.id);
                if (stats.assignedChores > 0) {
                  return (
                    <div className="bg-amberYellow/10 border border-amberYellow/20 rounded-lg p-3">
                      <p className="text-sm text-amberYellow/80">
                        <strong>Note:</strong> This member has {stats.assignedChores} assigned chore{stats.assignedChores !== 1 ? 's' : ''}. 
                        These will be unassigned when the member is removed.
                      </p>
                    </div>
                  );
                }
                return null;
              })()}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setMemberToRemove(null)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveMember}
                className="btn bg-gentleRed text-softWhite hover:bg-gentleRed/90"
              >
                Remove Member
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MemberManagementModal;
