'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, type MoodEntry } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMemo } from 'react';

const MOOD_OPTIONS = [
  { emoji: '😊', label: 'Heureux', mood: 'heureux', color: 'from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30', border: 'border-amber-200/50 dark:border-amber-700/30', textColor: 'text-amber-700 dark:text-amber-300', dotColor: '#C9A227' },
  { emoji: '😌', label: 'Paisible', mood: 'paisible', color: 'from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30', border: 'border-teal-200/50 dark:border-teal-700/30', textColor: 'text-teal-700 dark:text-teal-300', dotColor: '#2DD4BF' },
  { emoji: '😢', label: 'Triste', mood: 'triste', color: 'from-sky-100 to-blue-100 dark:from-sky-900/30 dark:to-blue-900/30', border: 'border-sky-200/50 dark:border-sky-700/30', textColor: 'text-sky-700 dark:text-sky-300', dotColor: '#60A5FA' },
  { emoji: '😤', label: 'Contrarié', mood: 'contrarie', color: 'from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30', border: 'border-rose-200/50 dark:border-rose-700/30', textColor: 'text-rose-700 dark:text-rose-300', dotColor: '#F472B6' },
  { emoji: '🤔', label: 'Curieux', mood: 'curieux', color: 'from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30', border: 'border-purple-200/50 dark:border-purple-700/30', textColor: 'text-purple-700 dark:text-purple-300', dotColor: '#A78BFA' },
];

const MOOD_MESSAGES: Record<string, string> = {
  heureux: "Quelle joie ! Partage ton bonheur avec ceux qui t'entourent 🌟",
  paisible: "La paix du cœur est un trésor. Garde-la précieusement 🌿",
  triste: "C'est normal d'être triste parfois. Dieu est avec toi 💛",
  contrarie: "Respire profondément, la colère passera. La patience est une force 🌸",
  curieux: "La curiosité est la clé de la sagesse ! Continue à explorer ✨",
};

function getMoodDotColor(mood: string): string {
  return MOOD_OPTIONS.find(m => m.mood === mood)?.dotColor || '#888';
}

function getMoodEmoji(mood: string): string {
  return MOOD_OPTIONS.find(m => m.mood === mood)?.emoji || '❓';
}

