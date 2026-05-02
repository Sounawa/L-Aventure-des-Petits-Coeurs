'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Clock } from 'lucide-react';
import type { Achievement } from '@/lib/store';

const typeColors: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  badge: {
    bg: 'bg-amber-50 dark:bg-amber-900/15',
    border: 'border-amber-200/50 dark:border-amber-700/30',
    text: 'text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-400',
  },
  chapter: {
    bg: 'bg-teal-50 dark:bg-teal-900/15',
    border: 'border-teal-200/50 dark:border-teal-700/30',
    text: 'text-teal-700 dark:text-teal-300',
    dot: 'bg-teal-400',
  },
  treasure: {
    bg: 'bg-rose-50 dark:bg-rose-900/15',
    border: 'border-rose-200/50 dark:border-rose-700/30',
    text: 'text-rose-700 dark:text-rose-300',
    dot: 'bg-rose-400',
  },
};

const typeLabels: Record<string, string> = {
  badge: 'Badge',
  chapter: 'Chapitre',
  treasure: 'Trésor',
};

function formatTimestamp(ts: string): string {
  try {
    const date = new Date(ts);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;

    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  } catch {
    return '';
  }
}

function TimelineEntry({ achievement, index }: { achievement: Achievement; index: number }) {
  const colors = typeColors[achievement.type] || typeColors.badge;

  return (
    <motion.div
      className="relative flex gap-3"
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 200, damping: 20 }}
    >
      {/* Timeline line and dot */}
      <div className="flex flex-col items-center">
        <motion.div
          className={`w-4 h-4 rounded-full ${colors.dot} flex items-center justify-center shadow-sm border-2 border-background z-10`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.08 + 0.1, type: 'spring', stiffness: 300 }}
        >
          <span className="text-[6px]">●</span>
        </motion.div>
        {/* Connecting line */}
        <div className="w-0.5 flex-1 bg-gradient-to-b from-border/40 to-transparent min-h-[20px]" />
      </div>

      {/* Content */}
      <div className={`flex-1 mb-3 p-2.5 rounded-xl ${colors.bg} border ${colors.border} transition-all`}>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-base">{achievement.emoji}</span>
          <span className={`text-[9px] font-bold uppercase tracking-wide ${colors.text}`}>
            {typeLabels[achievement.type] || achievement.type}
          </span>
          <span className="text-[9px] text-muted-foreground ml-auto flex items-center gap-0.5">
            <Clock className="w-2.5 h-2.5" />
            {formatTimestamp(achievement.timestamp)}
          </span>
        </div>
        <p className="text-xs text-foreground/80 leading-snug">
          {achievement.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function AchievementTimeline() {
  const { achievements } = useAppStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const recentAchievements = useMemo(() => {
    return [...achievements].reverse().slice(0, 10);
  }, [achievements]);

  const hasAchievements = recentAchievements.length > 0;

  return (
    <div className="w-full">
      {/* Header with expand toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-2 group"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🏆</span>
          <span className="text-sm font-semibold text-foreground">
            Mes Accomplissements
          </span>
          {hasAchievements && (
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
              {achievements.length}
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-muted-foreground group-hover:text-primary transition-colors"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            {hasAchievements ? (
              <div className="relative pl-1 max-h-96 overflow-y-auto custom-scrollbar">
                {/* Animated gradient line */}
                <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 via-teal-400/30 to-rose-400/30" />

                {recentAchievements.map((achievement, i) => (
                  <TimelineEntry key={achievement.timestamp + i} achievement={achievement} index={i} />
                ))}

                {achievements.length > 10 && (
                  <p className="text-center text-[10px] text-muted-foreground mt-2 pb-2">
                    ...et {achievements.length - 10} autres accomplissements
                  </p>
                )}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="empty-state-card"
              >
                <motion.span
                  className="text-3xl block mb-2 sparkle-float"
                >
                  🏆
                </motion.span>
                <p className="text-sm font-medium text-foreground/80 mb-1">
                  Tes accomplissements apparaîtront ici !
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Collecte des trésors, lis des chapitres et débloque des badges
                </p>
                <div className="flex justify-center gap-2 mt-2">
                  {['📖', '💎', '🏅'].map((e, i) => (
                    <motion.span
                      key={i}
                      className="text-lg opacity-40"
                      animate={{ opacity: [0.2, 0.6, 0.2], y: [0, -3, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    >
                      {e}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
