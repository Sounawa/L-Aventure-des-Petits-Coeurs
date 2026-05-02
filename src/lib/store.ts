import { create } from 'zustand';

export type Section = 'accueil' | 'aventures' | 'pratique' | 'activites';
export type AdventureId = 'miroir' | 'tresors' | 'lumiere';

export interface ChapterProgress {
  read: boolean;
  activityCompleted: boolean;
}

export interface TreasureProgress {
  collected: boolean;
}

export interface GratitudeEntry {
  date: string;
  items: string[];
}

export interface PracticeDay {
  date: string;
  prayers: boolean;
  kindness: boolean;
  breathing: boolean;
  gratitude: boolean;
  silence: boolean;
}

interface AppState {
  // Navigation
  currentSection: Section;
  currentAdventure: AdventureId;
  currentChapter: number;
  
  // Progress
  chaptersProgress: Record<string, ChapterProgress>;
  treasuresProgress: Record<string, TreasureProgress>;
  
  // Stars
  totalStars: number;
  
  // Practice
  practiceDays: PracticeDay[];
  gratitudeEntries: GratitudeEntry[];
  
  // Activities
  quizCompleted: boolean;
  quizScore: number;
  
  // Hydration
  _hydrated: boolean;
  
  // Actions
  setSection: (section: Section) => void;
  setAdventure: (adventure: AdventureId) => void;
  setChapter: (chapter: number) => void;
  markChapterRead: (adventure: AdventureId, chapter: number) => void;
  markActivityCompleted: (adventure: AdventureId, chapter: number) => void;
  collectTreasure: (treasureId: string) => void;
  addStars: (count: number) => void;
  updatePracticeDay: (day: PracticeDay) => void;
  addGratitudeEntry: (entry: GratitudeEntry) => void;
  setQuizCompleted: (score: number) => void;
  _hydrate: () => void;
}

const STORAGE_KEY = 'alchimie-miroir-state';

function loadState(): Partial<AppState> | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return null;
}

function saveState(state: AppState) {
  if (typeof window === 'undefined') return;
  try {
    const toSave = {
      chaptersProgress: state.chaptersProgress,
      treasuresProgress: state.treasuresProgress,
      totalStars: state.totalStars,
      practiceDays: state.practiceDays,
      gratitudeEntries: state.gratitudeEntries,
      quizCompleted: state.quizCompleted,
      quizScore: state.quizScore,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // ignore
  }
}

const defaultState = {
  currentSection: 'accueil' as Section,
  currentAdventure: 'miroir' as AdventureId,
  currentChapter: 0,
  chaptersProgress: {} as Record<string, ChapterProgress>,
  treasuresProgress: {} as Record<string, TreasureProgress>,
  totalStars: 0,
  practiceDays: [] as PracticeDay[],
  gratitudeEntries: [] as GratitudeEntry[],
  quizCompleted: false,
  quizScore: 0,
  _hydrated: false,
};

export const useAppStore = create<AppState>((set, get) => ({
  ...defaultState,
  
  _hydrate: () => {
    if (get()._hydrated) return;
    const saved = loadState();
    if (saved) {
      set({ ...saved, _hydrated: true });
    } else {
      set({ _hydrated: true });
    }
  },
  
  setSection: (section) => set({ currentSection: section, currentChapter: 0 }),
  setAdventure: (adventure) => set({ currentAdventure: adventure, currentChapter: 0 }),
  setChapter: (chapter) => set({ currentChapter: chapter }),
  
  markChapterRead: (adventure, chapter) => {
    const key = `${adventure}-${chapter}`;
    const current = get().chaptersProgress[key] || { read: false, activityCompleted: false };
    if (!current.read) {
      const newState = {
        chaptersProgress: { ...get().chaptersProgress, [key]: { ...current, read: true } },
        totalStars: get().totalStars + 1,
      };
      set(newState);
      saveState({ ...get(), ...newState });
    }
  },
  
  markActivityCompleted: (adventure, chapter) => {
    const key = `${adventure}-${chapter}`;
    const current = get().chaptersProgress[key] || { read: false, activityCompleted: false };
    if (!current.activityCompleted) {
      const newState = {
        chaptersProgress: { ...get().chaptersProgress, [key]: { ...current, activityCompleted: true } },
        totalStars: get().totalStars + 2,
      };
      set(newState);
      saveState({ ...get(), ...newState });
    }
  },
  
  collectTreasure: (treasureId) => {
    const current = get().treasuresProgress[treasureId];
    if (!current?.collected) {
      const newState = {
        treasuresProgress: { ...get().treasuresProgress, [treasureId]: { collected: true } },
        totalStars: get().totalStars + 3,
      };
      set(newState);
      saveState({ ...get(), ...newState });
    }
  },
  
  addStars: (count) => {
    const newState = { totalStars: get().totalStars + count };
    set(newState);
    saveState({ ...get(), ...newState });
  },
  
  updatePracticeDay: (day) => {
    const existing = get().practiceDays;
    const idx = existing.findIndex(d => d.date === day.date);
    let newDays;
    if (idx >= 0) {
      newDays = [...existing];
      newDays[idx] = day;
    } else {
      newDays = [...existing, day];
    }
    const allChecked = day.prayers && day.kindness && day.breathing && day.gratitude && day.silence;
    const prevDay = existing.find(d => d.date === day.date);
    const wasAllChecked = prevDay ? prevDay.prayers && prevDay.kindness && prevDay.breathing && prevDay.gratitude && prevDay.silence : false;
    const starChange = allChecked && !wasAllChecked ? 5 : 0;
    const newState = { practiceDays: newDays, totalStars: get().totalStars + starChange };
    set(newState);
    saveState({ ...get(), ...newState });
  },
  
  addGratitudeEntry: (entry) => {
    const existing = get().gratitudeEntries;
    const idx = existing.findIndex(e => e.date === entry.date);
    let newEntries;
    if (idx >= 0) {
      newEntries = [...existing];
      newEntries[idx] = entry;
    } else {
      newEntries = [...existing, entry];
    }
    const newState = { gratitudeEntries: newEntries };
    set(newState);
    saveState({ ...get(), ...newState });
  },
  
  setQuizCompleted: (score) => {
    const newState = { quizCompleted: true, quizScore: score, totalStars: get().totalStars + score };
    set(newState);
    saveState({ ...get(), ...newState });
  },
}));
