'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'idle';

const phaseConfig = {
  inhale: { duration: 4, label: 'Inspire...', emoji: '🌬️', color: 'from-amber-200 to-yellow-300' },
  hold: { duration: 2, label: 'Tiens...', emoji: '⏸️', color: 'from-teal-200 to-cyan-300' },
  exhale: { duration: 6, label: 'Expire...', emoji: '💨', color: 'from-purple-200 to-indigo-300' },
  idle: { duration: 0, label: 'Appuie pour commencer', emoji: '🧘', color: 'from-amber-100 to-yellow-200' },
};

export default function BreathingExercise() {
  const [phase, setPhase] = useState<BreathPhase>('idle');
  const [breathCount, setBreathCount] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (phase === 'idle') return;
    
    const config = phaseConfig[phase];
    const interval = 50;
    const steps = (config.duration * 1000) / interval;
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      setProgress(step / steps);
      
      if (step >= steps) {
        clearInterval(timer);
        setProgress(0);
        
        if (phase === 'inhale') {
          setPhase('hold');
        } else if (phase === 'hold') {
          setPhase('exhale');
        } else if (phase === 'exhale') {
          setBreathCount(prev => prev + 1);
          setPhase('inhale');
        }
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [phase]);

  const start = () => {
    setPhase('inhale');
  };

  const stop = () => {
    setPhase('idle');
    setProgress(0);
  };

  const config = phaseConfig[phase];
  const isActive = phase !== 'idle';
  
  // Circle size based on phase
  const circleScale = phase === 'inhale' ? 0.6 + progress * 0.4 : 
                      phase === 'hold' ? 1 :
                      phase === 'exhale' ? 1 - progress * 0.4 :
                      0.7;

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-center text-foreground/70">
        Respiration magique 4-2-6 🌬️
      </p>
      
      {/* Breathing circle */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Outer glow */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-200/30 to-yellow-300/30 blur-xl"
          animate={{ scale: circleScale * 1.1 }}
          transition={{ duration: 0.1 }}
        />
        
        {/* Main circle */}
        <motion.div
          className={`relative w-full h-full rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center shadow-lg border-4 border-white/50`}
          animate={{ scale: circleScale }}
          transition={{ duration: 0.1 }}
        >
          <div className="text-center">
            <motion.span 
              className="text-3xl block"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {config.emoji}
            </motion.span>
            <p className="text-sm font-bold text-foreground/80 mt-1">
              {config.label}
            </p>
          </div>
        </motion.div>
        
        {/* Progress ring */}
        {isActive && (
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
            <circle
              cx="100" cy="100" r="95"
              fill="none"
              stroke="oklch(0.55 0.12 80 / 20%)"
              strokeWidth="3"
            />
            <circle
              cx="100" cy="100" r="95"
              fill="none"
              stroke="oklch(0.55 0.12 80)"
              strokeWidth="3"
              strokeDasharray={`${2 * Math.PI * 95}`}
              strokeDashoffset={`${2 * Math.PI * 95 * (1 - progress)}`}
              strokeLinecap="round"
              className="transition-all duration-100"
            />
          </svg>
        )}
      </div>

      {/* Breath counter */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Respirations :</span>
        <span className="text-lg font-bold text-primary">{breathCount}</span>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        {!isActive ? (
          <Button onClick={start} className="bg-primary hover:bg-primary/90">
            🧘 Commencer
          </Button>
        ) : (
          <Button onClick={stop} variant="outline">
            ⏹️ Arrêter
          </Button>
        )}
      </div>

      {breathCount >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/10 rounded-xl p-3 text-center border border-primary/20"
        >
          <p className="text-sm font-medium text-primary">
            🌟 Bravo ! Tu respires calmement. Sents-tu la paix dans ton cœur ?
          </p>
        </motion.div>
      )}
    </div>
  );
}

function Button({ children, onClick, className = '', variant = 'default' }: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'outline';
}) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
        variant === 'outline'
          ? 'border-2 border-border bg-card hover:bg-muted text-foreground'
          : 'bg-primary text-primary-foreground hover:opacity-90 shadow-md'
      } ${className}`}
    >
      {children}
    </button>
  );
}
