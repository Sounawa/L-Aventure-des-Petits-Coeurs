'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';

// 7 different challenge types, one for each day of the week
const dailyChallenges = [
  {
    day: 0,
    dayName: 'Lundi',
    emoji: '🤝',
    title: 'Acte de gentillesse',
    text: 'Fais un acte de gentillesse pour quelqu\'un aujourd\'hui. Un sourire, un mot doux, ou aide quelqu\'un !',
    description: 'La gentillesse rend le monde plus beau 💛',
    category: 'Gentillesse',
    gradient: 'from-pink-100 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20',
    border: 'border-pink-200/50 dark:border-pink-700/30',
    accent: '#EC4899',
  },
  {
    day: 1,
    dayName: 'Mardi',
    emoji: '🙏',
    title: 'Moment de gratitude',
    text: 'Prends un moment pour dire "Alhamdulillah" et penser à 3 choses pour lesquelles tu es reconnaissant(e).',
    description: 'La gratitude illumine le cœur ✨',
    category: 'Gratitude',
    gradient: 'from-amber-100 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-900/20',
    border: 'border-amber-200/50 dark:border-amber-700/30',
    accent: '#C9A227',
  },
  {
    day: 2,
    dayName: 'Mercredi',
    emoji: '🌬️',
    title: 'Exercice de respiration',
    text: 'Fais 3 respirations calmes : inspire 4 secondes, retiens 2 secondes, expire 6 secondes.',
    description: 'La respiration apaise l\'âme 🌊',
    category: 'Respiration',
    gradient: 'from-sky-100 to-cyan-100 dark:from-sky-900/20 dark:to-cyan-900/20',
    border: 'border-sky-200/50 dark:border-sky-700/30',
    accent: '#0EA5E9',
  },
  {
    day: 3,
    dayName: 'Jeudi',
    emoji: '📖',
    title: 'Lecture du Coran',
    text: 'Lis au moins une page du Coran aujourd\'hui, même une petite sourate !',
    description: 'Le Coran est la lumière de Dieu 🌟',
    category: 'Coran',
    gradient: 'from-emerald-100 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20',
    border: 'border-emerald-200/50 dark:border-emerald-700/30',
    accent: '#10B981',
  },
  {
    day: 4,
    dayName: 'Vendredi',
    emoji: '🤲',
    title: 'Prière extra',
    text: 'Fais une prière supplémentaire aujourd\'hui, même juste 2 rak\'ahs avec le cœur.',
    description: 'La prière rapproche de Dieu 💜',
    category: 'Prière',
    gradient: 'from-teal-100 to-cyan-100 dark:from-teal-900/20 dark:to-cyan-900/20',
    border: 'border-teal-200/50 dark:border-teal-700/30',
    accent: '#14B8A6',
  },
  {
    day: 5,
    dayName: 'Samedi',
    emoji: '🎨',
    title: 'Dessin spirituel',
    text: 'Dessine quelque chose qui te rend reconnaissant(e) : une étoile, un cœur, une fleur...',
    description: 'L\'art exprime la beauté du cœur 🎨',
    category: 'Créativité',
    gradient: 'from-orange-100 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20',
    border: 'border-orange-200/50 dark:border-orange-700/30',
    accent: '#F59E0B',
  },
  {
    day: 6,
    dayName: 'Dimanche',
    emoji: '👨‍👩‍👧‍👦',
    title: 'Partage avec famille',
    text: 'Partage quelque chose avec ta famille : une histoire, un dessin, un moment de prière ensemble.',
    description: 'La famille est un trésor 🏠',
    category: 'Partage',
    gradient: 'from-rose-100 to-pink-100 dark:from-rose-900/20 dark:to-pink-900/20',
    border: 'border-rose-200/50 dark:border-rose-700/30',
    accent: '#F43F5E',
  },
];

const dayEmojis = ['🌅', '☀️', '🌿', '🌤️', '🌟', '🌙', '✨'];

