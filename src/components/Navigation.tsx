'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, type Section } from '@/lib/store';
import { Home, BookOpen, Star, Gamepad2, Moon, Sun, Trophy } from 'lucide-react';
import { useState } from 'react';

const navItems: { id: Section; label: string; icon: React.ReactNode; emoji: string }[] = [
  { id: 'accueil', label: 'Accueil', icon: <Home className="w-5 h-5" />, emoji: '🏠' },
  { id: 'aventures', label: 'Aventures', icon: <BookOpen className="w-5 h-5" />, emoji: '📖' },
  { id: 'pratique', label: 'Pratique', icon: <Star className="w-5 h-5" />, emoji: '⭐' },
  { id: 'activites', label: 'Activités', icon: <Gamepad2 className="w-5 h-5" />, emoji: '🎮' },
];

function BadgePanel() {
  const { badges } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const unlockedCount = badges.filter(b => b.unlockedAt).length;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full hover:bg-primary/20 transition-colors"
        aria-label="Badges"
      >
        <Trophy className="w-3.5 h-3.5 text-primary" />
        <span className="text-[10px] font-bold text-primary">{unlockedCount}</span>
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
                  <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground text-lg">
                    ✕
                  </button>
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
                            ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30'
                            : 'bg-muted/30 border-border/50 opacity-50'
                        }`}
                        whileTap={isUnlocked ? { scale: 0.95 } : {}}
                      >
                        <span className="text-2xl block">{isUnlocked ? badge.emoji : '🔒'}</span>
                        <p className="text-xs font-bold mt-1">{badge.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{badge.description}</p>
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
  const { currentSection, setSection, totalStars, darkMode, toggleDarkMode } = useAppStore();

  return (
    <>
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="flex items-center justify-between px-3 py-2 max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-lg">🪞</span>
            <span className="font-bold text-primary text-sm sm:text-base hidden sm:inline">L&apos;Alchimie du Miroir</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Badges */}
            <BadgePanel />
            
            {/* Star count */}
            <div className="flex items-center gap-1 bg-primary/10 px-2.5 py-1 rounded-full glow-gold">
              <span className="text-yellow-500 text-xs">⭐</span>
              <span className="font-bold text-primary text-xs">{totalStars}</span>
            </div>
            
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-1.5 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
              aria-label={darkMode ? 'Mode jour' : 'Mode nuit'}
            >
              {darkMode ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-primary" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-t border-border/50 safe-area-bottom shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around max-w-4xl mx-auto py-1 px-2">
          {navItems.map((item) => {
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className="flex flex-col items-center justify-center py-2 px-3 sm:px-6 min-w-[64px] relative rounded-xl transition-colors"
                aria-label={item.label}
              >
                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute -top-1 w-10 h-1 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <span className={`transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  {item.icon}
                </span>
                <span className={`text-[10px] sm:text-xs mt-0.5 transition-colors ${isActive ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="navDot"
                    className="absolute -bottom-0.5 w-1.5 h-1.5 bg-primary rounded-full"
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
