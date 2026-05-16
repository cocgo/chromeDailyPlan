import { format, getWeekRange, getDaysOfWeek, getPrevWeek, getNextWeek } from '../utils/dateUtils';
import { Task } from '../types';
import { ChevronLeft, ChevronRight, Plus, Calendar } from 'lucide-react';
import { TaskIcon } from './TaskIcons';

interface WeekViewProps {
  date: Date;
  tasks: Task[];
  onDateChange: (date: Date) => void;
  onAddTask: () => void;
  onEditTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onTaskClick: (task: Task) => void;
  onOpenDatePicker: () => void;
  windowWidth?: number;
}

export default function WeekView({
  date,
  tasks,
  onDateChange,
  onAddTask,
  onEditTask: _onEditTask,
  onDeleteTask: _onDeleteTask,
  onTaskClick,
  onOpenDatePicker,
  windowWidth = 400,
}: WeekViewProps) {
  const daysOfWeek = getDaysOfWeek(date);
  const weekRange = getWeekRange(date);
  const weekLabel = `${format(weekRange.start, 'MM月dd日')} - ${format(weekRange.end, 'MM月dd日')}`;

  const priorityColors = {
    important_urgent: 'bg-red-200 text-red-700',
    important_not_urgent: 'bg-blue-200 text-blue-700',
    not_important_urgent: 'bg-yellow-200 text-yellow-700',
    not_important_not_urgent: 'bg-gray-200 text-gray-700',
  };

  const isWideMode = windowWidth > 400;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <button
          onClick={() => onDateChange(getPrevWeek(date))}
          className="p-2 hover:bg-white rounded-lg transition-colors shadow-sm"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="text-center flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-lg font-bold text-gray-800">{weekLabel}</h2>
            {/* <p className="text-xs text-gray-500">{weekLabel}</p> */}
          </div>
          <button
            onClick={onOpenDatePicker}
            className="p-1.5 hover:bg-white rounded-lg transition-colors shadow-sm"
            title="选择日期"
          >
            <Calendar className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <button
          onClick={() => onDateChange(getNextWeek(date))}
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

        <div className={`overflow-y-auto flex-1 min-h-0 ${isWideMode ? '' : 'space-y-2'}`}>
          {isWideMode ? (
            <div className="grid grid-cols-7 gap-2 h-full">
              {daysOfWeek.map((day) => {
                const dayTasks = tasks.filter((t) => t.date === format(day, 'yyyy-MM-dd'));
                const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

                return (
                  <div
                    key={format(day, 'yyyy-MM-dd')}
                    className={`p-2 rounded-lg border-2 flex flex-col ${
                      isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1 mb-2 pb-2 border-b">
                      <span className="font-semibold text-sm">
                        {format(day, 'EEE')}
                      </span>
                      <span className="text-xs text-gray-500">
                        {format(day, 'MM/dd')}
                      </span>
                      <span className="text-xs font-medium text-gray-500">
                        {dayTasks.length} 任务
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-1">
                      {dayTasks.length === 0 ? (
                        <div className="text-center py-4 text-gray-400 text-xs">
                          无任务
                        </div>
                      ) : (
                        dayTasks.map((task) => (
                          <div
                            key={task.id}
                            onClick={() => onTaskClick(task)}
                            className={`p-1.5 rounded text-[10px] cursor-pointer hover:shadow-sm transition-all ${
                              priorityColors[task.priority]
                            } ${task.completed ? 'opacity-50 line-through' : ''}`}
                            style={{ borderLeft: `2px solid ${task.color || '#3b82f6'}` }}
                          >
                            <div className="flex items-center gap-1">
                              {task.icon && <TaskIcon name={task.icon} size={10} />}
                              {task.startTime && (
                                <span className="mr-0.5">{task.startTime}</span>
                              )}
                              {task.title}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            daysOfWeek.map((day) => {
              const dayTasks = tasks.filter((t) => t.date === format(day, 'yyyy-MM-dd'));
              const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

              return (
                <div
                  key={format(day, 'yyyy-MM-dd')}
                  className={`p-3 rounded-lg border-2 ${
                    isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-semibold text-sm">
                        {format(day, 'EEE')}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {format(day, 'MM/dd')}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-gray-500">
                      {dayTasks.length} 任务
                    </span>
                  </div>

                  {dayTasks.length === 0 ? (
                    <div className="text-center py-2 text-gray-400 text-sm">
                      无任务
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {dayTasks.slice(0, 3).map((task) => (
                        <div
                          key={task.id}
                          onClick={() => onTaskClick(task)}
                          className={`p-2 rounded text-xs cursor-pointer hover:shadow-sm transition-all ${
                            priorityColors[task.priority]
                          } ${task.completed ? 'opacity-50 line-through' : ''}`}
                          style={{ borderLeft: `2px solid ${task.color || '#3b82f6'}` }}
                        >
                          <div className="flex items-center gap-1">
                            {task.icon && <TaskIcon name={task.icon} size={12} />}
                            {task.startTime && (
                              <span className="mr-1">{task.startTime}</span>
                            )}
                            {task.title}
                          </div>
                        </div>
                      ))}
                      {dayTasks.length > 3 && (
                        <div className="text-xs text-gray-500 text-center py-1">
                          +{dayTasks.length - 3} 更多
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}