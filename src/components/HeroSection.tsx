'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import Image from 'next/image';

export default function HeroSection() {
  const { setSection, totalStars } = useAppStore();

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/magic-mirror-hero.png"
          alt="Miroir magique doré"
          fill
          className="object-cover opacity-15"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
      </div>

      {/* Decorative circles */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-amber-200/10 blur-3xl" />
      <div className="absolute bottom-40 right-10 w-40 h-40 rounded-full bg-teal-200/10 blur-3xl" />
      <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-pink-200/10 blur-2xl" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-5 max-w-lg mx-auto">
        {/* Mirror emoji with animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="relative"
        >
          <span className="text-7xl sm:text-8xl block">🪞</span>
          {/* Orbiting sparkle */}
          <motion.span
            className="absolute text-xl"
            animate={{ 
              rotate: 360,
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{ originX: '50%', originY: '150%' }}
          >
            ✨
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

        {/* Welcome card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="w-full bg-card/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-lg border border-primary/20 card-hover"
        >
          <p className="text-base sm:text-lg text-foreground/90 leading-relaxed">
            Bienvenue petit voyageur ! 🌟 Tu vas découvrir un miroir magique qui reflète la lumière de ton cœur. Es-tu prêt(e) pour l&apos;aventure ?
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

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="grid grid-cols-3 gap-3 mt-2 w-full"
        >
          <div className="bg-card/60 backdrop-blur-sm rounded-xl p-3 border border-primary/10 text-center card-hover">
            <span className="text-2xl block">📖</span>
            <p className="text-xs sm:text-sm font-semibold mt-1">3 Aventures</p>
          </div>
          <div className="bg-card/60 backdrop-blur-sm rounded-xl p-3 border border-secondary/10 text-center card-hover">
            <span className="text-2xl block">🎮</span>
            <p className="text-xs sm:text-sm font-semibold mt-1">Activités</p>
          </div>
          <div className="bg-card/60 backdrop-blur-sm rounded-xl p-3 border border-accent/10 text-center card-hover">
            <span className="text-2xl block">⭐</span>
            <p className="text-xs sm:text-sm font-semibold mt-1">Gagne des étoiles</p>
          </div>
        </motion.div>

        {/* Star count if any */}
        {totalStars > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full"
          >
            <span className="text-yellow-500">⭐</span>
            <span className="text-sm font-bold text-primary">{totalStars} étoiles collectées</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
