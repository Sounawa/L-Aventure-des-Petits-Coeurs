'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';

// 3x3 sliding puzzle - 8 tiles + 1 empty
interface SlidingPuzzleState {
  tiles: number[]; // 0 = empty, 1-8 = tile numbers
  emptyIndex: number;
}

const puzzleThemes = [
  {
    name: 'Le Miroir Magique',
    emoji: '🪞',
    tiles: ['🪞', '✨', '💛', '🌟', '🌙', '🕊️', '🤲', '🌸'],
    bgGradient: 'from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20',
    borderColor: 'border-amber-200/50 dark:border-amber-700/30',
  },
  {
    name: 'Les Trésors du Cœur',
    emoji: '💎',
    tiles: ['💎', '🙏', '🕊️', '💪', '🤝', '❤️', '🌟', '🌸'],
    bgGradient: 'from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20',
    borderColor: 'border-teal-200/50 dark:border-teal-700/30',
  },
  {
    name: 'La Lumière Intérieure',
    emoji: '🌟',
    tiles: ['🌅', '📖', '🕯️', '🌈', '💫', '⭐', '💜', '🕊️'],
    bgGradient: 'from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20',
    borderColor: 'border-purple-200/50 dark:border-purple-700/30',
  },
];

// Goal state: [1, 2, 3, 4, 5, 6, 7, 8, 0]
const GOAL: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 0];

function isSolvable(tiles: number[]): boolean {
  const inversions = tiles.reduce((count, tile, i) => {
    if (tile === 0) return count;
    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[j] !== 0 && tiles[j] < tile) count++;
    }
    return count;
  }, 0);
  return inversions % 2 === 0;
}

function generatePuzzle(): SlidingPuzzleState {
  let tiles: number[];
  do {
    tiles = [...GOAL];
    // Fisher-Yates shuffle
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
  } while (!isSolvable(tiles) || tiles.every((t, i) => t === GOAL[i]));

  return {
    tiles,
    emptyIndex: tiles.indexOf(0),
  };
}

function isAdjacent(indexA: number, indexB: number): boolean {
  const rowA = Math.floor(indexA / 3);
  const colA = indexA % 3;
  const rowB = Math.floor(indexB / 3);
  const colB = indexB % 3;
  return Math.abs(rowA - rowB) + Math.abs(colA - colB) === 1;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function ConfettiPiece({ index }: { index: number }) {
  const [height, setHeight] = useState(0);
  useEffect(() => {
    setHeight(window.innerHeight);
  }, []);

  if (!height) return null;

  const colors = ['#C9A227', '#2DD4BF', '#F472B6', '#A78BFA', '#FB923C'];
  const shapes = ['circle', 'square', 'star'] as const;
  const color = colors[index % colors.length];
  const shape = shapes[index % shapes.length];
  const left = Math.random() * 100;
  const delay = Math.random() * 0.5;
  const duration = 2 + Math.random() * 1.5;

  return (
    <motion.div
      style={{ position: 'fixed', left: `${left}%`, top: -20, zIndex: 100 }}
      initial={{ y: -20, opacity: 1, rotate: 0 }}
      animate={{ y: height + 20, opacity: 0, rotate: 360 * (Math.random() > 0.5 ? 1 : -1) }}
      transition={{ duration, delay, ease: 'easeOut' }}
    >
      {shape === 'circle' && <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color }} />}
      {shape === 'square' && <div style={{ width: 7, height: 7, borderRadius: 1, backgroundColor: color, transform: 'rotate(45deg)' }} />}
      {shape === 'star' && <span style={{ fontSize: 10 }}>⭐</span>}
    </motion.div>
  );
}

