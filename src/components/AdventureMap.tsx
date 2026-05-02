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

  return (
    <div className="py-4">
      {/* Dotted path between stations - rendered first as background */}
      <div className="relative">
        {/* Dotted path lines behind the stations */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex items-center px-12 sm:px-16 pointer-events-none" aria-hidden="true">
          <div className="flex-1 border-t-2 border-dashed border-amber-300/30 dark:border-amber-600/20" />
          <div className="w-20 sm:w-24" />
          <div className="flex-1 border-t-2 border-dashed border-teal-300/30 dark:border-teal-600/20" />
        </div>
      </div>

      <div className="relative flex items-center justify-between">
        {stations.map((station, index) => {
          const progress = getProgress(station.id);
          const isComplete = progress === station.totalItems;
          const isCurrent = currentAdventure === station.id;
          const percent = station.totalItems > 0 ? (progress / station.totalItems) * 100 : 0;

          return (
            <div key={station.id} className="flex items-center flex-1 relative">
              {/* Station node */}
              <motion.button
                onClick={() => setAdventure(station.id)}
                className="relative flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer z-10"
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.05 }}
              >
                {/* Glow ring for current adventure */}
                {isCurrent && (
                  <motion.div
                    className={`absolute -inset-4 rounded-full bg-gradient-to-br ${station.bgColor} blur-lg ${station.glowColor}`}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                {/* Circle node */}
                <div className={`relative rounded-2xl bg-gradient-to-br ${station.bgColor} border-2 ${
                  isCurrent ? station.borderColor : 'border-border/50'
                } flex items-center justify-center shadow-md overflow-hidden ${
                  isComplete ? 'station-complete-shimmer' : ''
                }`}
                  style={{ width: '72px', height: '72px' }}
                >
                  {/* Progress arc background */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50" cy="50" r="42"
                        fill="none"
                        stroke="currentColor"
                        className="text-primary/10"
                        strokeWidth="5"
                      />
                      {progress > 0 && (
                        <motion.circle
                          cx="50" cy="50" r="42"
                          fill="none"
                          stroke="currentColor"
                          className="text-primary"
                          strokeWidth="5"
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
                  {isComplete ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                      className="relative z-20"
                    >
                      <Check className="w-8 h-8" strokeWidth={3} />
                      <span className="absolute -top-1 -right-1 text-xs">🎉</span>
                    </motion.div>
                  ) : (
                    <span className="text-2xl sm:text-3xl relative z-20">{station.emoji}</span>
                  )}
                </div>

                {/* Label with progress */}
                <div className="text-center max-w-[80px] sm:max-w-[100px]">
                  <p className={`text-[10px] sm:text-xs font-bold leading-tight ${
                    isCurrent ? station.color : 'text-foreground/70'
                  }`}>
                    {station.title}
                  </p>
                  <div className="mt-1">
                    <p className={`text-xs sm:text-sm font-extrabold ${progress > 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                      {progress}/{station.totalItems}
                      {isComplete && ' 🎉'}
                    </p>
                    {/* Mini progress bar below station */}
                    <div className="w-full bg-muted/50 rounded-full h-1.5 mt-1 overflow-hidden">
                      <motion.div
                        className="gradient-progress rounded-full h-1.5"
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.button>

              {/* Dotted path connector between stations */}
              {index < stations.length - 1 && (
                <div className="flex-1 flex items-center justify-center px-1 sm:px-2 relative min-w-[30px] sm:min-w-[50px] z-10">
                  <div className="w-full relative">
                    {/* Dotted path background */}
                    <div className="w-full h-0 border-t-2 border-dashed border-amber-300/30 dark:border-amber-600/20 rounded-full" />
                    {/* Animated progress fill */}
                    {isComplete && (
                      <motion.div
                        className={`absolute inset-y-0 left-0 bg-gradient-to-r ${station.bgColor} rounded-full border-t-2 border-solid`}
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                      />
                    )}
                    {/* Animated dots moving along the line */}
                    {isCurrent && (
                      <>
                        <motion.div
                          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary shadow-sm shadow-primary/30"
                          animate={{ left: ['0%', '100%'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <motion.div
                          className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary/50"
                          animate={{ left: ['0%', '100%'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                        />
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
