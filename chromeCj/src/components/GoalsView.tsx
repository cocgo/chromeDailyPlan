import { Goal } from '../types';
import { Plus, Target, Edit3, Trash2 } from 'lucide-react';

interface GoalsViewProps {
  goals: Goal[];
  onAddGoal: () => void;
  onEditGoal: (goal: Goal) => void;
  onDeleteGoal: (goalId: string) => void;
}

const goalTypeLabels: Record<Goal['type'], string> = {
  daily: '日目标',
  weekly: '周目标',
  monthly: '月目标',
  yearly: '年目标',
  'multi_year_3': '3年目标',
  'multi_year_5': '5年目标',
  'multi_year_10': '10年目标',
  'multi_year_20': '20年目标',
  'multi_year_30': '30年目标',
  'multi_year_50': '50年目标',
  lifetime: '终身目标',
};

export default function GoalsView({ 
  goals, 
  onAddGoal, 
  onEditGoal, 
  onDeleteGoal 
}: GoalsViewProps) {
  const groupedGoals = goals.reduce((acc, goal) => {
    if (!acc[goal.type]) {
      acc[goal.type] = [];
    }
    acc[goal.type].push(goal);
    return acc;
  }, {} as Record<string, Goal[]>);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Target className="w-5 h-5 text-green-500" />
          目标管理
        </h2>
        <button
          onClick={onAddGoal}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium">添加目标</span>
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {goals.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>暂无目标，点击"添加目标"开始设定您的目标</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedGoals).map(([type, goalsOfType]) => (
              <div key={type} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-lg text-gray-700 mb-3">{goalTypeLabels[type as Goal['type']]}</h3>
                <div className="space-y-3">
                  {goalsOfType.map((goal) => (
                    <div 
                      key={goal.id} 
                      className={`p-4 rounded-lg border-2 flex justify-between items-start ${
                        goal.achieved 
                          ? 'bg-green-50 border-green-200 opacity-80' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-800">{goal.title}</h4>
                          {goal.achieved && (
                            <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">已完成</span>
                          )}
                        </div>
                        {goal.description && (
                          <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                        )}
                        {goal.targetDate && (
                          <p className="text-xs text-gray-500 mt-2">
                            目标日期: {new Date(goal.targetDate).toLocaleDateString('zh-CN')}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEditGoal(goal)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="编辑"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteGoal(goal.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}