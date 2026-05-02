'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, type AdventureId } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

// Map chapter keys to their data for display
const chapterInfo: Record<string, { title: string; emoji: string; adventure: AdventureId; chapterNum: number }> = {
  'miroir-1': { title: 'La Découverte', emoji: '🪞', adventure: 'miroir', chapterNum: 1 },
  'miroir-2': { title: 'Le Premier Regard', emoji: '💛', adventure: 'miroir', chapterNum: 2 },
  'miroir-3': { title: 'La Respiration Magique', emoji: '🌬️', adventure: 'miroir', chapterNum: 3 },
  'miroir-4': { title: 'Le Murmure du Cœur', emoji: '💜', adventure: 'miroir', chapterNum: 4 },
  'miroir-5': { title: 'Le Miroir et la Prière', emoji: '🤲', adventure: 'miroir', chapterNum: 5 },
  'lumiere-1': { title: "D'où vient la lumière ?", emoji: '☀️', adventure: 'lumiere', chapterNum: 1 },
  'lumiere-2': { title: 'Les Noms Lumineux', emoji: '🌟', adventure: 'lumiere', chapterNum: 2 },
  'lumiere-3': { title: 'Partager la Lumière', emoji: '💛', adventure: 'lumiere', chapterNum: 3 },
  'lumiere-4': { title: 'Le Miroir de la Nuit', emoji: '🌙', adventure: 'lumiere', chapterNum: 4 },
};

const treasureInfo: Record<string, { title: string; emoji: string }> = {
  'gratitude': { title: 'La Gratitude', emoji: '💛' },
  'patience': { title: 'La Patience', emoji: '🌿' },
  'gentillesse': { title: 'La Gentillesse', emoji: '🌸' },
  'courage': { title: 'Le Courage', emoji: '⭐' },
  'honnêteté': { title: "L'Honnêteté", emoji: '💎' },
  'amour': { title: "L'Amour", emoji: '❤️' },
};

export default function FavoriteChapters() {
  const { favoriteChapters, setSection, setAdventure } = useAppStore();

  const handleNavigate = (chapterKey: string) => {
    const info = chapterInfo[chapterKey];
    if (info) {
      setAdventure(info.adventure);
      setSection('aventures');
    }
  };

  const getChapterDisplay = (key: string) => {
    const info = chapterInfo[key];
    if (info) {
      return { title: info.title, emoji: info.emoji };
    }
    const treasure = treasureInfo[key];
    if (treasure) {
      return { title: treasure.title, emoji: treasure.emoji };
    }
    return { title: key, emoji: '📖' };
  };

  if (favoriteChapters.length === 0) {
    return (
      <div className="text-center py-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-2xl p-6 border-2 border-rose-200/50 dark:border-rose-800/30"
        >
          <span className="text-4xl block mb-3">💜</span>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Tu n&apos;as pas encore de chapitres favoris.<br />
            Ajoutes-en en cliquant sur le cœur ! 💜
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
      <AnimatePresence>
        {favoriteChapters.map((key, i) => {
          const display = getChapterDisplay(key);
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 bg-gradient-to-r from-rose-50/80 to-pink-50/80 dark:from-rose-900/20 dark:to-pink-900/20 rounded-xl p-3 border border-rose-200/40 dark:border-rose-800/20 hover:shadow-md transition-shadow"
            >
              <span className="text-xl flex-shrink-0">{display.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{display.title}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigate(key)}
                className="flex-shrink-0 text-primary hover:text-primary hover:bg-primary/10 text-xs"
              >
                Lire →
              </Button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
