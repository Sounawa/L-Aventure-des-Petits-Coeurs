'use client';

import { motion } from 'framer-motion';
import { useAppStore, type AdventureId } from '@/lib/store';
import { useMemo } from 'react';
import { Check } from 'lucide-react';

interface AdventureStation {
  id: AdventureId;
  title: string;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
  glowColor: string;
  totalItems: number;
}

const stations: AdventureStation[] = [
  {
    id: 'miroir',
    title: 'Le Miroir Magique',
    emoji: '🪞',
    color: 'text-amber-700 dark:text-amber-300',
    bgColor: 'from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/20',
    borderColor: 'border-amber-300 dark:border-amber-700/50',
    glowColor: 'shadow-amber-300/50 dark:shadow-amber-600/30',
    totalItems: 5,
  },
  {
    id: 'tresors',
    title: 'Les Trésors du Cœur',
    emoji: '💎',
    color: 'text-emerald-700 dark:text-emerald-300',
    bgColor: 'from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/20',
    borderColor: 'border-emerald-300 dark:border-emerald-700/50',
    glowColor: 'shadow-emerald-300/50 dark:shadow-emerald-600/30',
    totalItems: 6,
  },
  {
    id: 'lumiere',
    title: 'La Lumière Intérieure',
    emoji: '✨',
    color: 'text-purple-700 dark:text-purple-300',
    bgColor: 'from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/20',
    borderColor: 'border-purple-300 dark:border-purple-700/50',
    glowColor: 'shadow-purple-300/50 dark:shadow-purple-600/30',
    totalItems: 4,
  },
];

export default function AdventureMap() {
  const { currentAdventure, setAdventure, chaptersProgress, treasuresProgress } = useAppStore();

  const getProgress = useMemo(() => {
    return (advId: AdventureId) => {
      if (advId === 'miroir') {
        return [1, 2, 3, 4, 5].filter(i => chaptersProgress[`miroir-${i}`]?.activityCompleted).length;
      }
      if (advId === 'tresors') {
        const allTreasures = ['gratitude', 'patience', 'gentillesse', 'courage', 'honnêteté', 'amour'];
        return allTreasures.filter(t => treasuresProgress[t]?.collected).length;
      }
      if (advId === 'lumiere') {
        return [1, 2, 3, 4].filter(i => chaptersProgress[`lumiere-${i}`]?.activityCompleted).length;
      }
      return 0;
    };
  }, [chaptersProgress, treasuresProgress]);

  const isUnlocked = useMemo(() => {
    return (advId: AdventureId): boolean => {
      if (advId === 'miroir') return true; // Always unlocked
      if (advId === 'tresors') {
        // Unlock after completing 3 chapters of miroir
        const miroirCompleted = [1, 2, 3, 4, 5].filter(i => chaptersProgress[`miroir-${i}`]?.activityCompleted).length;
        return miroirCompleted >= 3;
      }
      if (advId === 'lumiere') {
        // Unlock after collecting 3 treasures
        const allTreasures = ['gratitude', 'patience', 'gentillesse', 'courage', 'honnêteté', 'amour'];
        const tresorsCollected = allTreasures.filter(t => treasuresProgress[t]?.collected).length;
        return tresorsCollected >= 3;
      }
      return false;
    };
  }, [chaptersProgress, treasuresProgress]);

  return (
    <div className="py-4">
      <div className="flex items-center justify-between">
        {stations.map((station, index) => {
          const progress = getProgress(station.id);
          const isComplete = progress === station.totalItems;
          const unlocked = isUnlocked(station.id);
          const isCurrent = currentAdventure === station.id;
          const percent = station.totalItems > 0 ? (progress / station.totalItems) * 100 : 0;

          return (
            <div key={station.id} className="flex items-center flex-1">
              {/* Station node */}
              <motion.button
                onClick={() => unlocked && setAdventure(station.id)}
                disabled={!unlocked}
                className={`relative flex flex-col items-center gap-1.5 flex-shrink-0 ${
                  unlocked ? 'cursor-pointer' : 'cursor-not-allowed'
                }`}
                whileTap={unlocked ? { scale: 0.92 } : {}}
                whileHover={unlocked ? { scale: 1.05 } : {}}
              >
                {/* Glow ring for current adventure */}
                {isCurrent && unlocked && (
                  <motion.div
                    className={`absolute -inset-3 rounded-full bg-gradient-to-br ${station.bgColor} blur-md ${station.glowColor}`}
                    animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                {/* Circle node */}
                <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${station.bgColor} border-2 ${isCurrent && unlocked ? station.borderColor : 'border-border/50'} flex items-center justify-center shadow-md overflow-hidden`}>
                  {/* Progress arc background */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50" cy="50" r="42"
                        fill="none"
                        stroke="currentColor"
                        className="text-primary/10"
                        strokeWidth="4"
                      />
                      {unlocked && progress > 0 && (
                        <motion.circle
                          cx="50" cy="50" r="42"
                          fill="none"
                          stroke="currentColor"
                          className="text-primary"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 42}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - percent / 100) }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                      )}
                    </svg>
                  </div>

                  {/* Content */}
                  {isComplete && unlocked ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      <Check className={`w-7 h-7 ${station.color}`} />
                    </motion.div>
                  ) : !unlocked ? (
                    <span className="text-2xl opacity-50">🔒</span>
                  ) : (
                    <span className="text-2xl sm:text-3xl">{station.emoji}</span>
                  )}
                </div>

                {/* Label */}
                <div className="text-center max-w-[80px] sm:max-w-[100px]">
                  <p className={`text-[10px] sm:text-xs font-bold leading-tight ${
                    isCurrent && unlocked ? station.color : unlocked ? 'text-foreground/70' : 'text-muted-foreground/50'
                  }`}>
                    {station.title}
                  </p>
                  {unlocked && (
                    <p className={`text-[9px] mt-0.5 ${progress > 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                      {progress}/{station.totalItems}
                      {isComplete && ' 🎉'}
                    </p>
                  )}
                  {!unlocked && (
                    <p className="text-[9px] text-muted-foreground/60 mt-0.5">
                      Verrouillé
                    </p>
                  )}
                </div>
              </motion.button>

              {/* Connection line to next station */}
              {index < stations.length - 1 && (
                <div className="flex-1 flex items-center justify-center px-1 sm:px-2 relative min-w-[30px] sm:min-w-[50px]">
                  {/* Dashed line */}
                  <div className="w-full h-0.5 bg-gradient-to-r from-border/60 to-border/40 relative overflow-hidden">
                    {/* Animated progress fill */}
                    {isComplete && (
                      <motion.div
                        className={`absolute inset-y-0 left-0 bg-gradient-to-r ${station.bgColor}`}
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                      />
                    )}
                    {/* Moving dot */}
                    {isCurrent && unlocked && (
                      <motion.div
                        className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary`}
                        animate={{ left: ['0%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Unlock hint */}
      {!isUnlocked('tresors') && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-xs text-muted-foreground mt-3"
        >
          🔓 Complète 3 chapitres du Miroir pour débloquer les Trésors
        </motion.p>
      )}
      {isUnlocked('tresors') && !isUnlocked('lumiere') && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-xs text-muted-foreground mt-3"
        >
          🔓 Collecte 3 trésors pour débloquer la Lumière
        </motion.p>
      )}
    </div>
  );
}
