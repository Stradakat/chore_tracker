import React from 'react';
import { BarChart3, TrendingUp, Users, Calendar, Award, Target } from 'lucide-react';
import { Statistics as StatisticsType, Chore, ChoreCompletion, HouseholdMember } from '../types';
import { formatTime, formatDate } from '../utils/choreUtils';

interface StatisticsProps {
  statistics: StatisticsType;
  chores: Chore[];
  completions: ChoreCompletion[];
  householdMembers: HouseholdMember[];
}

const Statistics: React.FC<StatisticsProps> = ({ statistics, chores, completions, householdMembers }) => {
  const getMemberName = (id: string) => {
    const member = householdMembers.find(m => m.id === id);
    return member?.name || 'Unknown';
  };

  const getMemberColor = (id: string) => {
    const member = householdMembers.find(m => m.id === id);
    return member?.color || '#6B7280';
  };

  const getCompletionRate = (memberId: string) => {
    const memberCompletions = completions.filter(c => c.completedBy === memberId);
    const memberChores = chores.filter(c => c.assignee === memberId);
    return memberChores.length > 0 ? Math.round((memberCompletions.length / memberChores.length) * 100) : 0;
  };

  const getRecentCompletions = () => {
    return completions
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      .slice(0, 5);
  };

  const getCategoryStats = () => {
    const categoryStats = Object.entries(statistics.categoryBreakdown).map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / statistics.totalChores) * 100)
    }));
    return categoryStats.sort((a, b) => b.count - a.count);
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="text-center lg:text-left">
        <h2 className="text-xl sm:text-2xl font-bold text-charcoal mb-2">Household Statistics</h2>
        <p className="text-sm text-charcoal/70">
          Track your family's chore completion progress and performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <div className="bg-softWhite border border-lightGray rounded-lg p-3 lg:p-4 text-center">
          <div className="w-8 h-8 lg:w-12 lg:h-12 bg-sage rounded-full flex items-center justify-center mx-auto mb-2 lg:mb-3">
            <BarChart3 className="w-4 h-4 lg:w-6 lg:h-6 text-softWhite" />
          </div>
          <div className="text-xl lg:text-3xl font-bold text-charcoal">{statistics.totalChores}</div>
          <div className="text-xs lg:text-sm text-charcoal/70">Total Chores</div>
        </div>
        
        <div className="bg-softWhite border border-lightGray rounded-lg p-3 lg:p-4 text-center">
          <div className="w-8 h-8 lg:w-12 lg:h-12 bg-freshGreen rounded-full flex items-center justify-center mx-auto mb-2 lg:mb-3">
            <TrendingUp className="w-4 h-4 lg:w-6 lg:h-6 text-softWhite" />
          </div>
          <div className="text-xl lg:text-3xl font-bold text-charcoal">{statistics.completedToday}</div>
          <div className="text-xs lg:text-sm text-charcoal/70">Completed Today</div>
        </div>
        
        <div className="bg-softWhite border border-lightGray rounded-lg p-3 lg:p-4 text-center">
          <div className="w-8 h-8 lg:w-12 lg:h-12 bg-amberYellow rounded-full flex items-center justify-center mx-auto mb-2 lg:mb-3">
            <Calendar className="w-4 h-4 lg:w-6 lg:h-6 text-softWhite" />
          </div>
          <div className="text-xl lg:text-3xl font-bold text-charcoal">{statistics.completedThisWeek}</div>
          <div className="text-xs lg:text-sm text-charcoal/70">This Week</div>
        </div>
        
        <div className="bg-softWhite border border-lightGray rounded-lg p-3 lg:p-4 text-center">
          <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gentleRed rounded-full flex items-center justify-center mx-auto mb-2 lg:mb-3">
            <Target className="w-4 h-4 lg:w-6 lg:h-6 text-softWhite" />
          </div>
          <div className="text-xl lg:text-3xl font-bold text-charcoal">{statistics.overdueChores}</div>
          <div className="text-xs lg:text-sm text-charcoal/70">Overdue</div>
        </div>
      </div>

      {/* Charts and Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Category Breakdown */}
        <div className="card p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-semibold text-charcoal mb-3 lg:mb-4">Category Breakdown</h3>
          <div className="space-y-2 lg:space-y-3">
            {getCategoryStats().map(({ category, count, percentage }) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{category === 'Pet Care' ? '🐾' : 
                    category === 'Kitchen' ? '🍳' : 
                    category === 'Bathroom' ? '🚿' : 
                    category === 'Bedroom' ? '🛏️' : 
                    category === 'Living Room' ? '🛋️' : 
                    category === 'Laundry' ? '👕' : 
                    category === 'Outdoor' ? '🌳' : 
                    category === 'General Cleaning' ? '🧹' : '🔧'}</span>
                  <span className="text-sm lg:text-base text-charcoal">{category}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 lg:w-20 bg-lightGray rounded-full h-2">
                    <div 
                      className="bg-sage h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm lg:text-base font-medium text-charcoal w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Member Performance */}
        <div className="card p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-semibold text-charcoal mb-3 lg:mb-4">Member Performance</h3>
          <div className="space-y-3 lg:space-y-4">
            {householdMembers.map(member => {
              const performance = statistics.memberPerformance[member.name];
              const completionRate = getCompletionRate(member.id);
              
              return (
                <div key={member.id} className="flex items-center justify-between p-2 lg:p-3 bg-softWhite border border-lightGray rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 lg:w-4 lg:h-4 rounded-full"
                      style={{ backgroundColor: member.color }}
                    />
                    <span className="text-sm lg:text-base text-charcoal">{member.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm lg:text-base font-medium text-sage">
                      {performance ? `${performance.completed}/${performance.total}` : '0/0'}
                    </div>
                    <div className="text-xs text-charcoal/70">{completionRate}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Assignment Distribution */}
      <div className="card p-4 lg:p-6">
        <h3 className="text-base lg:text-lg font-semibold text-charcoal mb-3 lg:mb-4">Assignment Distribution</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <div className="space-y-2 lg:space-y-3">
            <h4 className="font-medium text-charcoal">Assigned Chores</h4>
            {householdMembers.map(member => {
              const assignedChores = chores.filter(chore => chore.assignee === member.id).length;
              return (
                <div key={member.id} className="flex items-center justify-between p-2 lg:p-3 bg-softWhite border border-lightGray rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: member.color }}
                    />
                    <span className="text-sm lg:text-base text-charcoal">{member.name}</span>
                  </div>
                  <span className="text-sm lg:text-base font-medium text-sage">{assignedChores}</span>
                </div>
              );
            })}
          </div>
          
          <div className="space-y-2 lg:space-y-3">
            <h4 className="font-medium text-charcoal">Unassigned Chores</h4>
            <div className="p-2 lg:p-3 bg-softWhite border border-lightGray rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm lg:text-base text-charcoal">Unassigned</span>
                <span className="text-sm lg:text-base font-medium text-softCoral">
                  {chores.filter(chore => !chore.assignee).length}
                </span>
              </div>
            </div>
            
            <div className="text-xs lg:text-sm text-charcoal/70 p-2 lg:p-3 bg-warmBeige rounded-lg">
              <p>💡 <strong>Tip:</strong> Assign chores to household members to track individual responsibilities and completion rates.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card p-4 lg:p-6">
        <h3 className="text-base lg:text-lg font-semibold text-charcoal mb-3 lg:mb-4">Recent Activity</h3>
        <div className="space-y-2 lg:space-y-3">
          {getRecentCompletions().map(completion => {
            const chore = chores.find(c => c.id === completion.choreId);
            const member = householdMembers.find(m => m.id === completion.completedBy);
            
            return (
              <div key={completion.id} className="flex items-center justify-between p-2 lg:p-3 bg-softWhite border border-lightGray rounded-lg">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: member?.color || '#6B7280' }}
                  />
                  <span className="text-sm lg:text-base text-charcoal">
                    <strong>{member?.name || 'Unknown'}</strong> completed <strong>{chore?.name || 'Unknown chore'}</strong>
                  </span>
                </div>
                <span className="text-xs lg:text-sm text-charcoal/70">
                  {formatDate(completion.completedAt)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="card p-4 lg:p-6">
        <h3 className="text-base lg:text-lg font-semibold text-charcoal mb-3 lg:mb-4">Performance Insights</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <div className="space-y-2 lg:space-y-3">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-amberYellow" />
              <span className="text-sm lg:text-base font-medium text-charcoal">Top Performer</span>
            </div>
            {(() => {
              const topMember = householdMembers
                .map(member => ({
                  ...member,
                  completionRate: getCompletionRate(member.id)
                }))
                .sort((a, b) => b.completionRate - a.completionRate)[0];
              
              return topMember ? (
                <div className="p-2 lg:p-3 bg-warmBeige rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: topMember.color }}
                    />
                    <span className="text-sm lg:text-base font-medium text-charcoal">{topMember.name}</span>
                  </div>
                  <div className="text-xs text-charcoal/70 mt-1">{topMember.completionRate}% completion rate</div>
                </div>
              ) : (
                <div className="text-sm text-charcoal/70">No data available</div>
              );
            })()}
          </div>
          
          <div className="space-y-2 lg:space-y-3">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-sage" />
              <span className="text-sm lg:text-base font-medium text-charcoal">Most Active Category</span>
            </div>
            {(() => {
              const mostActiveCategory = getCategoryStats()[0];
              return mostActiveCategory ? (
                <div className="p-2 lg:p-3 bg-warmBeige rounded-lg">
                  <div className="text-sm lg:text-base font-medium text-charcoal">{mostActiveCategory.category}</div>
                  <div className="text-xs text-charcoal/70 mt-1">{mostActiveCategory.count} chores ({mostActiveCategory.percentage}%)</div>
                </div>
              ) : (
                <div className="text-sm text-charcoal/70">No data available</div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
