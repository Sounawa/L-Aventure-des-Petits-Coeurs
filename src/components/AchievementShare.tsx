'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check, Trophy, Star, BookOpen, Flame } from 'lucide-react';

export default function AchievementShare() {
  const { totalStars, badges, chaptersProgress, currentStreak, userName } = useAppStore();
  const [copied, setCopied] = useState(false);

  const unlockedBadges = badges.filter(b => b.unlockedAt).length;
  const chaptersRead = Object.values(chaptersProgress).filter(c => c.read).length;

  const shareText = `🌟 J'ai gagné ${totalStars} étoile${totalStars !== 1 ? 's' : ''} et ${unlockedBadges} badge${unlockedBadges !== 1 ? 's' : ''} dans L'Aventure des Petits Cœurs !${currentStreak > 0 ? ` 🔥 ${currentStreak} jour${currentStreak !== 1 ? 's' : ''} de suite !` : ''} Viens rejoindre l'aventure ! ✨`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'L\'Aventure des Petits Cœurs',
          text: shareText,
        });
      } catch {
        // User cancelled or error — ignore
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Clipboard API not available
      }
    }
  };

  const stats = [
    { emoji: '⭐', icon: Star, value: totalStars, label: 'Étoiles', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { emoji: '🏅', icon: Trophy, value: unlockedBadges, label: 'Badges', color: 'text-primary', bg: 'bg-primary/5' },
    { emoji: '📖', icon: BookOpen, value: chaptersRead, label: 'Chapitres', color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-900/20' },
    { emoji: '🔥', icon: Flame, value: currentStreak, label: 'Jours de suite', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl overflow-hidden shadow-lg"
    >
      {/* Gradient border wrapper */}
      <div className="p-[2px] rounded-2xl bg-gradient-to-r from-amber-400 via-primary to-rose-400">
        <div className="bg-card rounded-2xl overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-primary p-4 text-center relative overflow-hidden">
            {/* Trophy decoration */}
            <motion.span
              className="text-4xl block mb-1"
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
            >
              🏆
            </motion.span>
            <h3 className="text-base font-bold text-amber-950">
              {userName ? `Les progrès de ${userName}` : 'Mes Progrès'}
            </h3>
            {/* Decorative sparkles */}
            <span className="absolute top-2 left-3 text-xs opacity-60">✨</span>
            <span className="absolute bottom-2 right-3 text-xs opacity-60">✨</span>
            <span className="absolute top-3 right-8 text-xs opacity-40">⭐</span>
            <span className="absolute bottom-3 left-8 text-xs opacity-40">⭐</span>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-2 p-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + idx * 0.1, type: 'spring', stiffness: 300, damping: 20 }}
                className={`${stat.bg} rounded-xl p-3 text-center`}
              >
                <span className="text-xl block mb-1">{stat.emoji}</span>
                <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-[10px] text-muted-foreground font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Share button */}
          <div className="px-4 pb-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleShare}
                className="w-full bg-gradient-to-r from-amber-500 to-primary hover:from-amber-600 hover:to-primary/90 text-white font-bold py-3 rounded-xl shadow-md h-auto"
              >
                {copied ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Copié !
                  </motion.span>
                ) : (
                  <span className="flex items-center gap-2">
                    {navigator.share ? (
                      <Share2 className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    Partager mes progrès
                  </span>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
