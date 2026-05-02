'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { useMemo } from 'react';

interface VirtuePlot {
  id: string;
  name: string;
  emoji: string;
  color: string;
  bgColor: string;
  darkBgColor: string;
  flowerEmoji: string;
}

const virtues: VirtuePlot[] = [
  { id: 'gratitude', name: 'Gratitude', emoji: '💛', color: 'amber', bgColor: 'from-amber-100 to-yellow-100', darkBgColor: 'dark:from-amber-900/20 dark:to-yellow-900/20', flowerEmoji: '🌻' },
  { id: 'patience', name: 'Patience', emoji: '🌿', color: 'teal', bgColor: 'from-teal-100 to-emerald-100', darkBgColor: 'dark:from-teal-900/20 dark:to-emerald-900/20', flowerEmoji: '🌷' },
  { id: 'gentillesse', name: 'Gentillesse', emoji: '🌸', color: 'pink', bgColor: 'from-pink-100 to-rose-100', darkBgColor: 'dark:from-pink-900/20 dark:to-rose-900/20', flowerEmoji: '🌹' },
  { id: 'courage', name: 'Courage', emoji: '🦁', color: 'orange', bgColor: 'from-orange-100 to-amber-100', darkBgColor: 'dark:from-orange-900/20 dark:to-amber-900/20', flowerEmoji: '🔥' },
  { id: 'honnêteté', name: 'Honnêteté', emoji: '💎', color: 'blue', bgColor: 'from-sky-100 to-cyan-100', darkBgColor: 'dark:from-sky-900/20 dark:to-cyan-900/20', flowerEmoji: '💠' },
  { id: 'amour', name: 'Amour', emoji: '❤️', color: 'rose', bgColor: 'from-rose-100 to-red-100', darkBgColor: 'dark:from-rose-900/20 dark:to-red-900/20', flowerEmoji: '💐' },
];

function getGrowthStage(virtueId: string, treasuresProgress: Record<string, { collected: boolean }>, chaptersProgress: Record<string, { read: boolean; activityCompleted: boolean }>): number {
  const treasure = treasuresProgress[virtueId];

  if (!treasure?.collected) return 0;

  // Check if the activity for this treasure's chapter is completed
  // Treasures are in the "tresors" adventure
  const treasureIndex = virtues.findIndex(v => v.id === virtueId);
  const chapterKey = `tresors-${treasureIndex + 1}`;
  const chapter = chaptersProgress[chapterKey];

  if (chapter?.activityCompleted) return 3;
  if (chapter?.read) return 2;

  return 1;
}

function WaterDroplet({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute text-sm pointer-events-none"
      initial={{ y: -20, opacity: 0, scale: 0.5 }}
      animate={{
        y: [0, 15, 25],
        opacity: [0, 1, 0],
        scale: [0.5, 1, 0.8],
      }}
      transition={{
        duration: 1.2,
        delay,
        ease: 'easeOut',
      }}
    >
      💧
    </motion.div>
  );
}

