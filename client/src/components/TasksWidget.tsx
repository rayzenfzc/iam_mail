import React from 'react';

interface TasksWidgetProps {
  darkMode: boolean;
  tasks: any[];
  onTaskToggle: (id: number) => void;
  onTaskClick: (task: any) => void;
}

export const TasksWidget: React.FC<TasksWidgetProps> = ({ darkMode, tasks, onTaskToggle, onTaskClick }) => {
    const incompleteTasks = tasks.filter(t => !t.completed).slice(0, 5);
    const todayTasks = incompleteTasks.filter(t => t.due === 'Today');
    
    return (
        <div className="flex flex-col mb-6">
             <h3 className={`text-xs font-black uppercase tracking-widest mb-4 ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                Today's Tasks
                {todayTasks.length > 0 && (
                  <span className="ml-2 text-violet-500">{todayTasks.length}</span>
                )}
             </h3>
             {incompleteTasks.length === 0 ? (
               <div className={`text-center py-6 opacity-40 text-xs ${darkMode ? 'text-white' : 'text-black'}`}>
                 <div className="text-2xl mb-2">✓</div>
                 <p>All clear!</p>
               </div>
             ) : (
               <div className="space-y-2">
                   {incompleteTasks.map(task => (
                       <div 
                         key={task.id} 
                         onClick={() => onTaskClick(task)}
                         className={`p-3 rounded-md border cursor-pointer transition-all hover:border-violet-500/30 ${darkMode ? 'border-white/5 bg-white/5' : 'border-neutral-200 bg-white'}`}
                       >
                           <div className="flex items-start gap-2">
                               <input 
                                 type="checkbox" 
                                 checked={false}
                                 onChange={(e) => {
                                   e.stopPropagation();
                                   onTaskToggle(task.id);
                                 }}
                                 className="mt-0.5 w-3 h-3 rounded accent-violet-500 cursor-pointer shrink-0" 
                               />
                               <div className="flex-1 min-w-0">
                                 <div className={`text-xs font-medium line-clamp-2 ${darkMode ? 'text-white' : 'text-black'}`}>
                                   {task.title}
                                 </div>
                                 <div className="flex items-center gap-2 mt-1">
                                   <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                                     task.priority === 'HIGH' ? 'bg-red-500/20 text-red-500' :
                                     task.priority === 'MEDIUM' ? 'bg-amber-500/20 text-amber-500' :
                                     'bg-blue-500/20 text-blue-500'
                                   }`}>{task.priority}</span>
                                   {task.due !== 'No date' && (
                                     <span className="text-[9px] opacity-50">{task.due}</span>
                                   )}
                                 </div>
                               </div>
                           </div>
                       </div>
                   ))}
               </div>
             )}
        </div>
    );
};
