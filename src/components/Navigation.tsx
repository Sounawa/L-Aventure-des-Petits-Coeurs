'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, type Section } from '@/lib/store';
import { Home, BookOpen, Star, Gamepad2, Moon, Sun, Trophy, Heart } from 'lucide-react';
import { useState, useRef } from 'react';
import SettingsPanel from './SettingsPanel';
import { useSoundEffects } from './SoundEffects';

const navItems: { id: Section; label: string; icon: React.ReactNode; emoji: string }[] = [
  { id: 'accueil', label: 'Accueil', icon: <Home className="w-4 h-4" />, emoji: '🏠' },
  { id: 'aventures', label: 'Aventures', icon: <BookOpen className="w-4 h-4" />, emoji: '📖' },
  { id: 'pratique', label: 'Pratique', icon: <Star className="w-4 h-4" />, emoji: '⭐' },
  { id: 'activites', label: 'Activités', icon: <Gamepad2 className="w-4 h-4" />, emoji: '🎮' },
];

function BadgePanel() {
  const { badges } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const unlockedCount = badges.filter(b => b.unlockedAt).length;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full hover:bg-primary/20 transition-all hover:shadow-md"
        aria-label="Badges"
      >
        <Trophy className="w-4 h-4 text-primary" />
        <motion.span
          key={`badge-count-${unlockedCount}`}
          className="text-[10px] font-bold text-primary"
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.3, 0.9, 1.1, 1] }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {unlockedCount}
        </motion.span>
        {unlockedCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full border border-background animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-[60]"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="fixed top-14 left-4 right-4 max-w-md mx-auto bg-card rounded-2xl shadow-2xl border border-border z-[70] max-h-[70vh] overflow-y-auto custom-scrollbar shimmer-shine"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-primary flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    Mes Badges
                  </h3>
                  <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground text-lg transition-colors">
                    ✕
                  </button>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-muted rounded-full h-2 mb-3 overflow-hidden">
                  <motion.div
                    className="gradient-progress rounded-full h-2"
                    initial={{ width: 0 }}
                    animate={{ width: `${(unlockedCount / badges.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {unlockedCount}/{badges.length} badges débloqués
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {badges.map((badge) => {
                    const isUnlocked = !!badge.unlockedAt;
                    return (
                      <motion.div
                        key={badge.id}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          isUnlocked
                            ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 badge-shine'
                            : 'bg-muted/30 border-border/50 opacity-50'
                        }`}
                        whileTap={isUnlocked ? { scale: 0.95 } : {}}
                      >
                        <span className="text-2xl block">{isUnlocked ? badge.emoji : '🔒'}</span>
                        <p className="text-xs font-bold mt-1">{badge.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{isUnlocked ? badge.description : '???'}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

const sectionGradients: Record<Section, { light: string; dark: string }> = {
  accueil: {
    light: 'linear-gradient(180deg, rgba(245, 158, 11, 0.08), rgba(255, 255, 255, 0.95))',
    dark: 'linear-gradient(180deg, rgba(245, 158, 11, 0.12), oklch(0.15 0.03 280))',
  },
  aventures: {
    light: 'linear-gradient(180deg, rgba(20, 184, 166, 0.08), rgba(255, 255, 255, 0.95))',
    dark: 'linear-gradient(180deg, rgba(20, 184, 166, 0.12), oklch(0.15 0.03 280))',
  },
  pratique: {
    light: 'linear-gradient(180deg, rgba(244, 63, 94, 0.08), rgba(255, 255, 255, 0.95))',
    dark: 'linear-gradient(180deg, rgba(244, 63, 94, 0.12), oklch(0.15 0.03 280))',
  },
  activites: {
    light: 'linear-gradient(180deg, rgba(168, 85, 247, 0.08), rgba(255, 255, 255, 0.95))',
    dark: 'linear-gradient(180deg, rgba(168, 85, 247, 0.12), oklch(0.15 0.03 280))',
  },
};

export default function Navigation() {
  const { currentSection, setSection, totalStars, darkMode, toggleDarkMode, userName, favoriteChapters, bedtimeMode } = useAppStore();
  const { play } = useSoundEffects();

  // Ripple effect state
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const rippleIdRef = useRef(0);

  // Star counter animation - use animation key derived from totalStars
  // No setState in effects needed - the key change triggers CSS animation re-mount

  const handleNavClick = (section: Section, e: React.MouseEvent<HTMLButtonElement>) => {
    play('click');
    // Create ripple effect at touch point
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = rippleIdRef.current++;
    setRipples(prev => [...prev, { id, x, y }]);
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 600);
    setSection(section);
  };

  const topBarGradient = sectionGradients[currentSection];

  return (
    <>
      {/* Top bar with section-matching gradient */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 shadow-sm transition-all duration-500"
        style={{
          background: darkMode ? topBarGradient.dark : topBarGradient.light,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex items-center justify-between px-3 py-2 max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-lg">🪞</span>
            <div className="hidden sm:block">
              <span className="font-bold text-gradient-gold text-sm">L&apos;Alchimie du Miroir</span>
              {userName && (
                <span className="text-[10px] text-muted-foreground ml-1.5">• Salut {userName} 👋</span>
              )}
            </div>
            {/* Bedtime mode crescent moon indicator */}
            {bedtimeMode && (
              <motion.span
                className="text-lg"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                🌙
              </motion.span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {/* Favorites indicator - consistent icon size */}
            {favoriteChapters.length > 0 && (
              <div className="flex items-center gap-0.5 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 px-1.5 py-1 rounded-full border border-rose-200/40 dark:border-rose-700/20">
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                <span className="text-[10px] font-bold text-rose-500">{favoriteChapters.length}</span>
              </div>
            )}

            {/* Badges - consistent icon size */}
            <div id="guide-badges" className="flex flex-col items-center">
              <BadgePanel />
              <span className="hidden sm:inline text-[8px] text-muted-foreground mt-0.5">Badges</span>
            </div>

            {/* Star count with gold glow + bounce animation on change - consistent icon size */}
            <div className="flex flex-col items-center">
              <motion.div
                key={`stars-${totalStars}`}
                id="guide-stars"
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.4, 0.9, 1.15, 1] }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative flex items-center gap-1 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 px-2.5 py-1 rounded-full border border-amber-200/40 dark:border-amber-700/20 glow-gold"
              >
                <span className="text-yellow-500 text-xs">⭐</span>
                <span className="font-bold text-gradient-gold text-xs">{totalStars}</span>
                {/* Gold particle burst */}
                {totalStars > 0 && (
                  <div className="absolute inset-0 pointer-events-none overflow-visible">
                    {[
                      { px: -15, py: -20, delay: 0 },
                      { px: 15, py: -18, delay: 0.05 },
                      { px: -20, py: -10, delay: 0.1 },
                      { px: 20, py: -12, delay: 0.08 },
                      { px: -8, py: -25, delay: 0.03 },
                      { px: 8, py: -22, delay: 0.06 },
                    ].map((p, i) => (
                      <motion.span
                        key={i}
                        className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-yellow-400"
                        initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                        animate={{ x: p.px, y: p.py, scale: 0, opacity: 0 }}
                        transition={{ duration: 0.6, delay: p.delay, ease: 'easeOut' }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
              <span className="hidden sm:inline text-[8px] text-muted-foreground mt-0.5">étoiles</span>
            </div>

            {/* Dark mode toggle - consistent icon size */}
            <div className="flex flex-col items-center">
              <button
                id="guide-darkmode"
                onClick={toggleDarkMode}
                className="p-1.5 rounded-full bg-primary/10 hover:bg-primary/20 transition-all hover:scale-105"
                aria-label={darkMode ? 'Mode jour' : 'Mode nuit'}
              >
                {darkMode ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-primary" />
                )}
              </button>
              <span className="hidden sm:inline text-[8px] text-muted-foreground mt-0.5">{darkMode ? 'Jour' : 'Nuit'}</span>
            </div>

            {/* Settings - consistent icon size */}
            <div className="flex flex-col items-center">
              <SettingsPanel />
              <span className="hidden sm:inline text-[8px] text-muted-foreground mt-0.5">Réglages</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom navigation - polished with active glow, ripple, and transitions */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 safe-area-bottom shadow-[0_-2px_10px_rgba(0,0,0,0.05)] transition-all duration-500"
        style={{
          background: darkMode
            ? sectionGradients[currentSection].dark.replace('180deg', '0deg')
            : sectionGradients[currentSection].light.replace('180deg', '0deg'),
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex items-center justify-around max-w-4xl mx-auto py-1 px-2">
          {navItems.map((item) => {
            const isActive = currentSection === item.id;
            return (
              <motion.button
                key={item.id}
                id={`guide-nav-${item.id}`}
                onClick={(e) => handleNavClick(item.id, e)}
                className="flex flex-col items-center justify-center py-2 px-3 sm:px-6 min-w-[64px] relative rounded-xl transition-all duration-200 overflow-hidden"
                aria-label={item.label}
                whileTap={{ scale: 0.85 }}
                whileHover={{ scale: 1.05 }}
              >
                {/* Ripple effects */}
                {ripples.map(ripple => (
                  <span
                    key={ripple.id}
                    className="ripple-effect"
                    style={{
                      left: ripple.x - 10,
                      top: ripple.y - 10,
                    }}
                  />
                ))}

                {/* Active tab background with rounded corners, gradient glow, and pulse */}
                {isActive && (
                  <motion.div
                    layoutId="navBg"
                    className="absolute inset-0 rounded-xl border border-primary/15 tab-glow-pulse"
                    style={{
                      background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.08), rgba(201, 162, 39, 0.04), rgba(20, 184, 166, 0.03))',
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}

                {/* Top indicator bar — gradient with glow */}
                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute -top-1 w-10 h-1 rounded-full nav-indicator-slide"
                    style={{
                      background: 'linear-gradient(90deg, #C9A227, #14B8A6)',
                      boxShadow: '0 0 8px rgba(201, 162, 39, 0.3), 0 0 4px rgba(20, 184, 166, 0.2)',
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}

                <span className={`transition-all duration-200 relative z-10 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  {isActive ? (
                    <motion.span
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 0.3 }}
                      className={`inline-block ${isActive ? 'nav-pulse' : ''}`}
                    >
                      {item.icon}
                    </motion.span>
                  ) : (
                    item.icon
                  )}
                </span>
                <span className={`text-[10px] sm:text-xs mt-0.5 transition-all duration-200 relative z-10 ${isActive ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                  {item.label}
                </span>

                {/* Active tab: dot below icon with glow + selection ring pulse */}
                {isActive && (
                  <motion.div
                    layoutId="navDot"
                    className="absolute bottom-1 left-1/2 -translate-x-1/2"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.4, 1] }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full selection-ring"
                      style={{ background: 'linear-gradient(135deg, #C9A227, #14B8A6)' }}
                    />
                  </motion.div>
                )}

                {/* Bottom-border highlight animation — gradient sweep on tab switch */}
                {isActive && (
                  <motion.div
                    layoutId="navBorderHighlight"
                    className="absolute bottom-0 left-1/2 h-[2px] rounded-full tab-border-highlight"
                    style={{
                      transform: 'translateX(-50%)',
                      background: 'linear-gradient(90deg, transparent, #C9A227, #14B8A6, transparent)',
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </>
  );
}
