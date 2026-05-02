'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';

interface StatItem {
  icon: string;
  label: string;
  value: number;
  max?: number;
  color: string;
}

const levelDefinitions = [
  { minStars: 0, level: 1, title: 'Débutant', emoji: '🌱', color: 'from-green-400 to-emerald-500' },
  { minStars: 11, level: 2, title: 'Explorateur', emoji: '🧭', color: 'from-teal-400 to-cyan-500' },
  { minStars: 26, level: 3, title: 'Aventurier', emoji: '⚔️', color: 'from-amber-400 to-yellow-500' },
  { minStars: 51, level: 4, title: 'Sage', emoji: '📚', color: 'from-purple-400 to-violet-500' },
  { minStars: 101, level: 5, title: 'Maître du Cœur', emoji: '👑', color: 'from-rose-400 to-pink-500' },
];

function AnimatedNumber({ target, duration = 1000 }: { target: number; duration?: number }) {
  const [current, setCurrent] = useState(() => target);

  useEffect(() => {
    const startTime = Date.now();
    const startVal = 0;
    let rafId: number;
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const newVal = Math.round(startVal + (target - startVal) * eased);
      setCurrent(newVal);
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration]);

  return <span>{current}</span>;
}

function CircularProgress({ progress, size = 120, strokeWidth = 8, color }: { progress: number; size?: number; strokeWidth?: number; color: string }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(progress, 1) * circumference);

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-muted/30"
      />
      {/* Progress circle */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#progressGradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color === 'amber' ? '#C9A227' : color === 'teal' ? '#14B8A6' : '#A855F7'} />
          <stop offset="100%" stopColor={color === 'amber' ? '#E8D44D' : color === 'teal' ? '#5EEAD4' : '#C084FC'} />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function StatsDashboard() {
  const {
    totalStars,
    chaptersProgress,
    treasuresProgress,
    currentStreak,
    badges,
    practiceDays,
    dailyChallengeCompleted,
  } = useAppStore();

  const [isVisible, setIsVisible] = useState(false);

  // Calculate stats
  const stats = useMemo(() => {
    const chaptersRead = Object.values(chaptersProgress).filter(c => c.read).length;
    const treasuresCollected = Object.values(treasuresProgress).filter(t => t.collected).length;
    const activitiesCompleted = Object.values(chaptersProgress).filter(c => c.activityCompleted).length;
    const badgesUnlocked = badges.filter(b => b.unlockedAt).length;
    const uniqueDays = new Set(practiceDays.map(d => d.date)).size;
    const dailyChallengesCompleted = Object.values(dailyChallengeCompleted).filter(Boolean).length;

    return {
      chaptersRead,
      treasuresCollected,
      activitiesCompleted: activitiesCompleted + dailyChallengesCompleted,
      badgesUnlocked,
      uniqueDays,
    };
  }, [chaptersProgress, treasuresProgress, badges, practiceDays, dailyChallengeCompleted]);

  // Current level
  const currentLevel = useMemo(() => {
    let level = levelDefinitions[0];
    for (const def of levelDefinitions) {
      if (totalStars >= def.minStars) level = def;
    }
    return level;
  }, [totalStars]);

  // Next level
  const nextLevel = useMemo(() => {
    const idx = levelDefinitions.indexOf(currentLevel);
    if (idx < levelDefinitions.length - 1) return levelDefinitions[idx + 1];
    return null;
  }, [currentLevel]);

  // Progress to next level
  const levelProgress = useMemo(() => {
    if (!nextLevel) return 1; // Max level
    const starsInLevel = totalStars - currentLevel.minStars;
    const starsNeeded = nextLevel.minStars - currentLevel.minStars;
    return starsInLevel / starsNeeded;
  }, [totalStars, currentLevel, nextLevel]);

  const statItems: StatItem[] = [
    { icon: '⭐', label: 'Étoiles', value: totalStars, color: 'amber' },
    { icon: '📖', label: 'Chapitres lus', value: stats.chaptersRead, max: 15, color: 'teal' },
    { icon: '💎', label: 'Trésors', value: stats.treasuresCollected, max: 6, color: 'amber' },
    { icon: '🔥', label: 'Série', value: currentStreak, color: 'amber' },
    { icon: '🏆', label: 'Badges', value: stats.badgesUnlocked, max: 15, color: 'amber' },
    { icon: '🎮', label: 'Activités', value: stats.activitiesCompleted, color: 'teal' },
    { icon: '📅', label: 'Jours actifs', value: stats.uniqueDays, color: 'teal' },
  ];

  const colorMap: Record<string, string> = {
    amber: 'from-amber-100 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200/40 dark:border-amber-700/20',
    teal: 'from-teal-100 to-cyan-100 dark:from-teal-900/20 dark:to-cyan-900/20 border-teal-200/40 dark:border-teal-700/20',
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Level display */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex items-center justify-center gap-6 p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/15 dark:to-yellow-900/15 border-2 border-amber-200/40 dark:border-amber-700/25 overflow-hidden"
      >
        {/* Decorative background elements */}
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 bg-amber-200/10 rounded-full blur-2xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-24 h-24 bg-teal-200/10 rounded-full blur-2xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        />

        {/* Circular progress */}
        <div className="relative flex-shrink-0">
          <CircularProgress
            progress={levelProgress}
            size={100}
            strokeWidth={6}
            color="amber"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              className="text-3xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {currentLevel.emoji}
            </motion.span>
          </div>
        </div>

        {/* Level info */}
        <div className="relative z-10 text-center sm:text-left">
          <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider mb-1">
            Niveau {currentLevel.level}
          </p>
          <h3 className="text-xl sm:text-2xl font-bold text-gradient-gold mb-1">
            {currentLevel.title}
          </h3>
          <p className="text-sm text-foreground/60">
            {nextLevel
              ? `${nextLevel.minStars - totalStars} ⭐ avant ${nextLevel.title} ${nextLevel.emoji}`
              : 'Niveau maximum atteint ! 🎉'}
          </p>
          {totalStars > 0 && (
            <p className="text-xs text-foreground/40 mt-1">{totalStars} étoiles au total</p>
          )}
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {statItems.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className={`relative bg-gradient-to-br ${colorMap[stat.color]} border rounded-xl p-4 text-center overflow-hidden card-hover-enhanced`}
            onMouseEnter={() => setIsVisible(true)}
          >
            <span className="text-2xl sm:text-3xl block mb-1">{stat.icon}</span>
            <p className="text-2xl sm:text-3xl font-bold text-foreground/90">
              <AnimatedNumber target={stat.value} duration={800 + idx * 100} />
            </p>
            <p className="text-[10px] sm:text-xs text-foreground/50 font-medium mt-0.5">{stat.label}</p>
            {stat.max !== undefined && (
              <p className="text-[9px] text-foreground/30 mt-0.5">/ {stat.max}</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Level roadmap */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="rounded-xl p-4 bg-muted/20 border border-border/30"
      >
        <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-3">
          Progression des niveaux
        </p>
        <div className="flex items-center gap-1">
          {levelDefinitions.map((def, idx) => {
            const isCurrent = def.level === currentLevel.level;
            const isUnlocked = totalStars >= def.minStars;
            return (
              <div key={def.level} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all ${
                    isCurrent
                      ? 'border-amber-400 bg-gradient-to-br from-amber-200 to-yellow-200 dark:from-amber-800/50 dark:to-yellow-800/50 shadow-lg'
                      : isUnlocked
                      ? 'border-green-300 bg-green-100 dark:border-green-700 dark:bg-green-900/30'
                      : 'border-muted/40 bg-muted/10'
                  }`}
                  animate={isCurrent ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {isUnlocked ? def.emoji : '🔒'}
                </motion.div>
                <span className={`text-[8px] sm:text-[9px] text-center leading-tight ${
                  isCurrent ? 'font-bold text-amber-600 dark:text-amber-400' : 'text-foreground/40'
                }`}>
                  {def.title}
                </span>
                {idx < levelDefinitions.length - 1 && (
                  <div className="hidden sm:block" />
                )}
              </div>
            );
          })}
        </div>
        {/* Connection line */}
        <div className="relative h-0.5 bg-muted/20 rounded-full mt-1 mx-6">
          <motion.div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${levelProgress * 100}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </motion.div>
    </div>
  );
}
