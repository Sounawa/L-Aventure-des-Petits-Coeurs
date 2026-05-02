'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PRAYER_NAMES = [
  { name: 'Fajr', emoji: '🌅', time: 'Aube' },
  { name: 'Dhuhr', emoji: '☀️', time: 'Midi' },
  { name: 'Asr', emoji: '🌤️', time: 'Après-midi' },
  { name: 'Maghrib', emoji: '🌇', time: 'Coucher' },
  { name: 'Isha', emoji: '🌙', time: 'Nuit' },
];

export default function PrayerCounter() {
  const { dailyPrayers, togglePrayer, _hydrated } = useAppStore();
  const today = new Date().toISOString().split('T')[0];
  const prayers = dailyPrayers[today] || [false, false, false, false, false];
  const completedCount = prayers.filter(Boolean).length;

  if (!_hydrated) return null;

  return (
    <Card className="border-2 border-emerald-200/50 dark:border-emerald-800/30 overflow-hidden card-pattern">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <span>🤲</span>
          Mes 5 Prières
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          {PRAYER_NAMES.map((prayer, index) => {
            const isCompleted = prayers[index];
            return (
              <motion.button
                key={prayer.name}
                onClick={() => togglePrayer(today, index)}
                className="flex flex-col items-center gap-1.5 group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`${prayer.name} - ${isCompleted ? 'complétée' : 'à faire'}`}
              >
                {/* Circle button */}
                <div className="relative">
                  <motion.div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border-3 transition-all ${
                      isCompleted
                        ? 'bg-gradient-to-br from-emerald-400 to-green-500 border-emerald-500 dark:border-emerald-400 shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/30'
                        : 'bg-gradient-to-br from-muted/50 to-muted/30 border-muted-foreground/20 dark:border-muted-foreground/10 hover:border-emerald-300/50 dark:hover:border-emerald-600/50'
                    }`}
                    animate={isCompleted ? {
                      scale: [1, 1.08, 1],
                    } : {}}
                    transition={isCompleted ? { duration: 0.3 } : {}}
                    style={{ borderWidth: '3px' }}
                  >
                    <AnimatePresence mode="wait">
                      {isCompleted ? (
                        <motion.span
                          key="check"
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 90 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                          className="text-white text-lg sm:text-xl font-bold"
                        >
                          ✓
                        </motion.span>
                      ) : (
                        <motion.span
                          key="empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-muted-foreground/40 text-lg"
                        >
                          ○
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  {/* Small glow effect when completed */}
                  {isCompleted && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-emerald-400/20"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>
                {/* Prayer name */}
                <span className="text-[10px] sm:text-xs font-medium text-foreground/80 text-center">
                  {prayer.name}
                </span>
                {/* Time indicator */}
                <span className="text-[8px] sm:text-[10px] text-muted-foreground">
                  {prayer.emoji}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Count display */}
        <motion.div
          className="mt-4 text-center"
          key={completedCount}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
            completedCount === 5
              ? 'bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 border border-emerald-200/50 dark:border-emerald-700/30'
              : 'bg-muted/30 border border-border/30'
          }`}>
            <span className={`text-sm font-bold ${
              completedCount === 5 ? 'text-emerald-700 dark:text-emerald-300' : 'text-foreground/70'
            }`}>
              {completedCount}/5 prières
            </span>
            {completedCount === 5 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 15, -15, 0] }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="text-base"
              >
                ✨
              </motion.span>
            )}
          </div>
        </motion.div>

        {/* All completed celebration message */}
        <AnimatePresence>
          {completedCount === 5 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-900/15 dark:via-green-900/15 dark:to-teal-900/15 rounded-xl p-3 text-center border border-emerald-200/30 dark:border-emerald-700/20"
            >
              <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                🌟 Macha&apos;Allah ! Toutes tes prières sont complétées !
              </p>
              <p className="text-[10px] text-emerald-600/70 dark:text-emerald-400/60 mt-0.5">
                Que Dieu bénisse ta journée 💚
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
