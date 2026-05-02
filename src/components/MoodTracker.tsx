'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MOOD_OPTIONS = [
  { emoji: '😊', label: 'Heureux', mood: 'heureux', color: 'from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30', border: 'border-amber-200/50 dark:border-amber-700/30', textColor: 'text-amber-700 dark:text-amber-300' },
  { emoji: '😌', label: 'Paisible', mood: 'paisible', color: 'from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30', border: 'border-teal-200/50 dark:border-teal-700/30', textColor: 'text-teal-700 dark:text-teal-300' },
  { emoji: '😢', label: 'Triste', mood: 'triste', color: 'from-sky-100 to-blue-100 dark:from-sky-900/30 dark:to-blue-900/30', border: 'border-sky-200/50 dark:border-sky-700/30', textColor: 'text-sky-700 dark:text-sky-300' },
  { emoji: '😤', label: 'Contrarié', mood: 'contrarie', color: 'from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30', border: 'border-rose-200/50 dark:border-rose-700/30', textColor: 'text-rose-700 dark:text-rose-300' },
  { emoji: '🤔', label: 'Curieux', mood: 'curieux', color: 'from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30', border: 'border-purple-200/50 dark:border-purple-700/30', textColor: 'text-purple-700 dark:text-purple-300' },
];

const MOOD_MESSAGES: Record<string, string> = {
  heureux: "Quelle joie ! Partage ton bonheur avec ceux qui t'entourent 🌟",
  paisible: "La paix du cœur est un trésor. Garde-la précieusement 🌿",
  triste: "C'est normal d'être triste parfois. Dieu est avec toi 💛",
  contrarie: "Respire profondément, la colère passera. La patience est une force 🌸",
  curieux: "La curiosité est la clé de la sagesse ! Continue à explorer ✨",
};

export default function MoodTracker() {
  const { dailyMood, setDailyMood, _hydrated } = useAppStore();
  const today = new Date().toISOString().split('T')[0];
  const currentMood = dailyMood[today] || '';

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
        <div className="flex items-center justify-between gap-2">
          {MOOD_OPTIONS.map((option) => {
            const isSelected = currentMood === option.mood;
            return (
              <motion.button
                key={option.mood}
                onClick={() => setDailyMood(today, option.mood)}
                className="flex flex-col items-center gap-1 group"
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.88 }}
                aria-label={`Humeur : ${option.label}`}
              >
                {/* Emoji button with ring when selected */}
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
                    animate={isSelected ? {
                      scale: [1.1, 1.2, 1.1],
                    } : {}}
                    transition={isSelected ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : {}}
                  >
                    {option.emoji}
                  </motion.span>
                </div>
                {/* Label */}
                <span className={`text-[10px] sm:text-xs font-medium text-center ${
                  isSelected ? option.textColor : 'text-muted-foreground'
                }`}>
                  {option.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Kind message based on selected mood */}
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

        {/* Previous mood indicator if no mood today */}
        {!currentMood && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 text-center text-xs text-muted-foreground"
          >
            Choisis l&apos;emoji qui correspond à ton humeur 😊
          </motion.p>
        )}
      </CardContent>
    </Card>
  );
}
