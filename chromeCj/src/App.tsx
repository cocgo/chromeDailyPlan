import { useState, useEffect } from 'react';
import { ViewType, DailyReflection, Goal, FutureLetter } from './types';
import Header from './components/Header';
import ViewSwitcher from './components/ViewSwitcher';
import DayView from './components/DayView';
import WeekView from './components/WeekView';
import MonthView from './components/MonthView';
import GoalsView from './components/GoalsView';
import FutureLettersView from './components/FutureLettersView';
import ReflectionsView from './components/ReflectionsView';
import TaskModal from './components/TaskModal';
import DatePicker from './components/DatePicker';
import ResizableContainer from './components/ResizableContainer';
import DailyReflectionModal from './components/DailyReflectionModal';
import GoalModal from './components/GoalModal';
import FutureLetterModal from './components/FutureLetterModal';
import { storageService } from './services/storage';
import { windowSizeService } from './services/windowSize';
import { reflectionStorageService } from './services/reflectionStorage';
import { Task } from './types';

function App() {
  const [view, setView] = useState<ViewType>(() => {
    // Initialize view from localStorage immediately
    const savedViewType = localStorage.getItem('lastViewType') || 'week';
    const savedViewDate = localStorage.getItem('lastViewDate');
    return {
      type: savedViewType as 'day' | 'week' | 'month' | 'goals' | 'letters' | 'reflections',
      date: savedViewDate ? new Date(savedViewDate) : new Date()
    };
  });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [reflections, setReflections] = useState<DailyReflection[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [letters, setLetters] = useState<FutureLetter[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReflectionModalOpen, setIsReflectionModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isFutureLetterModalOpen, setIsFutureLetterModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingReflection, setEditingReflection] = useState<DailyReflection | null>(null);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [editingLetter, setEditingLetter] = useState<FutureLetter | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(400);
  const [windowHeight, setWindowHeight] = useState(600);

  // Load tasks, saved view, and window size on mount
  useEffect(() => {
    console.log('[App] Component mounted, loading data...');
    const initialize = async () => {
      // Load tasks
      const savedTasks = await storageService.getTasks();
      setTasks(savedTasks);

      // Load reflections
      const savedReflections = await reflectionStorageService.getReflections();
      setReflections(savedReflections);

      // Load goals
      const savedGoals = await reflectionStorageService.getGoals();
      setGoals(savedGoals);

      // Load letters
      const savedLetters = await reflectionStorageService.getFutureLetters();
      setLetters(savedLetters);

      // Load saved view type from chrome storage
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get(['lastViewType', 'lastViewDate'], (result) => {
          if (result.lastViewType || result.lastViewDate) {
            const savedViewType = result.lastViewType || 'week';
            const savedViewDate = result.lastViewDate ? new Date(result.lastViewDate) : new Date();
            setView({ type: savedViewType, date: savedViewDate });
          }
        });
      }
    };

    // Load saved window size
    windowSizeService.getSavedSize().then((size) => {
      console.log('[App] Loaded size:', size);
      setWindowWidth(size.width);
      setWindowHeight(size.height);
      console.log('[App] Updated state: windowWidth=', size.width, 'windowHeight=', size.height);
    }).catch(err => {
      console.log('[App] Error loading size:', err);
    });

    initialize();
  }, []);

  const handleAddTask = (taskData: Omit<Task, 'id'>) => {
    storageService.addTask(taskData).then((newTask) => {
      setTasks([...tasks, newTask]);
      setIsModalOpen(false);
    });
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    storageService.updateTask(taskId, updates).then((updatedTask) => {
      if (updatedTask) {
        setTasks(tasks.map((t) => (t.id === taskId ? updatedTask : t)));
      }
    });
  };

  const handleDeleteTask = (taskId: string) => {
    storageService.deleteTask(taskId).then(() => {
      setTasks(tasks.filter((t) => t.id !== taskId));
    });
  };

  const handleAddReflection = (date: string) => {
    // 检查是否已存在该日期的反省
    const existingReflection = reflections.find(r => r.date === date);
    if (existingReflection) {
      // 如果存在，则编辑该反省
      setEditingReflection(existingReflection);
      setIsReflectionModalOpen(true);
    } else {
      // 如果不存在，则创建新反省
      setEditingReflection({
        id: Date.now().toString(),
        date,
        score: 5,
        reflection: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setIsReflectionModalOpen(true);
    }
  };

  const handleUpdateReflection = (reflectionData: Omit<DailyReflection, 'id' | 'createdAt' | 'updatedAt'>) => {
    reflectionStorageService.saveReflection(reflectionData).then((updatedReflection) => {
      // 检查是否已存在该日期的反省
      const existingIndex = reflections.findIndex(r => r.date === updatedReflection.date);
      if (existingIndex !== -1) {
        // 更新现有反省
        setReflections(reflections.map(r => r.date === updatedReflection.date ? updatedReflection : r));
      } else {
        // 添加新反省
        setReflections([...reflections, updatedReflection]);
      }
      setIsReflectionModalOpen(false);
    });
  };

  const handleAddGoal = (goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    reflectionStorageService.saveGoal(goalData).then((newGoal) => {
      setGoals([...goals, newGoal]);
      setIsGoalModalOpen(false);
    });
  };

  const handleUpdateGoal = (goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const goalId = editingGoal?.id;
    if (!goalId) return;
    
    reflectionStorageService.updateGoal(goalId, goalData).then((updatedGoal) => {
      if (updatedGoal) {
        setGoals(goals.map(g => g.id === updatedGoal.id ? updatedGoal : g));
      }
      setIsGoalModalOpen(false);
    });
  };

  const handleDeleteGoal = (goalId: string) => {
    reflectionStorageService.deleteGoal(goalId).then((success) => {
      if (success) {
        setGoals(goals.filter(g => g.id !== goalId));
      }
    });
  };

  const handleAddLetter = (letterData: Omit<FutureLetter, 'id' | 'createdAt'>) => {
    reflectionStorageService.saveFutureLetter(letterData).then((newLetter) => {
      setLetters([...letters, newLetter]);
      setIsFutureLetterModalOpen(false);
    });
  };

  const handleUpdateLetter = (letterData: Omit<FutureLetter, 'id' | 'createdAt'>) => {
    const letterId = editingLetter?.id;
    if (!letterId) return;
    
    reflectionStorageService.updateFutureLetter(letterId, letterData).then((updatedLetter) => {
      if (updatedLetter) {
        setLetters(letters.map(l => l.id === updatedLetter.id ? updatedLetter : l));
      }
      setIsFutureLetterModalOpen(false);
    });
  };

  const openModal = (task: Task | null = null) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const openReflectionModal = (reflection: DailyReflection | null = null) => {
    setEditingReflection(reflection);
    setIsReflectionModalOpen(true);
  };

  const openGoalModal = (goal: Goal | null = null) => {
    setEditingGoal(goal);
    setIsGoalModalOpen(true);
  };

  const openFutureLetterModal = (letter: FutureLetter | null = null) => {
    setEditingLetter(letter);
    setIsFutureLetterModalOpen(true);
  };

  const closeModal = () => {
    setEditingTask(null);
    setIsModalOpen(false);
  };

  const closeReflectionModal = () => {
    setEditingReflection(null);
    setIsReflectionModalOpen(false);
  };

  const closeGoalModal = () => {
    setEditingGoal(null);
    setIsGoalModalOpen(false);
  };

  const closeFutureLetterModal = () => {
    setEditingLetter(null);
    setIsFutureLetterModalOpen(false);
  };

  const handleViewChange = (newView: ViewType) => {
    setView(newView);

    // Save view preference
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({
        lastViewType: newView.type,
        lastViewDate: newView.date.toISOString()
      });
    } else {
      localStorage.setItem('lastViewType', newView.type);
      localStorage.setItem('lastViewDate', newView.date.toISOString());
    }
  };

  const handleSizeChange = async (width: number, height: number) => {
    console.log('[App] Saving size:', width, height);
    setWindowWidth(width);
    setWindowHeight(height);

    // Save window size
    await windowSizeService.saveSize({ width, height });
    console.log('[App] Size saved');
  };

  return (
    <ResizableContainer
      width={windowWidth}
      height={windowHeight}
      onSizeChange={handleSizeChange}
    >
      {/* Debug: Show current size */}
      {false && (
        <div style={{
          position: 'fixed',
          top: '50px',
          right: '10px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '4px',
          fontSize: '12px',
          zIndex: 99999,
        }}>
          windowWidth: {windowWidth}, windowHeight: {windowHeight}
        </div>
      )}
      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden flex flex-col">
        <Header />
        <div className="p-4 flex-1 flex flex-col overflow-hidden">
          <ViewSwitcher currentView={view} onViewChange={handleViewChange} />

          <div className="mt-4 flex-1 overflow-hidden">
            {view.type === 'day' && (
              <DayView
                date={view.date}
                tasks={tasks}
                onDateChange={(date) => handleViewChange({ ...view, date })}
                onAddTask={() => openModal()}
                onEditTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                onTaskClick={openModal}
                onOpenDatePicker={() => setIsDatePickerOpen(true)}
              />
            )}
            {view.type === 'week' && (
              <WeekView
                date={view.date}
                tasks={tasks}
                onDateChange={(date) => handleViewChange({ ...view, date })}
                onAddTask={() => openModal()}
                onEditTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                onTaskClick={openModal}
                onOpenDatePicker={() => setIsDatePickerOpen(true)}
                windowWidth={windowWidth}
              />
            )}
            {view.type === 'month' && (
              <MonthView
                date={view.date}
                tasks={tasks}
                onDateChange={(date) => handleViewChange({ ...view, date })}
                onAddTask={() => openModal()}
                onEditTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                onTaskClick={openModal}
                onOpenDatePicker={() => setIsDatePickerOpen(true)}
              />
            )}
            {view.type === 'goals' && (
              <GoalsView
                goals={goals}
                onAddGoal={() => openGoalModal()}
                onEditGoal={(goal) => openGoalModal(goal)}
                onDeleteGoal={handleDeleteGoal}
              />
            )}
            {view.type === 'letters' && (
              <FutureLettersView
                letters={letters}
                onAddLetter={() => openFutureLetterModal()}
                onEditLetter={(letter) => openFutureLetterModal(letter)}
                onToggleSent={(letterId, sent) => {
                  const letter = letters.find(l => l.id === letterId);
                  if (letter) {
                    handleUpdateLetter({...letter, sent});
                  }
                }}
              />
            )}
            {view.type === 'reflections' && (
              <ReflectionsView
                reflections={reflections}
                onAddReflection={handleAddReflection}
                onEditReflection={(reflection) => openReflectionModal(reflection)}
              />
            )}
          </div>
        </div>

        {isModalOpen && (
          <TaskModal
            task={editingTask}
            onClose={closeModal}
            onSave={editingTask ? (data) => handleUpdateTask(editingTask.id, data) : handleAddTask}
          />
        )}

        {isReflectionModalOpen && (
          <DailyReflectionModal
            reflection={editingReflection}
            onClose={closeReflectionModal}
            onSave={editingReflection ? handleUpdateReflection : (data) => {
              // 新增反省时，使用传入的日期
              handleUpdateReflection(data);
            }}
          />
        )}

        {isGoalModalOpen && (
          <GoalModal
            goal={editingGoal}
            onClose={closeGoalModal}
            onSave={editingGoal ? (data) => {
              setEditingGoal({...editingGoal, ...data});
              handleUpdateGoal(data);
            } : handleAddGoal}
          />
        )}

        {isFutureLetterModalOpen && (
          <FutureLetterModal
            letter={editingLetter}
            onClose={closeFutureLetterModal}
            onSave={editingLetter ? (data) => {
              setEditingLetter({...editingLetter, ...data});
              handleUpdateLetter(data);
            } : handleAddLetter}
          />
        )}

        {isDatePickerOpen && (
          <DatePicker
            selectedDate={view.date}
            onDateChange={(date) => {
              handleViewChange({ ...view, date });
              setIsDatePickerOpen(false);
            }}
            onClose={() => setIsDatePickerOpen(false)}
          />
        )}
      </div>
    </ResizableContainer>
  );
}

export default App;