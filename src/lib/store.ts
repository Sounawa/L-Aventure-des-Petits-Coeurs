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

export interface Badge {
  id: string;
  emoji: string;
  title: string;
  description: string;
  unlockedAt: string | null;
}

const allBadges: Badge[] = [
  { id: 'first_chapter', emoji: '📖', title: 'Premier Chapitre', description: 'Tu as lu ton premier chapitre !', unlockedAt: null },
  { id: 'first_activity', emoji: '🎮', title: 'Première Activité', description: 'Tu as complété ta première activité !', unlockedAt: null },
  { id: 'first_treasure', emoji: '💎', title: 'Premier Trésor', description: 'Tu as collecté ton premier trésor !', unlockedAt: null },
  { id: 'mirror_master', emoji: '🪞', title: 'Maître du Miroir', description: 'Tu as complété toutes les activités du Miroir Magique !', unlockedAt: null },
  { id: 'treasure_hunter', emoji: '🏆', title: 'Chasseur de Trésors', description: 'Tu as collecté tous les trésors du Cœur !', unlockedAt: null },
  { id: 'light_bearer', emoji: '✨', title: 'Porteur de Lumière', description: 'Tu as complété toutes les activités de Lumière !', unlockedAt: null },
  { id: 'gratitude_3', emoji: '💛', title: 'Cœur Reconnaissant', description: 'Tu as écrit 3 entrées de gratitude !', unlockedAt: null },
  { id: 'perfect_day', emoji: '🌟', title: 'Jour Parfait', description: 'Tu as complété toutes les pratiques d\'un jour !', unlockedAt: null },
  { id: 'star_10', emoji: '⭐', title: '10 Étoiles', description: 'Tu as gagné 10 étoiles !', unlockedAt: null },
  { id: 'star_25', emoji: '🌠', title: '25 Étoiles', description: 'Tu as gagné 25 étoiles !', unlockedAt: null },
  { id: 'star_50', emoji: '🏅', title: '50 Étoiles', description: 'Tu as gagné 50 étoiles ! Champion !', unlockedAt: null },
  { id: 'quiz_master', emoji: '🧠', title: 'Sage du Cœur', description: 'Tu as complété le Quiz des Trésors !', unlockedAt: null },
  { id: 'breathing_3', emoji: '🌬️', title: 'Respirateur', description: 'Tu as fait 3 respirations complètes !', unlockedAt: null },
  { id: 'all_complete', emoji: '👑', title: 'Cœur d\'Or', description: 'Tu as tout complété ! Tu es un vrai petit sage !', unlockedAt: null },
];

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
  
  // Badges
  badges: Badge[];
  
  // Theme
  darkMode: boolean;
  
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
  unlockBadge: (badgeId: string) => void;
  toggleDarkMode: () => void;
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
      badges: state.badges,
      darkMode: state.darkMode,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // ignore
  }
}

function checkAndUnlockBadges(state: AppState): Badge[] {
  const badges = [...state.badges];
  const now = new Date().toISOString();
  
  const unlock = (id: string) => {
    const badge = badges.find(b => b.id === id);
    if (badge && !badge.unlockedAt) {
      badge.unlockedAt = now;
    }
  };

  // First chapter read
  const hasReadChapter = Object.values(state.chaptersProgress).some(c => c.read);
  if (hasReadChapter) unlock('first_chapter');
  
  // First activity completed
  const hasCompletedActivity = Object.values(state.chaptersProgress).some(c => c.activityCompleted);
  if (hasCompletedActivity) unlock('first_activity');
  
  // First treasure
  const hasCollectedTreasure = Object.values(state.treasuresProgress).some(t => t.collected);
  if (hasCollectedTreasure) unlock('first_treasure');
  
  // Mirror master - all 5 chapters
  const miroirComplete = [1,2,3,4,5].every(i => state.chaptersProgress[`miroir-${i}`]?.activityCompleted);
  if (miroirComplete) unlock('mirror_master');
  
  // Treasure hunter - all 6 treasures
  const allTreasures = ['gratitude','patience','gentillesse','courage','honnêteté','amour'];
  const tresorsComplete = allTreasures.every(t => state.treasuresProgress[t]?.collected);
  if (tresorsComplete) unlock('treasure_hunter');
  
  // Light bearer - all 4 chapters
  const lumiereComplete = [1,2,3,4].every(i => state.chaptersProgress[`lumiere-${i}`]?.activityCompleted);
  if (lumiereComplete) unlock('light_bearer');
  
  // Gratitude 3 entries
  if (state.gratitudeEntries.length >= 3) unlock('gratitude_3');
  
  // Perfect day
  const today = new Date().toISOString().split('T')[0];
  const todayPractice = state.practiceDays.find(d => d.date === today);
  if (todayPractice && todayPractice.prayers && todayPractice.kindness && todayPractice.breathing && todayPractice.gratitude && todayPractice.silence) {
    unlock('perfect_day');
  }
  
  // Stars
  if (state.totalStars >= 10) unlock('star_10');
  if (state.totalStars >= 25) unlock('star_25');
  if (state.totalStars >= 50) unlock('star_50');
  
  // Quiz completed
  if (state.quizCompleted) unlock('quiz_master');
  
  // All complete
  if (miroirComplete && tresorsComplete && lumiereComplete && state.quizCompleted) {
    unlock('all_complete');
  }
  
  return badges;
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
  badges: allBadges,
  darkMode: false,
  _hydrated: false,
};

