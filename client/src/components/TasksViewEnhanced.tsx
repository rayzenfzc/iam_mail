import React from 'react';

interface TasksViewEnhancedProps {
  darkMode: boolean;
  tasks: any[];
  filter: 'ALL' | 'TODAY' | 'OVERDUE';
  onTaskToggle: (taskId: number) => void;
  onTaskClick?: (task: any) => void;
}

export const TasksViewEnhanced: React.FC<TasksViewEnhancedProps> = ({ 
  darkMode, 
  tasks, 
  filter, 
  onTaskToggle,
  onTaskClick 
}) => {
  // Filter tasks based on filter state
  const filteredTasks = tasks.filter((task: any) => {
    if (filter === 'TODAY') {
      return task.due === 'Today';
    } else if (filter === 'OVERDUE') {
      // For demo purposes, treat specific keywords as overdue
      const overdueKeywords = ['Yesterday', 'Dec 28', 'Dec 27', 'Last week'];
      return overdueKeywords.some(keyword => task.due.includes(keyword)) && !task.completed;
    }
    return true; // ALL
  });

  return (
    <div className="sm:max-w-2xl sm:mx-auto">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-thin uppercase tracking-[0.2em] sm:tracking-[0.3em] bg-gradient-to-r from-red-400 via-orange-300 to-red-400 bg-clip-text text-transparent">
          TASKS
          {filter !== 'ALL' && <span className="text-base sm:text-lg ml-2 sm:ml-3 opacity-50">• {filter}</span>}
        </h2>
        <div className={`text-sm font-bold px-3 py-1 rounded-full ${darkMode ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-100 text-violet-600'}`}>
          {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
        </div>
      </div>
      {filteredTasks.length === 0 ? (
        <div className={`text-center py-12 opacity-40 ${darkMode ? 'text-white' : 'text-black'}`}>
          <div className="text-4xl mb-3">✓</div>
          <p>No {filter.toLowerCase()} tasks</p>
          {filter !== 'ALL' && (
            <button 
              onClick={() => {}} 
              className="mt-4 text-sm opacity-60 hover:opacity-100 underline"
            >
              Show all tasks
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {filteredTasks.map((task: any) => (
            <div 
              key={task.id} 
              className={`p-3 sm:p-4 rounded-lg border flex items-start gap-3 sm:gap-4 transition-all cursor-pointer active:scale-[0.98] ${
                task.completed ? 'opacity-50' : ''
              } ${darkMode ? 'bg-[#111] border-white/5 hover:border-violet-500/20' : 'bg-white border-neutral-100'}`}
              onClick={() => onTaskClick && onTaskClick(task)}
            >
              <input 
                type="checkbox" 
                checked={task.completed} 
                onChange={(e) => {
                  e.stopPropagation();
                  onTaskToggle(task.id);
                }}
                className="mt-1 w-4 h-4 rounded accent-violet-500 cursor-pointer" 
              />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className={`text-sm font-medium ${task.completed ? 'line-through' : ''}`}>
                    {task.title}
                  </h3>
                  <span className={`text-[9px] font-bold px-2 py-1 rounded shrink-0 ml-2 ${
                    task.priority === 'HIGH' ? 'bg-red-500/20 text-red-500' :
                    task.priority === 'MEDIUM' ? 'bg-amber-500/20 text-amber-500' :
                    'bg-blue-500/20 text-blue-500'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <div className="flex gap-4 text-[10px] opacity-50 flex-wrap">
                  <span>📅 {task.due}</span>
                  <span>🏷 {task.category}</span>
                  {task.sourceEmailSubject && (
                    <span className={`opacity-100 ${darkMode ? 'text-violet-400' : 'text-violet-600'}`}>
                      📧 {task.sourceEmailSubject.substring(0, 30)}{task.sourceEmailSubject.length > 30 ? '...' : ''}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};