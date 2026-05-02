'use client';

import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export default function MirrorInteraction() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const rippleId = useRef(0);
  const sparkleId = useRef(0);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = rippleId.current++;
    setRipples(prev => [...prev, { id, x, y }]);
    
    // Add sparkles around click point
    for (let i = 0; i < 5; i++) {
      const sx = x + (Math.random() - 0.5) * 80;
      const sy = y + (Math.random() - 0.5) * 80;
      const sid = sparkleId.current++;
      setSparkles(prev => [...prev, { id: sid, x: sx, y: sy }]);
    }

    // Clean up after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 2000);
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id >= id));
    }, 1500);
  }, []);

  // Auto-sparkle
  useEffect(() => {
    const interval = setInterval(() => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const sx = Math.random() * rect.width;
      const sy = Math.random() * rect.height;
      const sid = sparkleId.current++;
      setSparkles(prev => [...prev.slice(-20), { id: sid, x: sx, y: sy }]);
      setTimeout(() => {
        setSparkles(prev => prev.filter(s => s.id !== sid));
      }, 1500);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square max-w-[300px] mx-auto rounded-full bg-gradient-to-br from-yellow-200 via-amber-100 to-yellow-300 border-4 border-primary/50 shadow-lg shadow-primary/20 cursor-pointer overflow-hidden select-none"
      onClick={handleClick}
    >
      {/* Mirror shine */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none" />
      
      {/* Central reflection */}
      <div className="absolute inset-1/4 rounded-full bg-gradient-to-br from-white/40 to-amber-100/60 pointer-events-none flex items-center justify-center">
        <motion.span
          className="text-4xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          ✨
        </motion.span>
      </div>

      {/* Ripples */}
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full border-2 border-primary/40 pointer-events-none"
          style={{ left: ripple.x, top: ripple.y, transform: 'translate(-50%, -50%)' }}
          initial={{ width: 0, height: 0, opacity: 0.8 }}
          animate={{ width: 200, height: 200, opacity: 0 }}
          transition={{ duration: 2, ease: 'easeOut' }}
        />
      ))}

      {/* Sparkles */}
      {sparkles.map(sparkle => (
        <motion.span
          key={sparkle.id}
          className="absolute pointer-events-none text-primary text-sm"
          style={{ left: sparkle.x, top: sparkle.y }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5 }}
        >
          ✦
        </motion.span>
      ))}

      {/* Instructions */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-xs text-amber-800/70 font-medium">Touche le miroir ✨</p>
      </div>
    </div>
  );
}
