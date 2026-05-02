'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const divineNames = [
  {
    name: 'Ar-Rahman',
    meaning: 'Le Très Miséricordieux',
    description: 'Il t\'aime infiniment',
    emoji: '💛',
    color: 'from-amber-200 to-yellow-300',
    textColor: 'text-amber-900',
  },
  {
    name: 'Al-Hadi',
    meaning: 'Le Guide',
    description: 'Il te montre le chemin',
    emoji: '🌿',
    color: 'from-emerald-200 to-green-300',
    textColor: 'text-emerald-900',
  },
  {
    name: 'Al-Wadud',
    meaning: 'Le Tout-Affectueux',
    description: 'Son amour est le plus grand',
    emoji: '💗',
    color: 'from-pink-200 to-rose-300',
    textColor: 'text-pink-900',
  },
  {
    name: 'As-Salam',
    meaning: 'La Paix',
    description: 'Il donne la paix à ton cœur',
    emoji: '💎',
    color: 'from-blue-200 to-cyan-300',
    textColor: 'text-blue-900',
  },
  {
    name: 'An-Nur',
    meaning: 'La Lumière',
    description: 'Il éclaire tout',
    emoji: '✨',
    color: 'from-white to-amber-100',
    textColor: 'text-amber-900',
  },
];

export default function DivineNames() {
  const [activeName, setActiveName] = useState<number | null>(null);

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <p className="text-sm text-muted-foreground text-center">
        Touche un beau nom de Dieu pour découvrir Sa lumière 🌟
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        {divineNames.map((dn, i) => (
          <motion.button
            key={dn.name}
            onClick={() => setActiveName(activeName === i ? null : i)}
            className={`relative px-4 py-3 rounded-2xl bg-gradient-to-br ${dn.color} ${dn.textColor} shadow-md transition-shadow hover:shadow-lg min-w-[100px]`}
            whileTap={{ scale: 0.95 }}
            animate={activeName === i ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            <span className="text-2xl block">{dn.emoji}</span>
            <span className="text-sm font-bold block mt-1">{dn.name}</span>
            
            {/* Glow effect when active */}
            {activeName === i && (
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-white/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Active name detail */}
      {activeName !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-br ${divineNames[activeName].color} rounded-2xl p-6 max-w-sm w-full text-center shadow-lg`}
        >
          <span className="text-4xl block mb-2">{divineNames[activeName].emoji}</span>
          <h3 className={`text-xl font-bold ${divineNames[activeName].textColor}`}>
            {divineNames[activeName].name}
          </h3>
          <p className={`text-sm font-medium ${divineNames[activeName].textColor} mt-1`}>
            {divineNames[activeName].meaning}
          </p>
          <p className={`text-base mt-3 ${divineNames[activeName].textColor} font-semibold`}>
            &ldquo;{divineNames[activeName].description}&rdquo;
          </p>
        </motion.div>
      )}
    </div>
  );
}
