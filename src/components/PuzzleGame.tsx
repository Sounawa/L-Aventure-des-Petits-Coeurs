'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';

interface PuzzlePiece {
  id: number;
  currentIndex: number;
  correctIndex: number;
  emoji: string;
  label: string;
}

const puzzleSets = [
  {
    name: 'Le Miroir Magique',
    pieces: ['🪞', '✨', '💛', '🌟', '🤲', '🌙'],
    labels: ['Miroir', 'Lumière', 'Cœur', 'Étoile', 'Prières', 'Nuit'],
  },
  {
    name: 'Les Trésors du Cœur',
    pieces: ['💎', '🙏', '🕊️', '💪', '🤝', '❤️'],
    labels: ['Trésor', 'Gratitude', 'Paix', 'Courage', 'Gentillesse', 'Amour'],
  },
  {
    name: 'La Lumière Intérieure',
    pieces: ['🌅', '📖', '🕯️', '🌈', '🗣️', '⭐'],
    labels: ['Aube', 'Sagesse', 'Espoir', 'Promesse', 'Rappel', 'Foi'],
  },
];

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
      style={{
        position: 'fixed',
        left: `${left}%`,
        top: -20,
        zIndex: 100,
      }}
      initial={{ y: -20, opacity: 1, rotate: 0 }}
      animate={{ y: height + 20, opacity: 0, rotate: 360 * (Math.random() > 0.5 ? 1 : -1) }}
      transition={{ duration, delay, ease: 'easeOut' }}
    >
      {shape === 'circle' && (
        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color }} />
      )}
      {shape === 'square' && (
        <div style={{ width: 7, height: 7, borderRadius: 1, backgroundColor: color, transform: 'rotate(45deg)' }} />
      )}
      {shape === 'star' && (
        <span style={{ fontSize: 10 }}>⭐</span>
      )}
    </motion.div>
  );
}

