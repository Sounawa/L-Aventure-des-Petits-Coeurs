'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, type AdventureId } from '@/lib/store';
import { useMemo, useState } from 'react';
import CertificateView from './CertificateView';

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
    emblem: '✨',
    accentColor: '#F59E0B',
    order: 1,
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
    emblem: '🌟',
    accentColor: '#14B8A6',
    order: 2,
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
    emblem: '🌙',
    accentColor: '#A78BFA',
    order: 3,
  },
];

export default function AdventureSelector() {
  const { currentAdventure, setAdventure, chaptersProgress, treasuresProgress } = useAppStore();
  const [celebratingId, setCelebratingId] = useState<AdventureId | null>(null);
  const [certificateAdv, setCertificateAdv] = useState<typeof adventures[number] | null>(null);

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
    <>
    {/* Recommended order indicator */}
    <div className="flex items-center justify-center gap-1 mb-2">
      <span className="text-[10px] text-muted-foreground font-medium">Ordre recommandé :</span>
      {adventures.map((adv, i) => (
        <div key={adv.id} className="flex items-center">
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-all duration-200 ${
            currentAdventure === adv.id
              ? 'bg-primary/20 text-primary glow-gold'
              : 'text-muted-foreground'
          }`}>
            {adv.order}
          </span>
          {i < adventures.length - 1 && (
            <span className="text-muted-foreground/40 mx-0.5">→</span>
          )}
        </div>
      ))}
    </div>

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
            className={`flex-shrink-0 px-4 py-3 rounded-2xl border-2 transition-all duration-300 min-w-[130px] snap-start relative overflow-hidden card-glow-hover ${
              isActive
                ? 'border-primary/60 shadow-xl scale-105 adventure-tab-active selection-ring'
                : 'border-border/50 bg-card hover:border-primary/40'
            }`}
            whileTap={{ scale: 0.93 }}
            whileHover={isActive ? { scale: 1.06 } : { scale: 1.02 }}
            style={isActive ? { background: adv.gradient + '22', '--accent-shadow': adv.accentColor + '26', '--accent-shadow-light': adv.accentColor + '14' } as React.CSSProperties : {}}
          >
            {/* Gradient background for active state — animated gradient overlay */}
            {isActive && (
              <motion.div
                className="absolute inset-0 opacity-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ duration: 0.3 }}
                style={{ background: adv.gradient }}
              />
            )}
            {/* Shimmer overlay for active tab */}
            {isActive && (
              <div className="absolute inset-0 shimmer-shine rounded-2xl pointer-events-none" />
            )}

            {/* Decorative emblem watermark - different from main emoji */}
            <div className="absolute -bottom-2 -right-2 text-4xl opacity-10 select-none">
              {adv.emblem}
            </div>

            {/* Order number badge */}
            <div className="absolute top-1 left-1.5 z-10">
              <span className={`w-5 h-5 flex items-center justify-center text-[9px] font-bold rounded-full shadow-sm transition-all ${
                isActive
                  ? 'bg-gradient-to-br from-amber-400 to-yellow-300 text-amber-900'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {adv.order}
              </span>
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
            <div className="relative z-10 mt-2">
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
              <>
                <motion.span
                  className="text-[9px] font-bold block relative z-10 text-gradient-gold"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Complété ! 🎉
                </motion.span>
                <motion.button
                  className="text-[8px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700/30 font-medium relative z-10 mt-0.5 hover:shadow-md transition-shadow"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCertificateAdv(adv);
                  }}
                >
                  📜 Certificat
                </motion.button>
              </>
            )}

            {/* Progress bar with gradient + shimmer overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-primary/10 rounded-b-2xl overflow-hidden progress-bar-shimmer">
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

      {/* Certificate overlay */}
      <CertificateView
        isOpen={!!certificateAdv}
        onClose={() => setCertificateAdv(null)}
        adventureName={certificateAdv?.title || ''}
        adventureEmoji={certificateAdv?.emoji || ''}
      />
    </>
  );
}
