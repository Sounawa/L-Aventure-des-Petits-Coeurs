'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
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

function CircularProgress({ progress, size = 120, strokeWidth = 8, color, label, value, max }: {
  progress: number; size?: number; strokeWidth?: number; color: string;
  label?: string; value?: number; max?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(progress, 1) * circumference);
  const gradientId = `gradient-${label?.replace(/\s/g, '') || Math.random()}`;

  return (
    <div className="relative inline-flex items-center justify-center">
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
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color === 'amber' ? '#C9A227' : color === 'teal' ? '#14B8A6' : color === 'rose' ? '#F43F5E' : '#A855F7'} />
            <stop offset="100%" stopColor={color === 'amber' ? '#E8D44D' : color === 'teal' ? '#5EEAD4' : color === 'rose' ? '#FB7185' : '#C084FC'} />
          </linearGradient>
        </defs>
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {value !== undefined && max !== undefined ? (
          <>
            <span className="text-lg sm:text-xl font-bold text-foreground/90">{value}<span className="text-xs text-foreground/40">/{max}</span></span>
            <span className="text-[9px] text-foreground/50">{label}</span>
          </>
        ) : value !== undefined ? (
          <>
            <span className="text-lg sm:text-xl font-bold text-foreground/90">{value}</span>
            <span className="text-[9px] text-foreground/50">{label}</span>
          </>
        ) : null}
      </div>
    </div>
  );
}