export default function PuzzleGame() {
  const { addStars, setPuzzleCompleted, puzzleCompleted } = useAppStore();
  const [currentSet, setCurrentSet] = useState(0);
  const [pieces, setPieces] = useState<PuzzlePiece[]>(() => {
    // Initialize with shuffled pieces on first render
    const set = puzzleSets[0];
    const correctOrder = set.pieces.map((emoji, i) => ({
      id: i,
      currentIndex: i,
      correctIndex: i,
      emoji,
      label: set.labels[i],
    }));
    // Simple shuffle
    const shuffled = [...correctOrder];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.map((p, newIdx) => ({ ...p, currentIndex: newIdx }));
  });
  const [moves, setMoves] = useState(0);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const completedRef = useRef(false);

  // Direct shuffle function (no useEffect for setState compliance)
  const doShuffle = (setIndex: number) => {
    const set = puzzleSets[setIndex];
    const correctOrder = set.pieces.map((emoji: string, i: number) => ({
      id: i,
      currentIndex: i,
      correctIndex: i,
      emoji,
      label: set.labels[i],
    }));

    let shuffled: PuzzlePiece[];
    do {
      shuffled = [...correctOrder];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      shuffled = shuffled.map((p, newIdx) => ({ ...p, currentIndex: newIdx }));
    } while (shuffled.every(p => p.currentIndex === p.correctIndex));

    setPieces(shuffled);
  };

  const handlePieceClick = (clickedIndex: number) => {
    if (isComplete) return;

    if (selectedPiece === null) {
      setSelectedPiece(clickedIndex);
    } else if (selectedPiece === clickedIndex) {
      setSelectedPiece(null);
    } else {
      // Swap pieces
      const newPieces = [...pieces];
      const tempCurrent = newPieces[selectedPiece].currentIndex;
      newPieces[selectedPiece].currentIndex = newPieces[clickedIndex].currentIndex;
      newPieces[clickedIndex].currentIndex = tempCurrent;

      // Actually swap the positions
      [newPieces[selectedPiece], newPieces[clickedIndex]] = [newPieces[clickedIndex], newPieces[selectedPiece]];

      setPieces(newPieces);
      setSelectedPiece(null);
      setMoves(prev => prev + 1);

      // Check if complete
      const isAllCorrect = newPieces.every((p, idx) => p.correctIndex === idx);
      if (isAllCorrect && !completedRef.current) {
        completedRef.current = true;
        setIsComplete(true);
        setShowConfetti(true);
        addStars(3);
        if (!puzzleCompleted) {
          setPuzzleCompleted();
        }
        setTimeout(() => setShowConfetti(false), 4000);
      }
    }
  };

  const handleNextPuzzle = () => {
    const nextSet = (currentSet + 1) % puzzleSets.length;
    setCurrentSet(nextSet);
    setMoves(0);
    setIsComplete(false);
    setSelectedPiece(null);
    completedRef.current = false;
    doShuffle(nextSet);
  };

  const handleRetry = () => {
    setMoves(0);
    setIsComplete(false);
    setSelectedPiece(null);
    completedRef.current = false;
    doShuffle(currentSet);
  };

  const set = puzzleSets[currentSet];
  const correctCount = pieces.filter((p, idx) => p.correctIndex === idx).length;

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
          <h3 className="text-base font-bold text-gradient-gold">{set.name}</h3>
          <p className="text-xs text-muted-foreground">Puzzle {currentSet + 1}/{puzzleSets.length}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-muted px-2 py-1 rounded-full">{moves} coups</span>
          <span className="text-xs bg-primary/10 px-2 py-1 rounded-full text-primary font-medium">{correctCount}/{pieces.length} ✓</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <motion.div
          className="gradient-progress rounded-full h-2"
          initial={{ width: 0 }}
          animate={{ width: `${(correctCount / pieces.length) * 100}%` }}
          transition={{ duration: 0.4, type: 'spring' }}
        />
      </div>

      {/* Instructions */}
      {!isComplete && (
        <motion.div
          className="bg-gradient-to-r from-teal-50/80 to-cyan-50/80 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl p-3 border border-teal-200/40 dark:border-teal-700/20 text-center"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p className="text-xs text-teal-700 dark:text-teal-300 font-medium">
            {selectedPiece !== null
              ? '✨ Clique sur une autre pièce pour les échanger !'
              : '👆 Clique sur une pièce pour la sélectionner'}
          </p>
        </motion.div>
      )}

      {/* Puzzle grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <AnimatePresence mode="popLayout">
          {pieces.map((piece, idx) => {
            const isCorrect = piece.correctIndex === idx;
            const isSelected = selectedPiece === idx;

            return (
              <motion.button
                key={piece.id}
                layout
                onClick={() => handlePieceClick(idx)}
                className={`relative aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all overflow-hidden ${
                  isComplete
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-300 dark:border-green-600'
                    : isSelected
                    ? 'bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 border-amber-400 dark:border-amber-500 shadow-lg shadow-amber-200/50 dark:shadow-amber-800/30'
                    : isCorrect
                    ? 'bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700/30'
                    : 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-600 hover:border-primary/40 hover:shadow-md'
                }`}
                whileHover={!isComplete ? { scale: 1.05 } : {}}
                whileTap={!isComplete ? { scale: 0.95 } : {}}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <span className="text-3xl sm:text-4xl">{piece.emoji}</span>
                <span className={`text-[10px] sm:text-xs font-medium ${
                  isComplete ? 'text-green-700 dark:text-green-300' : 'text-foreground/70'
                }`}>
                  {piece.label}
                </span>

                {/* Correct indicator */}
                {isCorrect && (
                  <motion.div
                    className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}

                {/* Selected glow ring */}
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-amber-400 dark:border-amber-500"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Target order hint */}
      {!isComplete && (
        <div className="bg-muted/30 rounded-xl p-3 border border-border/30">
          <p className="text-[10px] text-muted-foreground text-center mb-2 font-medium">Ordre correct :</p>
          <div className="flex items-center justify-center gap-1">
            {set.pieces.map((emoji, i) => (
              <span key={i} className="text-base">{emoji}</span>
            ))}
          </div>
        </div>
      )}

      {/* Win screen */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl p-5 text-center border border-amber-200/40 dark:border-amber-700/20"
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
            Tu as reconstitué le puzzle en {moves} coups !
          </p>
          <div className="flex items-center justify-center gap-1 mb-3">
            {moves <= 8 ? '⭐⭐⭐' : moves <= 14 ? '⭐⭐' : '⭐'}
          </div>
          <p className="text-xs text-primary font-medium mb-3">+3 étoiles gagnées ! ⭐</p>
          <div className="flex gap-2 justify-center">
            <motion.button
              onClick={handleRetry}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-card border border-border hover:bg-muted transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🔄 Rejouer
            </motion.button>
            <motion.button
              onClick={handleNextPuzzle}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-400 to-yellow-400 dark:from-amber-600 dark:to-yellow-600 text-amber-900 dark:text-amber-100 shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Puzzle suivant →
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