export const useAppStore = create<AppState>((set, get) => ({
  ...defaultState,
  
  _hydrate: () => {
    if (get()._hydrated) return;
    const saved = loadState();
    if (saved) {
      // Merge saved badges with template (to handle new badges added in updates)
      const mergedBadges = allBadges.map(template => {
        const savedBadge = (saved.badges || []).find((b: Badge) => b.id === template.id);
        return savedBadge || template;
      });
      set({ ...saved, badges: mergedBadges, _hydrated: true });
      // Apply dark mode class
      if (saved.darkMode && typeof document !== 'undefined') {
        document.documentElement.classList.add('dark');
      }
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
      const updatedBadges = checkAndUnlockBadges({ ...get(), ...newState });
      const finalState = { ...newState, badges: updatedBadges };
      set(finalState);
      saveState({ ...get(), ...finalState });
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
      const updatedBadges = checkAndUnlockBadges({ ...get(), ...newState });
      const finalState = { ...newState, badges: updatedBadges };
      set(finalState);
      saveState({ ...get(), ...finalState });
    }
  },
  
  collectTreasure: (treasureId) => {
    const current = get().treasuresProgress[treasureId];
    if (!current?.collected) {
      const newState = {
        treasuresProgress: { ...get().treasuresProgress, [treasureId]: { collected: true } },
        totalStars: get().totalStars + 3,
      };
      const updatedBadges = checkAndUnlockBadges({ ...get(), ...newState });
      const finalState = { ...newState, badges: updatedBadges };
      set(finalState);
      saveState({ ...get(), ...finalState });
    }
  },
  
  addStars: (count) => {
    const newState = { totalStars: get().totalStars + count };
    const updatedBadges = checkAndUnlockBadges({ ...get(), ...newState });
    const finalState = { ...newState, badges: updatedBadges };
    set(finalState);
    saveState({ ...get(), ...finalState });
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
    const updatedBadges = checkAndUnlockBadges({ ...get(), ...newState });
    const finalState = { ...newState, badges: updatedBadges };
    set(finalState);
    saveState({ ...get(), ...finalState });
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
    const updatedBadges = checkAndUnlockBadges({ ...get(), ...newState });
    const finalState = { ...newState, badges: updatedBadges };
    set(finalState);
    saveState({ ...get(), ...finalState });
  },
  
  setQuizCompleted: (score) => {
    const newState = { quizCompleted: true, quizScore: score, totalStars: get().totalStars + score };
    const updatedBadges = checkAndUnlockBadges({ ...get(), ...newState });
    const finalState = { ...newState, badges: updatedBadges };
    set(finalState);
    saveState({ ...get(), ...finalState });
  },

  unlockBadge: (badgeId: string) => {
    const badges = [...get().badges];
    const badge = badges.find(b => b.id === badgeId);
    if (badge && !badge.unlockedAt) {
      badge.unlockedAt = new Date().toISOString();
      set({ badges });
      saveState({ ...get(), badges });
    }
  },

  toggleDarkMode: () => {
    const newDarkMode = !get().darkMode;
    if (typeof document !== 'undefined') {
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    set({ darkMode: newDarkMode });
    saveState({ ...get(), darkMode: newDarkMode });
  },
}));

export { allBadges };
