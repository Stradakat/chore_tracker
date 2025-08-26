import React, { useState, useEffect } from 'react';
import { X, Save, Edit } from 'lucide-react';
import { Chore, HouseholdMember, ChoreCategory, Frequency } from '../types';
import { categoryIcons } from '../data/initialData';

interface EditChoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  chore: Chore | null;
  onEdit: (id: string, updates: Partial<Chore>) => void;
  householdMembers: HouseholdMember[];
}

const EditChoreModal: React.FC<EditChoreModalProps> = ({
  isOpen,
  onClose,
  chore,
  onEdit,
  householdMembers
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Pet Care' as ChoreCategory,
    frequency: 'Daily' as Frequency,
    completionsPerDay: 1,
    estimatedTime: 15,
    assignee: '',
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when chore changes
  useEffect(() => {
    if (chore) {
      setFormData({
        name: chore.name,
        description: chore.description,
        category: chore.category,
        frequency: chore.frequency,
        completionsPerDay: chore.completionsPerDay || 1,
        estimatedTime: chore.estimatedTime,
        assignee: chore.assignee || '',
        isActive: chore.isActive
      });
      setErrors({});
    }
  }, [chore]);

  if (!isOpen || !chore) return null;

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
      onEdit(chore.id, {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        frequency: formData.frequency,
        completionsPerDay: formData.completionsPerDay,
        estimatedTime: formData.estimatedTime,
        assignee: formData.assignee,
        isActive: formData.isActive
      });
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
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

  const getMemberName = (id: string) => {
    const member = householdMembers.find(m => m.id === id);
    return member?.name || 'Unassigned';
  };



  return (
    <div className="fixed inset-0 bg-charcoal/50 flex items-center justify-center z-50 p-4">
      <div className="bg-softWhite rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-lightGray">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-sage rounded-lg">
              <Edit className="w-5 h-5 text-softWhite" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-charcoal">Edit Chore</h2>
              <p className="text-sm text-charcoal/70">Update chore details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-warmBeige rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-charcoal" />
          </button>
        </div>

        {/* Current Chore Info */}
        <div className="p-6 border-b border-lightGray bg-warmBeige/30">
          <h4 className="font-medium text-charcoal mb-3">Current Chore Information</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-charcoal/70">Created:</span>
              <span className="ml-2 font-medium text-charcoal">
                {chore.createdAt.toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-charcoal/70">Last Completed:</span>
              <span className="ml-2 font-medium text-charcoal">
                {chore.lastCompleted ? chore.lastCompleted.toLocaleDateString() : 'Never'}
              </span>
            </div>
            <div>
              <span className="text-charcoal/70">Next Due:</span>
              <span className="ml-2 font-medium text-charcoal">
                {chore.nextDueDate.toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-charcoal/70">Status:</span>
              <span className={`ml-2 font-medium ${
                chore.isActive ? 'text-freshGreen' : 'text-mutedBlue'
              }`}>
                {chore.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Chore Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`input ${errors.name ? 'border-gentleRed' : ''}`}
                placeholder="e.g., Clean Cat Litter Box"
              />
              {errors.name && (
                <p className="text-sm text-gentleRed mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value as ChoreCategory)}
                className="input"
              >
                {Object.keys(categoryIcons).map(category => (
                  <option key={category} value={category}>
                    {categoryIcons[category]} {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`input min-h-[80px] resize-none ${errors.description ? 'border-gentleRed' : ''}`}
              placeholder="Describe what needs to be done..."
            />
            {errors.description && (
              <p className="text-sm text-gentleRed mt-1">{errors.description}</p>
            )}
          </div>

          {/* Scheduling and Assignment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Frequency *
              </label>
              <select
                value={formData.frequency}
                onChange={(e) => handleInputChange('frequency', e.target.value as Frequency)}
                className="input"
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
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Completions Per Day *
                </label>
                <input
                  type="number"
                  min="2"
                  max="12"
                  value={formData.completionsPerDay}
                  onChange={(e) => handleInputChange('completionsPerDay', parseInt(e.target.value))}
                  className={`input ${errors.completionsPerDay ? 'border-gentleRed' : ''}`}
                  placeholder="2"
                />
                {errors.completionsPerDay && (
                  <p className="text-sm text-gentleRed mt-1">{errors.completionsPerDay}</p>
                )}
                <p className="text-xs text-charcoal/50 mt-1">
                  How many times per day should this chore be completed?
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Estimated Time (minutes) *
              </label>
              <input
                type="number"
                min="1"
                max="480"
                value={formData.estimatedTime}
                onChange={(e) => handleInputChange('estimatedTime', parseInt(e.target.value))}
                className={`input ${errors.estimatedTime ? 'border-gentleRed' : ''}`}
                placeholder="15"
              />
              {errors.estimatedTime && (
                <p className="text-sm text-gentleRed mt-1">{errors.estimatedTime}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Assign To *
              </label>
              <select
                value={formData.assignee}
                onChange={(e) => handleInputChange('assignee', e.target.value)}
                className={`input ${errors.assignee ? 'border-gentleRed' : ''}`}
              >
                <option value="">Select member</option>
                {householdMembers.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
              {errors.assignee && (
                <p className="text-sm text-gentleRed mt-1">{errors.assignee}</p>
              )}
            </div>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between p-4 bg-warmBeige rounded-lg">
            <div>
              <h4 className="font-medium text-charcoal">Chore Status</h4>
              <p className="text-sm text-charcoal/70">
                {formData.isActive 
                  ? 'This chore is currently active and will appear in the main list'
                  : 'This chore is inactive and will be hidden from the main list'
                }
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-lightGray peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-lightGray after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage"></div>
            </label>
          </div>

          {/* Updated Preview */}
          <div className="bg-warmBeige rounded-lg p-4">
            <h4 className="font-medium text-charcoal mb-3">Updated Chore Preview</h4>
            <div className="space-y-2 text-sm">
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
                  {formData.assignee ? getMemberName(formData.assignee) : 'Unassigned'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-charcoal/70">Status:</span>
                <span className={`font-medium ${
                  formData.isActive ? 'text-freshGreen' : 'text-mutedBlue'
                }`}>
                  {formData.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
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
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditChoreModal;
