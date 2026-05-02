'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, type AdventureId } from '@/lib/store';
import { useMemo, useState } from 'react';

const adventures = [
  { 
    id: 'miroir' as AdventureId, 
    title: 'Le Miroir Magique', 
    emoji: '🪞', 
    color: 'from-amber-100 to-yellow-200', 
    darkColor: 'from-amber-900/30 to-yellow-800/30',
    gradient: 'linear-gradient(135deg, #F59E0B, #EAB308)',
    desc: 'Découvre le miroir enchanté', 
    totalChapters: 5,
    emblem: '🪞',
    accentColor: '#F59E0B',
  },
  { 
    id: 'tresors' as AdventureId, 
    title: 'Les Trésors du Cœur', 
    emoji: '💎', 
    color: 'from-emerald-100 to-teal-200', 
    darkColor: 'from-emerald-900/30 to-teal-800/30',
    gradient: 'linear-gradient(135deg, #14B8A6, #10B981)',
    desc: 'Collecte les vertus précieuses', 
    totalChapters: 6,
    emblem: '💎',
    accentColor: '#14B8A6',
  },
  { 
    id: 'lumiere' as AdventureId, 
    title: 'La Lumière Intérieure', 
    emoji: '✨', 
    color: 'from-purple-100 to-indigo-200', 
    darkColor: 'from-purple-900/30 to-indigo-800/30',
    gradient: 'linear-gradient(135deg, #A78BFA, #818CF8)',
    desc: 'Comprends la lumière divine', 
    totalChapters: 4,
    emblem: '✨',
    accentColor: '#A78BFA',
  },
];

export default function AdventureSelector() {
  const { currentAdventure, setAdventure, chaptersProgress, treasuresProgress } = useAppStore();
  const [celebratingId, setCelebratingId] = useState<AdventureId | null>(null);

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

  const handleClick = (advId: AdventureId) => {
    const progress = getProgress(advId);
    const isComplete = progress.completed === progress.total && progress.total > 0;
    if (isComplete) {
      setCelebratingId(advId);
      setTimeout(() => setCelebratingId(null), 1500);
    }
    setAdventure(advId);
  };

  return (
    <div className="flex gap-3 overflow-x-auto pb-3 px-1 custom-scrollbar snap-x snap-mandatory">
      {adventures.map((adv) => {
        const isActive = currentAdventure === adv.id;
        const progress = getProgress(adv.id);
        const isComplete = progress.completed === progress.total && progress.total > 0;
        const isCelebrating = celebratingId === adv.id;
        
        return (
          <motion.button
            key={adv.id}
            onClick={() => handleClick(adv.id)}
            className={`flex-shrink-0 px-4 py-3 rounded-2xl border-2 transition-all min-w-[130px] snap-start relative overflow-hidden ${
              isActive
                ? 'border-primary/60 shadow-lg scale-[1.02]'
                : 'border-border/50 bg-card hover:border-primary/40'
            }`}
            whileTap={{ scale: 0.95 }}
            style={isActive ? { background: adv.gradient + '22' } : {}}
          >
            {/* Gradient background for active state */}
            {isActive && (
              <div 
                className="absolute inset-0 opacity-20"
                style={{ background: adv.gradient }}
              />
            )}

            {/* Decorative emblem watermark */}
            <div className="absolute -bottom-2 -right-2 text-4xl opacity-10 select-none">
              {adv.emblem}
            </div>

            {/* Celebration effect */}
            <AnimatePresence>
              {isCelebrating && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.span
                      key={i}
                      className="absolute text-sm"
                      style={{
                        left: `${20 + Math.random() * 60}%`,
                        top: `${20 + Math.random() * 60}%`,
                      }}
                      initial={{ scale: 0, rotate: 0 }}
                      animate={{ scale: [0, 1.5, 0], rotate: [0, 180, 360], y: [0, -30, -60] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1, delay: i * 0.08 }}
                    >
                      {['✨', '🌟', '💫', '⭐'][i % 4]}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Badge/emblem icon */}
            <div className="relative z-10">
              <motion.div
                className="text-2xl block"
                animate={isComplete ? { rotate: [0, 5, -5, 0] } : {}}
                transition={{ duration: 0.5, repeat: isComplete ? 1 : 0, repeatDelay: 3 }}
              >
                {isComplete ? '🌟' : adv.emoji}
              </motion.div>
            </div>

            <span className={`text-[10px] sm:text-xs font-bold block mt-1 relative z-10 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
              {adv.title}
            </span>

            {progress.completed > 0 && (
              <span className="text-[9px] text-muted-foreground block mt-0.5 relative z-10">
                {progress.completed}/{progress.total} ✨
              </span>
            )}

            {isComplete && (
              <motion.span 
                className="text-[9px] font-bold block relative z-10 text-gradient-gold"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Complété ! 🎉
              </motion.span>
            )}

            {/* Progress bar with gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-primary/10 rounded-b-2xl overflow-hidden">
              <motion.div
                className="h-full gradient-progress rounded-b-2xl"
                initial={{ width: 0 }}
                animate={{ width: `${progress.percent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