export default function PuzzleGame() {
  const { addStars, setPuzzleCompleted, puzzleCompleted } = useAppStore();
  const [currentTheme, setCurrentTheme] = useState(0);
  const [puzzle, setPuzzle] = useState<SlidingPuzzleState>(() => generatePuzzle());
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const completedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer
  useEffect(() => {
    if (isTimerRunning && !isComplete) {
      timerRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, isComplete]);

  const handleTileClick = useCallback((tileIndex: number) => {
    if (isComplete) return;
    if (!isAdjacent(tileIndex, puzzle.emptyIndex)) return;

    // Start timer on first move
    if (!isTimerRunning) setIsTimerRunning(true);

    const newTiles = [...puzzle.tiles];
    newTiles[puzzle.emptyIndex] = newTiles[tileIndex];
    newTiles[tileIndex] = 0;

    const newPuzzle = { tiles: newTiles, emptyIndex: tileIndex };
    setPuzzle(newPuzzle);
    setMoves(prev => prev + 1);

    // Check win
    if (newTiles.every((t, i) => t === GOAL[i]) && !completedRef.current) {
      completedRef.current = true;
      setIsComplete(true);
      setIsTimerRunning(false);
      setShowConfetti(true);
      addStars(3);
      if (!puzzleCompleted) {
        setPuzzleCompleted();
      }
      setTimeout(() => setShowConfetti(false), 4000);
    }
  }, [puzzle, isComplete, isTimerRunning, addStars, setPuzzleCompleted, puzzleCompleted]);

  const handleReset = useCallback(() => {
    setPuzzle(generatePuzzle());
    setMoves(0);
    setSeconds(0);
    setIsTimerRunning(false);
    setIsComplete(false);
    completedRef.current = false;
  }, []);

  const handleNextTheme = useCallback(() => {
    const next = (currentTheme + 1) % puzzleThemes.length;
    setCurrentTheme(next);
    setPuzzle(generatePuzzle());
    setMoves(0);
    setSeconds(0);
    setIsTimerRunning(false);
    setIsComplete(false);
    completedRef.current = false;
  }, [currentTheme]);

  const theme = puzzleThemes[currentTheme];

  // Star rating based on moves
  const starRating = moves <= 20 ? 3 : moves <= 35 ? 2 : 1;

  return (
    <div className="flex flex-col gap-4 py-4">
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 25 }).map((_, i) => (
            <ConfettiPiece key={i} index={i} />
          ))}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gradient-gold">{theme.name}</h3>
          <p className="text-xs text-muted-foreground">Puzzle {currentTheme + 1}/{puzzleThemes.length}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-muted px-2 py-1 rounded-full">⏱️ {formatTime(seconds)}</span>
          <span className="text-xs bg-primary/10 px-2 py-1 rounded-full text-primary font-medium">{moves} coups</span>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <motion.div
          className="gradient-progress rounded-full h-2"
          initial={{ width: 0 }}
          animate={{ width: `${(puzzle.tiles.filter((t, i) => t === GOAL[i]).length / 9) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Instructions */}
      {!isComplete && (
        <motion.div
          className={`bg-gradient-to-r ${theme.bgGradient} rounded-xl p-3 border ${theme.borderColor} text-center`}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p className="text-xs text-foreground/70 font-medium">
            👆 Glisse les tuiles pour reconstituer l&apos;image !
          </p>
        </motion.div>
      )}

      {/* Puzzle grid */}
      <div className="flex justify-center">
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2" style={{ width: 'min(280px, 85vw)', height: 'min(280px, 85vw)' }}>
          {puzzle.tiles.map((tile, index) => {
            const isEmpty = tile === 0;
            const isCorrect = tile === GOAL[index] && !isEmpty;
            const row = Math.floor(index / 3);
            const col = index % 3;

            return (
              <motion.button
                key={`pos-${index}`}
                onClick={() => handleTileClick(index)}
                disabled={isEmpty || isComplete}
                className={`relative aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all overflow-hidden ${
                  isEmpty
                    ? 'bg-muted/10 border-2 border-dashed border-muted-foreground/10'
                    : isComplete
                    ? `bg-gradient-to-br ${theme.bgGradient} border-2 border-green-300 dark:border-green-600 shadow-sm`
                    : isCorrect
                    ? `bg-gradient-to-br ${theme.bgGradient} border-2 border-green-200 dark:border-green-700/30 shadow-sm`
                    : `bg-card border-2 border-border/50 hover:border-primary/40 hover:shadow-md`
                } ${!isEmpty && !isComplete ? 'cursor-pointer active:scale-95' : ''}`}
                layout={false}
                style={{ touchAction: 'manipulation' }}
              >
                {!isEmpty && (
                  <>
                    {/* Tile emoji */}
                    <motion.span
                      className="text-2xl sm:text-3xl"
                      layout
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                      {theme.tiles[tile - 1]}
                    </motion.span>
                    {/* Tile number */}
                    <span className={`text-[9px] font-bold ${
                      isComplete ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground/50'
                    }`}>
                      {tile}
                    </span>
                    {/* Correct position indicator */}
                    {isCorrect && !isComplete && (
                      <motion.div
                        className="absolute top-0.5 right-0.5 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    )}
                  </>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Target hint */}
      {!isComplete && (
        <div className="bg-muted/30 rounded-xl p-3 border border-border/30">
          <p className="text-[10px] text-muted-foreground text-center mb-2 font-medium">Objectif :</p>
          <div className="grid grid-cols-3 gap-0.5 max-w-[120px] mx-auto">
            {GOAL.map((tile, i) => (
              <div key={i} className="w-8 h-8 rounded-md flex items-center justify-center text-[10px] bg-muted/50 border border-border/20">
                {tile === 0 ? '' : theme.tiles[tile - 1]}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Win screen */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-br ${theme.bgGradient} rounded-2xl p-5 text-center border ${theme.borderColor}`}
        >
          <motion.span
            className="text-5xl block mb-2"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            🎉
          </motion.span>
          <h3 className="text-lg font-bold text-gradient-gold mb-1">Bravo !</h3>
          <p className="text-sm text-foreground/70 mb-2">
            Puzzle reconstitué en {moves} coups et {formatTime(seconds)} !
          </p>
          <div className="flex items-center justify-center gap-1 mb-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.span
                key={i}
                className="text-xl"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: i < starRating ? 1 : 0.5, rotate: 0 }}
                transition={{ delay: 0.3 + i * 0.15, type: 'spring', stiffness: 300 }}
                style={{ opacity: i < starRating ? 1 : 0.2 }}
              >
                ⭐
              </motion.span>
            ))}
          </div>
          <p className="text-xs text-primary font-medium mb-3">+3 étoiles gagnées ! ⭐</p>
          <div className="flex gap-2 justify-center">
            <motion.button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-card border border-border hover:bg-muted transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🔄 Rejouer
            </motion.button>
            <motion.button
              onClick={handleNextTheme}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-400 to-yellow-400 dark:from-amber-600 dark:to-yellow-600 text-amber-900 dark:text-amber-100 shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Thème suivant →
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Reset button during play */}
      {!isComplete && moves > 0 && (
        <div className="flex justify-center">
          <Button variant="outline" size="sm" onClick={handleReset} className="text-xs">
            🔄 Nouveau puzzle
          </Button>
        </div>
      )}
    </div>
  );
}
