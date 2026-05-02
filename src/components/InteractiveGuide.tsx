'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';

interface GuideStep {
  targetId: string;
  title: string;
  message: string;
  emoji: string;
  position: 'top' | 'bottom';
}

const guideSteps: GuideStep[] = [
  {
    targetId: 'guide-nav-activites',
    title: 'Tes Activités',
    message: 'Ici tu trouveras toutes tes activités !',
    emoji: '🎮',
    position: 'top',
  },
  {
    targetId: 'guide-stars',
    title: 'Tes Étoiles',
    message: 'Chaque activité te donne des étoiles !',
    emoji: '⭐',
    position: 'bottom',
  },
  {
    targetId: 'guide-badges',
    title: 'Tes Badges',
    message: 'Complète des défis pour gagner des badges !',
    emoji: '🏅',
    position: 'bottom',
  },
  {
    targetId: 'guide-darkmode',
    title: 'Mode Nuit',
    message: 'Tu peux activer le mode nuit pour lire le soir !',
    emoji: '🌙',
    position: 'bottom',
  },
];

function Sparkle({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.span
      className="absolute text-sm pointer-events-none select-none"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0, rotate: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1.2, 0],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 1.5,
        delay,
        repeat: Infinity,
        repeatDelay: 1,
      }}
    >
      ✨
    </motion.span>
  );
}

export default function InteractiveGuide() {
  const { userName, guideShown, setGuideShown, _hydrated } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (_hydrated && userName && !guideShown) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [_hydrated, userName, guideShown]);

  useEffect(() => {
    if (!isVisible) return;
    const step = guideSteps[currentStep];
    if (!step) return;

    const handleUpdate = () => {
      const el = document.getElementById(step.targetId);
      if (el) {
        setTargetRect(el.getBoundingClientRect());
      }
    };

    handleUpdate();
    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate, true);
    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate, true);
    };
  }, [currentStep, isVisible]);

  const handleNext = () => {
    if (currentStep < guideSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSkip();
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    setGuideShown();
  };

  // Auto-dismiss after 20 seconds if user doesn't interact
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => {
      setIsVisible(false);
      setGuideShown();
    }, 20000);
    return () => clearTimeout(timer);
  }, [isVisible, setGuideShown]);

  if (!isVisible || !targetRect) return null;

  const step = guideSteps[currentStep];
  const tooltipWidth = 280;
  const padding = 16;

  const tooltipLeft = Math.max(8, Math.min(
    targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
    window.innerWidth - tooltipWidth - 8
  ));

  const tooltipTop = step.position === 'top'
    ? targetRect.top - padding - 10
    : targetRect.bottom + padding + 10;

  const arrowX = targetRect.left + targetRect.width / 2 - tooltipLeft;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay with cutout */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90]"
            onClick={handleSkip}
          >
            <div
              style={{
                position: 'fixed',
                left: targetRect.left - 6,
                top: targetRect.top - 6,
                width: targetRect.width + 12,
                height: targetRect.height + 12,
                borderRadius: 12,
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.3)',
                zIndex: 91,
                pointerEvents: 'none',
              }}
              className="border-2 border-amber-400 dark:border-amber-300"
            />
            <motion.div
              style={{
                position: 'fixed',
                left: targetRect.left - 8,
                top: targetRect.top - 8,
                width: targetRect.width + 16,
                height: targetRect.height + 16,
                borderRadius: 14,
                zIndex: 92,
                pointerEvents: 'none',
              }}
              animate={{
                boxShadow: [
                  '0 0 8px 2px rgba(251, 191, 36, 0.3)',
                  '0 0 16px 4px rgba(251, 191, 36, 0.5)',
                  '0 0 8px 2px rgba(251, 191, 36, 0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          {/* Tooltip */}
          <motion.div
            key={`tooltip-${currentStep}`}
            initial={{ opacity: 0, scale: 0.8, y: step.position === 'top' ? 10 : -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            style={{
              position: 'fixed',
              left: tooltipLeft,
              top: tooltipTop,
              transform: step.position === 'top' ? 'translateY(-100%)' : undefined,
              zIndex: 95,
              width: tooltipWidth,
            }}
          >
            {/* Arrow */}
            <div
              style={{
                position: 'absolute',
                left: Math.max(20, Math.min(arrowX, tooltipWidth - 20)),
                ...(step.position === 'top'
                  ? { bottom: -8 }
                  : { top: -8 }),
                transform: 'translateX(-50%) rotate(45deg)',
              }}
              className="w-4 h-4 bg-amber-400 dark:bg-amber-500"
            />

            {/* Tooltip content */}
            <div className="bg-amber-400 dark:bg-amber-500 rounded-2xl p-5 shadow-xl relative overflow-hidden">
              <Sparkle x={8} y={8} delay={0} />
              <Sparkle x={245} y={5} delay={0.3} />
              <Sparkle x={12} y={85} delay={0.6} />
              <Sparkle x={250} y={90} delay={0.9} />
              <Sparkle x={130} y={3} delay={0.4} />

              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{step.emoji}</span>
                <h3 className="text-base font-bold text-amber-900 dark:text-amber-950">
                  {step.title}
                </h3>
              </div>

              <p className="text-sm font-medium text-amber-900/80 dark:text-amber-950/80 mb-4 leading-relaxed">
                {step.message}
              </p>

              <div className="flex items-center justify-between">
                <button
                  onClick={handleSkip}
                  className="text-xs font-semibold text-amber-900/60 dark:text-amber-950/60 hover:text-amber-900 dark:hover:text-amber-950 transition-colors px-2 py-1"
                >
                  Passer
                </button>
                <motion.button
                  onClick={handleNext}
                  className="bg-amber-900 dark:bg-amber-950 text-amber-100 dark:text-amber-200 px-5 py-2 rounded-xl text-sm font-bold shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {currentStep < guideSteps.length - 1 ? 'Suivant' : "C'est parti ! ✨"}
                </motion.button>
              </div>

              <div className="flex items-center justify-center gap-2 mt-3">
                {guideSteps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`rounded-full transition-all duration-300 ${
                      idx === currentStep
                        ? 'w-6 h-2 bg-amber-900/60 dark:bg-amber-950/60'
                        : 'w-2 h-2 bg-amber-900/25 dark:bg-amber-950/25'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
