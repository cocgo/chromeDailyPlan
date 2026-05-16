import { ViewType } from '../types';
import { CalendarDays, Calendar, LayoutGrid, Target, Mail, Star } from 'lucide-react';

interface ViewSwitcherProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export default function ViewSwitcher({ currentView, onViewChange }: ViewSwitcherProps) {
  const views = [
    { type: 'day' as const, icon: CalendarDays, label: '日视图' },
    { type: 'week' as const, icon: Calendar, label: '周视图' },
    { type: 'month' as const, icon: LayoutGrid, label: '月视图' },
    { type: 'reflections' as const, icon: Star, label: '反省' },
    { type: 'goals' as const, icon: Target, label: '目标' },
    { type: 'letters' as const, icon: Mail, label: '信件' },
  ];

  return (
    <div className="flex bg-white rounded-lg shadow-md p-1 gap-1">
      {views.map(({ type, icon: Icon, label }) => (
        <button
          key={type}
          onClick={() => onViewChange({ ...currentView, type })}
          className={`flex-1 flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-md transition-all ${
            currentView.type === type
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          title={label}
        >
          <Icon className="w-5 h-5" />
          <span className="text-xs font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
}