function GardenPlot({ virtue, stage }: { virtue: VirtuePlot; stage: number }) {
  return (
    <motion.div
      className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 min-h-[120px] bg-gradient-to-br ${virtue.bgColor} ${virtue.darkBgColor} overflow-hidden transition-all duration-500 ${
        stage === 0
          ? 'border-dashed border-amber-300/40 dark:border-amber-700/20'
          : stage === 3
            ? 'border-solid border-green-300/60 dark:border-green-700/40 shadow-sm'
            : 'border-solid border-amber-200/40 dark:border-amber-700/20'
      }`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      {/* Soil base */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-amber-700/20 to-amber-700/5 dark:from-amber-900/20 dark:to-amber-900/5 rounded-b-2xl" />

      {/* Water droplet animation - shown when planted */}
      <AnimatePresence>
        {stage >= 1 && (
          <>
            <WaterDroplet delay={0} />
            <WaterDroplet delay={0.3} />
            <WaterDroplet delay={0.6} />
          </>
        )}
      </AnimatePresence>

      {/* Content based on stage */}
      <div className="relative z-10 flex flex-col items-center gap-1">
        {stage === 0 && (
          <>
            <div className="w-10 h-6 rounded-md bg-amber-700/15 dark:bg-amber-900/20 mb-1" />
            <span className="text-[10px] font-medium text-foreground/60 text-center leading-tight">
              {virtue.name}
            </span>
          </>
        )}

        {stage === 1 && (
          <motion.div
            initial={{ scale: 0, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="flex flex-col items-center gap-1"
          >
            <motion.span
              className="text-2xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              🌱
            </motion.span>
            <span className="text-[10px] font-semibold text-green-700 dark:text-green-400 text-center leading-tight">
              {virtue.name}
            </span>
          </motion.div>
        )}

        {stage === 2 && (
          <motion.div
            initial={{ scale: 0, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="flex flex-col items-center gap-1"
          >
            <motion.span
              className="text-2xl"
              animate={{ rotate: [0, 3, -3, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              🌿
            </motion.span>
            <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 text-center leading-tight">
              {virtue.name}
            </span>
          </motion.div>
        )}

        {stage === 3 && (
          <motion.div
            initial={{ scale: 0, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="flex flex-col items-center gap-1"
          >
            <motion.span
              className="text-3xl"
              animate={{
                scale: [1, 1.15, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              {virtue.flowerEmoji}
            </motion.span>
            <span className="text-[10px] font-bold text-foreground text-center leading-tight">
              {virtue.name}
            </span>
            <motion.span
              className="text-[8px] text-green-600 dark:text-green-400"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨ Épanouie ✨
            </motion.span>
          </motion.div>
        )}
      </div>

      {/* Virtue emoji badge */}
      <div className="absolute top-1 right-1 w-6 h-6 rounded-full bg-background/60 dark:bg-background/30 flex items-center justify-center text-xs">
        {virtue.emoji}
      </div>
    </motion.div>
  );
}

export default function VirtueGarden() {
  const { treasuresProgress, chaptersProgress } = useAppStore();

  const gardenData = useMemo(() => {
    return virtues.map(virtue => ({
      virtue,
      stage: getGrowthStage(virtue.id, treasuresProgress, chaptersProgress),
    }));
  }, [treasuresProgress, chaptersProgress]);

  const fullyGrown = gardenData.filter(d => d.stage === 3).length;

  return (
    <div className="w-full">
      {/* Garden header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🌱</span>
          <span className="text-sm font-semibold text-foreground">
            Mon Jardin des Vertus
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">
            {fullyGrown}/6 fleurs
          </span>
          {fullyGrown === 6 && (
            <motion.span
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
            >
              🌸
            </motion.span>
          )}
        </div>
      </div>

      {/* Garden grid */}
      <div
        className="relative rounded-2xl p-4 overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #e8f5e9 0%, #c8e6c9 30%, #a5d6a7 60%, #8d6e63 90%, #6d4c41 100%)',
        }}
      >
        {/* Dark mode overlay */}
        <div className="absolute inset-0 dark:bg-black/40 pointer-events-none" />

        {/* Decorative clouds */}
        <motion.div
          className="absolute top-2 left-4 text-lg opacity-30 pointer-events-none"
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          ☁️
        </motion.div>
        <motion.div
          className="absolute top-4 right-8 text-sm opacity-20 pointer-events-none"
          animate={{ x: [0, -8, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        >
          ☁️
        </motion.div>

        {/* Sun */}
        <motion.div
          className="absolute top-1 right-3 text-xl opacity-40 pointer-events-none"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          ☀️
        </motion.div>

        {/* Grid of plots */}
        <div className="relative z-10 grid grid-cols-3 gap-2 sm:gap-3">
          {gardenData.map(({ virtue, stage }) => (
            <GardenPlot key={virtue.id} virtue={virtue} stage={stage} />
          ))}
        </div>

        {/* Garden footer */}
        {fullyGrown === 0 && (
          <motion.p
            className="relative z-10 text-center text-[10px] text-amber-900/50 dark:text-amber-200/40 mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Collecte des trésors pour faire pousser ton jardin ! 🌱
          </motion.p>
        )}

        {fullyGrown > 0 && fullyGrown < 6 && (
          <motion.p
            className="relative z-10 text-center text-[10px] text-green-900/50 dark:text-green-200/40 mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Continue, ton jardin grandit ! 🌿
          </motion.p>
        )}

        {fullyGrown === 6 && (
          <motion.p
            className="relative z-10 text-center text-xs text-green-900/60 dark:text-green-200/50 mt-3 font-semibold"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🌸 Ton jardin est magnifique ! 🌸
          </motion.p>
        )}
      </div>
    </div>
  );
}