export default function MoodTracker() {
  const { dailyMood, setDailyMood, addMoodEntry, moodHistory, _hydrated } = useAppStore();
  const today = new Date().toISOString().split('T')[0];
  const currentMood = dailyMood[today] || '';

  // Weekly mood data (last 7 days)
  const weeklyMoods = useMemo(() => {
    const days: { date: string; dayName: string; mood: string; emoji: string; color: string }[] = [];
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const mood = dailyMood[dateStr] || '';
      const option = MOOD_OPTIONS.find(m => m.mood === mood);
      days.push({
        date: dateStr,
        dayName: dayNames[d.getDay()],
        mood,
        emoji: option?.emoji || '',
        color: option?.dotColor || '#888',
      });
    }
    return days;
  }, [dailyMood]);

  // Mood streaks
  const moodStreaks = useMemo(() => {
    const entries = Object.entries(dailyMood).sort(([a], [b]) => b.localeCompare(a));
    let currentStreak = 0;
    const d = new Date();

    for (let i = 0; i < 365; i++) {
      const dateStr = d.toISOString().split('T')[0];
      if (dailyMood[dateStr]) {
        currentStreak++;
      } else if (i > 0) {
        break;
      } else {
        // Today might not be set yet, check yesterday
        const yesterday = new Date(d);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        if (!dailyMood[yesterdayStr]) break;
        // If yesterday has a mood but today doesn't, streak is from yesterday
      }
      d.setDate(d.getDate() - 1);
    }

    // Count total moods tracked
    const totalTracked = Object.keys(dailyMood).length;

    // Most frequent mood
    const moodCounts: Record<string, number> = {};
    Object.values(dailyMood).forEach(m => {
      moodCounts[m] = (moodCounts[m] || 0) + 1;
    });
    const mostFrequent = Object.entries(moodCounts).sort(([, a], [, b]) => b - a)[0];

    return { currentStreak, totalTracked, mostFrequent };
  }, [dailyMood]);

  // Mood pattern (last 14 days as chart)
  const moodPattern = useMemo(() => {
    const pattern: { date: string; mood: string; color: string; emoji: string }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const mood = dailyMood[dateStr] || '';
      pattern.push({
        date: dateStr,
        mood,
        color: getMoodDotColor(mood),
        emoji: getMoodEmoji(mood),
      });
    }
    return pattern;
  }, [dailyMood]);

  const handleMoodSelect = (mood: string) => {
    setDailyMood(today, mood);
    addMoodEntry(mood);
  };

  if (!_hydrated) return null;

  return (
    <Card className="border-2 border-teal-200/50 dark:border-teal-800/30 overflow-hidden card-pattern">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <span>💫</span>
          Comment tu te sens aujourd&apos;hui ?
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Mood selector */}
        <div className="flex items-center justify-between gap-2">
          {MOOD_OPTIONS.map((option) => {
            const isSelected = currentMood === option.mood;
            return (
              <motion.button
                key={option.mood}
                onClick={() => handleMoodSelect(option.mood)}
                className="flex flex-col items-center gap-1 group"
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.88 }}
                aria-label={`Humeur : ${option.label}`}
              >
                <div className="relative">
                  {isSelected && (
                    <motion.div
                      className={`absolute -inset-2 rounded-full bg-gradient-to-br ${option.color} border-2 ${option.border}`}
                      layoutId="mood-ring"
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    />
                  )}
                  <motion.span
                    className={`relative text-3xl sm:text-4xl block transition-transform ${
                      isSelected ? 'scale-110' : 'opacity-60 group-hover:opacity-100'
                    }`}
                    animate={isSelected ? { scale: [1.1, 1.2, 1.1] } : {}}
                    transition={isSelected ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : {}}
                  >
                    {option.emoji}
                  </motion.span>
                </div>
                <span className={`text-[10px] sm:text-xs font-medium text-center ${
                  isSelected ? option.textColor : 'text-muted-foreground'
                }`}>
                  {option.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Kind message */}
        <AnimatePresence mode="wait">
          {currentMood && (
            <motion.div
              key={currentMood}
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <div className={`bg-gradient-to-r ${
                MOOD_OPTIONS.find(m => m.mood === currentMood)?.color || ''
              } rounded-xl p-3.5 border ${
                MOOD_OPTIONS.find(m => m.mood === currentMood)?.border || ''
              } text-center`}>
                <motion.p
                  className={`text-sm font-medium ${
                    MOOD_OPTIONS.find(m => m.mood === currentMood)?.textColor || ''
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {MOOD_MESSAGES[currentMood] || ''}
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!currentMood && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 text-center text-xs text-muted-foreground"
          >
            Choisis l&apos;emoji qui correspond à ton humeur 😊
          </motion.p>
        )}

        {/* Weekly mood history visualization */}
        {moodHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-5"
          >
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-sm">📅</span>
              <p className="text-sm font-semibold text-foreground/80">Cette semaine</p>
            </div>
            <div className="flex items-end justify-between gap-1 sm:gap-2">
              {weeklyMoods.map((day, i) => {
                const isToday = day.date === today;
                return (
                  <div key={day.date} className="flex flex-col items-center gap-1.5 flex-1">
                    {/* Emoji or empty */}
                    <div className="h-8 flex items-center justify-center">
                      {day.emoji ? (
                        <motion.span
                          className="text-lg sm:text-xl"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.05, type: 'spring', stiffness: 300 }}
                        >
                          {day.emoji}
                        </motion.span>
                      ) : (
                        <span className="w-4 h-4 rounded-full border-2 border-dashed border-muted-foreground/20" />
                      )}
                    </div>
                    {/* Color dot */}
                    <motion.div
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 ${
                        day.mood
                          ? 'border-transparent shadow-sm'
                          : 'border-muted-foreground/15 bg-muted/20'
                      } ${isToday ? 'ring-2 ring-primary/30' : ''}`}
                      style={day.mood ? { backgroundColor: day.color } : {}}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.05, type: 'spring', stiffness: 200 }}
                    />
                    {/* Day name */}
                    <span className={`text-[9px] sm:text-[10px] font-medium ${
                      isToday ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      {day.dayName}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Mood pattern chart (14 days) */}
        {moodHistory.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-5"
          >
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-sm">📊</span>
              <p className="text-sm font-semibold text-foreground/80">Tendance sur 14 jours</p>
            </div>
            {/* Dot pattern visualization */}
            <div className="flex items-center gap-1 flex-wrap">
              {moodPattern.map((day, i) => (
                <motion.div
                  key={day.date}
                  className="relative group"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.03, type: 'spring', stiffness: 200 }}
                >
                  <div
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center text-[10px] ${
                      day.mood ? 'shadow-sm' : 'bg-muted/20 border border-dashed border-muted-foreground/15'
                    }`}
                    style={day.mood ? { backgroundColor: day.color + '33', borderColor: day.color } : {}}
                  >
                    {day.emoji || ''}
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-foreground/90 text-background text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {day.date.slice(5)} {day.emoji}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Mood stats/streaks */}
        {moodStreaks.totalTracked > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-5 grid grid-cols-3 gap-2"
          >
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/15 dark:to-yellow-900/15 rounded-xl p-2.5 text-center border border-amber-200/30 dark:border-amber-700/20">
              <p className="text-lg font-bold text-gradient-gold">{moodStreaks.currentStreak}</p>
              <p className="text-[9px] text-muted-foreground">jours de suite</p>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/15 dark:to-cyan-900/15 rounded-xl p-2.5 text-center border border-teal-200/30 dark:border-teal-700/20">
              <p className="text-lg font-bold text-gradient-teal">{moodStreaks.totalTracked}</p>
              <p className="text-[9px] text-muted-foreground">jours suivis</p>
            </div>
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/15 dark:to-pink-900/15 rounded-xl p-2.5 text-center border border-rose-200/30 dark:border-rose-700/20">
              {moodStreaks.mostFrequent ? (
                <>
                  <p className="text-lg">{getMoodEmoji(moodStreaks.mostFrequent[0])}</p>
                  <p className="text-[9px] text-muted-foreground">le plus fréquent</p>
                </>
              ) : (
                <>
                  <p className="text-lg">—</p>
                  <p className="text-[9px] text-muted-foreground">le plus fréquent</p>
                </>
              )}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
