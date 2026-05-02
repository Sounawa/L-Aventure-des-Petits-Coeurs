'use client';

import { motion } from 'framer-motion';
import { useAppStore, type AdventureId } from '@/lib/store';

const adventures = [
  { id: 'miroir' as AdventureId, title: 'Le Miroir Magique', emoji: '🪞', color: 'from-amber-100 to-yellow-200', desc: 'Découvre le miroir enchanté' },
  { id: 'tresors' as AdventureId, title: 'Les Trésors du Cœur', emoji: '💎', color: 'from-emerald-100 to-teal-200', desc: 'Collecte les vertus précieuses' },
  { id: 'lumiere' as AdventureId, title: 'La Lumière Intérieure', emoji: '✨', color: 'from-purple-100 to-indigo-200', desc: 'Comprends la lumière divine' },
];

export default function AdventureSelector() {
  const { currentAdventure, setAdventure } = useAppStore();

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 px-1 custom-scrollbar">
      {adventures.map((adv) => {
        const isActive = currentAdventure === adv.id;
        return (
          <motion.button
            key={adv.id}
            onClick={() => setAdventure(adv.id)}
            className={`flex-shrink-0 px-4 py-3 rounded-2xl border-2 transition-all min-w-[130px] ${
              isActive
                ? 'border-primary bg-gradient-to-br ' + adv.color + ' shadow-md'
                : 'border-border bg-card hover:border-primary/50'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-2xl block">{adv.emoji}</span>
            <span className={`text-xs font-bold block mt-1 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
              {adv.title}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
