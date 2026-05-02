'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StarRewardProps {
  /** Number of stars to animate */
  count: number;
  /** Whether the reward is currently active */
  isActive: boolean;
  /** Callback when animation completes */
  onComplete?: () => void;
  /** Position to fly stars from (relative to viewport) */
  originX?: number;
  originY?: number;
}

// Individual flying star component
function FlyingStar({ startX, startY, endX, endY, delay, onDone }: {
  startX: number; startY: number;
  endX: number; endY: number;
  delay: number; onDone: () => void;
}) {
  const [phase, setPhase] = useState<'flying' | 'arrived'>('flying');

  // Arc control point — create a nice parabolic arc
  const midX = (startX + endX) / 2 + (Math.random() - 0.5) * 80;
  const midY = Math.min(startY, endY) - 60 - Math.random() * 40;

  return (
    <motion.div
      className="fixed z-[100] pointer-events-none"
      initial={{
        left: startX,
        top: startY,
        scale: 0.3,
        opacity: 0,
      }}
      animate={{
        left: [startX, midX, endX],
        top: [startY, midY, endY],
        scale: [0.3, 1.2, 0.6],
        opacity: [0, 1, 1],
      }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
        times: [0, 0.5, 1],
      }}
      onAnimationComplete={() => {
        setPhase('arrived');
        onDone();
      }}
      style={{
        fontSize: '1.5rem',
        filter: phase === 'flying' ? 'drop-shadow(0 0 8px rgba(201, 162, 39, 0.6))' : 'none',
      }}
    >
      ⭐
    </motion.div>
  );
}

// Sparkle burst component
function SparkleBurst({ x, y }: { x: number; y: number }) {
  const sparkles = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    const distance = 20 + Math.random() * 30;
    return {
      id: i,
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance,
      size: 4 + Math.random() * 4,
    };
  });

  return (
    <div className="fixed z-[99] pointer-events-none" style={{ left: x, top: y }}>
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{
            width: s.size,
            height: s.size,
            background: 'linear-gradient(135deg, #E8D44D, #C9A227)',
            left: 0,
            top: 0,
          }}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{ x: s.dx, y: s.dy, scale: 0, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

// Floating "+N ⭐" text
function FloatingText({ x, y, count }: { x: number; y: number; count: number }) {
  return (
    <motion.div
      className="fixed z-[100] pointer-events-none font-bold text-lg"
      style={{
        left: x - 20,
        top: y - 30,
        color: '#C9A227',
        textShadow: '0 0 10px rgba(201, 162, 39, 0.5), 0 2px 4px rgba(0,0,0,0.1)',
      }}
      initial={{ opacity: 1, y: 0, scale: 0.8 }}
      animate={{ opacity: 0, y: -40, scale: 1.2 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      +{count} ⭐
    </motion.div>
  );
}

export default function StarReward({ count, isActive, onComplete, originX, originY }: StarRewardProps) {
  const [flyingStars, setFlyingStars] = useState<Array<{ id: number; startX: number; startY: number; endX: number; endY: number; delay: number }>>([]);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [floatingText, setFloatingText] = useState<{ x: number; y: number; count: number } | null>(null);
  const completedRef = useRef(0);
  const activeRef = useRef(false);

  // Get star counter position in the top bar
  const getStarCounterPos = useCallback(() => {
    const starEl = document.getElementById('guide-stars');
    if (starEl) {
      const rect = starEl.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    }
    // Fallback: top-right area
    return { x: window.innerWidth - 80, y: 20 };
  }, []);

  // Get origin position
  const getOriginPos = useCallback(() => {
    if (originX !== undefined && originY !== undefined) {
      return { x: originX, y: originY };
    }
    // Default: center of screen
    return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  }, [originX, originY]);

  useEffect(() => {
    if (!isActive || activeRef.current || count <= 0) return;

    activeRef.current = true;
    completedRef.current = 0;

    const origin = getOriginPos();
    const end = getStarCounterPos();

    // Create flying stars with staggered delays
    const stars = Array.from({ length: Math.min(count, 8) }, (_, i) => ({
      id: i,
      startX: origin.x + (Math.random() - 0.5) * 30,
      startY: origin.y + (Math.random() - 0.5) * 30,
      endX: end.x,
      endY: end.y,
      delay: i * 0.1,
    }));

    // Use requestAnimationFrame to defer setState outside the effect body
    // This avoids the React 19 cascading render warning
    const rafId = requestAnimationFrame(() => {
      setFlyingStars(stars);
      setSparkles([{ id: 0, x: origin.x, y: origin.y }]);
      setFloatingText({ x: origin.x, y: origin.y, count });
    });

    // Cleanup after animation
    const totalDuration = (stars.length * 0.1 + 0.8 + 0.3) * 1000;
    const timer = setTimeout(() => {
      setFlyingStars([]);
      setSparkles([]);
      setFloatingText(null);
      activeRef.current = false;
      onComplete?.();
    }, totalDuration);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, [isActive, count, getOriginPos, getStarCounterPos, onComplete]);

  const handleStarDone = useCallback(() => {
    completedRef.current++;
  }, []);

  return (
    <AnimatePresence>
      {/* Flying stars */}
      {flyingStars.map((star) => (
        <FlyingStar
          key={star.id}
          startX={star.startX}
          startY={star.startY}
          endX={star.endX}
          endY={star.endY}
          delay={star.delay}
          onDone={handleStarDone}
        />
      ))}

      {/* Sparkle bursts */}
      {sparkles.map((s) => (
        <SparkleBurst key={s.id} x={s.x} y={s.y} />
      ))}

      {/* Floating "+N ⭐" text */}
      {floatingText && (
        <FloatingText
          x={floatingText.x}
          y={floatingText.y}
          count={floatingText.count}
        />
      )}
    </AnimatePresence>
  );
}

// ---- useStarReward hook ----
// A convenient hook that other components can use to trigger star rewards
export function useStarReward() {
  const [rewardState, setRewardState] = useState<{
    isActive: boolean;
    count: number;
    originX: number;
    originY: number;
  }>({
    isActive: false,
    count: 0,
    originX: 0,
    originY: 0,
  });

  const triggerStarReward = useCallback((count: number, originElement?: HTMLElement | null) => {
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    if (originElement) {
      const rect = originElement.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }

    setRewardState({ isActive: true, count, originX: x, originY: y });
  }, []);

  const handleComplete = useCallback(() => {
    setRewardState(prev => ({ ...prev, isActive: false }));
  }, []);

  return {
    triggerStarReward,
    starRewardProps: {
      count: rewardState.count,
      isActive: rewardState.isActive,
      originX: rewardState.originX,
      originY: rewardState.originY,
      onComplete: handleComplete,
    },
  };
}
