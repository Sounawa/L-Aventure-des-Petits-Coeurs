'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';

const CARD_EMOJIS = ['🪞', '💛', '🌟', '🤲', '🌸', '🕊️'];

interface MemoryCard {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createCards(): MemoryCard[] {
  const pairs = [...CARD_EMOJIS, ...CARD_EMOJIS];
  const shuffled = shuffleArray(pairs);
  return shuffled.map((emoji, index) => ({
    id: index,
    emoji,
    isFlipped: false,
    isMatched: false,
  }));
}

// Confetti piece component
function ConfettiPiece({ delay, color }: { delay: number; color: string }) {
  const x = Math.random() * 100;
  const rotation = Math.random() * 360;
  const shape = Math.random() > 0.5 ? 'circle' : Math.random() > 0.5 ? 'square' : 'star';
  const size = 6 + Math.random() * 8;
  const [viewH, setViewH] = useState(600);

  useEffect(() => {
    setViewH(window.innerHeight);
  }, []);

  return (
    <motion.div
      className="absolute top-0"
      style={{ left: `${x}%` }}
      initial={{ y: -20, opacity: 1, rotate: 0 }}
      animate={{
        y: viewH,
        opacity: [1, 1, 0],
        rotate: rotation + 720,
        x: [0, (Math.random() - 0.5) * 100],
      }}
      transition={{
        duration: 2.5 + Math.random() * 1.5,
        delay,
        ease: 'easeOut',
      }}
    >
      {shape === 'circle' ? (
        <div style={{ width: size, height: size, borderRadius: '50%', backgroundColor: color }} />
      ) : shape === 'square' ? (
        <div style={{ width: size, height: size, backgroundColor: color, transform: 'rotate(45deg)' }} />
      ) : (
        <span style={{ fontSize: size + 4 }}>⭐</span>
      )}
    </motion.div>
  );
}

export default function MemoryGame() {
  const { addStars } = useAppStore();
  const [cards, setCards] = useState<MemoryCard[]>(createCards);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [mismatchedIds, setMismatchedIds] = useState<number[]>([]);
  const starsAwarded = useRef(false);

  // Timer
  useEffect(() => {
    if (!isPlaying || isWon) return;
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, isWon]);

  // Award stars on win (derived from state, not in effect)
  useEffect(() => {
    if (isWon && !starsAwarded.current) {
      starsAwarded.current = true;
      const stars = moves <= 10 ? 5 : moves <= 15 ? 3 : 1;
      addStars(stars);
    }
  }, [isWon, moves, addStars]);

  const handleCardClick = useCallback((id: number) => {
    if (isChecking || isWon) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;

    // Start timer on first flip
    if (!isPlaying) setIsPlaying(true);

    const newCards = cards.map(c =>
      c.id === id ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    const newFlipped = [...flippedIds, id];
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      const newMoves = moves + 1;
      setMoves(newMoves);
      setIsChecking(true);

      const [firstId, secondId] = newFlipped;
      const firstCard = newCards.find(c => c.id === firstId)!;
      const secondCard = newCards.find(c => c.id === secondId)!;

      if (firstCard.emoji === secondCard.emoji) {
        // Match!
        const newMatches = matches + 1;
        setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              c.id === firstId || c.id === secondId
                ? { ...c, isMatched: true }
                : c
            )
          );
          setMatches(newMatches);
          setFlippedIds([]);
          setIsChecking(false);
          // Check win
          if (newMatches === CARD_EMOJIS.length) {
            setIsWon(true);
            setIsPlaying(false);
          }
        }, 500);
      } else {
        // Mismatch - shake then flip back
        setMismatchedIds([firstId, secondId]);
        setTimeout(() => {
          setMismatchedIds([]);
          setCards(prev =>
            prev.map(c =>
              c.id === firstId || c.id === secondId
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedIds([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  }, [cards, flippedIds, isChecking, isPlaying, isWon, matches, moves]);

  const handleReplay = () => {
    setCards(createCards());
    setFlippedIds([]);
    setMoves(0);
    setMatches(0);
    setTimeElapsed(0);
    setIsPlaying(false);
    setIsWon(false);
    setIsChecking(false);
    setMismatchedIds([]);
    starsAwarded.current = false;
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const earnedStars = moves <= 10 ? 5 : moves <= 15 ? 3 : 1;

  return (
    <div className="flex flex-col gap-4">
      {/* Stats bar */}
      <div className="flex justify-between items-center bg-primary/5 rounded-xl p-3 border border-primary/10">
        <div className="text-center">
          <p className="text-lg font-bold text-primary">{moves}</p>
          <p className="text-[10px] text-muted-foreground">Coups</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-primary">{formatTime(timeElapsed)}</p>
          <p className="text-[10px] text-muted-foreground">Temps</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-primary">{matches}/{CARD_EMOJIS.length}</p>
          <p className="text-[10px] text-muted-foreground">Paires</p>
        </div>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
        {cards.map((card) => (
          <motion.button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className="relative w-full aspect-square cursor-pointer"
            disabled={card.isFlipped || card.isMatched || isChecking}
            whileTap={!card.isFlipped && !card.isMatched ? { scale: 0.95 } : {}}
          >
            <motion.div
              className="w-full h-full relative"
              style={{ perspective: 600 }}
              animate={{
                rotateY: card.isFlipped || card.isMatched ? 180 : 0,
              }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 200, damping: 25 }}
            >
              {/* Face down (question mark) */}
              <div
                className={`absolute inset-0 rounded-xl flex items-center justify-center border-2 backface-hidden ${
                  card.isMatched
                    ? 'border-green-300 bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/40 dark:to-emerald-800/40'
                    : 'border-primary/30 bg-gradient-to-br from-purple-100 to-violet-200 dark:from-purple-900/40 dark:to-violet-800/40'
                } ${mismatchedIds.includes(card.id) ? 'animate-shake' : ''}`}
                style={{ backfaceVisibility: 'hidden' }}
              >
                <span className="text-2xl sm:text-3xl font-bold text-primary/60">?</span>
              </div>

              {/* Face up (emoji) */}
              <div
                className={`absolute inset-0 rounded-xl flex items-center justify-center border-2 backface-hidden ${
                  card.isMatched
                    ? 'border-green-300 bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/40 dark:to-emerald-800/40 shadow-lg shadow-green-200/50'
                    : 'border-primary/30 bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-800/30'
                }`}
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <span className="text-3xl sm:text-4xl">{card.emoji}</span>
                {card.isMatched && (
                  <motion.div
                    className="absolute inset-0 rounded-xl border-2 border-green-400"
                    initial={{ boxShadow: '0 0 0 0 rgba(34,197,94,0.5)' }}
                    animate={{ boxShadow: '0 0 20px 5px rgba(34,197,94,0.3)' }}
                    transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
                  />
                )}
              </div>
            </motion.div>
          </motion.button>
        ))}
      </div>

      {/* Win overlay */}
      <AnimatePresence>
        {isWon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          >
            {/* Confetti */}
            {Array.from({ length: 30 }).map((_, i) => (
              <ConfettiPiece
                key={i}
                delay={i * 0.05}
                color={['#C9A227', '#2DD4BF', '#F472B6', '#A78BFA', '#FB923C', '#22C55E'][i % 6]}
              />
            ))}

            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <Card className="border-2 border-primary/30 shadow-2xl max-w-sm mx-4">
                <CardHeader className="text-center pb-2">
                  <motion.span
                    className="text-5xl block"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  >
                    🎉
                  </motion.span>
                  <CardTitle className="text-xl text-primary mt-2">
                    Bravo ! Tu as gagné !
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-3">
                  <div className="flex justify-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <motion.span
                        key={i}
                        className="text-2xl"
                        initial={{ scale: 0, y: -20 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.1, type: 'spring' }}
                      >
                        {i < earnedStars ? '⭐' : '☆'}
                      </motion.span>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {earnedStars === 5 ? 'Parfait ! Mémoire extraordinaire ! 🧠' :
                     earnedStars === 3 ? 'Très bien ! Bonne mémoire ! 💪' :
                     'Continue à t\'entraîner ! 🌱'}
                  </p>
                  <div className="bg-primary/5 rounded-xl p-3 space-y-1">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Coups :</span>{' '}
                      <span className="font-bold">{moves}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Temps :</span>{' '}
                      <span className="font-bold">{formatTime(timeElapsed)}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Étoiles gagnées :</span>{' '}
                      <span className="font-bold text-primary">+{earnedStars} ⭐</span>
                    </p>
                  </div>
                  <Button onClick={handleReplay} className="w-full pulse-gold">
                    🔄 Rejouer
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
