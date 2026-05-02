'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { useMemo } from 'react';

export default function StreakTracker() {
  const { currentStreak } = useAppStore();

  const fireSize = useMemo(() => {
    if (currentStreak === 0) return 'text-2xl';
    if (currentStreak < 3) return 'text-3xl';
    if (currentStreak < 7) return 'text-4xl';
    if (currentStreak < 14) return 'text-5xl';
    if (currentStreak < 30) return 'text-6xl';
    return 'text-7xl';
  }, [currentStreak]);

  const isMilestone7 = currentStreak === 7;
  const isMilestone30 = currentStreak === 30;
  const isMilestone = isMilestone7 || isMilestone30;

  const motivationalMessage = useMemo(() => {
    if (currentStreak === 0) return 'Commence ta série aujourd\'hui !';
    if (currentStreak === 1) return 'Premier jour ! Garde le feu allumé !';
    if (currentStreak < 3) return 'Garde le feu allumé !';
    if (currentStreak < 7) return 'Tu es en feu ! Continue !';
    if (currentStreak === 7) return '🎉 7 jours ! Série en or !';
    if (currentStreak < 14) return 'Incroyable ! Ne t\'arrête pas !';
    if (currentStreak < 30) return 'Tu es une étoile brillante !';
    if (currentStreak === 30) return '🏆 30 jours ! Légendaire !';
    return '🔥 Légende vivante !';
  }, [currentStreak]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/30 dark:via-amber-950/20 dark:to-yellow-950/30 rounded-2xl p-4 border-2 border-orange-200/60 dark:border-orange-800/40 relative overflow-hidden"
    >
      {/* Background glow */}
      {currentStreak > 0 && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-orange-200/20 via-amber-200/10 to-yellow-200/20 dark:from-orange-800/10 dark:via-amber-800/5 dark:to-yellow-800/10"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      <div className="relative z-10 flex items-center gap-4">
        {/* Fire emoji with animation */}
        <div className="flex-shrink-0 relative">
          <motion.span
            className={`${fireSize} block`}
            animate={
              currentStreak > 0
                ? { scale: [1, 1.15, 1], rotate: [0, 3, -3, 0] }
                : { scale: [1, 1.05, 1] }
            }
            transition={
              currentStreak > 0
                ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
            }
          >
            {currentStreak === 0 ? '💨' : currentStreak < 3 ? '🔥' : currentStreak < 7 ? '🔥' : currentStreak < 30 ? '🔥' : '🔥'}
          </motion.span>

          {/* Sparkles around fire for high streaks */}
          {currentStreak >= 3 && (
            <>
              <motion.span
                className="absolute -top-1 -right-2 text-sm"
                animate={{ scale: [0.5, 1.2, 0.5], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
              >
                ✨
              </motion.span>
              <motion.span
                className="absolute -bottom-1 -left-2 text-xs"
                animate={{ scale: [0.5, 1.3, 0.5], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.7 }}
              >
                ✦
              </motion.span>
            </>
          )}
        </div>

        {/* Streak info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <motion.span
              key={currentStreak}
              initial={{ scale: 1.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400"
            >
              {currentStreak}
            </motion.span>
            <span className="text-sm font-semibold text-orange-700/80 dark:text-orange-300/80">
              {currentStreak === 1 ? 'jour' : 'jours'}
            </span>
            <span className="text-lg">🔥</span>
          </div>
          <motion.p
            key={motivationalMessage}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-orange-600/70 dark:text-orange-400/70 font-medium mt-0.5 truncate"
          >
            {motivationalMessage}
          </motion.p>
        </div>

        {/* Milestone indicators */}
        <div className="flex-shrink-0 flex flex-col items-end gap-1">
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
            currentStreak >= 7
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
              : 'bg-muted/50 text-muted-foreground'
          }`}>
            <span>{currentStreak >= 7 ? '🌟' : '◯'}</span>
            <span>7j</span>
          </div>
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
            currentStreak >= 30
              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
              : 'bg-muted/50 text-muted-foreground'
          }`}>
            <span>{currentStreak >= 30 ? '🏆' : '◯'}</span>
            <span>30j</span>
          </div>
        </div>
      </div>

      {/* Milestone celebration overlay */}
      <AnimatePresence>
        {isMilestone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-yellow-400/30 to-amber-400/20 dark:from-amber-600/20 dark:via-yellow-600/30 dark:to-amber-600/20 flex items-center justify-center backdrop-blur-[2px] z-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-center"
            >
              <span className="text-4xl block">
                {isMilestone7 ? '🌟' : '🏆'}
              </span>
              <p className="text-sm font-bold text-amber-800 dark:text-amber-200 mt-1">
                {isMilestone7 ? '7 jours !' : '30 jours !'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
