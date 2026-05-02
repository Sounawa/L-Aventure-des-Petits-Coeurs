'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

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
  for (let i = 0; i < 30; i++) {
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

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            fontSize: `${star.size}px`,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.15, 0.5, 0.15],
            scale: [0.8, 1.1, 0.8],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: 'easeInOut',
          }}
        >
          <span className="text-amber-400/40">{star.emoji}</span>
        </motion.div>
      ))}
    </div>
  );
}
