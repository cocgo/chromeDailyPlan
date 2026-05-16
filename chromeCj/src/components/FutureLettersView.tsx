import { FutureLetter } from '../types';
import { Plus, Mail, Edit3, Send } from 'lucide-react';
import { format } from 'date-fns';

interface FutureLettersViewProps {
  letters: FutureLetter[];
  onAddLetter: () => void;
  onEditLetter: (letter: FutureLetter) => void;
  onToggleSent: (letterId: string, sent: boolean) => void;
}

export default function FutureLettersView({ 
  letters, 
  onAddLetter, 
  onEditLetter, 
  onToggleSent 
}: FutureLettersViewProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const pendingLetters = letters.filter(letter => !letter.sent && new Date(letter.sendDate) > today);
  const dueLetters = letters.filter(letter => !letter.sent && new Date(letter.sendDate) <= today);
  const sentLetters = letters.filter(letter => letter.sent);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Mail className="w-5 h-5 text-purple-500" />
          给未来的信
        </h2>
        <button
          onClick={onAddLetter}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium">写信</span>
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {letters.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>暂无信件，点击"写信"给未来的自己留言</p>
          </div>
        ) : (
          <div className="space-y-6">
            {dueLetters.length > 0 && (
              <div className="border-2 border-yellow-300 rounded-lg p-4 bg-yellow-50">
                <h3 className="font-bold text-lg text-yellow-800 mb-3 flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  待发送的信件 (已到期)
                </h3>
                <div className="space-y-3">
                  {dueLetters.map((letter) => (
                    <div 
                      key={letter.id} 
                      className="p-4 rounded-lg border-2 border-yellow-200 bg-yellow-100 flex justify-between items-start"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{letter.title}</h4>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{letter.content}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          发送日期: {format(new Date(letter.sendDate), 'yyyy年MM月dd日')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEditLetter(letter)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="编辑"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onToggleSent(letter.id, true)}
                          className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="标记为已发送"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pendingLetters.length > 0 && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-lg text-gray-700 mb-3">待发送的信件</h3>
                <div className="space-y-3">
                  {pendingLetters.map((letter) => (
                    <div 
                      key={letter.id} 
                      className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50 flex justify-between items-start"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{letter.title}</h4>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{letter.content}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          发送日期: {format(new Date(letter.sendDate), 'yyyy年MM月dd日')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEditLetter(letter)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="编辑"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onToggleSent(letter.id, true)}
                          className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="标记为已发送"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sentLetters.length > 0 && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-lg text-gray-700 mb-3">已发送的信件</h3>
                <div className="space-y-3">
                  {sentLetters.map((letter) => (
                    <div 
                      key={letter.id} 
                      className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50 opacity-80 flex justify-between items-start"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{letter.title}</h4>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{letter.content}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          发送日期: {format(new Date(letter.sendDate), 'yyyy年MM月dd日')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEditLetter(letter)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="编辑"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}