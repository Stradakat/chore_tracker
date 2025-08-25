import React, { useState } from 'react';
import { X, CheckCircle, Star, Clock, MessageSquare } from 'lucide-react';
import { Chore, HouseholdMember, ChoreCompletion } from '../types';
import { categoryIcons } from '../data/initialData';

interface CompleteChoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  chore: Chore | null;
  onComplete: (choreId: string, completion: Omit<ChoreCompletion, 'id'>) => void;
  householdMembers: HouseholdMember[];
}

const CompleteChoreModal: React.FC<CompleteChoreModalProps> = ({
  isOpen,
  onClose,
  chore,
  onComplete,
  householdMembers
}) => {
  const [formData, setFormData] = useState({
    completedBy: '',
    rating: 0,
    notes: '',
    timeSpent: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen || !chore) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.completedBy) {
      newErrors.completedBy = 'Please select who completed the chore';
    }
    
    if (formData.timeSpent < 0) {
      newErrors.timeSpent = 'Time spent cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onComplete(chore.id, {
        choreId: chore.id,
        completedBy: formData.completedBy,
        completedAt: new Date(),
        rating: formData.rating > 0 ? formData.rating : undefined,
        notes: formData.notes.trim() || undefined,
        timeSpent: formData.timeSpent > 0 ? formData.timeSpent : undefined
      });
      
      // Reset form
      setFormData({
        completedBy: '',
        rating: 0,
        notes: '',
        timeSpent: 0
      });
      setErrors({});
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getMemberName = (id: string) => {
    const member = householdMembers.find(m => m.id === id);
    return member?.name || 'Unassigned';
  };

  const getMemberColor = (id: string) => {
    const member = householdMembers.find(m => m.id === id);
    return member?.color || '#6B7280';
  };

  return (
    <div className="fixed inset-0 bg-charcoal/50 flex items-center justify-center z-50 p-4">
      <div className="bg-softWhite rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-lightGray">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-freshGreen rounded-lg">
              <CheckCircle className="w-5 h-5 text-softWhite" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-charcoal">Mark Chore Complete</h2>
              <p className="text-sm text-charcoal/70">Record completion details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-warmBeige rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-charcoal" />
          </button>
        </div>

        {/* Chore Info */}
        <div className="p-6 border-b border-lightGray">
          <div className="flex items-start space-x-4">
            <div className="flex items-center justify-center w-16 h-16 bg-warmBeige rounded-lg">
              <span className="text-3xl">{categoryIcons[chore.category]}</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-charcoal mb-2">{chore.name}</h3>
              <p className="text-sm text-charcoal/70 mb-3">{chore.description}</p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-sage" />
                  <span className="text-charcoal/70">Estimated:</span>
                  <span className="font-medium text-charcoal">{chore.estimatedTime} min</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-charcoal/70">Assigned to:</span>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getMemberColor(chore.assignee || '') }}
                    />
                    <span className="font-medium text-charcoal">
                      {getMemberName(chore.assignee || '')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Who Completed */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              Completed By *
            </label>
            <select
              value={formData.completedBy}
              onChange={(e) => handleInputChange('completedBy', e.target.value)}
              className={`input ${errors.completedBy ? 'border-gentleRed' : ''}`}
            >
              <option value="">Select who completed this chore</option>
              {householdMembers.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
            {errors.completedBy && (
              <p className="text-sm text-gentleRed mt-1">{errors.completedBy}</p>
            )}
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              Quality Rating (Optional)
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleInputChange('rating', formData.rating === star ? 0 : star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= formData.rating
                        ? 'text-amberYellow fill-current'
                        : 'text-lightGray'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-charcoal/50 mt-1">
              Rate the quality of work (1 = poor, 5 = excellent)
            </p>
          </div>

          {/* Time Spent */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              Actual Time Spent (Optional)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="0"
                max="480"
                value={formData.timeSpent}
                onChange={(e) => handleInputChange('timeSpent', parseInt(e.target.value) || 0)}
                className={`input flex-1 ${errors.timeSpent ? 'border-gentleRed' : ''}`}
                placeholder="Actual time in minutes"
              />
              <span className="text-sm text-charcoal/70">minutes</span>
            </div>
            {errors.timeSpent && (
              <p className="text-sm text-gentleRed mt-1">{errors.timeSpent}</p>
            )}
            <p className="text-xs text-charcoal/50 mt-1">
              How long did it actually take? (vs. estimated {chore.estimatedTime} min)
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              Notes (Optional)
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-charcoal/50" />
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="input pl-10 min-h-[80px] resize-none"
                placeholder="Any notes about the completion, issues encountered, or special circumstances..."
              />
            </div>
            <p className="text-xs text-charcoal/50 mt-1">
              Add any relevant details about the completion
            </p>
          </div>

          {/* Completion Summary */}
          <div className="bg-warmBeige rounded-lg p-4">
            <h4 className="font-medium text-charcoal mb-3">Completion Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-charcoal/70">Chore:</span>
                <span className="font-medium text-charcoal">{chore.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-charcoal/70">Completed by:</span>
                <span className="font-medium text-charcoal">
                  {formData.completedBy ? getMemberName(formData.completedBy) : 'Not selected'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-charcoal/70">Rating:</span>
                <span className="font-medium text-charcoal">
                  {formData.rating > 0 ? `${formData.rating}/5 stars` : 'No rating'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-charcoal/70">Time spent:</span>
                <span className="font-medium text-charcoal">
                  {formData.timeSpent > 0 ? `${formData.timeSpent} min` : 'Not recorded'}
                </span>
              </div>
              {formData.notes && (
                <div className="flex items-center justify-between">
                  <span className="text-charcoal/70">Notes:</span>
                  <span className="font-medium text-charcoal max-w-xs truncate">
                    "{formData.notes}"
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-lightGray">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Mark Complete</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteChoreModal;
