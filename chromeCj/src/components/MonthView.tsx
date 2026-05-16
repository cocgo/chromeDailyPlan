import { format, getDaysOfMonth, getPrevMonth, getNextMonth } from '../utils/dateUtils';
import { Task } from '../types';
import { ChevronLeft, ChevronRight, Plus, Calendar } from 'lucide-react';
import { TaskIcon } from './TaskIcons';

interface MonthViewProps {
  date: Date;
  tasks: Task[];
  onDateChange: (date: Date) => void;
  onAddTask: () => void;
  onEditTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onTaskClick: (task: Task) => void;
  onOpenDatePicker: () => void;
}

export default function MonthView({
  date,
  tasks,
  onDateChange,
  onAddTask,
  onEditTask: _onEditTask,
  onDeleteTask: _onDeleteTask,
  onTaskClick,
  onOpenDatePicker,
}: MonthViewProps) {
  const daysOfMonth = getDaysOfMonth(date);
  const monthLabel = format(date, 'yyyy年 MM月');

  const priorityColors = {
    important_urgent: 'bg-red-200',
    important_not_urgent: 'bg-blue-200',
    not_important_urgent: 'bg-yellow-200',
    not_important_not_urgent: 'bg-gray-200',
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <button
          onClick={() => onDateChange(getPrevMonth(date))}
          className="p-2 hover:bg-white rounded-lg transition-colors shadow-sm"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="text-center flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-800">{monthLabel}</h2>
          <button
            onClick={onOpenDatePicker}
            className="p-1.5 hover:bg-white rounded-lg transition-colors shadow-sm"
            title="选择日期"
          >
            <Calendar className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <button
          onClick={() => onDateChange(getNextMonth(date))}
          className="p-2 hover:bg-white rounded-lg transition-colors shadow-sm"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="p-4 flex flex-col flex-1 min-h-0">
        <button
          onClick={onAddTask}
          className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">添加任务</span>
        </button>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['一', '二', '三', '四', '五', '六', '日'].map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-gray-500 py-1">
              {day}
            </div>
          ))}
        </div>

        <div className="overflow-y-auto flex-1 min-h-0">
          <div className="grid grid-cols-7 gap-1">
            {daysOfMonth.map((day) => {
              const dayTasks = tasks.filter((t) => t.date === format(day, 'yyyy-MM-dd'));
              const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
              const dayNum = format(day, 'd');

              return (
                <div
                  key={format(day, 'yyyy-MM-dd')}
                  onClick={() => onTaskClick(dayTasks[0] || null)}
                  className={`min-h-16 p-1 rounded-lg border cursor-pointer hover:shadow-md transition-all ${
                    isToday
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-right">
                    <span className={`text-xs font-semibold ${
                      isToday ? 'text-blue-600' : 'text-gray-700'
                    }`}>
                      {dayNum}
                    </span>
                  </div>

                  {dayTasks.length > 0 && (
                    <div className="space-y-0.5 mt-1">
                      {dayTasks.slice(0, 2).map((task) => (
                        <div
                          key={task.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onTaskClick(task);
                          }}
                          className={`text-[10px] px-1 py-0.5 rounded truncate flex items-center gap-1 ${
                            priorityColors[task.priority]
                          } ${task.completed ? 'opacity-50' : ''}`}
                          style={{ borderLeft: `2px solid ${task.color || '#3b82f6'}` }}
                        >
                          {task.icon && <TaskIcon name={task.icon} size={10} />}
                          {task.title}
                        </div>
                      ))}
                      {dayTasks.length > 2 && (
                        <div className="text-[9px] text-gray-500 text-center">
                          +{dayTasks.length - 2}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}