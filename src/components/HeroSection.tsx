'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import Image from 'next/image';
import AudioPlayer from './AudioPlayer';
import DailyInspiration from './DailyInspiration';
import WordOfTheDay from './WordOfTheDay';
import DailyChallenge from './DailyChallenge';
import MoodTracker from './MoodTracker';
import { useRef } from 'react';

// Pre-computed particle positions (deterministic, no Math.random() at render time)
const PARTICLE_POSITIONS = [
  { left: 36.2, top: 12.5, yMove: 25, duration: 3.2, delay: 0.4 },
  { left: 42.8, top: 28.1, yMove: 35, duration: 4.5, delay: 1.8 },
  { left: 50.1, top: 18.7, yMove: 20, duration: 3.8, delay: 0.9 },
  { left: 57.4, top: 35.2, yMove: 30, duration: 5.1, delay: 2.3 },
  { left: 38.9, top: 22.4, yMove: 28, duration: 3.5, delay: 0.2 },
  { left: 44.6, top: 38.1, yMove: 22, duration: 4.8, delay: 1.5 },
  { left: 52.3, top: 15.3, yMove: 32, duration: 3.1, delay: 2.7 },
  { left: 59.7, top: 26.8, yMove: 18, duration: 5.3, delay: 0.6 },
  { left: 40.3, top: 31.6, yMove: 26, duration: 4.2, delay: 1.1 },
  { left: 47.9, top: 19.9, yMove: 40, duration: 3.6, delay: 2.0 },
  { left: 55.6, top: 33.5, yMove: 24, duration: 4.9, delay: 0.8 },
  { left: 63.1, top: 24.2, yMove: 34, duration: 3.4, delay: 1.4 },
];

// Feature cards with themed border-left accents
const featureCards = [
  { emoji: '📖', label: '3 Aventures', desc: 'Explore des mondes magiques', gradient: 'from-amber-50 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-800/20', border: 'border-amber-200/50 dark:border-amber-700/30', textClass: 'text-gradient-gold', borderAccent: 'border-l-4 border-l-amber-400 dark:border-l-amber-500' },
  { emoji: '🎮', label: '7 Activités', desc: 'Joue et apprends en t\'amusant', gradient: 'from-teal-50 to-cyan-100 dark:from-teal-900/20 dark:to-cyan-800/20', border: 'border-teal-200/50 dark:border-teal-700/30', textClass: 'text-gradient-teal', borderAccent: 'border-l-4 border-l-teal-400 dark:border-l-teal-500' },
  { emoji: '🏅', label: '15 Badges', desc: 'Collecte des récompenses', gradient: 'from-pink-50 to-rose-100 dark:from-pink-900/20 dark:to-rose-800/20', border: 'border-pink-200/50 dark:border-pink-700/30', textClass: 'text-gradient-rose', borderAccent: 'border-l-4 border-l-rose-400 dark:border-l-rose-500' },
  { emoji: '🤲', label: 'Prière', desc: 'Apprends à prier avec le cœur', gradient: 'from-purple-50 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-800/20', border: 'border-purple-200/50 dark:border-purple-700/30', textClass: 'text-gradient-gold', borderAccent: 'border-l-4 border-l-purple-400 dark:border-l-purple-500' },
] as const;

