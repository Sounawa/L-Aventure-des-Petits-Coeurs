'use client';

import { motion } from 'framer-motion';
import { useAppStore, type AdventureId } from '@/lib/store';
import { useMemo } from 'react';

const adventures = [
  { id: 'miroir' as AdventureId, title: 'Le Miroir Magique', emoji: '🪞', color: 'from-amber-100 to-yellow-200', desc: 'Découvre le miroir enchanté', totalChapters: 5 },
  { id: 'tresors' as AdventureId, title: 'Les Trésors du Cœur', emoji: '💎', color: 'from-emerald-100 to-teal-200', desc: 'Collecte les vertus précieuses', totalChapters: 6 },
  { id: 'lumiere' as AdventureId, title: 'La Lumière Intérieure', emoji: '✨', color: 'from-purple-100 to-indigo-200', desc: 'Comprends la lumière divine', totalChapters: 4 },
];

export default function AdventureSelector() {
  const { currentAdventure, setAdventure, chaptersProgress, treasuresProgress } = useAppStore();

  const getProgress = useMemo(() => {
    return (advId: AdventureId) => {
      if (advId === 'miroir') {
        const completed = [1,2,3,4,5].filter(i => chaptersProgress[`miroir-${i}`]?.activityCompleted).length;
        return { completed, total: 5, percent: (completed / 5) * 100 };
      }
      if (advId === 'tresors') {
        const allTreasures = ['gratitude','patience','gentillesse','courage','honnêteté','amour'];
        const completed = allTreasures.filter(t => treasuresProgress[t]?.collected).length;
        return { completed, total: 6, percent: (completed / 6) * 100 };
      }
      if (advId === 'lumiere') {
        const completed = [1,2,3,4].filter(i => chaptersProgress[`lumiere-${i}`]?.activityCompleted).length;
        return { completed, total: 4, percent: (completed / 4) * 100 };
      }
      return { completed: 0, total: 0, percent: 0 };
    };
  }, [chaptersProgress, treasuresProgress]);

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 px-1 custom-scrollbar snap-x snap-mandatory">
      {adventures.map((adv) => {
        const isActive = currentAdventure === adv.id;
        const progress = getProgress(adv.id);
        const isComplete = progress.completed === progress.total && progress.total > 0;
        
        return (
          <motion.button
            key={adv.id}
            onClick={() => setAdventure(adv.id)}
            className={`flex-shrink-0 px-4 py-3 rounded-2xl border-2 transition-all min-w-[120px] snap-start relative overflow-hidden ${
              isActive
                ? 'border-primary bg-gradient-to-br ' + adv.color + ' shadow-md'
                : 'border-border bg-card hover:border-primary/50'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            {/* Progress bar background */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/10 rounded-b-2xl overflow-hidden">
              <motion.div
                className="h-full bg-primary/50 rounded-b-2xl"
                initial={{ width: 0 }}
                animate={{ width: `${progress.percent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>

            <span className="text-2xl block">{isComplete ? '🌟' : adv.emoji}</span>
            <span className={`text-[10px] sm:text-xs font-bold block mt-1 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
              {adv.title}
            </span>
            {progress.completed > 0 && (
              <span className="text-[9px] text-muted-foreground block mt-0.5">
                {progress.completed}/{progress.total} ✨
              </span>
            )}
            {isComplete && (
              <span className="text-[9px] text-primary font-bold block">Complété ! 🎉</span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
