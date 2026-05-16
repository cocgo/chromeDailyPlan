import { format, formatDisplayDate, getPrevDay, getNextDay } from '../utils/dateUtils';
import { Task } from '../types';
import { ChevronLeft, ChevronRight, Plus, Clock, Calendar } from 'lucide-react';
import { TaskIcon } from './TaskIcons';

interface DayViewProps {
  date: Date;
  tasks: Task[];
  onDateChange: (date: Date) => void;
  onAddTask: () => void;
  onEditTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onTaskClick: (task: Task) => void;
  onOpenDatePicker: () => void;
}

export default function DayView({
  date,
  tasks,
  onDateChange,
  onAddTask,
  onEditTask,
  onDeleteTask: _onDeleteTask,
  onTaskClick,
  onOpenDatePicker,
}: DayViewProps) {
  const currentTasks = tasks.filter((t) => t.date === format(date, 'yyyy-MM-dd'));

  const priorityColors = {
    important_urgent: 'bg-red-100 text-red-700 border-red-200',
    important_not_urgent: 'bg-blue-100 text-blue-700 border-blue-200',
    not_important_urgent: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    not_important_not_urgent: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <button
          onClick={() => onDateChange(getPrevDay(date))}
          className="p-2 hover:bg-white rounded-lg transition-colors shadow-sm"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="text-center flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-800">{formatDisplayDate(date)}</h2>
          <button
            onClick={onOpenDatePicker}
            className="p-1.5 hover:bg-white rounded-lg transition-colors shadow-sm"
            title="选择日期"
          >
            <Calendar className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <button
          onClick={() => onDateChange(getNextDay(date))}
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

        <div className="space-y-3 overflow-y-auto flex-1">
          {currentTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>暂无任务</p>
            </div>
          ) : (
            currentTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onTaskClick(task)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                  task.completed ? 'opacity-60' : ''
                } ${priorityColors[task.priority]}`}
                style={{ borderLeft: `4px solid ${task.color || '#3b82f6'}` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className={`font-semibold flex items-center gap-2 ${task.completed ? 'line-through' : ''}`}>
                      {task.icon && <TaskIcon name={task.icon} size={16} />}
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-sm mt-1 opacity-80">{task.description}</p>
                    )}
                    {task.startTime && task.endTime && (
                      <div className="flex items-center gap-1 mt-2 text-sm">
                        <Clock className="w-3 h-3" />
                        <span>{task.startTime} - {task.endTime}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditTask(task.id, { completed: !task.completed });
                      }}
                      className="px-3 py-1 text-sm bg-white rounded-md hover:bg-gray-50 transition-colors"
                    >
                      {task.completed ? '已完成' : '完成'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}