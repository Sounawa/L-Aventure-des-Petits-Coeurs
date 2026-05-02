'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';

interface ScrambleWord {
  word: string;
  hint: string;
  emoji: string;
}

const WORDS: ScrambleWord[] = [
  { word: 'Miroir', hint: 'Un objet qui reflète ton image', emoji: '🪞' },
  { word: 'Cœur', hint: 'L\'organe qui bat dans ta poitrine', emoji: '💛' },
  { word: 'Lumière', hint: 'Ce qui éclaire l\'obscurité', emoji: '🌟' },
  { word: 'Patience', hint: 'Savoir attendre sans se fâcher', emoji: '⏳' },
  { word: 'Gentillesse', hint: 'Être doux et bienveillant', emoji: '🌸' },
  { word: 'Gratitude', hint: 'Être reconnaissant pour ce qu\'on a', emoji: '🙏' },
  { word: 'Courage', hint: 'Faire ce qui est bien même quand on a peur', emoji: '💪' },
  { word: 'Amour', hint: 'Le plus beau sentiment du monde', emoji: '❤️' },
  { word: 'Paix', hint: 'Quand tout est calme et serein', emoji: '🕊️' },
  { word: 'Sagesse', hint: 'Comprendre ce qui est juste et bon', emoji: '🦉' },
  { word: 'Prière', hint: 'Parler à Dieu avec son cœur', emoji: '🤲' },
  { word: 'Espoir', hint: 'Croire que demain sera meilleur', emoji: '🌈' },
];

function scrambleWord(word: string): string {
  const chars = word.split('');
  let scrambled = chars;
  let attempts = 0;
  do {
    scrambled = [...chars];
    for (let i = scrambled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [scrambled[i], scrambled[j]] = [scrambled[j], scrambled[i]];
    }
    attempts++;
  } while (scrambled.join('') === word && attempts < 20);
  return scrambled.join('');
}

// Confetti piece for win screen
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

