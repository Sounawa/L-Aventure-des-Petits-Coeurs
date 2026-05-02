'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const DHIKR_OPTIONS = [
  {
    key: 'subhanallah',
    arabic: 'سُبْحَانَ ٱللَّٰهِ',
    transliteration: 'SubhanAllah',
    meaning: 'Gloire à Dieu',
    description: 'Chaque glorification purifie le cœur',
    color: 'from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30',
    border: 'border-amber-200/50 dark:border-amber-700/30',
    textColor: 'text-amber-700 dark:text-amber-300',
    beadColor: '#C9A227',
  },
  {
    key: 'alhamdulillah',
    arabic: 'ٱلْحَمْدُ لِلَّٰهِ',
    transliteration: 'Alhamdulillah',
    meaning: 'Louange à Dieu',
    description: 'Chaque remerciement remplit le cœur de lumière',
    color: 'from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30',
    border: 'border-teal-200/50 dark:border-teal-700/30',
    textColor: 'text-teal-700 dark:text-teal-300',
    beadColor: '#2DD4BF',
  },
  {
    key: 'allahuakbar',
    arabic: 'ٱللَّٰهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    meaning: 'Dieu est le plus Grand',
    description: 'Chaque proclamation élève l\'âme',
    color: 'from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30',
    border: 'border-rose-200/50 dark:border-rose-700/30',
    textColor: 'text-rose-700 dark:text-rose-300',
    beadColor: '#F472B6',
  },
];

const TOTAL_BEADS = 33;

