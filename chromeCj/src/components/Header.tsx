import { Calendar, CheckCircle } from 'lucide-react';

export default function Header() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 shadow-lg">
      <div className="flex items-center gap-3">
        <Calendar className="w-8 h-8" />
        <div>
          <h1 className="text-xl font-bold">每日计划器</h1>
          <p className="text-sm text-blue-100 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            保持组织有序
          </p>
        </div>
      </div>
    </div>
  );
}
