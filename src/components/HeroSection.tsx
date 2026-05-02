'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import Image from 'next/image';
import AudioPlayer from './AudioPlayer';
import DailyInspiration from './DailyInspiration';

export default function HeroSection() {
  const { setSection, totalStars, badges, userName } = useAppStore();
  const unlockedBadges = badges.filter(b => b.unlockedAt).length;

  const displayName = userName.trim() || 'petit voyageur';
  const welcomeText = `Bienvenue ${displayName} ! Tu vas découvrir un miroir magique qui reflète la lumière de ton cœur. Es-tu prêt pour l'aventure ?`;

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/magic-mirror-hero.png"
          alt="Miroir magique doré"
          fill
          sizes="(max-width: 640px) 100vw, 672px"
          className="object-cover opacity-15"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
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

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-5 max-w-lg mx-auto">
        {/* Mirror emoji with animation and glow ring */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="relative"
        >
          {/* Glow ring */}
          <motion.div
            className="absolute -inset-4 rounded-full bg-gradient-to-br from-amber-300/20 via-yellow-200/10 to-amber-400/20 blur-md"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
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

        {/* Welcome card with audio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="w-full bg-card/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-lg border border-primary/20 card-hover"
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <p className="text-[10px] text-primary font-semibold uppercase tracking-wider">Message de bienvenue</p>
            <AudioPlayer text={welcomeText} size="sm" />
          </div>
          <p className="text-base sm:text-lg text-foreground/90 leading-relaxed">
            {welcomeText}
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSection('aventures')}
          className="relative px-8 py-4 bg-primary text-primary-foreground rounded-full text-lg sm:text-xl font-bold shadow-lg glow-gold glow-gold-hover transition-all"
        >
          <span className="relative z-10">🌟 Commencer l&apos;Aventure 🌟</span>
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

        {/* Feature cards - enhanced with more detail */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="grid grid-cols-4 gap-2 mt-2 w-full"
        >
          <div className="bg-card/60 backdrop-blur-sm rounded-xl p-2.5 border border-primary/10 text-center card-hover">
            <span className="text-xl sm:text-2xl block">📖</span>
            <p className="text-[10px] sm:text-xs font-semibold mt-1">3 Aventures</p>
          </div>
          <div className="bg-card/60 backdrop-blur-sm rounded-xl p-2.5 border border-secondary/10 text-center card-hover">
            <span className="text-xl sm:text-2xl block">🎮</span>
            <p className="text-[10px] sm:text-xs font-semibold mt-1">6 Activités</p>
          </div>
          <div className="bg-card/60 backdrop-blur-sm rounded-xl p-2.5 border border-accent/10 text-center card-hover">
            <span className="text-xl sm:text-2xl block">🏅</span>
            <p className="text-[10px] sm:text-xs font-semibold mt-1">14 Badges</p>
          </div>
          <div className="bg-card/60 backdrop-blur-sm rounded-xl p-2.5 border border-primary/10 text-center card-hover">
            <span className="text-xl sm:text-2xl block">🤲</span>
            <p className="text-[10px] sm:text-xs font-semibold mt-1">Prière</p>
          </div>
        </motion.div>

        {/* Daily Inspiration Card */}
        <DailyInspiration />

        {/* Progress indicator if returning user */}
        {totalStars > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-4"
          >
            <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full">
              <span className="text-yellow-500 text-sm">⭐</span>
              <span className="text-sm font-bold text-primary">{totalStars}</span>
            </div>
            {unlockedBadges > 0 && (
              <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full">
                <span className="text-primary text-sm">🏅</span>
                <span className="text-sm font-bold text-primary">{unlockedBadges}</span>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
