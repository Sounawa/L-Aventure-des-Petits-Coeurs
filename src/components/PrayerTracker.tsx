'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const prayerNames = [
  { name: 'Fajr', emoji: '🌅', time: 'Aube' },
  { name: 'Dhuhr', emoji: '☀️', time: 'Midi' },
  { name: 'Asr', emoji: '🌤️', time: 'Après-midi' },
  { name: 'Maghrib', emoji: '🌅', time: 'Coucher' },
  { name: 'Isha', emoji: '🌙', time: 'Nuit' },
];

export default function PrayerTracker() {
  const [litStars, setLitStars] = useState<number[]>([]);

  const toggleStar = (index: number) => {
    setLitStars(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      return [...prev, index];
    });
  };

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <p className="text-sm text-muted-foreground text-center">
        Allume les étoiles pour chaque prière 🤲
      </p>
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {prayerNames.map((prayer, i) => {
          const isLit = litStars.includes(i);
          return (
            <button
              key={i}
              onClick={() => toggleStar(i)}
              className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-primary/5 transition-colors min-w-[56px]"
              aria-label={`${isLit ? 'Éteindre' : 'Allumer'} l'étoile de ${prayer.name}`}
            >
              <motion.span
                className="text-3xl sm:text-4xl block"
                animate={isLit ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                {isLit ? '⭐' : '☆'}
              </motion.span>
              <span className="text-lg">{prayer.emoji}</span>
              <span className={`text-xs font-medium ${isLit ? 'text-primary' : 'text-muted-foreground'}`}>
                {prayer.name}
              </span>
              <span className="text-[10px] text-muted-foreground">{prayer.time}</span>
            </button>
          );
        })}
      </div>
      <div className="text-center mt-2">
        <span className="text-sm font-medium">
          {litStars.length}/5 prières complétées
        </span>
        {litStars.length === 5 && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary font-bold mt-1"
          >
            🌟 Masha&apos;Allah ! Toutes les prières sont faites ! 🌟
          </motion.p>
        )}
      </div>
    </div>
  );
}
