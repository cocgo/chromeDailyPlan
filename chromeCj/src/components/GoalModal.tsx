import { useState } from 'react';
import { Goal } from '../types';
import { X } from 'lucide-react';

interface GoalModalProps {
  goal: Goal | null;
  onClose: () => void;
  onSave: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export default function GoalModal({ 
  goal, 
  onClose, 
  onSave 
}: GoalModalProps) {
  const [title, setTitle] = useState(goal?.title || '');
  const [description, setDescription] = useState(goal?.description || '');
  const [type, setType] = useState<Goal['type']>(goal?.type || 'yearly');
  const [targetDate, setTargetDate] = useState(goal?.targetDate || '');

  const goalTypes = [
    { value: 'daily', label: '日目标' },
    { value: 'weekly', label: '周目标' },
    { value: 'monthly', label: '月目标' },
    { value: 'yearly', label: '年目标' },
    { value: 'multi_year_3', label: '3年目标' },
    { value: 'multi_year_5', label: '5年目标' },
    { value: 'multi_year_10', label: '10年目标' },
    { value: 'multi_year_20', label: '20年目标' },
    { value: 'multi_year_30', label: '30年目标' },
    { value: 'multi_year_50', label: '50年目标' },
    { value: 'lifetime', label: '终身目标' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      description,
      type,
      targetDate: type.includes('year') || type === 'monthly' ? targetDate : undefined,
      achieved: goal?.achieved || false,
    });
  };

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4" style={{ zIndex: 9998 }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative" style={{ zIndex: 9999 }}>
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-bold text-gray-800">
            {goal ? '编辑目标' : '添加目标'}
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
              目标名称 *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="输入目标名称"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              目标描述
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              rows={3}
              placeholder="描述你的目标..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              目标类型 *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as Goal['type'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            >
              {goalTypes.map((goalType) => (
                <option key={goalType.value} value={goalType.value}>
                  {goalType.label}
                </option>
              ))}
            </select>
          </div>

          {(type.includes('year') || type === 'monthly') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                目标日期
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          )}

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
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}