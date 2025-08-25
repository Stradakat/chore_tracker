import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Chore, ChoreCategory, Frequency, HouseholdMember } from '../types';
import { categoryIcons } from '../data/initialData';

interface AddChoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (chore: Omit<Chore, 'id' | 'createdAt' | 'nextDueDate' | 'completedToday'>) => void;
  householdMembers: HouseholdMember[];
}

const AddChoreModal: React.FC<AddChoreModalProps> = ({ isOpen, onClose, onAdd, householdMembers }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Pet Care' as ChoreCategory,
    frequency: 'Daily' as Frequency,
    completionsPerDay: 1,
    estimatedTime: 15,
    assignee: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Chore name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.assignee) {
      newErrors.assignee = 'Please assign to a household member';
    }
    
    if (formData.estimatedTime <= 0) {
      newErrors.estimatedTime = 'Estimated time must be greater than 0';
    }
    
    if (formData.frequency === 'Multiple Daily' && formData.completionsPerDay < 2) {
      newErrors.completionsPerDay = 'Multiple Daily chores must be done at least 2 times per day';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onAdd({
        ...formData,
        isActive: true
      });
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: 'Pet Care',
        frequency: 'Daily',
        completionsPerDay: 1,
        estimatedTime: 15,
        assignee: ''
      });
      setErrors({});
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Reset completionsPerDay when frequency changes
    if (field === 'frequency') {
      if (value === 'Multiple Daily') {
        setFormData(prev => ({ ...prev, completionsPerDay: 2 }));
      } else {
        setFormData(prev => ({ ...prev, completionsPerDay: 1 }));
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-softWhite rounded-lg shadow-xl w-full max-w-md lg:max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-lightGray">
          <h2 className="mobile-h2 font-semibold text-charcoal">Add New Chore</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-warmBeige rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-charcoal" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 lg:p-6 space-y-4 lg:space-y-6">
          {/* Chore Name */}
          <div>
            <label className="block mobile-body font-medium text-charcoal mb-2">
              Chore Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`input w-full mobile-body ${errors.name ? 'border-gentleRed' : ''}`}
              placeholder="e.g., Clean Cat Litter Box"
            />
            {errors.name && (
              <p className="mobile-body-sm text-gentleRed mt-1">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block mobile-body font-medium text-charcoal mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className={`input w-full mobile-body resize-none ${errors.description ? 'border-gentleRed' : ''}`}
              placeholder="Describe what needs to be done..."
            />
            {errors.description && (
              <p className="mobile-body-sm text-gentleRed mt-1">{errors.description}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block mobile-body font-medium text-charcoal mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value as ChoreCategory)}
              className="input w-full mobile-body"
            >
              {Object.keys(categoryIcons).map(category => (
                <option key={category} value={category}>
                  {categoryIcons[category]} {category}
                </option>
              ))}
            </select>
          </div>

          {/* Frequency */}
          <div>
            <label className="block mobile-body font-medium text-charcoal mb-2">
              Frequency *
            </label>
            <select
              value={formData.frequency}
              onChange={(e) => handleInputChange('frequency', e.target.value as Frequency)}
              className="input w-full mobile-body"
            >
              <option value="Daily">Daily</option>
              <option value="Multiple Daily">Multiple Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Bi-weekly">Bi-weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="As Needed">As Needed</option>
            </select>
          </div>

          {formData.frequency === 'Multiple Daily' && (
            <div>
              <label className="block mobile-body font-medium text-charcoal mb-2">
                Completions Per Day *
              </label>
              <input
                type="number"
                min="2"
                max="12"
                value={formData.completionsPerDay}
                onChange={(e) => handleInputChange('completionsPerDay', parseInt(e.target.value))}
                className={`input w-full mobile-body ${errors.completionsPerDay ? 'border-gentleRed' : ''}`}
                placeholder="2"
              />
              {errors.completionsPerDay && (
                <p className="mobile-body-sm text-gentleRed mt-1">{errors.completionsPerDay}</p>
              )}
              <p className="mobile-caption text-charcoal/50 mt-1">
                How many times per day should this chore be completed?
              </p>
            </div>
          )}

          {/* Estimated Time */}
          <div>
            <label className="block mobile-body font-medium text-charcoal mb-2">
              Estimated Time (minutes) *
            </label>
            <input
              type="number"
              min="1"
              max="480"
              value={formData.estimatedTime}
              onChange={(e) => handleInputChange('estimatedTime', parseInt(e.target.value))}
              className={`input w-full mobile-body ${errors.estimatedTime ? 'border-gentleRed' : ''}`}
              placeholder="15"
            />
            {errors.estimatedTime && (
              <p className="mobile-body-sm text-gentleRed mt-1">{errors.estimatedTime}</p>
            )}
          </div>

          {/* Assignee */}
          <div>
            <label className="block mobile-body font-medium text-charcoal mb-2">
              Assign To *
            </label>
            <select
              value={formData.assignee}
              onChange={(e) => handleInputChange('assignee', e.target.value)}
              className={`input w-full mobile-body ${errors.assignee ? 'border-gentleRed' : ''}`}
            >
              <option value="">Select member</option>
              {householdMembers.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
            {errors.assignee && (
              <p className="mobile-body-sm text-gentleRed mt-1">{errors.assignee}</p>
            )}
            
            {/* Member Preview */}
            {formData.assignee && (
              <div className="mt-2 flex items-center space-x-2 p-2 bg-warmBeige rounded-lg">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: householdMembers.find(m => m.id === formData.assignee)?.color }}
                />
                <span className="mobile-body-sm text-charcoal">
                  Will be assigned to: <strong>{householdMembers.find(m => m.id === formData.assignee)?.name}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="bg-warmBeige rounded-lg p-3 lg:p-4">
            <h4 className="font-medium text-charcoal mb-2 lg:mb-3 mobile-h4">Preview</h4>
            <div className="space-y-1 lg:space-y-2 mobile-body-sm">
              <div className="flex items-center justify-between">
                <span className="text-charcoal/70">Category:</span>
                <span className="font-medium text-charcoal">
                  {categoryIcons[formData.category]} {formData.category}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-charcoal/70">Frequency:</span>
                <span className="font-medium text-charcoal">
                  {formData.frequency === 'Multiple Daily' && formData.completionsPerDay > 1
                    ? `${formData.completionsPerDay}x Daily`
                    : formData.frequency
                  }
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-charcoal/70">Time Estimate:</span>
                <span className="font-medium text-charcoal">{formData.estimatedTime} minutes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-charcoal/70">Assigned To:</span>
                <span className="font-medium text-charcoal">
                  {formData.assignee ? householdMembers.find(m => m.id === formData.assignee)?.name : 'Unassigned'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline flex-1 mobile-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1 mobile-btn flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Chore</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddChoreModal;
