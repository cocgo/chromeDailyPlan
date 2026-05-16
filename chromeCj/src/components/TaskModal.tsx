import { useState, useEffect } from 'react';
import { Task } from '../types';
import { format, isToday } from 'date-fns';
import { X, Save, RotateCcw } from 'lucide-react';
import { TaskIcon } from './TaskIcons';

interface TaskModalProps {
  task: Task | null;
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id'>) => void;
}

export default function TaskModal({ task, onClose, onSave }: TaskModalProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [date, setDate] = useState(task?.date || format(new Date(), 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState(task?.startTime || '09:00');
  const [endTime, setEndTime] = useState(task?.endTime || '10:00');
  const [priority, setPriority] = useState<'important_urgent' | 'important_not_urgent' | 'not_important_urgent' | 'not_important_not_urgent'>(
    task?.priority || 'important_not_urgent'
  );
  const [estimatedDuration, setEstimatedDuration] = useState(
    task?.estimatedDuration || 30
  );
  const [color, setColor] = useState(task?.color || '#3b82f6'); // 默认蓝色
  const [icon, setIcon] = useState(task?.icon || '');

  // 颜色选项
  const colorOptions = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#10b981', // green
    '#f59e0b', // yellow
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#f97316', // orange
  ];

  // 图标选项
  const iconOptions = [
    { name: 'task', label: '任务' },
    { name: 'meeting', label: '会议' },
    { name: 'work', label: '工作' },
    { name: 'study', label: '学习' },
    { name: 'break', label: '休息' },
    { name: 'exercise', label: '锻炼' },
    { name: 'shopping', label: '购物' },
    // { name: 'call', label: '通话' },
  ];

  // 当日期或预计时长变化时，自动计算结束时间
  useEffect(() => {
    if (startTime && estimatedDuration) {
      const [hours, minutes] = startTime.split(':').map(Number);
      const startDate = new Date();
      startDate.setHours(hours, minutes, 0, 0);
      
      const endDate = new Date(startDate.getTime() + estimatedDuration * 60000);
      const endHours = endDate.getHours().toString().padStart(2, '0');
      const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
      
      setEndTime(`${endHours}:${endMinutes}`);
    }
  }, [startTime, estimatedDuration]);

  const handleDurationQuickSelect = (minutes: number) => {
    setEstimatedDuration(minutes);
  };

  const handleRefreshTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    setStartTime(`${hours}:${minutes}`);
    
    // 重新计算结束时间
    const endDate = new Date(now.getTime() + estimatedDuration * 60000);
    const endHours = endDate.getHours().toString().padStart(2, '0');
    const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
    setEndTime(`${endHours}:${endMinutes}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      date,
      startTime,
      endTime,
      priority,
      completed: task?.completed || false,
      estimatedDuration,
      color,
      icon,
    });
    
    // 保存后关闭模态框
    onClose();
  };

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4" style={{ zIndex: 9998 }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative" style={{ zIndex: 9999 }}>
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-bold text-gray-800">
            {task ? '编辑任务' : '添加任务'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              任务标题 *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="输入任务标题"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              任务描述
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              rows={3}
              placeholder="添加任务描述（可选）"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                日期 *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                优先级
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'important_urgent' | 'important_not_urgent' | 'not_important_urgent' | 'not_important_not_urgent')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                <option value="important_urgent">重要紧急</option>
                <option value="important_not_urgent">重要不紧急</option>
                <option value="not_important_urgent">不重要紧急</option>
                <option value="not_important_not_urgent">不重要不紧急</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                开始时间
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                {isToday(new Date(date)) && (
                  <button
                    type="button"
                    onClick={handleRefreshTime}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="设置为当前时间"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                结束时间
              </label>
              <input
                type="time"
                value={endTime}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              预计时长（分钟）
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(Number(e.target.value))}
                min="1"
                step="1"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              <div className="flex gap-1">
                {[15, 30, 45, 60].map((minutes) => (
                  <button
                    key={minutes}
                    type="button"
                    onClick={() => handleDurationQuickSelect(minutes)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      estimatedDuration === minutes
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {minutes}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              颜色
            </label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((colorOption) => (
                <button
                  key={colorOption}
                  type="button"
                  onClick={() => setColor(colorOption)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    color === colorOption ? 'border-gray-800' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: colorOption }}
                  title={colorOption}
                />
              ))}
              <div className="flex items-center">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-8 h-8 p-1 rounded border border-gray-300"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              图标
            </label>
            <div className="flex flex-wrap gap-2">
              {iconOptions.map((iconOption) => (
                <button
                  key={iconOption.name}
                  type="button"
                  onClick={() => setIcon(iconOption.name)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-colors ${
                    icon === iconOption.name
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <TaskIcon name={iconOption.name} size={20} className={`${icon === iconOption.name ? 'text-blue-600' : 'text-gray-600'}`} />
                  <span className="text-xs mt-1">{iconOption.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}