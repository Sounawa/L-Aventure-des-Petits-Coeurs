'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, type Section } from '@/lib/store';
import { Home, BookOpen, Star, Gamepad2, Moon, Sun, Trophy, Heart } from 'lucide-react';
import { useState } from 'react';
import SettingsPanel from './SettingsPanel';

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
        className="relative flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full hover:bg-primary/20 transition-all"
        aria-label="Badges"
      >
        <Trophy className="w-4 h-4 text-primary" />
        <span className="text-[10px] font-bold text-primary">{unlockedCount}</span>
        {unlockedCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full border border-background" />
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
              className="fixed top-14 left-4 right-4 max-w-md mx-auto bg-card rounded-2xl shadow-2xl border border-border z-[70] max-h-[70vh] overflow-y-auto custom-scrollbar"
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

export default function Navigation() {
  const { currentSection, setSection, totalStars, darkMode, toggleDarkMode, userName, favoriteChapters } = useAppStore();

  return (
    <>
      {/* Top bar with gradient */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 shadow-sm"
        style={{
          background: darkMode
            ? 'linear-gradient(180deg, oklch(0.18 0.04 280), oklch(0.15 0.03 280))'
            : 'linear-gradient(180deg, oklch(0.98 0.008 85), oklch(0.96 0.01 85))',
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
            <BadgePanel />

            {/* Star count with gold glow - consistent icon size */}
            <div className="flex items-center gap-1 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 px-2.5 py-1 rounded-full border border-amber-200/40 dark:border-amber-700/20 glow-gold">
              <span className="text-yellow-500 text-xs">⭐</span>
              <span className="font-bold text-gradient-gold text-xs">{totalStars}</span>
            </div>

            {/* Dark mode toggle - consistent icon size */}
            <button
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

            {/* Settings - consistent icon size */}
            <SettingsPanel />
          </div>
        </div>
      </div>

      {/* Bottom navigation - polished with active glow and transitions */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 safe-area-bottom shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
        style={{
          background: darkMode
            ? 'linear-gradient(0deg, oklch(0.16 0.03 280), oklch(0.18 0.04 280))'
            : 'linear-gradient(0deg, oklch(0.97 0.008 85), oklch(0.98 0.005 85))',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex items-center justify-around max-w-4xl mx-auto py-1 px-2">
          {navItems.map((item) => {
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className="flex flex-col items-center justify-center py-2 px-3 sm:px-6 min-w-[64px] relative rounded-xl transition-all duration-200"
                aria-label={item.label}
              >
                {/* Active tab background with rounded corners and subtle glow */}
                {isActive && (
                  <motion.div
                    layoutId="navBg"
                    className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/15"
                    style={{ boxShadow: '0 0 12px oklch(0.55 0.12 80 / 10%)' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}

                {/* Top indicator bar */}
                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute -top-1 w-10 h-1 bg-primary rounded-full"
                    style={{ boxShadow: '0 0 8px oklch(0.55 0.12 80 / 30%)' }}
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

                {/* Pulsing bottom dot for active */}
                {isActive && (
                  <motion.div
                    layoutId="navDot"
                    className="absolute -bottom-0.5 w-1.5 h-1.5 bg-primary rounded-full pulse-soft"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
