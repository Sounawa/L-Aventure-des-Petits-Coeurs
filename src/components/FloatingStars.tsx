'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useAppStore } from '@/lib/store';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  emoji: string;
}

const starEmojis = ['✦', '✧', '⭐', '✨', '·'];

/**
 * Seeded pseudo-random number generator using a Linear Congruential Generator.
 * This ensures deterministic output, avoiding hydration mismatches.
 */
function createSeededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

const SEED = 42;

function generateStars(): Star[] {
  const random = createSeededRandom(SEED);
  const generated: Star[] = [];
  for (let i = 0; i < 12; i++) {
    generated.push({
      id: i,
      x: random() * 100,
      y: random() * 100,
      size: random() * 14 + 6,
      duration: random() * 5 + 3,
      delay: random() * 4,
      emoji: starEmojis[Math.floor(random() * starEmojis.length)],
    });
  }
  return generated;
}

export default function FloatingStars() {
  const stars = useMemo(() => generateStars(), []);
  const { bedtimeMode } = useAppStore();

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            fontSize: `${bedtimeMode ? star.size * 1.3 : star.size}px`,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: bedtimeMode
              ? [0.3, 0.9, 0.3]
              : [0.15, 0.5, 0.15],
            scale: bedtimeMode
              ? [0.8, 1.3, 0.8]
              : [0.8, 1.1, 0.8],
          }}
          transition={{
            duration: bedtimeMode ? star.duration * 1.5 : star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: 'easeInOut',
          }}
        >
          <span className={bedtimeMode ? 'text-amber-300/70' : 'text-amber-400/40'}>{star.emoji}</span>
        </motion.div>
      ))}
    </div>
  );
}
