'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Heart, Flame } from 'lucide-react';
import FavoriteChapters from './FavoriteChapters';

const practiceItems = [
  { id: 'prayers', label: "J'ai dit mes prières aujourd'hui", emoji: '🤲' },
  { id: 'kindness', label: "J'ai fait un acte de gentillesse", emoji: '🌸' },
  { id: 'breathing', label: "J'ai respiré calmement 3 fois", emoji: '🌬️' },
  { id: 'gratitude', label: 'J\'ai dit "merci" (Alhamdulillah) pour quelque chose', emoji: '💛' },
  { id: 'silence', label: "J'ai écouté mon cœur dans le silence", emoji: '💜' },
];

// Constellation patterns for star display
const constellationPositions = [
  { x: 50, y: 15 },
  { x: 20, y: 30 },
  { x: 80, y: 28 },
  { x: 35, y: 50 },
  { x: 65, y: 48 },
  { x: 15, y: 65 },
  { x: 50, y: 70 },
  { x: 85, y: 62 },
  { x: 30, y: 85 },
  { x: 70, y: 83 },
];

export default function PracticeSection() {
  const { practiceDays, updatePracticeDay, gratitudeEntries, addGratitudeEntry, totalStars, badges } = useAppStore();
  const [gratitudeText, setGratitudeText] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const todayPractice = useMemo(() => {
    return practiceDays.find(d => d.date === today) || {
      date: today,
      prayers: false,
      kindness: false,
      breathing: false,
      gratitude: false,
      silence: false,
    };
  }, [practiceDays, today]);

  const [localOverrides, setLocalOverrides] = useState<Record<string, boolean>>({});

  const checked = useMemo(() => {
    const result = { ...todayPractice };
    Object.entries(localOverrides).forEach(([k, v]) => {
      result[k] = v;
    });
    return result;
  }, [todayPractice, localOverrides]);

  const toggleItem = (id: string) => {
    const newValue = !checked[id as keyof typeof checked];
    setLocalOverrides(prev => ({ ...prev, [id]: newValue }));
    const newChecked = { ...checked, [id]: newValue };
    updatePracticeDay(newChecked);
  };

  const completedCount = Object.entries(checked).filter(([k, v]) => k !== 'date' && v).length;
  const allCompleted = completedCount === 5;

  // Calculate streak
  const streak = useMemo(() => {
    let count = 0;
    const d = new Date();
    // Check today first
    for (let i = 0; i < 365; i++) {
      const dateStr = d.toISOString().split('T')[0];
      const practice = practiceDays.find(p => p.date === dateStr);
      const completed = practice
        ? Object.entries(practice).filter(([k, v]) => k !== 'date' && v).length
        : 0;
      if (completed >= 3) {
        count++;
      } else if (i > 0) {
        break;
      } else {
        // Today might not be completed yet, check yesterday
        const yesterday = new Date(d);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        const yesterdayPractice = practiceDays.find(p => p.date === yesterdayStr);
        const yesterdayCompleted = yesterdayPractice
          ? Object.entries(yesterdayPractice).filter(([k, v]) => k !== 'date' && v).length
          : 0;
        if (yesterdayCompleted >= 3) {
          // Keep checking from yesterday
          continue;
        }
        break;
      }
      d.setDate(d.getDate() - 1);
    }
    return count;
  }, [practiceDays]);

  // Week view
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay() + i + 1);
    return d.toISOString().split('T')[0];
  });

  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const dayEmojis = ['🌅', '☀️', '🌿', '🌤️', '🌟', '🌙', '✨'];

  const saveGratitude = () => {
    if (gratitudeText.trim()) {
      const existing = gratitudeEntries.find(e => e.date === today);
      const items = gratitudeText.split('\n').filter(l => l.trim());
      addGratitudeEntry({ date: today, items: existing ? [...existing.items, ...items] : items });
      setGratitudeText('');
    }
  };

  const unlockedBadges = badges.filter(b => b.unlockedAt);
  const recentBadge = unlockedBadges.length > 0 ? unlockedBadges[unlockedBadges.length - 1] : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center py-2">
        <h2 className="text-2xl font-bold shimmer-text">⭐ Ma Pratique</h2>
        <p className="text-sm text-muted-foreground mt-1">Ton journal spirituel quotidien</p>
      </div>

      {/* Streak indicator */}
      {streak > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-100 via-amber-100 to-yellow-100 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-yellow-900/20 px-4 py-2.5 rounded-2xl border border-amber-200/50 dark:border-amber-700/30 shadow-sm"
        >
          <motion.span
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            🔥
          </motion.span>
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-bold text-gradient-gold">{streak} jour{streak > 1 ? 's' : ''}</span>
          </div>
          <span className="text-xs text-muted-foreground">de suite !</span>
        </motion.div>
      )}

      {/* Progress overview card */}
      <Card className="border-2 border-primary/10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/8 to-transparent rounded-bl-full" />
        <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-secondary/8 to-transparent rounded-br-full" />
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-yellow-200 dark:from-amber-900/30 dark:to-yellow-800/30 rounded-xl flex items-center justify-center">
                <span className="text-lg">⭐</span>
              </div>
              <div>
                <p className="text-lg font-bold text-gradient-gold">{totalStars}</p>
                <p className="text-[10px] text-muted-foreground">étoiles collectées</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-pink-200 dark:from-rose-900/30 dark:to-pink-800/30 rounded-xl flex items-center justify-center">
                <span className="text-lg">🏅</span>
              </div>
              <div>
                <p className="text-lg font-bold text-gradient-rose">{unlockedBadges.length}</p>
                <p className="text-[10px] text-muted-foreground">badges débloqués</p>
              </div>
            </div>
          </div>
          
          {/* Recent badge highlight */}
          {recentBadge && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 bg-gradient-to-r from-primary/8 to-secondary/8 rounded-xl p-2.5 border border-primary/15"
            >
              <span className="text-2xl">{recentBadge.emoji}</span>
              <div>
                <p className="text-xs font-bold text-primary">{recentBadge.title}</p>
                <p className="text-[10px] text-muted-foreground">{recentBadge.description}</p>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Favorite Chapters */}
      <Card className="border-2 border-rose-200/50 dark:border-rose-800/30 overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-rose-100/50 to-transparent dark:from-rose-900/20 dark:to-transparent rounded-bl-full" />
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            Mes Favoris
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FavoriteChapters />
        </CardContent>
      </Card>

      {/* Today's checklist */}
      <Card className="border-2 border-primary/10 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span>📋</span>
            <span>Aujourd&apos;hui</span>
            <span className="ml-auto text-sm font-normal text-muted-foreground">
              {completedCount}/5
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Progress bar with gradient */}
          <div className="w-full bg-muted rounded-full h-2.5 mb-4 overflow-hidden">
            <motion.div
              className="gradient-progress rounded-full h-2.5"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / 5) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="space-y-2">
            {practiceItems.map((item, idx) => {
              const isChecked = checked[item.id as keyof typeof checked] as boolean;
              return (
                <motion.label
                  key={item.id}
                  className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${
                    isChecked 
                      ? 'bg-gradient-to-r from-primary/8 to-primary/5 border border-primary/15' 
                      : 'hover:bg-muted/50'
                  }`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => toggleItem(item.id)}
                  />
                  <span className="text-lg">{item.emoji}</span>
                  <span className={`text-sm flex-1 ${isChecked ? 'line-through text-muted-foreground' : ''}`}>{item.label}</span>
                  {isChecked && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-xs text-primary">✓</motion.span>}
                </motion.label>
              );
            })}
          </div>

          <AnimatePresence>
            {allCompleted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, height: 0 }}
                animate={{ opacity: 1, scale: 1, height: 'auto' }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mt-4 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 dark:from-amber-900/15 dark:via-yellow-900/15 dark:to-amber-900/15 rounded-xl p-4 text-center border border-amber-200/40 dark:border-amber-700/20"
              >
                <p className="text-base font-bold text-gradient-gold">🌟 Bravo ! Journée complétée ! +5 étoiles 🌟</p>
                <p className="text-xs text-muted-foreground mt-1">Tu es un vrai petit sage !</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Weekly view with colored dots and emoji indicators */}
      <Card className="border-2 border-primary/10 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span>📅</span>
            Cette semaine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between gap-1">
            {weekDays.map((day, i) => {
              const practice = practiceDays.find(d => d.date === day);
              const completed = practice
                ? Object.entries(practice).filter(([k, v]) => k !== 'date' && v).length
                : 0;
              const isToday = day === today;
              const isFuture = new Date(day) > new Date(today);
              return (
                <div
                  key={day}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                    isToday ? 'bg-gradient-to-b from-primary/10 to-primary/5 border-2 border-primary/30 shadow-sm' : 
                    completed === 5 ? 'bg-gradient-to-b from-amber-50/80 to-yellow-50/80 dark:from-amber-900/10 dark:to-yellow-900/10 border border-amber-200/30 dark:border-amber-700/20' : 
                    completed > 0 ? 'bg-primary/5 border border-primary/10' : ''
                  }`}
                >
                  <span className="text-[10px] text-muted-foreground">{dayEmojis[i]}</span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">{dayNames[i]}</span>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center relative">
                    {isFuture ? (
                      <span className="text-muted-foreground/40 text-xs">—</span>
                    ) : completed === 5 ? (
                      <motion.span
                        className="text-lg"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      >
                        ⭐
                      </motion.span>
                    ) : completed > 0 ? (
                      <div className="flex flex-wrap gap-0.5 justify-center items-center w-full h-full">
                        {Array.from({ length: completed }).map((_, j) => (
                          <span key={j} className="w-2 h-2 rounded-full bg-primary/60" />
                        ))}
                        {Array.from({ length: 5 - completed }).map((_, j) => (
                          <span key={j} className="w-2 h-2 rounded-full bg-muted/40" />
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground/30 text-xs">·</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Badges collection */}
      {unlockedBadges.length > 0 && (
        <Card className="border-2 border-primary/10 overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Mes Badges
              <span className="text-xs font-normal text-muted-foreground ml-auto">
                {unlockedBadges.length}/{badges.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => {
                const isUnlocked = !!badge.unlockedAt;
                return (
                  <motion.div
                    key={badge.id}
                    className={`flex flex-col items-center p-2 rounded-xl w-16 text-center transition-all ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20'
                        : 'bg-muted/20 border border-border/30 opacity-40'
                    }`}
                    whileHover={isUnlocked ? { scale: 1.1 } : {}}
                  >
                    <span className="text-xl">{isUnlocked ? badge.emoji : '🔒'}</span>
                    <span className="text-[8px] font-medium mt-0.5 leading-tight">{badge.title}</span>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Star constellation with visual constellation pattern */}
      <Card className="border-2 border-primary/10 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span>🌟</span>
            Tes étoiles
          </CardTitle>
        </CardHeader>
        <CardContent>
          {totalStars > 0 ? (
            <div className="relative w-full h-48 sm:h-56">
              {/* Constellation lines */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                {constellationPositions.slice(0, Math.min(totalStars, 10) - 1).map((pos, i) => {
                  const next = constellationPositions[i + 1];
                  if (!next) return null;
                  return (
                    <motion.line
                      key={i}
                      x1={pos.x} y1={pos.y} x2={next.x} y2={next.y}
                      stroke="oklch(0.55 0.12 80 / 15%)"
                      strokeWidth="0.3"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                    />
                  );
                })}
              </svg>
              {/* Star dots */}
              {constellationPositions.slice(0, Math.min(totalStars, 10)).map((pos, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
                >
                  <span className="text-base sm:text-lg pulse-soft inline-block">⭐</span>
                </motion.div>
              ))}
              {/* Additional stars beyond constellation */}
              {totalStars > 10 && (
                <div className="absolute bottom-0 left-0 right-0 flex flex-wrap gap-0.5 justify-center">
                  {Array.from({ length: Math.min(totalStars - 10, 40) }).map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1 + i * 0.02, type: 'spring', stiffness: 200 }}
                      className="text-xs"
                    >
                      ⭐
                    </motion.span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              Complète des activités pour gagner des étoiles ! ✨
            </p>
          )}
          {totalStars > 50 && (
            <p className="text-center text-xs text-muted-foreground mt-2">
              ...et {totalStars - 50} autres ! 🌟
            </p>
          )}
          <p className="text-center text-sm text-muted-foreground mt-2">
            Total : <span className="font-bold text-gradient-gold">{totalStars}</span> ⭐
          </p>
        </CardContent>
      </Card>

      {/* Gratitude journal - enhanced */}
      <Card className="border-2 border-primary/10 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span>💛</span>
            Journal de gratitude
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Textarea
              value={gratitudeText}
              onChange={(e) => setGratitudeText(e.target.value)}
              placeholder="Écris ce pour quoi tu es reconnaissant(e) aujourd'hui... (une chose par ligne)"
              rows={3}
              className="resize-none border-primary/15 focus:border-primary/30"
            />
          </div>
          <Button onClick={saveGratitude} className="w-full mt-2" disabled={!gratitudeText.trim()} style={!gratitudeText.trim() ? {} : { background: 'linear-gradient(135deg, #C9A227, #E8D44D)' }}>
            💛 Ajouter
          </Button>

          {gratitudeEntries.length > 0 && (
            <div className="mt-4 space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
              {gratitudeEntries.slice().reverse().slice(0, 7).map((entry) => (
                <motion.div
                  key={entry.date}
                  className="bg-gradient-to-r from-amber-50/60 to-yellow-50/60 dark:from-amber-900/10 dark:to-yellow-900/10 rounded-xl p-3 border border-amber-200/30 dark:border-amber-700/15"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-[10px] text-muted-foreground mb-1 font-medium">{entry.date}</p>
                  <ul className="space-y-1">
                    {entry.items.map((item, i) => (
                      <li key={i} className="text-sm flex items-start gap-1.5">
                        <span>✨</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
