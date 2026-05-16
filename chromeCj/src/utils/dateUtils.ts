import { format, startOfDay, endOfDay, addDays, subDays, startOfWeek, endOfWeek, addWeeks, subWeeks, startOfMonth, endOfMonth, addMonths, subMonths, isSameDay, isWithinInterval, parseISO } from 'date-fns';

export const formatDate = (date: Date): string => format(date, 'yyyy-MM-dd');

export const formatDisplayDate = (date: Date): string => format(date, 'MM月dd日 EEEE');

export const getDayRange = (date: Date) => ({
  start: startOfDay(date),
  end: endOfDay(date),
});

export const getWeekRange = (date: Date) => ({
  start: startOfWeek(date, { weekStartsOn: 1 }), // Monday as start of week
  end: endOfWeek(date, { weekStartsOn: 1 }),
});

export const getMonthRange = (date: Date) => ({
  start: startOfMonth(date),
  end: endOfMonth(date),
});

export const getNextDay = (date: Date): Date => addDays(date, 1);
export const getPrevDay = (date: Date): Date => subDays(date, 1);

export const getNextWeek = (date: Date): Date => addWeeks(date, 1);
export const getPrevWeek = (date: Date): Date => subWeeks(date, 1);

export const getNextMonth = (date: Date): Date => addMonths(date, 1);
export const getPrevMonth = (date: Date): Date => subMonths(date, 1);

export const getDaysOfWeek = (date: Date): Date[] => {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
};

export const getDaysOfMonth = (date: Date): Date[] => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const days: Date[] = [];
  let current = monthStart;
  
  while (!isSameDay(current, addDays(monthEnd, 1))) {
    days.push(current);
    current = addDays(current, 1);
  }
  
  return days;
};

export const isTaskInRange = (
  taskDate: string,
  rangeStart: Date,
  rangeEnd: Date
): boolean => {
  const taskDateObj = parseISO(taskDate);
  return isWithinInterval(taskDateObj, { start: rangeStart, end: rangeEnd });
};

export { format };
