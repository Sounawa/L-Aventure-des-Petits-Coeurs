'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Heart, Flame, Sparkles, BookOpen } from 'lucide-react';
import FavoriteChapters from './FavoriteChapters';
import VirtueGarden from './VirtueGarden';
import AchievementTimeline from './AchievementTimeline';
import StatsDashboard from './StatsDashboard';

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

// Gratitude prompt suggestions
const gratitudePrompts = [
  "Aujourd'hui, je suis reconnaissant(e) pour...",
  "Une chose qui m'a fait sourire...",
  "Quelqu'un qui m'a aidé(e)...",
  "Un moment de paix que j'ai ressenti...",
  "Quelque chose de beau que j'ai vu...",
  "Une qualité que j'apprécie chez quelqu'un...",
  "Un plaisir simple de la journée...",
  "Une leçon que j'ai apprise...",
  "Quelqu'un à qui je veux dire merci...",
  "Un moment où je me suis senti(e) aimé(e)...",
];

// Streak milestone definitions
const streakMilestones = [
  { days: 7, emoji: '🌟', label: '7 jours' },
  { days: 14, emoji: '💫', label: '14 jours' },
  { days: 30, emoji: '👑', label: '30 jours' },
];

export default function PracticeSection() {
  const { practiceDays, updatePracticeDay, gratitudeEntries, addGratitudeEntry, totalStars, badges, setSection, darkMode } = useAppStore();
  const [gratitudeText, setGratitudeText] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState(() => {
    return gratitudePrompts[Math.floor(Math.random() * gratitudePrompts.length)];
  });

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
      // Rotate to a new prompt
      setCurrentPrompt(gratitudePrompts[Math.floor(Math.random() * gratitudePrompts.length)]);
    }
  };

  const rotatePrompt = () => {
    const otherPrompts = gratitudePrompts.filter(p => p !== currentPrompt);
    setCurrentPrompt(otherPrompts[Math.floor(Math.random() * otherPrompts.length)]);
  };

  const unlockedBadges = badges.filter(b => b.unlockedAt);
  const recentBadge = unlockedBadges.length > 0 ? unlockedBadges[unlockedBadges.length - 1] : null;

  // Next milestone
  const nextMilestone = streakMilestones.find(m => m.days > streak);

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center py-2 relative">
        {/* Floating decorations */}
        <motion.span
          className="absolute -top-1 left-4 text-base floating-decoration"
          animate={{ y: [0, -6, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          ✨
        </motion.span>
        <motion.span
          className="absolute -top-1 right-6 text-sm floating-decoration"
          animate={{ y: [0, -8, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
        >
          🌟
        </motion.span>
        <h2 className="text-2xl font-bold shimmer-text">⭐ Ma Pratique</h2>
        <p className="text-sm text-muted-foreground mt-1">Ton journal spirituel quotidien</p>
      </div>

      {/* Enhanced Streak indicator - always visible */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative flex items-center justify-center gap-3 px-5 py-4 rounded-2xl border shadow-sm overflow-hidden ${
          streak > 0 
            ? 'bg-gradient-to-r from-orange-100 via-amber-100 to-yellow-100 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-yellow-900/20 border-amber-200/50 dark:border-amber-700/30' 
            : 'bg-gradient-to-r from-amber-50/50 to-yellow-50/50 dark:from-amber-900/10 dark:to-yellow-900/10 border-amber-100/30 dark:border-amber-800/20'
        }`}
      >
        {/* Soft gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/20 dark:via-amber-800/10 to-transparent pointer-events-none" />
        
        <div className="flex items-center gap-3 relative z-10">
          {/* Fire emoji - dynamic based on streak length */}
          <motion.span
            className={`text-3xl ${streak >= 7 ? 'streak-flame-double' : streak >= 4 ? 'streak-flame-red' : 'streak-flame-orange'}`}
            animate={streak > 0 ? { 
              scale: [1, 1.2, 1], 
              rotate: [0, 5, -5, 0] 
            } : {}}
            transition={streak > 0 ? { duration: 1.5, repeat: Infinity } : {}}
          >
            {streak >= 7 ? '🔥🔥' : streak > 0 ? '🔥' : '💫'}
          </motion.span>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-xl font-bold text-gradient-gold">
                {streak > 0 ? streak : '0'}
              </span>
              <span className="text-sm text-muted-foreground">
                {streak > 1 ? 'jours de suite !' : streak === 1 ? 'jour de suite !' : 'Commence ta série !'}
              </span>
            </div>
            
            {/* Milestone indicators */}
            {streak > 0 && (
              <div className="flex items-center gap-2 mt-1">
                {streakMilestones.map((milestone) => {
                  const achieved = streak >= milestone.days;
                  return (
                    <motion.div
                      key={milestone.days}
                      className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        achieved 
                          ? 'bg-gradient-to-r from-amber-200 to-yellow-200 dark:from-amber-700/40 dark:to-yellow-700/40 text-amber-800 dark:text-amber-200' 
                          : 'bg-muted/30 text-muted-foreground'
                      }`}
                      animate={achieved ? { scale: [1, 1.05, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span>{milestone.emoji}</span>
                      <span>{milestone.label}</span>
                    </motion.div>
                  );
                })}
              </div>
            )}
            
            {/* Next milestone encouragement */}
            {nextMilestone && streak > 0 && (
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Plus que {nextMilestone.days - streak} jour{nextMilestone.days - streak > 1 ? 's' : ''} pour {nextMilestone.emoji} {nextMilestone.label} !
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Progress overview card - with better empty states */}
      <Card className="border-2 border-primary/10 overflow-hidden relative card-pattern">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/8 to-transparent rounded-bl-full" />
        <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-secondary/8 to-transparent rounded-br-full" />
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            {/* Stars */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-yellow-200 dark:from-amber-900/30 dark:to-yellow-800/30 rounded-xl flex items-center justify-center">
                <span className="text-lg">⭐</span>
              </div>
              <div>
                <p className="text-lg font-bold text-gradient-gold">{totalStars}</p>
                <p className="text-[10px] text-muted-foreground">étoiles collectées</p>
              </div>
            </div>
            {/* Badges */}
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
          
          {/* Better empty state for stars */}
          {totalStars === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 relative overflow-hidden rounded-2xl p-6 text-center"
              style={{
                background: darkMode
                  ? 'linear-gradient(135deg, oklch(0.20 0.04 280 / 80%), oklch(0.18 0.03 280 / 60%), oklch(0.22 0.04 280 / 80%))'
                  : 'linear-gradient(135deg, oklch(0.97 0.02 85 / 80%), oklch(0.95 0.03 80 / 60%), oklch(0.97 0.01 175 / 80%))',
                border: '2px dashed oklch(0.55 0.12 80 / 25%)',
              }}
            >
              {/* Decorative SVG star illustration */}
              <motion.div
                className="mx-auto mb-3 relative w-20 h-20"
                animate={{ rotate: [0, 3, -3, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg viewBox="0 0 80 80" className="w-full h-full" fill="none">
                  {/* Star rays */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <motion.line
                      key={i}
                      x1="40" y1="40"
                      x2={40 + 35 * Math.cos((angle * Math.PI) / 180)}
                      y2={40 + 35 * Math.sin((angle * Math.PI) / 180)}
                      stroke="oklch(0.75 0.14 80 / 40%)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                  {/* Central star */}
                  <polygon
                    points="40,12 46,30 65,30 50,42 56,60 40,48 24,60 30,42 15,30 34,30"
                    fill="oklch(0.75 0.14 80 / 60%)"
                    stroke="oklch(0.55 0.12 80 / 80%)"
                    strokeWidth="1"
                  />
                  {/* Inner glow */}
                  <circle cx="40" cy="35" r="6" fill="oklch(0.90 0.08 85 / 50%)" />
                </svg>
              </motion.div>
              <p className="text-base font-bold text-foreground/80 mb-1">
                Commence ta première pratique pour gagner des étoiles ! 🌟
              </p>
              <p className="text-xs text-foreground/70 mb-3">
                Chaque activité te rapproche de la lumière
              </p>
              <Button
                size="sm"
                className="text-xs"
                onClick={() => setSection('aventures')}
                style={{ background: 'linear-gradient(135deg, #C9A227, #E8D44D)', color: '#3D2C1E' }}
              >
                <BookOpen className="w-3 h-3 mr-1" />
                Aller aux Aventures
              </Button>
            </motion.div>
          )}

          {/* Better empty state for badges */}
          {unlockedBadges.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="empty-state-card mt-2"
            >
              <motion.span 
                className="text-3xl block mb-2 sparkle-float"
              >
                ✨
              </motion.span>
              <p className="text-sm font-medium text-foreground/80 mb-1">
                Explore les aventures pour débloquer des badges ! 🏅
              </p>
              <div className="flex justify-center gap-2 mt-2">
                {['📖', '💎', '🌟', '🏆'].map((e, i) => (
                  <motion.span
                    key={i}
                    className="text-lg opacity-40"
                    animate={{ opacity: [0.2, 0.6, 0.2], y: [0, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  >
                    {e}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
          
          {/* Recent badge highlight */}
          {recentBadge && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 bg-gradient-to-r from-primary/8 to-secondary/8 rounded-xl p-2.5 border border-primary/15 badge-shine mt-2"
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

      {/* Virtue Garden */}
      <Card className="border-2 border-green-200/50 dark:border-green-800/30 overflow-hidden card-pattern">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span>🌱</span>
            Mon Jardin des Vertus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <VirtueGarden />
        </CardContent>
      </Card>

      {/* Favorite Chapters - with better empty state */}
      <Card className="border-2 border-rose-200/50 dark:border-rose-800/30 overflow-hidden card-pattern">
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
      <Card className="border-2 border-primary/10 overflow-hidden card-pattern">
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
          {/* Progress bar with gradient shimmer and percentage */}
          <div className="w-full bg-muted rounded-full h-3 mb-1 overflow-hidden relative">
            <motion.div
              className="gradient-progress-shimmer rounded-full h-3"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / 5) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground text-right mb-4">
            {Math.round((completedCount / 5) * 100)}% complété
          </p>

          <div className="space-y-2">
            {practiceItems.map((item, idx) => {
              const isChecked = checked[item.id as keyof typeof checked] as boolean;
              return (
                <motion.label
                  key={item.id}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                    isChecked 
                      ? 'bg-gradient-to-r from-green-50/80 to-emerald-50/60 dark:from-green-900/15 dark:to-emerald-900/10 border border-green-200/40 dark:border-green-700/20 green-fade' 
                      : 'hover:bg-muted/50 border border-transparent'
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
                  {isChecked && (
                    <motion.span 
                      initial={{ scale: 0, rotate: -45 }} 
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                      className="text-xs text-green-600 dark:text-green-400 font-bold checkmark-spring"
                    >
                      ✓
                    </motion.span>
                  )}
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
                className="mt-4 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 dark:from-amber-900/15 dark:via-yellow-900/15 dark:to-amber-900/15 rounded-xl p-4 text-center border border-amber-200/40 dark:border-amber-700/20 relative overflow-hidden"
              >
                {/* Floating celebration sparkles */}
                <motion.span
                  className="absolute top-1 left-3 text-xs"
                  animate={{ y: [0, -8, 0], opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✨
                </motion.span>
                <motion.span
                  className="absolute top-1 right-3 text-xs"
                  animate={{ y: [0, -8, 0], opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  🌟
                </motion.span>
                <p className="text-base font-bold text-gradient-gold">🌟 Bravo ! Journée complétée ! +5 étoiles 🌟</p>
                <p className="text-xs text-muted-foreground mt-1">Tu es un vrai petit sage !</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Weekly view - enhanced with completed count and prominent stars */}
      <Card className="border-2 border-primary/10 overflow-hidden card-pattern">
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
                    isToday ? 'bg-gradient-to-b from-primary/10 to-primary/5 border-2 border-primary/30 shadow-sm pulse-ring' : 
                    completed === 5 ? 'bg-gradient-to-b from-amber-50/80 to-yellow-50/80 dark:from-amber-900/10 dark:to-yellow-900/10 border border-amber-200/30 dark:border-amber-700/20' : 
                    completed > 0 ? 'bg-primary/5 border border-primary/10' : ''
                  }`}
                >
                  <span className="text-[10px] text-muted-foreground">{dayEmojis[i]}</span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">{dayNames[i]}</span>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center relative">
                    {isFuture ? (
                      <span className="text-muted-foreground/40 text-xs">—</span>
                    ) : completed === 5 ? (
                      <motion.span
                        className="text-2xl"
                        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.15, 1] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      >
                        ⭐
                      </motion.span>
                    ) : completed > 0 ? (
                      <div className="flex flex-wrap gap-0.5 justify-center items-center w-full h-full">
                        {Array.from({ length: completed }).map((_, j) => (
                          <span key={j} className="w-2.5 h-2.5 rounded-full bg-primary/60" />
                        ))}
                        {Array.from({ length: 5 - completed }).map((_, j) => (
                          <span key={j} className="w-2.5 h-2.5 rounded-full bg-muted/40" />
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground/30 text-xs">·</span>
                    )}
                  </div>
                  {/* Completed count below each day */}
                  {!isFuture && (
                    <span className={`text-[9px] font-medium ${
                      completed === 5 ? 'text-amber-600 dark:text-amber-400' : 
                      completed > 0 ? 'text-primary' : 'text-muted-foreground/40'
                    }`}>
                      {completed}/5
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Badges collection - with shine animation on unlocked */}
      <Card className="border-2 border-primary/10 overflow-hidden card-pattern">
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
          {unlockedBadges.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => {
                const isUnlocked = !!badge.unlockedAt;
                return (
                  <motion.div
                    key={badge.id}
                    className={`flex flex-col items-center p-2.5 rounded-xl w-16 text-center transition-all ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 badge-shine'
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
          ) : (
            <div className="empty-state-card">
              <motion.span 
                className="text-3xl block mb-2 sparkle-float"
              >
                ✨
              </motion.span>
              <p className="text-sm font-medium text-foreground/80">
                Explore les aventures pour débloquer des badges ! 🏅
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Star constellation with visual constellation pattern */}
      <Card className="border-2 border-primary/10 overflow-hidden card-pattern">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
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
            <div className="relative overflow-hidden rounded-2xl p-8 text-center"
              style={{
                background: darkMode
                  ? 'linear-gradient(135deg, oklch(0.20 0.04 280 / 80%), oklch(0.18 0.03 280 / 60%), oklch(0.22 0.04 280 / 80%))'
                  : 'linear-gradient(135deg, oklch(0.97 0.02 85 / 80%), oklch(0.95 0.03 80 / 60%), oklch(0.97 0.01 175 / 80%))',
                border: '2px dashed oklch(0.55 0.12 80 / 25%)',
              }}
            >
              {/* Decorative SVG star illustration */}
              <motion.div
                className="mx-auto mb-3 relative w-20 h-20"
                animate={{ rotate: [0, 3, -3, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg viewBox="0 0 80 80" className="w-full h-full" fill="none">
                  {/* Star rays */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <motion.line
                      key={i}
                      x1="40" y1="40"
                      x2={40 + 35 * Math.cos((angle * Math.PI) / 180)}
                      y2={40 + 35 * Math.sin((angle * Math.PI) / 180)}
                      stroke="oklch(0.75 0.14 80 / 40%)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                  {/* Central star */}
                  <polygon
                    points="40,12 46,30 65,30 50,42 56,60 40,48 24,60 30,42 15,30 34,30"
                    fill="oklch(0.75 0.14 80 / 60%)"
                    stroke="oklch(0.55 0.12 80 / 80%)"
                    strokeWidth="1"
                  />
                  {/* Inner glow */}
                  <circle cx="40" cy="35" r="6" fill="oklch(0.90 0.08 85 / 50%)" />
                </svg>
              </motion.div>
              <p className="text-base font-bold text-foreground/80 mb-1">
                Commence ta première pratique pour gagner des étoiles ! 🌟
              </p>
              <p className="text-xs text-foreground/70 mb-3">
                Chaque activité te rapproche de la lumière
              </p>
              <Button
                size="sm"
                className="text-xs"
                onClick={() => setSection('aventures')}
                style={{ background: 'linear-gradient(135deg, #C9A227, #E8D44D)', color: '#3D2C1E' }}
              >
                <BookOpen className="w-3 h-3 mr-1" />
                Aller aux Aventures
              </Button>
            </div>
          )}
          {totalStars > 50 && (
            <p className="text-center text-xs text-muted-foreground mt-2">
              ...et {totalStars - 50} autres ! 🌟
            </p>
          )}
          {totalStars > 0 && (
            <p className="text-center text-sm text-muted-foreground mt-2">
              Total : <span className="font-bold text-gradient-gold">{totalStars}</span> ⭐
            </p>
          )}
        </CardContent>
      </Card>

      {/* Gratitude journal - enhanced with prompt system */}
      <Card className="border-2 border-primary/10 overflow-hidden card-pattern">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span>💛</span>
            Journal de gratitude
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Prompt suggestion with feather pen decoration */}
          <motion.div
            key={currentPrompt}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative flex items-center gap-2 bg-gradient-to-r from-amber-50/80 to-yellow-50/80 dark:from-amber-900/15 dark:to-yellow-900/15 rounded-xl p-3 border border-amber-200/30 dark:border-amber-700/15 mb-3"
          >
            <span className="text-base flex-shrink-0 feather-write">🪶</span>
            <p className="text-xs text-foreground/70 flex-1 italic">{currentPrompt}</p>
            <button
              onClick={rotatePrompt}
              className="text-[10px] text-primary hover:text-primary/80 font-medium flex-shrink-0 px-2 py-1 rounded-lg hover:bg-primary/10 transition-colors"
              aria-label="Changer de suggestion"
            >
              🔄
            </button>
          </motion.div>
          
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

      {/* Achievement Timeline - expandable */}
      <Card className="border-2 border-primary/10 overflow-hidden card-pattern">
        <CardContent className="p-4">
          <AchievementTimeline />
        </CardContent>
      </Card>

      {/* Stats Dashboard */}
      <Card className="border-2 border-primary/10 overflow-hidden card-pattern">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span>📊</span>
            Mes Statistiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StatsDashboard />
        </CardContent>
      </Card>
    </div>
  );
}
