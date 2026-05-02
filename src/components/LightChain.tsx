'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const people = ['Maman 💕', 'Papa 💙', 'Un(e) ami(e) 💚', 'Un(e) voisin(e) 🧡', 'Tous les enfants du monde 🌍'];

export default function LightChain() {
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [raysSent, setRaysSent] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);

  const sendRay = (person: string) => {
    setSelectedPerson(person);
    setIsSending(true);
    setTimeout(() => {
      setRaysSent(prev => prev.includes(person) ? prev : [...prev, person]);
      setIsSending(false);
      setSelectedPerson(null);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <p className="text-sm text-muted-foreground text-center">
        Envoie un rayon de lumière à quelqu&apos;un que tu aimes ☀️
      </p>

      {/* Light source */}
      <div className="relative">
        <motion.div
          className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 to-amber-400 flex items-center justify-center shadow-lg shadow-yellow-300/50"
          animate={{ scale: [1, 1.1, 1], boxShadow: ['0 0 20px rgba(234,179,8,0.3)', '0 0 40px rgba(234,179,8,0.5)', '0 0 20px rgba(234,179,8,0.3)'] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-2xl">☀️</span>
        </motion.div>

        {/* Ray animation */}
        {isSending && selectedPerson && (
          <motion.div
            className="absolute top-1/2 left-1/2 w-1 h-1 bg-yellow-400 rounded-full"
            initial={{ x: 0, y: 0, scale: 1 }}
            animate={{ 
              x: Math.random() > 0.5 ? 150 : -150,
              y: Math.random() > 0.5 ? 100 : -100,
              scale: [1, 2, 0],
              opacity: [1, 1, 0]
            }}
            transition={{ duration: 2 }}
          />
        )}
      </div>

      {/* People selection */}
      <div className="flex flex-wrap justify-center gap-2">
        {people.map((person) => {
          const sent = raysSent.includes(person);
          return (
            <motion.button
              key={person}
              onClick={() => !sent && sendRay(person)}
              disabled={sent || isSending}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                sent
                  ? 'bg-yellow-100 text-amber-800 border border-yellow-300'
                  : 'bg-card border border-border hover:border-primary hover:bg-primary/5'
              }`}
              whileTap={!sent ? { scale: 0.95 } : {}}
            >
              {sent ? '✨ ' : ''}{person}
            </motion.button>
          );
        })}
      </div>

      {raysSent.length > 0 && (
        <div className="bg-primary/10 rounded-xl p-3 text-center">
          <p className="text-sm text-primary font-medium">
            Tu as envoyé {raysSent.length} rayon{raysSent.length > 1 ? 's' : ''} de lumière ! 🌟
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            La lumière grandit quand on la partage ✨
          </p>
        </div>
      )}
    </div>
  );
}
