'use client';

import { motion } from 'framer-motion';
import { useAppStore, type Section } from '@/lib/store';
import { Home, BookOpen, Star, Gamepad2 } from 'lucide-react';

const navItems: { id: Section; label: string; icon: React.ReactNode; emoji: string }[] = [
  { id: 'accueil', label: 'Accueil', icon: <Home className="w-5 h-5" />, emoji: '🏠' },
  { id: 'aventures', label: 'Aventures', icon: <BookOpen className="w-5 h-5" />, emoji: '📖' },
  { id: 'pratique', label: 'Pratique', icon: <Star className="w-5 h-5" />, emoji: '⭐' },
  { id: 'activites', label: 'Activités', icon: <Gamepad2 className="w-5 h-5" />, emoji: '🎮' },
];

export default function Navigation() {
  const { currentSection, setSection, totalStars } = useAppStore();

  return (
    <>
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="flex items-center justify-between px-4 py-2 max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-lg">🪞</span>
            <span className="font-bold text-primary text-sm sm:text-base">L&apos;Alchimie du Miroir</span>
          </div>
          <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1 rounded-full glow-gold">
            <span className="text-yellow-500 text-sm">⭐</span>
            <span className="font-bold text-primary text-sm">{totalStars}</span>
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