export default function DailyChallenge() {
  const { dailyChallengeCompleted, completeDailyChallenge } = useAppStore();

  const today = useMemo(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }, []);

  const challenge = useMemo(() => {
    const d = new Date();
    const dayOfWeek = (d.getDay() + 6) % 7; // Monday=0
    return dailyChallenges[dayOfWeek];
  }, []);

  const isCompleted = dailyChallengeCompleted[today] || false;

  // Calculate weekly progress (which days this week are completed)
  const weeklyProgress = useMemo(() => {
    const result: { day: string; dayShort: string; completed: boolean; isToday: boolean; emoji: string }[] = [];
    const now = new Date();
    const dayOfWeek = (now.getDay() + 6) % 7; // Monday=0

    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - dayOfWeek + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

      result.push({
        day: dailyChallenges[i].dayName,
        dayShort: dayNames[i],
        completed: !!dailyChallengeCompleted[dateStr],
        isToday: dateStr === today,
        emoji: dayEmojis[i],
      });
    }
    return result;
  }, [dailyChallengeCompleted, today]);

  const completedDays = weeklyProgress.filter(d => d.completed).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full"
    >
      <div className={`relative overflow-hidden rounded-2xl border-2 bg-gradient-to-br ${challenge.gradient} ${challenge.border} p-5 sm:p-6 slow-gradient-border`}>
        {/* Animated border glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${challenge.accent}15, transparent, ${challenge.accent}15)`,
            backgroundSize: '200% 200%',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🎯</span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/70">
              Défi du jour
            </h3>
            <span className="ml-auto text-xs font-medium text-foreground/50">
              {challenge.dayName}
            </span>
          </div>

          {/* Challenge content */}
          <div className="flex items-start gap-3 mb-3">
            <motion.span
              className="text-4xl sm:text-5xl flex-shrink-0"
              animate={isCompleted ? { scale: [1, 1.15, 1], rotate: [0, 10, -10, 0] } : {}}
              transition={{ duration: 1.5, repeat: isCompleted ? Infinity : 0, repeatDelay: 2 }}
            >
              {challenge.emoji}
            </motion.span>
            <div className="flex-1">
              <h4 className="text-lg sm:text-xl font-bold text-foreground/90 mb-1">
                {challenge.title}
              </h4>
              <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
                {challenge.text}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  isCompleted
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-foreground/5 text-foreground/50'
                }`}>
                  {challenge.category}
                </span>
                <span className="text-[10px] text-foreground/40">
                  {challenge.description}
                </span>
              </div>
            </div>
          </div>

          {/* Completion button */}
          <AnimatePresence mode="wait">
            {isCompleted ? (
              <motion.div
                key="completed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center justify-center gap-2 py-2"
              >
                <motion.span
                  className="text-xl"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                >
                  ✅
                </motion.span>
                <span className="text-base font-bold text-green-700 dark:text-green-400">
                  Bravo ! Défi relevé ! 🌟
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="button"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                <Button
                  onClick={() => completeDailyChallenge(today)}
                  className="w-full rounded-xl py-3 text-sm font-bold"
                  style={{ background: 'linear-gradient(135deg, #C9A227, #E8D44D)', color: '#3D2C1E' }}
                >
                  ✅ Défi relevé ! (+2 ⭐)
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Weekly progress */}
          <div className="mt-4 pt-3 border-t border-foreground/5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-semibold text-foreground/50 uppercase tracking-wider">
                Cette semaine
              </p>
              <p className="text-[10px] font-bold text-foreground/60">
                {completedDays}/7 défis
              </p>
            </div>
            <div className="flex items-center gap-1">
              {weeklyProgress.map((day, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs transition-all ${
                      day.completed
                        ? 'bg-gradient-to-br from-green-300 to-emerald-400 shadow-sm shadow-green-200/50'
                        : day.isToday
                        ? 'bg-primary/15 border-2 border-primary/40 pulse-soft'
                        : 'bg-foreground/5'
                    }`}
                    animate={day.isToday && !day.completed ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {day.completed ? (
                      <span className="text-white text-[10px] font-bold">✓</span>
                    ) : (
                      <span className="text-[9px]">{day.emoji}</span>
                    )}
                  </motion.div>
                  <span className={`text-[8px] ${
                    day.isToday ? 'font-bold text-primary' : 'text-foreground/40'
                  }`}>
                    {day.dayShort}
                  </span>
                </div>
              ))}
            </div>

            {/* Streak message */}
            {completedDays >= 3 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-[10px] text-foreground/50 mt-2"
              >
                {completedDays === 7
                  ? '🌟 Semaine parfaite ! Tu es incroyable !'
                  : `🔥 ${completedDays} jours de suite ! Continue !`}
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
