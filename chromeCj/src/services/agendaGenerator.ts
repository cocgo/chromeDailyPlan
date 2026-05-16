import { Task, AgendaItem } from '../types';
import { addMinutes, parse, format } from 'date-fns';

interface AgendaConfig {
  workDayStart: string; // HH:mm
  workDayEnd: string; // HH:mm
  breakDuration: number; // minutes
  lunchTime?: { start: string; end: string };
}

const DEFAULT_CONFIG: AgendaConfig = {
  workDayStart: '09:00',
  workDayEnd: '18:00',
  breakDuration: 15,
  lunchTime: { start: '12:00', end: '13:00' },
};

class AgendaGenerator {
  /**
   * Generate daily agenda from tasks using intelligent time allocation
   * @param tasks - Tasks to schedule
   * @param date - Date to generate agenda for
   * @param config - Agenda configuration
   * @returns Array of agenda items with start and end times
   */
  generateAgenda(
    tasks: Task[],
    date: string,
    config: AgendaConfig = DEFAULT_CONFIG
  ): AgendaItem[] {
    // Filter tasks for the given date and sort by priority and estimated duration
    const dayTasks = tasks
      .filter((t) => t.date === date && !t.completed)
      .sort((a, b) => {
        // Sort by priority (important_urgent > important_not_urgent > not_important_urgent > not_important_not_urgent)
        const priorityOrder = { 
          important_urgent: 0, 
          important_not_urgent: 1, 
          not_important_urgent: 2, 
          not_important_not_urgent: 3 
        };
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        
        if (priorityDiff !== 0) return priorityDiff;
        
        // If same priority, sort by estimated duration (shorter first)
        const durationA = a.estimatedDuration || 60;
        const durationB = b.estimatedDuration || 60;
        return durationA - durationB;
      });

    if (dayTasks.length === 0) return [];

    const agendaItems: AgendaItem[] = [];
    let currentTime = parse(config.workDayStart, 'HH:mm', new Date());

    // Schedule each task
    for (const task of dayTasks) {
      const duration = task.estimatedDuration || 60;
      
      // Skip if task already has fixed times
      if (task.startTime && task.endTime) {
        agendaItems.push({
          taskId: task.id,
          startTime: task.startTime,
          endTime: task.endTime,
          title: task.title,
          priority: task.priority,
        });
        // Update current time to after the scheduled task
        const taskEndTime = parse(task.endTime, 'HH:mm', new Date());
        if (taskEndTime > currentTime) {
          currentTime = taskEndTime;
        }
        continue;
      }

      // Skip if after work day end
      if (currentTime >= parse(config.workDayEnd, 'HH:mm', new Date())) {
        break;
      }

      // Handle lunch break
      if (config.lunchTime) {
        const lunchStart = parse(config.lunchTime.start, 'HH:mm', new Date());
        const lunchEnd = parse(config.lunchTime.end, 'HH:mm', new Date());
        
        if (currentTime >= lunchStart && currentTime < lunchEnd) {
          currentTime = lunchEnd;
        }
        
        // Check if task would overlap with lunch
        const taskEndTime = addMinutes(currentTime, duration);
        if (currentTime < lunchEnd && taskEndTime > lunchStart) {
          // Schedule before lunch if possible
          if (currentTime < lunchStart) {
            const availableTime = (lunchStart.getTime() - currentTime.getTime()) / (1000 * 60);
            const shortDuration = Math.min(duration, availableTime - config.breakDuration);
            
            if (shortDuration > 15) {
              const endTime = addMinutes(currentTime, shortDuration);
              agendaItems.push({
                taskId: task.id,
                startTime: format(currentTime, 'HH:mm'),
                endTime: format(endTime, 'HH:mm'),
                title: `${task.title} (${shortDuration}分钟)`,
                priority: task.priority,
              });
              currentTime = lunchEnd;
              continue;
            }
          }
          
          currentTime = lunchEnd;
        }
      }

      // Check if we have enough time left in the work day
      const taskEndTime = addMinutes(currentTime, duration);
      const workDayEndTime = parse(config.workDayEnd, 'HH:mm', new Date());
      
      if (currentTime >= workDayEndTime) {
        break;
      }

      if (taskEndTime > workDayEndTime) {
        // Truncate task to fit work day
        const remainingTime = (workDayEndTime.getTime() - currentTime.getTime()) / (1000 * 60);
        if (remainingTime >= 15) {
          agendaItems.push({
            taskId: task.id,
            startTime: format(currentTime, 'HH:mm'),
            endTime: format(workDayEndTime, 'HH:mm'),
            title: `${task.title} (${Math.round(remainingTime)}分钟)`,
            priority: task.priority,
          });
        }
        break;
      }

      // Schedule the task
      agendaItems.push({
        taskId: task.id,
        startTime: format(currentTime, 'HH:mm'),
        endTime: format(taskEndTime, 'HH:mm'),
        title: task.title,
        priority: task.priority,
      });

      // Move to next time slot
      currentTime = addMinutes(taskEndTime, config.breakDuration);
    }

    return agendaItems;
  }

