'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Volume2, VolumeX, RotateCcw, BarChart3, Info, X, Sparkles, Star, Trophy, BookOpen, Flame } from 'lucide-react';

export default function SettingsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const {
    darkMode,
    toggleDarkMode,
    soundEffects,
    toggleSoundEffects,
    resetProgress,
    totalStars,
    badges,
    chaptersProgress,
    currentStreak,
  } = useAppStore();

  const unlockedBadges = badges.filter(b => b.unlockedAt).length;
  const chaptersRead = Object.values(chaptersProgress).filter(c => c.read).length;

  const handleReset = () => {
    resetProgress();
    setShowResetConfirm(false);
    setIsOpen(false);
  };

  return (
    <>
      {/* Gear icon button - rendered in Navigation */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-1.5 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
        aria-label="Paramètres"
      >
        <motion.span
          className="block text-sm"
          whileHover={{ rotate: 90 }}
          transition={{ duration: 0.3 }}
        >
          ⚙️
        </motion.span>
      </button>

      {/* Settings overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]"
              onClick={() => { setIsOpen(false); setShowResetConfirm(false); }}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm bg-card shadow-2xl z-[90] overflow-y-auto custom-scrollbar"
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Paramètres
                  </h2>
                  <button
                    onClick={() => { setIsOpen(false); setShowResetConfirm(false); }}
                    className="p-1.5 rounded-full bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Settings cards */}
                <div className="space-y-3">
                  {/* Dark/Light Mode */}
                  <Card className="border-2 border-primary/10">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-indigo-950/40 flex items-center justify-center">
                            {darkMode ? (
                              <Moon className="w-5 h-5 text-indigo-400" />
                            ) : (
                              <Sun className="w-5 h-5 text-amber-500" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">Mode nuit</p>
                            <p className="text-[10px] text-muted-foreground">
                              {darkMode ? 'Thème sombre activé' : 'Thème clair activé'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={toggleDarkMode}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            darkMode ? 'bg-primary' : 'bg-muted'
                          }`}
                        >
                          <motion.div
                            className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md"
                            animate={{ left: darkMode ? 26 : 2 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Sound Effects */}
                  <Card className="border-2 border-primary/10">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center">
                            {soundEffects ? (
                              <Volume2 className="w-5 h-5 text-teal-500" />
                            ) : (
                              <VolumeX className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">Effets sonores</p>
                            <p className="text-[10px] text-muted-foreground">
                              {soundEffects ? 'Sons activés' : 'Sons désactivés'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={toggleSoundEffects}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            soundEffects ? 'bg-primary' : 'bg-muted'
                          }`}
                        >
                          <motion.div
                            className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md"
                            animate={{ left: soundEffects ? 26 : 2 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Stats Summary */}
                  <Card className="border-2 border-primary/10">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <BarChart3 className="w-4 h-4 text-primary" />
                        <p className="text-sm font-semibold">Mes statistiques</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-primary/5 rounded-xl p-2.5 text-center">
                          <Star className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                          <p className="text-lg font-bold text-primary">{totalStars}</p>
                          <p className="text-[9px] text-muted-foreground">étoiles</p>
                        </div>
                        <div className="bg-primary/5 rounded-xl p-2.5 text-center">
                          <Trophy className="w-4 h-4 text-primary mx-auto mb-1" />
                          <p className="text-lg font-bold text-primary">{unlockedBadges}</p>
                          <p className="text-[9px] text-muted-foreground">badges</p>
                        </div>
                        <div className="bg-primary/5 rounded-xl p-2.5 text-center">
                          <BookOpen className="w-4 h-4 text-teal-500 mx-auto mb-1" />
                          <p className="text-lg font-bold text-primary">{chaptersRead}</p>
                          <p className="text-[9px] text-muted-foreground">chapitres lus</p>
                        </div>
                        <div className="bg-primary/5 rounded-xl p-2.5 text-center">
                          <Flame className="w-4 h-4 text-orange-500 mx-auto mb-1" />
                          <p className="text-lg font-bold text-primary">{currentStreak}</p>
                          <p className="text-[9px] text-muted-foreground">jours de suite</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Reset Progress */}
                  <Card className="border-2 border-red-200/50 dark:border-red-800/30">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <RotateCcw className="w-4 h-4 text-red-500" />
                        <p className="text-sm font-semibold">Réinitialiser la progression</p>
                      </div>
                      <p className="text-[10px] text-muted-foreground mb-3">
                        Attention ! Cela effacera toute ta progression, tes étoiles et tes badges.
                      </p>

                      <AnimatePresence mode="wait">
                        {showResetConfirm ? (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-2"
                          >
                            <p className="text-xs font-semibold text-red-600 dark:text-red-400 text-center">
                              Es-tu sûr(e) ? Cette action est irréversible !
                            </p>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowResetConfirm(false)}
                                className="flex-1"
                              >
                                Annuler
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleReset}
                                className="flex-1"
                              >
                                Réinitialiser
                              </Button>
                            </div>
                          </motion.div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowResetConfirm(true)}
                            className="w-full border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                          >
                            🔄 Réinitialiser
                          </Button>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>

                  {/* About */}
                  <Card className="border-2 border-primary/10">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="w-4 h-4 text-primary" />
                        <p className="text-sm font-semibold">À propos</p>
                      </div>
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <p className="font-medium text-foreground">
                          🪞 L&apos;Alchimie du Miroir
                        </p>
                        <p>
                          L&apos;Aventure des Petits Cœurs — une application spirituelle pour les enfants de 6 à 12 ans.
                        </p>
                        <p>
                          Découvre la lumière de ton cœur à travers 3 aventures magiques, des activités interactives et des prières.
                        </p>
                        <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                          <span className="text-[10px]">Version 1.0</span>
                          <span className="text-[10px]">•</span>
                          <span className="text-[10px]">Fait avec 💛 et 🤲</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
