'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function GratitudeJournal() {
  const { gratitudeEntries, addGratitudeEntry } = useAppStore();
  
  const today = new Date().toISOString().split('T')[0];
  const todayEntry = gratitudeEntries.find(e => e.date === today);
  const initialItems = todayEntry
    ? todayEntry.items.length >= 3
      ? todayEntry.items.slice(0, 3)
      : [...todayEntry.items, ...Array(3 - todayEntry.items.length).fill('')]
    : ['', '', ''];
  
  const [items, setItems] = useState<string[]>(initialItems);

  const handleSave = () => {
    const filledItems = items.filter(i => i.trim() !== '');
    if (filledItems.length > 0) {
      addGratitudeEntry({ date: today, items: filledItems });
    }
  };

  return (
    <div className="flex flex-col gap-4 py-4">
      <p className="text-sm text-muted-foreground text-center">
        Écris 3 choses pour lesquelles tu es reconnaissant(e) aujourd&apos;hui 💛
      </p>

      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xl min-w-[28px]">
              {i === 0 ? '1️⃣' : i === 1 ? '2️⃣' : '3️⃣'}
            </span>
            <Input
              value={item}
              onChange={(e) => {
                const newItems = [...items];
                newItems[i] = e.target.value;
                setItems(newItems);
              }}
              placeholder="Je suis reconnaissant(e) pour..."
              className="flex-1"
            />
          </div>
        ))}
      </div>

      <Button onClick={handleSave} className="w-full" disabled={!items.some(i => i.trim())}>
        💛 Sauvegarder
      </Button>

      {todayEntry && todayEntry.items.length > 0 && (
        <div className="bg-primary/10 rounded-xl p-4 mt-2">
          <p className="text-sm font-semibold text-primary mb-2">Aujourd&apos;hui, je dis Alhamdulillah pour :</p>
          <ul className="space-y-1">
            {todayEntry.items.map((item, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span>✨</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