export default function WordScramble() {
  const { wordScrambleCompleted, wordScrambleBestScore, setWordScrambleCompleted, addStars } = useAppStore();

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [scrambled, setScrambled] = useState(() => scrambleWord(WORDS[0].word));
  const [placedLetters, setPlacedLetters] = useState<(string | null)[]>(
    () => Array(WORDS[0].word.length).fill(null)
  );
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());
  const [hintVisible, setHintVisible] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [totalStarsEarned, setTotalStarsEarned] = useState(0);
  const [wordsCompleted, setWordsCompleted] = useState(0);

  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completedRef = useRef(false);

  // Start hint timer when word changes
  useEffect(() => {
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    hintTimerRef.current = setTimeout(() => {
      setHintVisible(true);
    }, 5000);
    return () => {
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    };
  }, [currentWordIndex]);

  const currentWord = WORDS[currentWordIndex];
  const wordLength = currentWord.word.length;

  const handleLetterTap = useCallback((letterIndex: number) => {
    if (usedIndices.has(letterIndex) || isCorrect) return;

    const newUsed = new Set(usedIndices);
    newUsed.add(letterIndex);
    setUsedIndices(newUsed);

    const nextEmptySlot = placedLetters.findIndex(l => l === null);
    if (nextEmptySlot === -1) return;

    const newPlaced = [...placedLetters];
    newPlaced[nextEmptySlot] = scrambled[letterIndex];
    setPlaced(newPlaced);

    // Check if word is complete
    const filled = newPlaced.filter(l => l !== null).length;
    if (filled === wordLength) {
      const attempt = newPlaced.join('');
      if (attempt === currentWord.word) {
        // Correct!
        setIsCorrect(true);
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        const wordStars = !hintVisible && newAttempts <= 1 ? 3 : hintVisible && newAttempts <= 1 ? 2 : 1;
        const newScore = score + wordStars;
        setScore(newScore);
        setTotalStarsEarned(prev => prev + wordStars);
      } else {
        // Wrong - shake
        setIsWrong(true);
        setAttempts(prev => prev + 1);
        setTimeout(() => {
          setIsWrong(false);
          setPlacedLetters(Array(wordLength).fill(null));
          setUsedIndices(new Set());
        }, 800);
      }
    }
  }, [usedIndices, isCorrect, placedLetters, scrambled, wordLength, currentWord.word, attempts, hintVisible, score]);

  const handleSlotTap = useCallback((slotIndex: number) => {
    if (placedLetters[slotIndex] === null || isCorrect) return;

    const letter = placedLetters[slotIndex];
    const newPlaced = [...placedLetters];
    newPlaced[slotIndex] = null;
    setPlacedLetters(newPlaced);

    // Remove the first used index matching this letter
    const newUsed = new Set(usedIndices);
    for (const idx of newUsed) {
      if (scrambled[idx] === letter) {
        newUsed.delete(idx);
        break;
      }
    }
    setUsedIndices(newUsed);
  }, [placedLetters, isCorrect, scrambled, usedIndices]);

  const handleNextWord = useCallback(() => {
    const newWordsCompleted = wordsCompleted + 1;
    setWordsCompleted(newWordsCompleted);

    if (currentWordIndex < WORDS.length - 1) {
      const nextIdx = currentWordIndex + 1;
      setCurrentWordIndex(nextIdx);
      setScrambled(scrambleWord(WORDS[nextIdx].word));
      setPlacedLetters(Array(WORDS[nextIdx].word.length).fill(null));
      setUsedIndices(new Set());
      setHintVisible(false);
      setAttempts(0);
      setIsCorrect(false);
      setIsWrong(false);
    } else {
      // Game finished
      setGameFinished(true);
      if (!completedRef.current) {
        completedRef.current = true;
        setWordScrambleCompleted(score);
        addStars(2);
      }
    }
  }, [currentWordIndex, wordsCompleted, score, setWordScrambleCompleted, addStars]);

  const handleReplay = () => {
    setCurrentWordIndex(0);
    setScrambled(scrambleWord(WORDS[0].word));
    setPlacedLetters(Array(WORDS[0].word.length).fill(null));
    setUsedIndices(new Set());
    setHintVisible(false);
    setAttempts(0);
    setIsCorrect(false);
    setIsWrong(false);
    setScore(0);
    setGameFinished(false);
    setTotalStarsEarned(0);
    setWordsCompleted(0);
    completedRef.current = false;
  };

  // Star rating for current word
  const currentWordStars = isCorrect
    ? (!hintVisible && attempts === 0 ? 3 : hintVisible && attempts === 0 ? 2 : 1)
    : 0;

  // Game finished screen
  if (gameFinished) {
    const finalRating = totalStarsEarned >= 30 ? 3 : totalStarsEarned >= 20 ? 2 : 1;
    return (
      <div className="flex flex-col items-center gap-4 py-4 relative">
        {/* Confetti */}
        {Array.from({ length: 25 }).map((_, i) => (
          <ConfettiPiece
            key={i}
            delay={i * 0.05}
            color={['#C9A227', '#F472B6', '#2DD4BF', '#A78BFA', '#FB923C', '#22C55E'][i % 6]}
          />
        ))}

        <motion.span
          className="text-5xl"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          🎉
        </motion.span>
        <h3 className="text-xl font-bold text-gradient-gold">Mots Mélangés terminé !</h3>

        <div className="flex justify-center gap-1">
          {[1, 2, 3].map(i => (
            <motion.span
              key={i}
              className="text-3xl"
              initial={{ scale: 0, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15, type: 'spring' }}
            >
              {i <= finalRating ? '⭐' : '☆'}
            </motion.span>
          ))}
        </div>

        <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-xl p-4 text-center border border-rose-200/50 dark:border-rose-700/30 space-y-2 w-full">
          <p className="text-sm">
            <span className="text-muted-foreground">Score :</span>{' '}
            <span className="font-bold text-gradient-gold">{totalStarsEarned}/36</span>
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">Mots trouvés :</span>{' '}
            <span className="font-bold">{WORDS.length}/12</span>
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">Étoiles gagnées :</span>{' '}
            <span className="font-bold text-primary">+2 ⭐</span>
          </p>
          {wordScrambleBestScore > 0 && (
            <p className="text-xs text-muted-foreground">
              Meilleur score : {wordScrambleBestScore}/36
            </p>
          )}
        </div>

        <p className="text-sm text-center">
          {finalRating === 3
            ? '🌟 Incroyable ! Tu es un vrai magicien des mots !'
            : finalRating === 2
            ? '💪 Bravo ! Tu connais bien les mots du cœur !'
            : '🌱 Continue à t\'entraîner, tu vas devenir fort !'}
        </p>

        <Button onClick={handleReplay} className="w-full pulse-gold">
          🔄 Rejouer
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-2">
      {/* Progress bar */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Mot {currentWordIndex + 1}/{WORDS.length}
        </span>
        <span className="text-sm font-medium text-gradient-gold">
          {score} ⭐
        </span>
      </div>

      <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
        <motion.div
          className="gradient-progress rounded-full h-2.5"
          initial={{ width: 0 }}
          animate={{ width: `${((currentWordIndex + 1) / WORDS.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Word area */}
      <div className="bg-gradient-to-br from-rose-50/80 to-pink-50/80 dark:from-rose-900/10 dark:to-pink-900/10 rounded-2xl p-5 border border-rose-200/40 dark:border-rose-700/20">
        {/* Hint */}
        <AnimatePresence>
          {hintVisible && !isCorrect && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="text-center mb-4"
            >
              <span className="text-2xl">{currentWord.emoji}</span>
              <p className="text-xs text-muted-foreground mt-1 italic">
                💡 {currentWord.hint}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Answer slots */}
        <div className="flex justify-center gap-1.5 sm:gap-2 mb-6">
          {placedLetters.map((letter, i) => (
            <motion.button
              key={`slot-${currentWordIndex}-${i}`}
              onClick={() => handleSlotTap(i)}
              className={`w-9 h-11 sm:w-11 sm:h-13 rounded-lg border-2 flex items-center justify-center text-base sm:text-lg font-bold transition-all ${
                letter !== null
                  ? isCorrect
                    ? 'bg-green-100 border-green-400 text-green-700 dark:bg-green-900/30 dark:border-green-600 dark:text-green-400'
                    : 'bg-card border-primary/40 text-primary cursor-pointer hover:border-primary'
                  : isWrong
                  ? 'bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-600 animate-shake'
                  : 'bg-card border-dashed border-muted-foreground/30'
              }`}
              whileTap={letter !== null && !isCorrect ? { scale: 0.9 } : {}}
              layout
            >
              {letter || ''}
            </motion.button>
          ))}
        </div>

        {/* Scrambled letter tiles */}
        <div className="flex justify-center gap-1.5 sm:gap-2 flex-wrap">
          {scrambled.split('').map((letter, i) => {
            const isUsed = usedIndices.has(i);
            return (
              <motion.button
                key={`tile-${currentWordIndex}-${i}`}
                onClick={() => handleLetterTap(i)}
                disabled={isUsed || isCorrect}
                className={`w-9 h-11 sm:w-11 sm:h-13 rounded-xl border-2 flex items-center justify-center text-base sm:text-lg font-bold shadow-sm transition-all ${
                  isUsed
                    ? 'bg-muted/50 border-muted text-muted-foreground opacity-40'
                    : 'bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 border-rose-300 dark:border-rose-600 text-rose-700 dark:text-rose-300 hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer'
                }`}
                whileTap={!isUsed && !isCorrect ? { scale: 0.9 } : {}}
                layout
              >
                {letter}
              </motion.button>
            );
          })}
        </div>

        {/* Correct feedback */}
        <AnimatePresence>
          {isCorrect && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center mt-4 space-y-2"
            >
              <motion.div
                className="inline-block bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-300 dark:border-green-600 rounded-xl px-4 py-2"
                initial={{ y: 10 }}
                animate={{ y: 0 }}
              >
                <span className="text-sm font-bold text-green-700 dark:text-green-400">
                  ✅ Bravo ! {currentWord.word}
                </span>
              </motion.div>
              <div className="flex justify-center gap-1">
                {[1, 2, 3].map(s => (
                  <motion.span
                    key={s}
                    className="text-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: s * 0.1, type: 'spring' }}
                  >
                    {s <= currentWordStars ? '⭐' : '☆'}
                  </motion.span>
                ))}
              </div>
              <Button
                onClick={handleNextWord}
                size="sm"
                className="bg-gradient-to-r from-rose-400 to-pink-500 text-white hover:from-rose-500 hover:to-pink-600 mt-2"
              >
                {currentWordIndex < WORDS.length - 1 ? 'Mot suivant →' : 'Voir le résultat 🎉'}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wrong feedback */}
        <AnimatePresence>
          {isWrong && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-center mt-3 text-sm font-medium text-red-500"
            >
              ❌ Pas tout à fait... Essaie encore !
            </motion.p>
          )}
        </AnimatePresence>

        {/* Attempts counter */}
        {attempts > 0 && !isCorrect && (
          <p className="text-center mt-2 text-xs text-muted-foreground">
            Tentative{attempts > 1 ? 's' : ''} : {attempts}
          </p>
        )}
      </div>
    </div>
  );
}
