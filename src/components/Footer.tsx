'use client';

import { Heart, Sparkles, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="text-center py-8 px-4 text-xs text-muted-foreground border-t border-border/30">
      {/* Decorative top border with gradient */}
      <div className="h-px w-full max-w-xs mx-auto bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-6" />

      {/* Decorative floating stars */}
      <div className="relative h-6 mb-4">
        <motion.div
          className="absolute left-[20%] top-0"
          animate={{ y: [0, -4, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Star className="w-3 h-3 text-amber-300 fill-amber-300 opacity-60" />
        </motion.div>
        <motion.div
          className="absolute left-[50%] top-1 -translate-x-1/2"
          animate={{ y: [0, -6, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
          <span className="text-base">✨</span>
        </motion.div>
        <motion.div
          className="absolute right-[20%] top-0"
          animate={{ y: [0, -3, 0], rotate: [0, -15, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <Star className="w-3 h-3 text-rose-300 fill-rose-300 opacity-60" />
        </motion.div>
      </div>

      <div className="flex flex-col items-center gap-3">
        {/* Logo and title */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">🪞</span>
          <div className="text-left">
            <p className="font-bold text-foreground/80 text-sm">L&apos;Alchimie du Miroir</p>
            <p className="text-[10px] text-muted-foreground">L&apos;Aventure des Petits Cœurs ✨</p>
          </div>
        </div>

        {/* Decorative heart divider */}
        <div className="flex items-center gap-2">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-rose-300/50" />
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            💜
          </motion.span>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-rose-300/50" />
        </div>

        {/* Quote */}
        <div className="bg-primary/5 rounded-xl px-4 py-2.5 border border-primary/10 max-w-sm">
          <p className="text-[11px] text-foreground/70 italic leading-relaxed">
            &ldquo;Ceux qui croient et dont les cœurs s&apos;apaisent à l&apos;évocation de Dieu.&rdquo;
          </p>
          <p className="text-[10px] text-primary/60 font-medium mt-1">— Coran 13:28</p>
        </div>

        {/* Features list - responsive grid */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] text-muted-foreground/70">
          <span className="flex items-center gap-1">📖 3 Aventures</span>
          <span className="flex items-center gap-1">🎮 8 Activités</span>
          <span className="flex items-center gap-1">🏅 16 Badges</span>
          <span className="flex items-center gap-1">🤲 Prières</span>
          <span className="flex items-center gap-1">🔊 Sons</span>
        </div>

        {/* Credits */}
        <div className="space-y-1.5 mt-1">
          <p className="text-[10px] text-muted-foreground/60 flex items-center justify-center gap-1 flex-wrap">
            Fait avec <Heart className="w-3 h-3 text-rose-400 fill-rose-400" /> et <Sparkles className="w-3 h-3 text-amber-400" /> pour les cœurs de 6 à 12 ans
          </p>
          <p className="text-[10px] text-muted-foreground/50">
            Inspiré des enseignements de Al-Ghazālī, Ibn al-Qayyim et Ibn &apos;Arabī
          </p>
        </div>
      </div>
    </footer>
  );
}
