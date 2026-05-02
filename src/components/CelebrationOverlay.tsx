'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  shape: 'circle' | 'square' | 'star';
  delay: number;
}

const confettiColors = [
  '#C9A227', '#2DD4BF', '#F472B6', '#A78BFA', '#FB923C',
  '#EF4444', '#22C55E', '#F59E0B', '#EC4899', '#8B5CF6',
];

function generateConfetti(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -10 - Math.random() * 20,
    rotation: Math.random() * 360,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    size: 6 + Math.random() * 8,
    shape: (['circle', 'square', 'star'] as const)[Math.floor(Math.random() * 3)],
    delay: Math.random() * 0.5,
  }));
}

interface CelebrationOverlayProps {
  isActive: boolean;
  message?: string;
  emoji?: string;
  duration?: number;
  onComplete?: () => void;
}

export default function CelebrationOverlay({
  isActive,
  message = 'Bravo !',
  emoji = '🌟',
  duration = 4000,
  onComplete,
}: CelebrationOverlayProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [showMessage, setShowMessage] = useState(false);

  const startCelebration = useCallback(() => {
    setPieces(generateConfetti(40));
    setTimeout(() => setShowMessage(true), 300);
  }, []);

  useEffect(() => {
    if (isActive) {
      startCelebration();
      const timer = setTimeout(() => {
        setPieces([]);
        setShowMessage(false);
        onComplete?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isActive, duration, onComplete, startCelebration]);

  return (
    <AnimatePresence>
      {isActive && pieces.length > 0 && (
        <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
          {/* Confetti pieces */}
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              className="absolute"
              style={{
                left: `${piece.x}%`,
                top: `${piece.y}%`,
                width: piece.size,
                height: piece.size,
              }}
              initial={{
                y: 0,
                x: 0,
                rotate: 0,
                opacity: 1,
              }}
              animate={{
                y: window.innerHeight + 50,
                x: (Math.random() - 0.5) * 200,
                rotate: piece.rotation + 720,
                opacity: [1, 1, 0.8, 0],
              }}
              transition={{
                duration: 3 + Math.random(),
                delay: piece.delay,
                ease: 'easeOut',
              }}
            >
              {piece.shape === 'circle' && (
                <div
                  className="w-full h-full rounded-full"
                  style={{ backgroundColor: piece.color }}
                />
              )}
              {piece.shape === 'square' && (
                <div
                  className="w-full h-full rounded-sm"
                  style={{
                    backgroundColor: piece.color,
                    transform: 'rotate(45deg)',
                  }}
                />
              )}
              {piece.shape === 'star' && (
                <span className="text-sm" style={{ color: piece.color }}>✦</span>
              )}
            </motion.div>
          ))}

          {/* Central message */}
          {showMessage && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-card/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-primary/30 text-center"
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <motion.span
                  className="text-5xl block mb-3"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1, repeat: 2 }}
                >
                  {emoji}
                </motion.span>
                <p className="text-xl font-bold text-primary">{message}</p>
              </motion.div>
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}

// Hook to trigger celebrations
export function useCelebration() {
  const [celebration, setCelebration] = useState<{
    active: boolean;
    message: string;
    emoji: string;
  }>({ active: false, message: '', emoji: '' });

  const triggerCelebration = (message: string, emoji: string = '🌟') => {
    setCelebration({ active: true, message, emoji });
    setTimeout(() => {
      setCelebration({ active: false, message: '', emoji: '' });
    }, 100);
  };

  return { celebration, triggerCelebration };
}
