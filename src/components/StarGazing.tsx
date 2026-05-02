'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const starPrayers = [
  { prayer: 'Ya Allah, protège ma famille', emoji: '🏠' },
  { prayer: 'Ya Allah, donne-moi la paix', emoji: '🕊️' },
  { prayer: 'Ya Allah, guide-moi', emoji: '🧭' },
  { prayer: 'Ya Allah, merci pour tout', emoji: '💛' },
  { prayer: 'Ya Allah, aide les enfants du monde', emoji: '🌍' },
  { prayer: 'Ya Allah, rends-moi courageux', emoji: '⭐' },
  { prayer: 'Ya Allah, remplis mon cœur d\'amour', emoji: '❤️' },
  { prayer: 'Ya Allah, pardonne-moi', emoji: '🌸' },
];

interface Star {
  id: number;
  x: number;
  y: number;
  revealed: boolean;
  prayerIndex: number;
}

export default function StarGazing() {
  const [stars] = useState<Star[]>(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 70,
      revealed: false,
      prayerIndex: i,
    }));
  });
  const [revealedStars, setRevealedStars] = useState<Set<number>>(new Set());
  const [activePrayer, setActivePrayer] = useState<{ prayer: string; emoji: string } | null>(null);

  const handleStarClick = (starId: number) => {
    setRevealedStars(prev => new Set([...prev, starId]));
    const star = stars.find(s => s.id === starId);
    if (star) {
      setActivePrayer(starPrayers[star.prayerIndex]);
      setTimeout(() => setActivePrayer(null), 3000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <p className="text-sm text-muted-foreground text-center">
        Touche les étoiles pour découvrir des prières 🌙
      </p>

      {/* Night sky */}
      <div className="relative w-full max-w-md aspect-[4/3] bg-gradient-to-b from-indigo-900 via-indigo-800 to-purple-900 rounded-2xl overflow-hidden">
        {/* Moon */}
        <motion.div
          className="absolute top-4 right-6 text-4xl"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          🌙
        </motion.div>

        {/* Small background stars */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={`bg-${i}`}
            className="absolute w-1 h-1 bg-white/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}

        {/* Interactive stars */}
        {stars.map((star) => {
          const isRevealed = revealedStars.has(star.id);
          return (
            <motion.button
              key={star.id}
              className="absolute text-2xl focus:outline-none"
              style={{ left: `${star.x}%`, top: `${star.y}%` }}
              onClick={() => handleStarClick(star.id)}
              animate={isRevealed ? { scale: [1, 1.5, 1] } : { opacity: [0.5, 1, 0.5] }}
              transition={isRevealed ? { duration: 0.5 } : { duration: 2, repeat: Infinity, delay: star.id * 0.3 }}
              aria-label={`Étoile ${star.id + 1}`}
            >
              {isRevealed ? '⭐' : '✦'}
            </motion.button>
          );
        })}
      </div>

      {/* Active prayer display */}
      {activePrayer && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="bg-indigo-900/10 rounded-2xl p-4 text-center max-w-sm w-full border border-indigo-200"
        >
          <span className="text-2xl">{activePrayer.emoji}</span>
          <p className="text-sm font-medium mt-2">{activePrayer.prayer}</p>
        </motion.div>
      )}

      <p className="text-xs text-muted-foreground">
        {revealedStars.size}/8 étoiles découvertes
      </p>
    </div>
  );
}