export default function PrayerCounter() {
  const { prayerCounts, setPrayerCount, addStars, _hydrated } = useAppStore();
  const [selectedDhikr, setSelectedDhikr] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const completedRef = useRef(false);

  const dhikr = DHIKR_OPTIONS[selectedDhikr];
  const count = prayerCounts[dhikr.key] || 0;
  const progress = Math.min(count / TOTAL_BEADS, 1);

  const handleTap = useCallback(() => {
    if (count >= TOTAL_BEADS) return;

    const newCount = count + 1;
    setPrayerCount(dhikr.key, newCount);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 150);

    // Check completion
    if (newCount >= TOTAL_BEADS && !completedRef.current) {
      completedRef.current = true;
      setShowComplete(true);
      addStars(2);
    }
  }, [count, dhikr.key, setPrayerCount, addStars]);

  const handleReset = useCallback(() => {
    setPrayerCount(dhikr.key, 0);
    completedRef.current = false;
    setShowComplete(false);
  }, [dhikr.key, setPrayerCount]);

  const handleDhikrChange = useCallback((idx: number) => {
    setSelectedDhikr(idx);
    completedRef.current = false;
    setShowComplete(false);
  }, []);

  if (!_hydrated) return null;

  // Generate bead positions in a circle
  const beadRadius = 110;
  const centerX = 130;
  const centerY = 130;

  return (
    <div className="flex flex-col gap-4 py-4">
      {/* Dhikr selector */}
      <div className="flex gap-2">
        {DHIKR_OPTIONS.map((option, i) => (
          <motion.button
            key={option.key}
            onClick={() => handleDhikrChange(i)}
            className={`flex-1 px-3 py-2.5 rounded-xl text-center border-2 transition-all ${
              selectedDhikr === i
                ? `bg-gradient-to-br ${option.color} ${option.border} shadow-md`
                : 'bg-card border-border/30 hover:border-primary/30'
            }`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <p className="text-base sm:text-lg leading-tight" dir="rtl" style={{ fontFamily: "'Amiri', 'Noto Naskh Arabic', serif" }}>
              {option.arabic}
            </p>
            <p className={`text-[10px] sm:text-xs font-medium mt-0.5 ${
              selectedDhikr === i ? option.textColor : 'text-muted-foreground'
            }`}>
              {option.transliteration}
            </p>
          </motion.button>
        ))}
      </div>

      {/* Current dhikr info */}
      <motion.div
        key={dhikr.key}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r ${dhikr.color} rounded-xl p-3 border ${dhikr.border} text-center`}
      >
        <p className="text-2xl sm:text-3xl mb-1" dir="rtl" style={{ fontFamily: "'Amiri', 'Noto Naskh Arabic', serif" }}>
          {dhikr.arabic}
        </p>
        <p className={`text-sm font-bold ${dhikr.textColor}`}>{dhikr.meaning}</p>
        <p className="text-[10px] text-foreground/60 mt-0.5">{dhikr.description}</p>
      </motion.div>

      {/* Prayer bead circle */}
      <div className="flex justify-center">
        <div className="relative" style={{ width: 260, height: 260 }}>
          <svg
            viewBox="0 0 260 260"
            className="w-full h-full"
            style={{ touchAction: 'manipulation' }}
          >
            {/* Thread ring */}
            <circle
              cx={centerX}
              cy={centerY}
              r={beadRadius}
              fill="none"
              stroke="oklch(0.7 0.05 80 / 15%)"
              strokeWidth="3"
              className="dark:stroke-foreground/10"
            />

            {/* Beads */}
            {Array.from({ length: TOTAL_BEADS }).map((_, i) => {
              const angle = (i / TOTAL_BEADS) * 2 * Math.PI - Math.PI / 2;
              const bx = centerX + beadRadius * Math.cos(angle);
              const by = centerY + beadRadius * Math.sin(angle);
              const isCompleted = i < count;
              const isCurrent = i === count && count < TOTAL_BEADS;
              const beadR = isCurrent ? 7 : isCompleted ? 6 : 4.5;

              return (
                <motion.circle
                  key={i}
                  cx={bx}
                  cy={by}
                  r={beadR}
                  fill={isCompleted ? dhikr.beadColor : isCurrent ? dhikr.beadColor : 'oklch(0.85 0.03 80 / 40%)'}
                  stroke={isCurrent ? dhikr.beadColor : 'none'}
                  strokeWidth={isCurrent ? 2 : 0}
                  opacity={isCompleted ? 1 : isCurrent ? 0.9 : 0.3}
                  initial={isCompleted && i === count - 1 ? { scale: 0 } : {}}
                  animate={isCompleted && i === count - 1 ? { scale: 1 } : {}}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  className={isCurrent ? 'dark:fill-opacity-80' : ''}
                />
              );
            })}
          </svg>

          {/* Center tap area */}
          <motion.button
            onClick={handleTap}
            className="absolute inset-0 flex flex-col items-center justify-center rounded-full cursor-pointer focus:outline-none"
            style={{ touchAction: 'manipulation' }}
            whileTap={{ scale: 0.95 }}
            disabled={count >= TOTAL_BEADS}
            aria-label="Compter un dhikr"
          >
            <motion.div
              className={`w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-lg border-2 ${
                count >= TOTAL_BEADS
                  ? 'bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border-green-300 dark:border-green-600'
                  : 'bg-gradient-to-br from-white to-amber-50 dark:from-gray-800 dark:to-gray-900 border-amber-200 dark:border-amber-700/50'
              }`}
              animate={isAnimating ? { scale: [1, 0.92, 1.04, 1] } : {}}
              transition={{ duration: 0.15 }}
            >
              <motion.span
                className="text-3xl sm:text-4xl font-bold tabular-nums"
                style={{ color: count >= TOTAL_BEADS ? '#22c55e' : dhikr.beadColor }}
                key={count}
                initial={{ scale: 1.3, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              >
                {count >= TOTAL_BEADS ? '✓' : count}
              </motion.span>
              <span className="text-[10px] text-muted-foreground font-medium">
                / {TOTAL_BEADS}
              </span>
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${dhikr.beadColor}, ${dhikr.beadColor}88)` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Count display with beautiful typography */}
      <div className="text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={`${dhikr.key}-${count}`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className={`text-sm font-medium ${dhikr.textColor}`}
          >
            {count >= TOTAL_BEADS
              ? `✨ ${dhikr.transliteration} complété ! ✨`
              : count === 0
              ? `Touche le cercle pour commencer ${dhikr.transliteration}`
              : `${TOTAL_BEADS - count} ${dhikr.transliteration} restant${TOTAL_BEADS - count > 1 ? 's' : ''}`
            }
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Reset button */}
      {count > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="text-xs"
          >
            🔄 Recommencer
          </Button>
        </motion.div>
      )}

      {/* Completion celebration */}
      <AnimatePresence>
        {showComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`bg-gradient-to-br ${dhikr.color} rounded-2xl p-5 text-center border ${dhikr.border}`}
          >
            <motion.span
              className="text-5xl block mb-2"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              🤲
            </motion.span>
            <h3 className={`text-lg font-bold ${dhikr.textColor} mb-1`}>
              Macha&apos;Allah !
            </h3>
            <p className="text-sm text-foreground/70 mb-1">
              Tu as complété {TOTAL_BEADS} {dhikr.transliteration} !
            </p>
            <p className="text-xs text-primary font-medium">
              +2 étoiles gagnées ! ⭐
            </p>
            <Button
              onClick={() => {
                setShowComplete(false);
                completedRef.current = false;
              }}
              size="sm"
              className="mt-3 text-xs"
              style={{ background: 'linear-gradient(135deg, #C9A227, #E8D44D)', color: '#3D2C1E' }}
            >
              Continuer ✨
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