export default function HeroSection() {
  const { setSection, totalStars, badges, userName } = useAppStore();
  const unlockedBadges = badges.filter(b => b.unlockedAt).length;

  const displayName = userName.trim() || 'petit voyageur';
  const welcomeText = `Bienvenue ${displayName} ! Tu vas découvrir un miroir magique qui reflète la lumière de ton cœur. Es-tu prêt pour l'aventure ?`;

  // Parallax scroll effect
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Mirror emoji moves slower (parallax foreground)
  const mirrorY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  // Background layers move at different speeds
  const bgY1 = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const bgY2 = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <div ref={containerRef} className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Gradient mesh background */}
      <motion.div className="absolute inset-0 z-0" style={{ y: bgY1 }}>
        <Image
          src="/images/magic-mirror-hero.png"
          alt="Miroir magique doré"
          fill
          sizes="(max-width: 640px) 100vw, 672px"
          className="object-cover opacity-10"
          priority
        />
        {/* Gradient mesh layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/60 via-background/80 to-background" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-amber-200/20 via-yellow-100/10 to-transparent rounded-full blur-3xl -translate-x-1/4 -translate-y-1/4" />
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-teal-200/15 via-cyan-100/10 to-transparent rounded-full blur-3xl translate-x-1/4" />
        <motion.div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] bg-gradient-to-tr from-pink-200/15 via-rose-100/10 to-transparent rounded-full blur-3xl translate-y-1/4" style={{ y: bgY2 }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-amber-100/10 via-transparent to-purple-100/10 rounded-full blur-3xl" />
      </motion.div>

      {/* Animated decorative circles */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 rounded-full bg-amber-200/10 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-40 right-10 w-40 h-40 rounded-full bg-teal-200/10 blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, delay: 2 }}
      />
      <motion.div
        className="absolute top-40 right-20 w-24 h-24 rounded-full bg-pink-200/10 blur-2xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      />

      {/* Particle/star effect behind the mirror (deterministic positions) */}
      {PARTICLE_POSITIONS.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-amber-300/40"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
          }}
          animate={{
            y: [0, -p.yMove, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Content — increased gaps between elements */}
      <div className="relative z-10 flex flex-col items-center gap-7 max-w-lg mx-auto">
        {/* Mirror emoji with parallax, shimmer effect, and glow ring */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="relative mirror-shimmer"
          style={{ y: mirrorY }}
        >
          {/* Glow ring - enhanced */}
          <motion.div
            className="absolute -inset-6 rounded-full bg-gradient-to-br from-amber-300/30 via-yellow-200/15 to-amber-400/30 blur-lg"
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="absolute -inset-3 rounded-full bg-gradient-to-tl from-teal-200/20 via-transparent to-pink-200/20 blur-md"
            animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          />
          <span className="text-7xl sm:text-8xl block">🪞</span>
          {/* Orbiting sparkles */}
          <motion.span
            className="absolute text-xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{ originX: '50%', originY: '150%' }}
          >
            ✨
          </motion.span>
          <motion.span
            className="absolute text-sm"
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            style={{ originX: '50%', originY: '200%' }}
          >
            ✦
          </motion.span>
        </motion.div>

        {/* Title — with more space below */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-2"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold shimmer-text">
            L&apos;Alchimie du Miroir
          </h1>
        </motion.div>

        {/* Subtitle — with more space below */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-xl sm:text-2xl font-semibold text-foreground/80 mb-2"
        >
          ✨ L&apos;Aventure des Petits Cœurs ✨
        </motion.p>

        {/* Welcome card with glass-card style and glow animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="w-full glass-card rounded-2xl p-5 sm:p-6 gradient-border card-hover welcome-glow"
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <p className="text-[10px] text-primary font-semibold uppercase tracking-wider">Message de bienvenue</p>
            <AudioPlayer text={welcomeText} size="sm" />
          </div>
          <p className="text-base sm:text-lg text-foreground/90 leading-relaxed">
            {welcomeText}
          </p>
        </motion.div>

        {/* CTA Button - enhanced with gradient and pulse */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setSection('aventures')}
          className="relative px-8 py-4 rounded-full text-lg sm:text-xl font-bold shadow-xl transition-all overflow-hidden pulse-gold"
          style={{
            background: 'linear-gradient(135deg, #C9A227, #E8D44D, #D4A853)',
            color: '#3D2C1E',
          }}
        >
          <span className="relative z-10">🌟 Commencer l&apos;Aventure 🌟</span>
          {/* Inner glow overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] animate-[shimmer_2s_linear_infinite]" />
          {/* Sparkle decorations */}
          <motion.span
            className="absolute -top-2 -right-2 text-lg"
            animate={{ scale: [0.5, 1.5, 0.5], rotate: [0, 180, 360] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✦
          </motion.span>
          <motion.span
            className="absolute -bottom-1 -left-2 text-sm"
            animate={{ scale: [1, 1.8, 1], rotate: [360, 180, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
          >
            ✦
          </motion.span>
        </motion.button>

        {/* Feature cards with themed border-left accents */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="grid grid-cols-4 gap-2 mt-1 w-full"
        >
          {featureCards.map((card, idx) => (
            <motion.div
              key={idx}
              className={`bg-gradient-to-br ${card.gradient} rounded-xl p-4 border ${card.border} ${card.borderAccent} text-center card-3d relative group`}
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-2xl sm:text-3xl block">{card.emoji}</span>
              <p className={`text-[10px] sm:text-xs font-bold mt-2 ${card.textClass}`}>{card.label}</p>
              {/* Hover description popup */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground/90 text-background text-[9px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                {card.desc}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground/90" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Daily Inspiration Card */}
        <DailyInspiration />

        {/* Mood Tracker */}
        <MoodTracker />

        {/* Daily Challenge Card */}
        <DailyChallenge />

        {/* Word of the Day in Arabic */}
        <WordOfTheDay />

        {/* Progress indicator if returning user */}
        {totalStars > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-4"
          >
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 px-3 py-1.5 rounded-full border border-amber-200/50 dark:border-amber-700/30 glow-gold">
              <span className="text-yellow-500 text-sm">⭐</span>
              <span className="text-sm font-bold text-gradient-gold">{totalStars}</span>
            </div>
            {unlockedBadges > 0 && (
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 px-3 py-1.5 rounded-full border border-rose-200/50 dark:border-rose-700/30">
                <span className="text-primary text-sm">🏅</span>
                <span className="text-sm font-bold text-gradient-rose">{unlockedBadges}</span>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Scroll-down indicator with animated hand emoji */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
      >
        <span className="text-[10px] text-muted-foreground font-medium">Découvrir</span>
        <motion.div
          className="hand-point-bounce"
        >
          <span className="text-2xl">👇</span>
        </motion.div>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg
            className="w-5 h-5 text-primary/60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