function WeeklyActivityChart({ practiceDays, dailyChallengeCompleted }: {
  practiceDays: { date: string; prayers: boolean; kindness: boolean; breathing: boolean; gratitude: boolean; silence: boolean }[];
  dailyChallengeCompleted: Record<string, boolean>;
}) {
  const weekData = useMemo(() => {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const now = new Date();
    const dayOfWeek = (now.getDay() + 6) % 7; // Monday=0
    const data: { day: string; value: number; isToday: boolean }[] = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - dayOfWeek + i);
      const dateStr = d.toISOString().split('T')[0];
      const practice = practiceDays.find(p => p.date === dateStr);
      const completed = practice
        ? Object.entries(practice).filter(([k, v]) => k !== 'date' && v).length
        : 0;
      const challengeCompleted = dailyChallengeCompleted[dateStr] ? 1 : 0;

      data.push({
        day: days[i],
        value: completed + challengeCompleted,
        isToday: dateStr === now.toISOString().split('T')[0],
      });
    }
    return data;
  }, [practiceDays, dailyChallengeCompleted]);

  const maxValue = Math.max(...weekData.map(d => d.value), 1);

  return (
    <div className="flex items-end gap-2 h-32">
      {weekData.map((day, idx) => {
        const barHeight = maxValue > 0 ? (day.value / maxValue) * 100 : 0;
        return (
          <div key={idx} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full h-24 flex items-end justify-center">
              <motion.div
                className={`w-full max-w-[32px] rounded-t-lg ${
                  day.isToday
                    ? 'bg-gradient-to-t from-amber-400 to-yellow-300 shadow-sm shadow-amber-200/50'
                    : day.value > 0
                    ? 'bg-gradient-to-t from-primary/30 to-primary/15'
                    : 'bg-muted/20'
                }`}
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(barHeight, 4)}%` }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              />
            </div>
            <span className={`text-[9px] font-medium ${
              day.isToday ? 'text-primary font-bold' : 'text-foreground/40'
            }`}>
              {day.day}
            </span>
            {day.value > 0 && (
              <span className="text-[8px] text-foreground/30">{day.value}</span>
            )}
          </div>
        );
      })}
    </div>
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
    gratitudeEntries,
  } = useAppStore();

  // Calculate stats
  const stats = useMemo(() => {
    const chaptersRead = Object.values(chaptersProgress).filter(c => c.read).length;
    const totalChapters = 15; // 5 miroir + 6 tresors + 4 lumiere
    const treasuresCollected = Object.values(treasuresProgress).filter(t => t.collected).length;
    const totalTreasures = 6;
    const activitiesCompleted = Object.values(chaptersProgress).filter(c => c.activityCompleted).length;
    const badgesUnlocked = badges.filter(b => b.unlockedAt).length;
    const totalBadges = badges.length;
    const uniqueDays = new Set(practiceDays.map(d => d.date)).size;
    const dailyChallengesCompleted = Object.values(dailyChallengeCompleted).filter(Boolean).length;

    // Reading time estimate: ~3 min per chapter read
    const readingTimeMinutes = chaptersRead * 3;

    return {
      chaptersRead,
      totalChapters,
      treasuresCollected,
      totalTreasures,
      activitiesCompleted: activitiesCompleted + dailyChallengesCompleted,
      badgesUnlocked,
      totalBadges,
      uniqueDays,
      readingTimeMinutes,
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

  const colorMap: Record<string, string> = {
    amber: 'from-amber-100 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200/40 dark:border-amber-700/20',
    teal: 'from-teal-100 to-cyan-100 dark:from-teal-900/20 dark:to-cyan-900/20 border-teal-200/40 dark:border-teal-700/20',
    rose: 'from-rose-100 to-pink-100 dark:from-rose-900/20 dark:to-pink-900/20 border-rose-200/40 dark:border-rose-700/20',
  };

  const statItems: StatItem[] = [
    { icon: '⭐', label: 'Étoiles', value: totalStars, color: 'amber' },
    { icon: '📖', label: 'Chapitres', value: stats.chaptersRead, max: stats.totalChapters, color: 'teal' },
    { icon: '💎', label: 'Trésors', value: stats.treasuresCollected, max: stats.totalTreasures, color: 'amber' },
    { icon: '🔥', label: 'Série', value: currentStreak, color: 'amber' },
    { icon: '🏆', label: 'Badges', value: stats.badgesUnlocked, max: stats.totalBadges, color: 'rose' },
    { icon: '🎮', label: 'Activités', value: stats.activitiesCompleted, color: 'teal' },
    { icon: '📅', label: 'Jours actifs', value: stats.uniqueDays, color: 'teal' },
    { icon: '⏱️', label: 'Lecture', value: stats.readingTimeMinutes, color: 'amber' },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Level display with circular progress */}
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

      {/* Progress circles row — chapters, treasures, badges */}
      <div className="grid grid-cols-3 gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/15 dark:to-cyan-900/15 border border-teal-200/40 dark:border-teal-700/20"
        >
          <CircularProgress
            progress={stats.totalChapters > 0 ? stats.chaptersRead / stats.totalChapters : 0}
            size={80}
            strokeWidth={5}
            color="teal"
            label="Chapitres"
            value={stats.chaptersRead}
            max={stats.totalChapters}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/15 dark:to-yellow-900/15 border border-amber-200/40 dark:border-amber-700/20"
        >
          <CircularProgress
            progress={stats.totalTreasures > 0 ? stats.treasuresCollected / stats.totalTreasures : 0}
            size={80}
            strokeWidth={5}
            color="amber"
            label="Trésors"
            value={stats.treasuresCollected}
            max={stats.totalTreasures}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/15 dark:to-pink-900/15 border border-rose-200/40 dark:border-rose-700/20"
        >
          <CircularProgress
            progress={stats.totalBadges > 0 ? stats.badgesUnlocked / stats.totalBadges : 0}
            size={80}
            strokeWidth={5}
            color="rose"
            label="Badges"
            value={stats.badgesUnlocked}
            max={stats.totalBadges}
          />
        </motion.div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {statItems.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
            className={`relative bg-gradient-to-br ${colorMap[stat.color]} border rounded-xl p-3 sm:p-4 text-center overflow-hidden card-hover-enhanced`}
          >
            <span className="text-xl sm:text-2xl block mb-0.5">{stat.icon}</span>
            <p className="text-lg sm:text-2xl font-bold text-foreground/90">
              <AnimatedNumber target={stat.value} duration={800 + idx * 100} />
            </p>
            <p className="text-[8px] sm:text-[10px] text-foreground/50 font-medium mt-0.5">{stat.label}</p>
            {stat.max !== undefined && (
              <p className="text-[8px] text-foreground/30 mt-0.5">/ {stat.max}</p>
            )}
            {/* Reading time suffix */}
            {stat.label === 'Lecture' && stat.value > 0 && (
              <p className="text-[7px] text-foreground/30 mt-0.5">min</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Streak with fire animation */}
      {currentStreak > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-900/15 dark:via-amber-900/15 dark:to-yellow-900/15 border border-amber-200/40 dark:border-amber-700/20 overflow-hidden"
        >
          {/* Animated fire */}
          <motion.span
            className="text-3xl sm:text-4xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            {currentStreak >= 7 ? '🔥🔥' : '🔥'}
          </motion.span>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-gradient-gold">{currentStreak}</p>
            <p className="text-xs text-foreground/60">
              {currentStreak > 1 ? 'jours de suite !' : 'jour de suite !'}
            </p>
            <p className="text-[10px] text-foreground/40 mt-0.5">
              {currentStreak >= 30
                ? '👑 Série légendaire !'
                : currentStreak >= 14
                ? '💫 Série incroyable !'
                : currentStreak >= 7
                ? '🌟 Série fantastique !'
                : 'Continue comme ça !'}
            </p>
          </div>
          {/* Decorative embers */}
          <div className="absolute top-0 right-4 flex gap-1">
            {[0, 1, 2].map(i => (
              <motion.span
                key={i}
                className="text-[8px]"
                animate={{ y: [0, -8, 0], opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
              >
                ✦
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Weekly activity chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="rounded-xl p-4 bg-gradient-to-br from-muted/20 to-muted/10 border border-border/30"
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">
            Activité cette semaine
          </p>
          <span className="text-[9px] text-foreground/30">pratiques + défis</span>
        </div>
        <WeeklyActivityChart
          practiceDays={practiceDays}
          dailyChallengeCompleted={dailyChallengeCompleted}
        />
      </motion.div>

      {/* Level roadmap */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
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
                  {isUnlocked ? def.emoji : '🌟'}
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

      {/* Gratitude count */}
      {gratitudeEntries.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10 border border-yellow-200/30 dark:border-yellow-700/20"
        >
          <span className="text-2xl">💛</span>
          <div>
            <p className="text-sm font-bold text-foreground/80">
              <AnimatedNumber target={gratitudeEntries.length} duration={600} /> entrées de gratitude
            </p>
            <p className="text-[10px] text-foreground/50">Continue à cultiver la reconnaissance !</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