  /**
   * AI-driven agenda generation (placeholder for future implementation)
   * @param tasks - Tasks to schedule
   * @param date - Date to generate agenda for
   * @param userPreferences - User preferences and historical data
   * @returns Promise of agenda items
   */
  async generateAgendaWithAI(
    tasks: Task[],
    date: string,
    userPreferences?: any
  ): Promise<AgendaItem[]> {
    console.log('AI agenda generation placeholder - to be implemented with AI service');
    console.log('User preferences:', userPreferences);
    
    // For now, fall back to local algorithm
    return this.generateAgenda(tasks, date);
  }

  /**
   * Optimize agenda based on task dependencies and constraints
   * @param tasks - Tasks with dependencies
   * @param date - Date to optimize for
   * @returns Optimized agenda items
   */
  optimizeAgenda(
    tasks: Array<Task & { dependencies?: string[] }>,
    date: string
  ): AgendaItem[] {
    // Group tasks by dependencies
    const taskMap = new Map(tasks.map(t => [t.id, t]));
    const scheduled = new Set<string>();

    const scheduleTask = (task: typeof tasks[0]): void => {
      if (scheduled.has(task.id)) return;
      
      // Schedule dependencies first
      if (task.dependencies) {
        for (const depId of task.dependencies) {
          const depTask = taskMap.get(depId);
          if (depTask) {
            scheduleTask(depTask);
          }
        }
      }
      
      scheduled.add(task.id);
    };

    // Schedule all tasks
    for (const task of tasks) {
      scheduleTask(task);
    }

    // Generate agenda with topologically sorted tasks
    const sortedTasks = tasks.filter(t => scheduled.has(t.id));
    return this.generateAgenda(sortedTasks, date);
  }

  /**
   * Estimate optimal task duration based on task complexity and user history
   * @param task - Task to estimate duration for
   * @param userHistory - Historical task completion data
   * @returns Estimated duration in minutes
   */
  estimateDuration(
    task: Task,
    userHistory?: Array<{ title: string; actualDuration: number }>
  ): number {
    // If task already has estimated duration, use it
    if (task.estimatedDuration) return task.estimatedDuration;

    // Simple heuristic based on task properties
    let duration = 60; // Default: 1 hour

    // Adjust based on priority
    if (task.priority === 'important_urgent') duration = 90;
    if (task.priority === 'not_important_not_urgent') duration = 30;

    // Adjust based on description length
    if (task.description) {
      const words = task.description.split(/\s+/).length;
      if (words > 50) duration += 30;
      if (words > 100) duration += 30;
    }

    // AI placeholder: analyze user history for better estimation
    if (userHistory && userHistory.length > 0) {
      console.log('AI duration estimation placeholder - analyze user history');
    }

    return duration;
  }
}

export const agendaGenerator = new AgendaGenerator();