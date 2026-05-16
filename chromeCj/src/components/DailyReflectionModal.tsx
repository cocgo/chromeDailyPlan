import { useState } from 'react';
import { DailyReflection } from '../types';
import { X } from 'lucide-react';

interface DailyReflectionModalProps {
  reflection: DailyReflection | null;
  onClose: () => void;
  onSave: (reflection: Omit<DailyReflection, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export default function DailyReflectionModal({ 
  reflection, 
  onClose, 
  onSave 
}: DailyReflectionModalProps) {
  const [score, setScore] = useState(reflection?.score || 5);
  const [reflectionText, setReflectionText] = useState(reflection?.reflection || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      date: reflection?.date || new Date().toISOString().split('T')[0],
      score,
      reflection: reflectionText
    });
  };

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4" style={{ zIndex: 9998 }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative" style={{ zIndex: 9999 }}>
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-bold text-gray-800">
            每日反省
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              自评分数 (1-10)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="10"
                value={score}
                onChange={(e) => setScore(parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-lg font-bold w-8 text-center">{score}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>最低</span>
              <span>最高</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              反省内容
            </label>
            <textarea
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              rows={5}
              placeholder="写下今天的反思和感悟..."
            />
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