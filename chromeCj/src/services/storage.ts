import { Task } from '../types';

class StorageService {
  private readonly TASKS_KEY = 'daily_planner_tasks';

  async getTasks(): Promise<Task[]> {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get([this.TASKS_KEY], (result) => {
          resolve(result[this.TASKS_KEY] || []);
        });
      } else {
        // Fallback for development
        const data = localStorage.getItem(this.TASKS_KEY);
        resolve(data ? JSON.parse(data) : []);
      }
    });
  }

  async saveTasks(tasks: Task[]): Promise<void> {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({ [this.TASKS_KEY]: tasks }, () => {
          resolve();
        });
      } else {
        localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
        resolve();
      }
    });
  }

  async addTask(task: Omit<Task, 'id'>): Promise<Task> {
    const tasks = await this.getTasks();
    const newTask: Task = {
      ...task,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    await this.saveTasks([...tasks, newTask]);
    return newTask;
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task | null> {
    const tasks = await this.getTasks();
    const index = tasks.findIndex((t) => t.id === taskId);
    if (index === -1) return null;

    const updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index], ...updates };
    await this.saveTasks(updatedTasks);
    return updatedTasks[index];
  }

  async deleteTask(taskId: string): Promise<boolean> {
    const tasks = await this.getTasks();
    const filteredTasks = tasks.filter((t) => t.id !== taskId);
    await this.saveTasks(filteredTasks);
    return true;
  }

  async getTasksByDate(date: string): Promise<Task[]> {
    const tasks = await this.getTasks();
    return tasks.filter((t) => t.date === date);
  }

  async getTasksByDateRange(startDate: string, endDate: string): Promise<Task[]> {
    const tasks = await this.getTasks();
    return tasks.filter((t) => t.date >= startDate && t.date <= endDate);
  }

  // Cloud sync placeholder for future implementation
  async syncWithCloud(): Promise<void> {
    console.log('Cloud sync placeholder - to be implemented with CloudBase or similar');
  }
}

export const storageService = new StorageService();
