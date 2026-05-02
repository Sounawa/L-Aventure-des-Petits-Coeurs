'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const steps = ['welcome', 'name', 'greet'] as const;
type Step = (typeof steps)[number];

export default function OnboardingFlow() {
  const { userName, _hydrated, setUserName } = useAppStore();
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [inputName, setInputName] = useState('');

  // Don't show if already onboarded or not hydrated yet
  if (!_hydrated || userName.trim() !== '') return null;

  const handleNameSubmit = () => {
    const trimmed = inputName.trim();
    if (trimmed.length > 0) {
      setCurrentStep('greet');
      // Auto-dismiss after showing greeting
      setTimeout(() => {
        setUserName(trimmed);
      }, 2500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 dark:from-[oklch(0.15_0.03_280)] dark:via-[oklch(0.18_0.04_280)] dark:to-[oklch(0.20_0.05_280)]" />

        {/* Floating decorative elements */}
        <motion.div
          className="absolute top-16 left-8 text-4xl"
          animate={{ y: [0, -12, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          ✨
        </motion.div>
        <motion.div
          className="absolute top-24 right-12 text-3xl"
          animate={{ y: [0, -8, 0], rotate: [0, -15, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
          🌙
        </motion.div>
        <motion.div
          className="absolute bottom-32 left-16 text-2xl"
          animate={{ y: [0, -10, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          ⭐
        </motion.div>
        <motion.div
          className="absolute bottom-40 right-8 text-3xl"
          animate={{ y: [0, -6, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        >
          💫
        </motion.div>
        <motion.div
          className="absolute top-1/3 left-6 text-2xl"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        >
          🌸
        </motion.div>
        <motion.div
          className="absolute top-1/2 right-6 text-2xl"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        >
          🕊️
        </motion.div>

        {/* Large blurred circles for atmosphere */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-amber-200/20 dark:bg-amber-400/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-teal-200/15 dark:bg-teal-400/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-rose-200/10 dark:bg-rose-400/5 blur-3xl" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-md mx-4">
          <AnimatePresence mode="wait">
            {/* Step 1: Welcome */}
            {currentStep === 'welcome' && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, scale: 0.8, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -40 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="flex flex-col items-center text-center gap-6"
              >
                {/* Mirror emoji */}
                <motion.div
                  className="relative"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 150, damping: 12, delay: 0.3 }}
                >
                  <motion.div
                    className="absolute -inset-6 rounded-full bg-gradient-to-br from-amber-300/30 via-yellow-200/20 to-amber-400/30 blur-lg"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <span className="text-8xl sm:text-9xl block">🪞</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <h1 className="text-3xl sm:text-4xl font-bold text-amber-800 dark:text-amber-200 mb-3">
                    Bienvenue petit voyageur ! 🌟
                  </h1>
                  <p className="text-lg text-amber-700/80 dark:text-amber-200/70 max-w-sm mx-auto leading-relaxed">
                    Un miroir magique t&apos;attend. Il reflète la lumière de ton cœur et te révélera des trésors merveilleux...
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <Button
                    onClick={() => setCurrentStep('name')}
                    className="px-8 py-6 text-lg rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg glow-gold"
                    size="lg"
                  >
                    ✨ Commencer l&apos;aventure ✨
                  </Button>
                </motion.div>
              </motion.div>
            )}

            {/* Step 2: Name Input */}
            {currentStep === 'name' && (
              <motion.div
                key="name"
                initial={{ opacity: 0, scale: 0.8, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -40 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="flex flex-col items-center text-center gap-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 150, damping: 12 }}
                >
                  <span className="text-6xl sm:text-7xl block">💫</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-2xl sm:text-3xl font-bold text-amber-800 dark:text-amber-200 mb-2">
                    Comment tu t&apos;appelles ? 😊
                  </h2>
                  <p className="text-amber-700/70 dark:text-amber-200/60">
                    Dis-moi ton prénom pour que le miroir te connaisse !
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="w-full max-w-xs"
                >
                  <Input
                    type="text"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ton prénom..."
                    className="text-center text-xl py-6 px-6 rounded-2xl border-2 border-amber-300 dark:border-amber-600 bg-white/80 dark:bg-white/10 backdrop-blur-sm focus-visible:border-amber-500 focus-visible:ring-amber-500/30 placeholder:text-amber-400 dark:placeholder:text-amber-300/50 text-amber-900 dark:text-amber-100"
                    autoFocus
                    maxLength={30}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Button
                    onClick={handleNameSubmit}
                    disabled={inputName.trim().length === 0}
                    className="px-8 py-5 text-lg rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                    size="lg"
                  >
                    C&apos;est moi ! 🌟
                  </Button>
                </motion.div>
              </motion.div>
            )}

            {/* Step 3: Personalized Greeting */}
            {currentStep === 'greet' && (
              <motion.div
                key="greet"
                initial={{ opacity: 0, scale: 0.8, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="flex flex-col items-center text-center gap-6"
              >
                {/* Sparkle burst animation */}
                {[...Array(8)].map((_, i) => (
                  <motion.span
                    key={i}
                    className="absolute text-2xl"
                    initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                    animate={{
                      opacity: [1, 0],
                      scale: [0, 1.5],
                      x: Math.cos((i * Math.PI) / 4) * 120,
                      y: Math.sin((i * Math.PI) / 4) * 120,
                    }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  >
                    ✨
                  </motion.span>
                ))}

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 150, damping: 10 }}
                >
                  <span className="text-7xl sm:text-8xl block">🌟</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-2xl sm:text-3xl font-bold text-amber-800 dark:text-amber-200 mb-2">
                    Enchanté {inputName.trim()} ! 🤗
                  </h2>
                  <p className="text-lg text-amber-700/80 dark:text-amber-200/70 max-w-sm mx-auto leading-relaxed">
                    Ton aventure commence maintenant... Le miroir magique t&apos;attend pour révéler les trésors de ton cœur ! 💛
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center gap-2"
                >
                  <div className="h-1 w-24 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 animate-pulse" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step indicator dots */}
          <div className="flex justify-center gap-2 mt-8">
            {steps.map((step, i) => (
              <motion.div
                key={step}
                className="w-2.5 h-2.5 rounded-full"
                animate={{
                  backgroundColor:
                    steps.indexOf(currentStep) >= i
                      ? '#C9A227' // primary gold
                      : 'rgba(201, 162, 39, 0.25)',
                  scale: steps.indexOf(currentStep) === i ? 1.3 : 1,
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
