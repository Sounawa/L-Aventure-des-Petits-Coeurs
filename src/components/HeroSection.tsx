'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import Image from 'next/image';
import AudioPlayer from './AudioPlayer';
import DailyInspiration from './DailyInspiration';
import WordOfTheDay from './WordOfTheDay';

export default function HeroSection() {
  const { setSection, totalStars, badges, userName } = useAppStore();
  const unlockedBadges = badges.filter(b => b.unlockedAt).length;

  const displayName = userName.trim() || 'petit voyageur';
  const welcomeText = `Bienvenue ${displayName} ! Tu vas découvrir un miroir magique qui reflète la lumière de ton cœur. Es-tu prêt pour l'aventure ?`;

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 z-0">
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
        <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] bg-gradient-to-tr from-pink-200/15 via-rose-100/10 to-transparent rounded-full blur-3xl translate-y-1/4" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-amber-100/10 via-transparent to-purple-100/10 rounded-full blur-3xl" />
      </div>

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

      {/* Particle/star effect behind the mirror */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-amber-300/40"
          style={{
            left: `${35 + Math.random() * 30}%`,
            top: `${10 + Math.random() * 30}%`,
          }}
          animate={{
            y: [0, -20 - Math.random() * 30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-5 max-w-lg mx-auto">
        {/* Mirror emoji with animation and glow ring */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="relative"
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

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold shimmer-text">
            L&apos;Alchimie du Miroir
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-xl sm:text-2xl font-semibold text-foreground/80"
        >
          ✨ L&apos;Aventure des Petits Cœurs ✨
        </motion.p>

        {/* Welcome card with glass-card style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="w-full glass-card rounded-2xl p-5 sm:p-6 gradient-border card-hover"
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

        {/* Feature cards - more visually appealing with gradients */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="grid grid-cols-4 gap-2 mt-2 w-full"
        >
          <motion.div
            className="bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-800/20 rounded-xl p-3 border border-amber-200/50 dark:border-amber-700/30 text-center card-hover-enhanced"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-2xl sm:text-3xl block">📖</span>
            <p className="text-[10px] sm:text-xs font-bold mt-1.5 text-gradient-gold">3 Aventures</p>
          </motion.div>
          <motion.div
            className="bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-teal-900/20 dark:to-cyan-800/20 rounded-xl p-3 border border-teal-200/50 dark:border-teal-700/30 text-center card-hover-enhanced"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-2xl sm:text-3xl block">🎮</span>
            <p className="text-[10px] sm:text-xs font-bold mt-1.5 text-gradient-teal">6 Activités</p>
          </motion.div>
          <motion.div
            className="bg-gradient-to-br from-pink-50 to-rose-100 dark:from-pink-900/20 dark:to-rose-800/20 rounded-xl p-3 border border-pink-200/50 dark:border-pink-700/30 text-center card-hover-enhanced"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-2xl sm:text-3xl block">🏅</span>
            <p className="text-[10px] sm:text-xs font-bold mt-1.5 text-gradient-rose">14 Badges</p>
          </motion.div>
          <motion.div
            className="bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-800/20 rounded-xl p-3 border border-purple-200/50 dark:border-purple-700/30 text-center card-hover-enhanced"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-2xl sm:text-3xl block">🤲</span>
            <p className="text-[10px] sm:text-xs font-bold mt-1.5 text-gradient-gold">Prière</p>
          </motion.div>
        </motion.div>

        {/* Daily Inspiration Card */}
        <DailyInspiration />

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
    </div>
  );
}
