import { DailyReflection, Goal, FutureLetter } from '../types';

class ReflectionStorageService {
  private readonly REFLECTION_KEY = 'daily_reflections';
  private readonly GOALS_KEY = 'goals';
  private readonly LETTERS_KEY = 'future_letters';

  async getReflections(): Promise<DailyReflection[]> {
    return new Promise((resolve, reject) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get([this.REFLECTION_KEY], (result) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(result[this.REFLECTION_KEY] || []);
          }
        });
      } else {
        try {
          const reflections = localStorage.getItem(this.REFLECTION_KEY);
          resolve(reflections ? JSON.parse(reflections) : []);
        } catch (error) {
          reject(error);
        }
      }
    });
  }

  async getReflectionByDate(date: string): Promise<DailyReflection | undefined> {
    const reflections = await this.getReflections();
    return reflections.find(r => r.date === date);
  }

  async saveReflection(reflection: Omit<DailyReflection, 'id' | 'createdAt' | 'updatedAt'>): Promise<DailyReflection> {
    return new Promise((resolve, reject) => {
      this.getReflections()
        .then(reflections => {
          const now = new Date().toISOString();
          const existingIndex = reflections.findIndex(r => r.date === reflection.date);
          
          const newReflection: DailyReflection = {
            ...reflection,
            id: existingIndex !== -1 ? reflections[existingIndex].id : Date.now().toString(),
            createdAt: existingIndex !== -1 ? reflections[existingIndex].createdAt : now,
            updatedAt: now
          };
          
          if (existingIndex !== -1) {
            reflections[existingIndex] = newReflection;
          } else {
            reflections.push(newReflection);
          }
          
          if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.set({ [this.REFLECTION_KEY]: reflections }, () => {
              if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
              } else {
                resolve(newReflection);
              }
            });
          } else {
            try {
              localStorage.setItem(this.REFLECTION_KEY, JSON.stringify(reflections));
              resolve(newReflection);
            } catch (error) {
              reject(error);
            }
          }
        })
        .catch(reject);
    });
  }

  async getGoals(): Promise<Goal[]> {
    return new Promise((resolve, reject) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get([this.GOALS_KEY], (result) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(result[this.GOALS_KEY] || []);
          }
        });
      } else {
        try {
          const goals = localStorage.getItem(this.GOALS_KEY);
          resolve(goals ? JSON.parse(goals) : []);
        } catch (error) {
          reject(error);
        }
      }
    });
  }

  async saveGoal(goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Goal> {
    return new Promise((resolve, reject) => {
      this.getGoals()
        .then(goals => {
          const now = new Date().toISOString();
          const newGoal: Goal = {
            ...goal,
            id: Date.now().toString(),
            createdAt: now,
            updatedAt: now
          };
          
          const existingIndex = goals.findIndex(g => g.id === newGoal.id);
          if (existingIndex !== -1) {
            goals[existingIndex] = newGoal;
          } else {
            goals.push(newGoal);
          }
          
          if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.set({ [this.GOALS_KEY]: goals }, () => {
              if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
              } else {
                resolve(newGoal);
              }
            });
          } else {
            try {
              localStorage.setItem(this.GOALS_KEY, JSON.stringify(goals));
              resolve(newGoal);
            } catch (error) {
              reject(error);
            }
          }
        })
        .catch(reject);
    });
  }

  async updateGoal(goalId: string, updates: Partial<Goal>): Promise<Goal | null> {
    return new Promise((resolve, reject) => {
      this.getGoals()
        .then(goals => {
          const goalIndex = goals.findIndex(g => g.id === goalId);
          if (goalIndex === -1) {
            resolve(null);
            return;
          }
          
          const updatedGoal = {
            ...goals[goalIndex],
            ...updates,
            updatedAt: new Date().toISOString()
          };
          
          goals[goalIndex] = updatedGoal;
          
          if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.set({ [this.GOALS_KEY]: goals }, () => {
              if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
              } else {
                resolve(updatedGoal);
              }
            });
          } else {
            try {
              localStorage.setItem(this.GOALS_KEY, JSON.stringify(goals));
              resolve(updatedGoal);
            } catch (error) {
              reject(error);
            }
          }
        })
        .catch(reject);
    });
  }

  async deleteGoal(goalId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.getGoals()
        .then(goals => {
          const filteredGoals = goals.filter(g => g.id !== goalId);
          
          if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.set({ [this.GOALS_KEY]: filteredGoals }, () => {
              if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
              } else {
                resolve(true);
              }
            });
          } else {
            try {
              localStorage.setItem(this.GOALS_KEY, JSON.stringify(filteredGoals));
              resolve(true);
            } catch (error) {
              reject(error);
            }
          }
        })
        .catch(reject);
    });
  }

  async getFutureLetters(): Promise<FutureLetter[]> {
    return new Promise((resolve, reject) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get([this.LETTERS_KEY], (result) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(result[this.LETTERS_KEY] || []);
          }
        });
      } else {
        try {
          const letters = localStorage.getItem(this.LETTERS_KEY);
          resolve(letters ? JSON.parse(letters) : []);
        } catch (error) {
          reject(error);
        }
      }
    });
  }

  async saveFutureLetter(letter: Omit<FutureLetter, 'id' | 'createdAt'>): Promise<FutureLetter> {
    return new Promise((resolve, reject) => {
      this.getFutureLetters()
        .then(letters => {
          const now = new Date().toISOString();
          const newLetter: FutureLetter = {
            ...letter,
            id: Date.now().toString(),
            createdAt: now
          };
          
          letters.push(newLetter);
          
          if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.set({ [this.LETTERS_KEY]: letters }, () => {
              if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
              } else {
                resolve(newLetter);
              }
            });
          } else {
            try {
              localStorage.setItem(this.LETTERS_KEY, JSON.stringify(letters));
              resolve(newLetter);
            } catch (error) {
              reject(error);
            }
          }
        })
        .catch(reject);
    });
  }

  async updateFutureLetter(letterId: string, updates: Partial<FutureLetter>): Promise<FutureLetter | null> {
    return new Promise((resolve, reject) => {
      this.getFutureLetters()
        .then(letters => {
          const letterIndex = letters.findIndex(l => l.id === letterId);
          if (letterIndex === -1) {
            resolve(null);
            return;
          }
          
          const updatedLetter = {
            ...letters[letterIndex],
            ...updates
          };
          
          letters[letterIndex] = updatedLetter;
          
          if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.set({ [this.LETTERS_KEY]: letters }, () => {
              if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
              } else {
                resolve(updatedLetter);
              }
            });
          } else {
            try {
              localStorage.setItem(this.LETTERS_KEY, JSON.stringify(letters));
              resolve(updatedLetter);
            } catch (error) {
              reject(error);
            }
          }
        })
        .catch(reject);
    });
  }

  async getUnsentLetters(): Promise<FutureLetter[]> {
    const letters = await this.getFutureLetters();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return letters.filter(letter => !letter.sent && new Date(letter.sendDate) <= today);
  }
}

export const reflectionStorageService = new ReflectionStorageService();