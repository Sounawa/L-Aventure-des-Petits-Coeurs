'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Heart } from 'lucide-react';
import FavoriteChapters from './FavoriteChapters';

const practiceItems = [
  { id: 'prayers', label: "J'ai dit mes prières aujourd'hui", emoji: '🤲' },
  { id: 'kindness', label: "J'ai fait un acte de gentillesse", emoji: '🌸' },
  { id: 'breathing', label: "J'ai respiré calmement 3 fois", emoji: '🌬️' },
  { id: 'gratitude', label: 'J\'ai dit "merci" (Alhamdulillah) pour quelque chose', emoji: '💛' },
  { id: 'silence', label: "J'ai écouté mon cœur dans le silence", emoji: '💜' },
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

  // Week view
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay() + i + 1);
    return d.toISOString().split('T')[0];
  });

  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

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

      {/* Progress overview card */}
      <Card className="border-2 border-primary/10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">⭐</span>
              <div>
                <p className="text-lg font-bold text-primary">{totalStars}</p>
                <p className="text-[10px] text-muted-foreground">étoiles collectées</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🏅</span>
              <div>
                <p className="text-lg font-bold text-primary">{unlockedBadges.length}</p>
                <p className="text-[10px] text-muted-foreground">badges débloqués</p>
              </div>
            </div>
          </div>
          
          {/* Recent badge highlight */}
          {recentBadge && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 bg-primary/5 rounded-xl p-2 border border-primary/10"
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
      <Card className="border-2 border-rose-200/50 dark:border-rose-800/30">
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
      <Card className="border-2 border-primary/10">
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
          {/* Progress bar */}
          <div className="w-full bg-muted rounded-full h-2 mb-4 overflow-hidden">
            <motion.div
              className="bg-primary rounded-full h-2"
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
                    isChecked ? 'bg-primary/5 border border-primary/10' : 'hover:bg-muted/50'
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
                  {isChecked && <span className="text-xs text-primary">✓</span>}
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
                className="mt-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 text-center border border-primary/20"
              >
                <p className="text-base font-bold text-primary">🌟 Bravo ! Journée complétée ! +5 étoiles 🌟</p>
                <p className="text-xs text-muted-foreground mt-1">Tu es un vrai petit sage !</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Weekly view */}
      <Card className="border-2 border-primary/10">
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
                    isToday ? 'bg-primary/10 border-2 border-primary/30 shadow-sm' : 
                    completed === 5 ? 'bg-primary/5 border border-primary/10' : ''
                  }`}
                >
                  <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">{dayNames[i]}</span>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    {isFuture ? '·' : completed === 5 ? '⭐' : completed > 0 ? (
                      <span className="text-primary">{completed}</span>
                    ) : '·'}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Badges collection */}
      {unlockedBadges.length > 0 && (
        <Card className="border-2 border-primary/10">
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
                  <div
                    key={badge.id}
                    className={`flex flex-col items-center p-2 rounded-xl w-16 text-center transition-all ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20'
                        : 'bg-muted/20 border border-border/30 opacity-40'
                    }`}
                  >
                    <span className="text-xl">{isUnlocked ? badge.emoji : '🔒'}</span>
                    <span className="text-[8px] font-medium mt-0.5 leading-tight">{badge.title}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Star constellation */}
      <Card className="border-2 border-primary/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span>🌟</span>
            Tes étoiles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-0.5 justify-center min-h-[40px]">
            {Array.from({ length: Math.min(totalStars, 50) }).map((_, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: i * 0.03, type: 'spring', stiffness: 200 }}
                className="text-sm"
              >
                ⭐
              </motion.span>
            ))}
            {totalStars === 0 && (
              <p className="text-sm text-muted-foreground text-center py-2">
                Complète des activités pour gagner des étoiles !
              </p>
            )}
          </div>
          {totalStars > 50 && (
            <p className="text-center text-xs text-muted-foreground mt-2">
              ...et {totalStars - 50} autres ! 🌟
            </p>
          )}
          <p className="text-center text-sm text-muted-foreground mt-2">
            Total : {totalStars} ⭐
          </p>
        </CardContent>
      </Card>

      {/* Gratitude journal */}
      <Card className="border-2 border-primary/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span>💛</span>
            Journal de gratitude
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={gratitudeText}
            onChange={(e) => setGratitudeText(e.target.value)}
            placeholder="Écris ce pour quoi tu es reconnaissant(e) aujourd'hui... (une chose par ligne)"
            rows={3}
            className="resize-none"
          />
          <Button onClick={saveGratitude} className="w-full mt-2" disabled={!gratitudeText.trim()}>
            💛 Ajouter
          </Button>

          {gratitudeEntries.length > 0 && (
            <div className="mt-4 space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
              {gratitudeEntries.slice().reverse().slice(0, 7).map((entry) => (
                <div key={entry.date} className="bg-primary/5 rounded-xl p-3 border border-primary/10">
                  <p className="text-[10px] text-muted-foreground mb-1 font-medium">{entry.date}</p>
                  <ul className="space-y-1">
                    {entry.items.map((item, i) => (
                      <li key={i} className="text-sm flex items-start gap-1.5">
                        <span>✨</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
