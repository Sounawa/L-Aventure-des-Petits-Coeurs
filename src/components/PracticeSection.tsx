'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const practiceItems = [
  { id: 'prayers', label: "J'ai dit mes prières aujourd'hui", emoji: '🤲' },
  { id: 'kindness', label: "J'ai fait un acte de gentillesse", emoji: '🌸' },
  { id: 'breathing', label: "J'ai respiré calmement 3 fois", emoji: '🌬️' },
  { id: 'gratitude', label: 'J\'ai dit "merci" (Alhamdulillah) pour quelque chose', emoji: '💛' },
  { id: 'silence', label: "J'ai écouté mon cœur dans le silence", emoji: '💜' },
];

export default function PracticeSection() {
  const { practiceDays, updatePracticeDay, gratitudeEntries, addGratitudeEntry, totalStars } = useAppStore();
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
    d.setDate(d.getDate() - d.getDay() + i);
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

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center py-2">
        <h2 className="text-2xl font-bold text-primary">⭐ Ma Pratique</h2>
        <p className="text-sm text-muted-foreground mt-1">Ton journal spirituel quotidien</p>
      </div>

      {/* Today's checklist */}
      <Card>
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
          <div className="space-y-3">
            {practiceItems.map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <Checkbox
                  checked={checked[item.id as keyof typeof checked] as boolean}
                  onCheckedChange={() => toggleItem(item.id)}
                />
                <span className="text-lg">{item.emoji}</span>
                <span className="text-sm flex-1">{item.label}</span>
              </label>
            ))}
          </div>

          {allCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 bg-primary/10 rounded-xl p-3 text-center"
            >
              <p className="text-sm font-bold text-primary">🌟 Bravo ! Journée complétée ! +5 étoiles 🌟</p>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Weekly view */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">📅 Cette semaine</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between gap-1">
            {weekDays.map((day, i) => {
              const practice = practiceDays.find(d => d.date === day);
              const completed = practice
                ? Object.entries(practice).filter(([k, v]) => k !== 'date' && v).length
                : 0;
              const isToday = day === today;
              return (
                <div
                  key={day}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl ${
                    isToday ? 'bg-primary/10 border border-primary/30' : ''
                  }`}
                >
                  <span className="text-xs text-muted-foreground">{dayNames[i]}</span>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    {completed === 5 ? '⭐' : completed > 0 ? `${completed}` : '·'}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Star constellation */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">🌟 Tes étoiles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1 justify-center">
            {Array.from({ length: Math.min(totalStars, 50) }).map((_, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="text-sm"
              >
                ⭐
              </motion.span>
            ))}
            {totalStars === 0 && (
              <p className="text-sm text-muted-foreground">
                Complète des activités pour gagner des étoiles !
              </p>
            )}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-2">
            Total : {totalStars} ⭐
          </p>
        </CardContent>
      </Card>

      {/* Gratitude journal */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">💛 Journal de gratitude</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={gratitudeText}
            onChange={(e) => setGratitudeText(e.target.value)}
            placeholder="Écris ce pour quoi tu es reconnaissant(e) aujourd'hui... (une chose par ligne)"
            rows={3}
          />
          <Button onClick={saveGratitude} className="w-full mt-2" disabled={!gratitudeText.trim()}>
            💛 Ajouter
          </Button>

          {gratitudeEntries.length > 0 && (
            <div className="mt-4 space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
              {gratitudeEntries.slice().reverse().slice(0, 7).map((entry) => (
                <div key={entry.date} className="bg-muted/50 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">{entry.date}</p>
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
