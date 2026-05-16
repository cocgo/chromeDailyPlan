import { useState } from 'react';
import { FutureLetter } from '../types';
import { X } from 'lucide-react';

interface FutureLetterModalProps {
  letter: FutureLetter | null;
  onClose: () => void;
  onSave: (letter: Omit<FutureLetter, 'id' | 'createdAt'>) => void;
}

export default function FutureLetterModal({ 
  letter, 
  onClose, 
  onSave 
}: FutureLetterModalProps) {
  const [title, setTitle] = useState(letter?.title || '');
  const [content, setContent] = useState(letter?.content || '');
  const [sendDate, setSendDate] = useState(letter?.sendDate || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sendDate) {
      alert('请选择一个发送日期');
      return;
    }
    
    onSave({
      title,
      content,
      sendDate,
      sent: false
    });
  };

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4" style={{ zIndex: 9998 }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative" style={{ zIndex: 9999 }}>
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-bold text-gray-800">
            {letter ? '编辑信件' : '写给未来的信'}
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
              信件标题 *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="给这封信起个标题"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              发送日期 *
            </label>
            <input
              type="date"
              value={sendDate}
              onChange={(e) => setSendDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              信件内容 *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              rows={6}
              placeholder="写下你想对未来的自己说的话..."
              required
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