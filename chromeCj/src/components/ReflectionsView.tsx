import { useState, useMemo } from 'react';
import { DailyReflection } from '../types';
import { Star, Edit3, Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { format } from 'date-fns';

interface ReflectionsViewProps {
  reflections: DailyReflection[];
  onAddReflection: (date: string) => void;
  onEditReflection: (reflection: DailyReflection) => void;
}

export default function ReflectionsView({ 
  reflections, 
  onAddReflection, 
  onEditReflection 
}: ReflectionsViewProps) {
  // 日期范围管理
  const [currentDateRangeStart, setCurrentDateRangeStart] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 14); // 默认从14天前开始
    return date;
  });

  // 日期选择器状态
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDateForPicker, setSelectedDateForPicker] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  // 生成最近30天的日期列表
  const generateDateRange = (startDate: Date) => {
    const dates = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      dates.push(dateString);
    }
    return dates;
  };

  const dateRange = useMemo(() => generateDateRange(currentDateRangeStart), [currentDateRangeStart]);
  const today = new Date().toISOString().split('T')[0];

  // 只显示当前日期范围内的反省记录
  const rangeReflections = useMemo(() => {
    return reflections.filter(reflection => 
      dateRange.includes(reflection.date)
    ).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [dateRange, reflections]);

  const goToPreviousRange = () => {
    const newStart = new Date(currentDateRangeStart);
    newStart.setDate(newStart.getDate() - 30);
    setCurrentDateRangeStart(newStart);
  };

  const goToNextRange = () => {
    const newStart = new Date(currentDateRangeStart);
    newStart.setDate(newStart.getDate() + 30);
    // 确保不会超过今天
    const maxStart = new Date();
    maxStart.setDate(maxStart.getDate() - 29); // 确保30天范围不会超过今天
    if (newStart > maxStart) {
      newStart.setTime(maxStart.getTime());
    }
    setCurrentDateRangeStart(newStart);
  };

  // 处理日期选择
  const handleDateSelect = (date: string) => {
    // 可以在这里执行任何需要的日期选择逻辑
    // 目前只是确保日期范围包含所选日期
    const selectedDate = new Date(date);
    const rangeStartDate = currentDateRangeStart;
    const rangeEndDate = new Date(currentDateRangeStart.getTime() + 29*24*60*60*1000);

    // 如果所选日期不在当前范围内，调整范围
    if (selectedDate < rangeStartDate) {
      setCurrentDateRangeStart(new Date(selectedDate));
    } else if (selectedDate > rangeEndDate) {
      const newStart = new Date(selectedDate);
      newStart.setDate(newStart.getDate() - 29);
      setCurrentDateRangeStart(newStart);
    }
  };

  // 选择特定日期
  const selectDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    setSelectedDateForPicker(dateString);
    handleDateSelect(dateString);
    const reflection = reflections.find(r => r.date === dateString);
    if (reflection) {
      onEditReflection(reflection);
    } else {
      onAddReflection(dateString);
    }
    setShowDatePicker(false);
  };

  const handleDateChangeInPicker = (dateString: string) => {
    const date = new Date(dateString);
    selectDate(date);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          每日反省
        </h2>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {rangeReflections.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>
              {'当前日期范围内暂无反省记录'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {rangeReflections.map((reflection) => (
              <div 
                key={reflection.id} 
                className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50 flex justify-between items-start"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">
                      {format(new Date(reflection.date), 'yyyy年MM月dd日')} 
                      <span className="ml-2 text-sm font-normal">({format(new Date(reflection.date), 'EEEE')})</span>
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-yellow-600">{reflection.score}/10</span>
                      <div className="flex">
                        {[...Array(10)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < reflection.score ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">{reflection.reflection}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    更新时间: {format(new Date(reflection.updatedAt), 'yyyy年MM月dd日 HH:mm')}
                  </p>
                </div>
                <button
                  onClick={() => onEditReflection(reflection)}
                  className="ml-4 p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="编辑"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 日期范围选择 */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              日期范围
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDatePicker(true);
                }}
                className="p-1.5 text-gray-500 hover:bg-gray-200 rounded"
                title="选择日期"
              >
                <Calendar className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // 防止触发外层点击事件
                  goToPreviousRange();
                }}
                className="p-1.5 text-gray-500 hover:bg-gray-200 rounded"
                title="前30天"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600">
                {`${format(currentDateRangeStart, 'MM月dd日')} - ${format(new Date(currentDateRangeStart.getTime() + 29*24*60*60*1000), 'MM月dd日')}`}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // 防止触发外层点击事件
                  goToNextRange();
                }}
                className="p-1.5 text-gray-500 hover:bg-gray-200 rounded"
                title="后30天"
                disabled={new Date(currentDateRangeStart.getTime() + 29*24*60*60*1000) >= new Date()}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {dateRange.map((date) => {
              const reflection = reflections.find(r => r.date === date);
              const isToday = date === today;
              
              return (
                <button
                  key={date}
                  onClick={() => {
                    handleDateSelect(date);
                    const reflection = reflections.find(r => r.date === date);
                    if (reflection) {
                      onEditReflection(reflection);
                    } else {
                      onAddReflection(date);
                    }
                  }}
                  className={`p-2 rounded-lg text-center text-xs flex flex-col items-center ${
                    isToday 
                      ? 'bg-blue-100 border border-blue-300' 
                      : reflection 
                        ? 'bg-green-100 border border-green-300' 
                        : 'bg-gray-100 border border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  <span>{format(new Date(date), 'MM/dd')}</span>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-2 h-2 ${
                          reflection && i < Math.floor(reflection.score / 2) 
                            ? 'text-yellow-500 fill-yellow-500' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* 日期选择器弹窗 */}
          {showDatePicker && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg w-full max-w-xs mx-4">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">选择日期</h3>
                  <button 
                    onClick={() => setShowDatePicker(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-4">
                  <input
                    type="date"
                    value={selectedDateForPicker}
                    onChange={(e) => handleDateChangeInPicker(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-3"
                  />
                  
                  <div className="flex justify-center">
                    <button
                      onClick={() => selectDate(new Date())}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      今天
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}