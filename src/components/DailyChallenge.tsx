'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';

const dailyChallenges = [
  { day: 0, dayName: 'Lundi', emoji: '🌬️', text: "Fais 3 respirations calmes aujourd'hui", category: 'Respiration' },
  { day: 1, dayName: 'Mardi', emoji: '🙏', text: "Dis 'merci' à 3 personnes aujourd'hui", category: 'Gratitude' },
  { day: 2, dayName: 'Mercredi', emoji: '🌸', text: 'Fais un acte de gentillesse pour quelqu\'un', category: 'Gentillesse' },
  { day: 3, dayName: 'Jeudi', emoji: '💜', text: 'Écoute ton cœur pendant 2 minutes de silence', category: 'Méditation' },
  { day: 4, dayName: 'Vendredi', emoji: '🤲', text: 'Apprends une nouvelle prière aujourd\'hui', category: 'Prière' },
  { day: 5, dayName: 'Samedi', emoji: '🎨', text: 'Dessine quelque chose qui te rend heureux', category: 'Créativité' },
  { day: 6, dayName: 'Dimanche', emoji: '📖', text: 'Partage une belle histoire avec ta famille', category: 'Partage' },
];

const categoryColors: Record<string, string> = {
  Respiration: 'from-sky-100 to-cyan-100 dark:from-sky-900/20 dark:to-cyan-900/20 border-sky-200/50 dark:border-sky-700/30',
  Gratitude: 'from-amber-100 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200/50 dark:border-amber-700/30',
  Gentillesse: 'from-pink-100 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20 border-pink-200/50 dark:border-pink-700/30',
  Méditation: 'from-purple-100 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200/50 dark:border-purple-700/30',
  Prière: 'from-teal-100 to-emerald-100 dark:from-teal-900/20 dark:to-emerald-900/20 border-teal-200/50 dark:border-teal-700/30',
  Créativité: 'from-orange-100 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200/50 dark:border-orange-700/30',
  Partage: 'from-rose-100 to-pink-100 dark:from-rose-900/20 dark:to-pink-900/20 border-rose-200/50 dark:border-rose-700/30',
};

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

  const colorClass = categoryColors[challenge.category] || categoryColors.Respiration;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full"
    >
      <div className={`relative overflow-hidden rounded-2xl border-2 bg-gradient-to-br ${colorClass} p-5 sm:p-6`}>
        {/* Animated border glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.1), transparent, rgba(201, 162, 39, 0.1))',
            backgroundSize: '200% 200%',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🎯</span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/70">
              Défi du jour
            </h3>
            <span className="ml-auto text-xs font-medium text-foreground/50">
              {challenge.dayName}
            </span>
          </div>

          <div className="flex items-start gap-3 mb-4">
            <motion.span
              className="text-4xl sm:text-5xl flex-shrink-0"
              animate={isCompleted ? { scale: [1, 1.15, 1], rotate: [0, 10, -10, 0] } : {}}
              transition={{ duration: 1.5, repeat: isCompleted ? Infinity : 0, repeatDelay: 2 }}
            >
              {challenge.emoji}
            </motion.span>
            <div className="flex-1">
              <p className="text-lg sm:text-xl font-semibold text-foreground/90 leading-relaxed">
                {challenge.text}
              </p>
              <span className={`inline-block mt-2 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                isCompleted
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-foreground/5 text-foreground/50'
              }`}>
                {challenge.category}
              </span>
            </div>
          </div>

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
                  Bravo ! Tu as relevé le défi ! 🌟
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
        </div>
      </div>
    </motion.div>
  );
}
