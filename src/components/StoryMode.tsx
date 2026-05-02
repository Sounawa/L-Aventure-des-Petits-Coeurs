'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, type AdventureId } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { X, Play, Pause, BookOpen, Gauge, ChevronLeft, ChevronRight } from 'lucide-react';

interface StoryModeProps {
  story: string;
  title: string;
  adventureId: string;
  chapterNum: number;
  isOpen: boolean;
  onClose: () => void;
}

const adventureGradients: Record<string, string> = {
  miroir: 'from-amber-900/80 via-amber-800/70 to-yellow-900/80',
  tresors: 'from-teal-900/80 via-teal-800/70 to-cyan-900/80',
  lumiere: 'from-purple-900/80 via-purple-800/70 to-indigo-900/80',
};

const adventureLightGradients: Record<string, string> = {
  miroir: 'from-amber-100 via-amber-50 to-yellow-100',
  tresors: 'from-teal-100 via-teal-50 to-cyan-100',
  lumiere: 'from-purple-100 via-purple-50 to-indigo-100',
};

const adventureEmojis: Record<string, string[]> = {
  miroir: ['🪞', '✨', '🌙', '💫', '⭐', '🌟'],
  tresors: ['💎', '💛', '🌸', '🕊️', '🌟', '✨'],
  lumiere: ['🌟', '✨', '💜', '💫', '🌙', '⭐'],
};

// Illustration emojis for each paragraph index
const illustrationEmojis = ['🪞', '🌙', '⭐', '💫', '🌟', '✨', '🕊️', '🌸', '💛', '💎'];

type SpeedLevel = 'slow' | 'medium' | 'fast';

const SPEED_CONFIG: Record<SpeedLevel, { label: string; ms: number; emoji: string }> = {
  slow: { label: 'Lent', ms: 1000, emoji: '🐢' },
  medium: { label: 'Moyen', ms: 667, emoji: '🚶' },
  fast: { label: 'Rapide', ms: 400, emoji: '🏃' },
};

const SPEED_ORDER: SpeedLevel[] = ['slow', 'medium', 'fast'];

// Page turn animation variants
const pageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    rotateY: direction > 0 ? 15 : -15,
  }),
  center: {
    x: 0,
    opacity: 1,
    rotateY: 0,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    rotateY: direction > 0 ? -15 : 15,
  }),
};

function StoryModeContent({ story, title, adventureId, chapterNum, onClose }: Omit<StoryModeProps, 'isOpen'>) {
  const { markChapterRead, darkMode, bedtimeMode } = useAppStore();
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWordHighlight, setIsWordHighlight] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [speed, setSpeed] = useState<SpeedLevel>('medium');
  const [isManual, setIsManual] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completedRef = useRef(false);

  const paragraphs = useMemo(() => story.split('\n').filter(p => p.trim()), [story]);
  const totalPages = paragraphs.length;

  // Current page words for word-by-word highlighting
  const currentPageWords = useMemo(() => {
    if (currentPage < paragraphs.length) {
      return paragraphs[currentPage].split(/\s+/).filter(w => w.trim());
    }
    return [];
  }, [paragraphs, currentPage]);

  const speedMs = SPEED_CONFIG[speed].ms;

  // Word-by-word highlight animation
  useEffect(() => {
    if (isPlaying && !isManual && currentWordIndex < currentPageWords.length) {
      intervalRef.current = setInterval(() => {
        setCurrentWordIndex(prev => {
          if (prev >= currentPageWords.length - 1) {
            // Auto advance to next page
            if (currentPage < totalPages - 1) {
              setTimeout(() => {
                setDirection(1);
                setCurrentPage(prevPage => prevPage + 1);
                setCurrentWordIndex(0);
              }, 500);
            } else {
              setIsPlaying(false);
            }
            return prev;
          }
          return prev + 1;
        });
      }, speedMs);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, isManual, currentWordIndex, currentPageWords.length, speedMs, currentPage, totalPages]);

  const overallProgress = useMemo(() => {
    if (totalPages === 0) return 0;
    const pageProgress = currentPage / totalPages;
    const wordProgress = currentPageWords.length > 0 ? currentWordIndex / currentPageWords.length / totalPages : 0;
    return Math.min(pageProgress + wordProgress, 1);
  }, [currentPage, totalPages, currentWordIndex, currentPageWords.length]);

  const handlePlayPause = useCallback(() => {
    if (!isWordHighlight) {
      setIsWordHighlight(true);
    }
    if (currentWordIndex >= currentPageWords.length - 1 && currentPage >= totalPages - 1) {
      setCurrentWordIndex(0);
      setCurrentPage(0);
      setDirection(0);
      setIsPlaying(true);
      setIsManual(false);
    } else {
      setIsPlaying(prev => !prev);
      setIsManual(false);
    }
  }, [currentWordIndex, currentPageWords.length, currentPage, totalPages, isWordHighlight]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setDirection(1);
      setCurrentPage(prev => prev + 1);
      setCurrentWordIndex(0);
      setIsManual(true);
      setIsPlaying(false);
    }
  }, [currentPage, totalPages]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage(prev => prev - 1);
      setCurrentWordIndex(-1);
      setIsManual(true);
      setIsPlaying(false);
    }
  }, [currentPage]);

  const handleSpeedChange = useCallback(() => {
    const currentIdx = SPEED_ORDER.indexOf(speed);
    const nextIdx = (currentIdx + 1) % SPEED_ORDER.length;
    setSpeed(SPEED_ORDER[nextIdx]);
  }, [speed]);

  const handleFinishReading = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    markChapterRead(adventureId as AdventureId, chapterNum);
    setIsCompleted(true);
  }, [markChapterRead, adventureId, chapterNum]);

  const handleClose = useCallback(() => {
    setIsPlaying(false);
    onClose();
  }, [onClose]);

  const gradient = darkMode || bedtimeMode
    ? adventureGradients[adventureId] || adventureGradients.miroir
    : adventureLightGradients[adventureId] || adventureLightGradients.miroir;

  const emojis = adventureEmojis[adventureId] || adventureEmojis.miroir;
  const isDark = darkMode || bedtimeMode;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col"
    >
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />

      {/* Decorative floating emojis */}
      {emojis.map((emoji, i) => (
        <motion.span
          key={i}
          className="absolute text-2xl sm:text-3xl pointer-events-none select-none"
          style={{
            left: `${10 + (i * 15) % 80}%`,
            top: `${5 + (i * 18) % 70}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, (i % 2 === 0 ? 10 : -10), 0],
            opacity: [0.1, 0.3, 0.1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.7,
            ease: 'easeInOut',
          }}
        >
          {emoji}
        </motion.span>
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6">
          <div className="flex items-center gap-2">
            <BookOpen className={`w-5 h-5 ${isDark ? 'text-amber-300' : 'text-amber-700'}`} />
            <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-amber-100' : 'text-amber-900'}`}>
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className={`${isDark ? 'text-amber-200 hover:bg-white/10' : 'text-amber-800 hover:bg-amber-200/50'} rounded-full`}
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Story pages with page-turn animation */}
        <div className="flex-1 overflow-hidden relative">
          <div className="h-full flex items-center justify-center px-4 sm:px-8 md:px-16 lg:px-24">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentPage}
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-full max-w-2xl"
                style={{ perspective: '1200px' }}
              >
                {/* Book page card */}
                <div className={`rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden ${
                  isDark
                    ? 'bg-amber-900/40 border border-amber-500/20 backdrop-blur-sm'
                    : 'bg-white/80 border border-amber-200/50 backdrop-blur-sm'
                }`}>
                  {/* Page decoration top */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />

                  {/* Illustration placeholder */}
                  <div className={`w-full h-32 sm:h-40 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden ${
                    isDark
                      ? 'bg-gradient-to-br from-amber-800/30 to-amber-900/30'
                      : 'bg-gradient-to-br from-amber-50 to-yellow-50'
                  }`}>
                    <motion.span
                      className="text-5xl sm:text-6xl"
                      animate={{
                        scale: [1, 1.05, 1],
                        rotate: [0, 3, -3, 0],
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      {illustrationEmojis[currentPage % illustrationEmojis.length]}
                    </motion.span>
                    {/* Decorative sparkles around illustration */}
                    <motion.span
                      className="absolute top-3 right-4 text-lg"
                      animate={{ opacity: [0.3, 0.8, 0.3], y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      ✨
                    </motion.span>
                    <motion.span
                      className="absolute bottom-3 left-4 text-sm"
                      animate={{ opacity: [0.3, 0.7, 0.3], y: [0, -4, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                    >
                      💫
                    </motion.span>
                  </div>

                  {/* Story text — large, beautiful typography */}
                  <div className={`text-lg sm:text-xl leading-[2] ${
                    isDark ? 'text-amber-50/90' : 'text-amber-950/85'
                  }`} style={{ fontFamily: "'Georgia', 'Times New Roman', 'Noto Serif', serif" }}>
                    {isWordHighlight ? (
                      currentPageWords.map((word, wIdx) => {
                        const isHighlighted = wIdx === currentWordIndex;
                        const isPast = wIdx < currentWordIndex;
                        return (
                          <span
                            key={wIdx}
                            className={`inline transition-all duration-200 ${
                              isHighlighted
                                ? 'bg-amber-300/70 dark:bg-amber-400/60 rounded px-1 -mx-0.5 font-bold'
                                : isPast
                                ? (isDark ? 'text-amber-100/50' : 'text-amber-900/40')
                                : ''
                            }`}
                          >
                            {word}{' '}
                          </span>
                        );
                      })
                    ) : (
                      <p>{paragraphs[currentPage]}</p>
                    )}
                  </div>

                  {/* Page number */}
                  <div className="flex items-center justify-center mt-6 gap-2">
                    <span className={`text-xs ${isDark ? 'text-amber-300/50' : 'text-amber-700/40'}`}>
                      — {currentPage + 1} / {totalPages} —
                    </span>
                  </div>

                  {/* Page decoration bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Previous/Next navigation arrows */}
          <div className="absolute inset-y-0 left-2 sm:left-6 flex items-center">
            <motion.button
              onClick={handlePrevPage}
              disabled={currentPage <= 0}
              className={`p-2 rounded-full transition-all ${
                currentPage <= 0 ? 'opacity-20 cursor-not-allowed' : 'opacity-70 hover:opacity-100'
              } ${isDark ? 'text-amber-200 hover:bg-white/10' : 'text-amber-800 hover:bg-amber-200/50'}`}
              whileTap={currentPage > 0 ? { scale: 0.9 } : {}}
              aria-label="Page précédente"
            >
              <ChevronLeft className="w-8 h-8" />
            </motion.button>
          </div>
          <div className="absolute inset-y-0 right-2 sm:right-6 flex items-center">
            <motion.button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages - 1}
              className={`p-2 rounded-full transition-all ${
                currentPage >= totalPages - 1 ? 'opacity-20 cursor-not-allowed' : 'opacity-70 hover:opacity-100'
              } ${isDark ? 'text-amber-200 hover:bg-white/10' : 'text-amber-800 hover:bg-amber-200/50'}`}
              whileTap={currentPage < totalPages - 1 ? { scale: 0.9 } : {}}
              aria-label="Page suivante"
            >
              <ChevronRight className="w-8 h-8" />
            </motion.button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-4 sm:px-8">
          <div className={`h-1.5 rounded-full ${isDark ? 'bg-black/30' : 'bg-amber-200/60'}`}>
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(overallProgress * 100, 0)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className={`px-4 sm:px-8 py-4 ${isCompleted ? 'pb-8' : ''}`}>
          <div className={`max-w-3xl mx-auto rounded-2xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3 ${
            isDark
              ? 'bg-black/40 backdrop-blur-md border border-white/10'
              : 'bg-white/70 backdrop-blur-md border border-amber-200/50'
          }`}>
            {/* Previous word button */}
            <Button
              onClick={() => {
                if (currentWordIndex > 0) {
                  setCurrentWordIndex(prev => prev - 1);
                  setIsManual(true);
                  setIsPlaying(false);
                } else if (currentPage > 0) {
                  handlePrevPage();
                }
              }}
              disabled={currentPage <= 0 && currentWordIndex <= 0}
              className={`rounded-full w-9 h-9 p-0 flex-shrink-0 text-sm ${
                isDark
                  ? 'bg-amber-400/10 hover:bg-amber-400/20 text-amber-200 disabled:opacity-30'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-800 disabled:opacity-30'
              }`}
            >
              ←
            </Button>

            {/* Play/Pause */}
            <Button
              onClick={handlePlayPause}
              className={`rounded-full w-11 h-11 p-0 flex-shrink-0 ${
                isDark
                  ? 'bg-amber-400/20 hover:bg-amber-400/30 text-amber-200'
                  : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
              }`}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </Button>

            {/* Next word button */}
            <Button
              onClick={() => {
                if (currentWordIndex < currentPageWords.length - 1) {
                  setCurrentWordIndex(prev => prev + 1);
                  setIsManual(true);
                  setIsPlaying(false);
                } else if (currentPage < totalPages - 1) {
                  handleNextPage();
                }
              }}
              disabled={currentPage >= totalPages - 1 && currentWordIndex >= currentPageWords.length - 1}
              className={`rounded-full w-9 h-9 p-0 flex-shrink-0 text-sm ${
                isDark
                  ? 'bg-amber-400/10 hover:bg-amber-400/20 text-amber-200 disabled:opacity-30'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-800 disabled:opacity-30'
              }`}
            >
              →
            </Button>

            {/* Speed control */}
            <motion.button
              onClick={handleSpeedChange}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                isDark
                  ? 'bg-amber-400/10 hover:bg-amber-400/20 text-amber-200'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-700'
              }`}
              whileTap={{ scale: 0.9 }}
              aria-label={`Vitesse: ${SPEED_CONFIG[speed].label}`}
            >
              <Gauge className="w-3 h-3" />
              <span className="hidden sm:inline">{SPEED_CONFIG[speed].emoji}</span>
              <span>{SPEED_CONFIG[speed].label}</span>
            </motion.button>

            {/* Spacer */}
            <div className="flex-1 min-w-0" />

            {/* Progress text */}
            <p className={`text-[10px] sm:text-xs ${isDark ? 'text-amber-200/70' : 'text-amber-700/70'} hidden sm:block`}>
              {isPlaying || currentWordIndex >= 0 ? `${Math.round(overallProgress * 100)}%` : '▶ Lecture'}
            </p>

            {/* Finish button */}
            <Button
              onClick={handleFinishReading}
              className="rounded-full px-3 sm:px-4 flex-shrink-0 text-xs sm:text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #C9A227, #E8D44D)', color: '#3D2C1E' }}
            >
              J&apos;ai fini ! ⭐
            </Button>
          </div>
        </div>

        {/* Completion overlay */}
        <AnimatePresence>
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`absolute inset-0 z-30 flex items-center justify-center ${
                isDark ? 'bg-black/50' : 'bg-amber-100/70'
              } backdrop-blur-sm`}
            >
              <motion.div
                className={`rounded-3xl p-8 sm:p-10 text-center max-w-sm mx-4 ${
                  isDark
                    ? 'bg-amber-900/80 border border-amber-500/30'
                    : 'bg-white border border-amber-200'
                } shadow-2xl`}
                animate={{ rotate: [0, 2, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <motion.span
                  className="text-6xl block mb-4"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  🌟
                </motion.span>
                <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-amber-100' : 'text-amber-900'}`}>
                  Bravo !
                </h3>
                <p className={`text-base mb-4 ${isDark ? 'text-amber-200/80' : 'text-amber-700'}`}>
                  Tu as lu l&apos;histoire ! +1 ⭐
                </p>
                <Button
                  onClick={handleClose}
                  className="rounded-full px-6 text-sm font-bold"
                  style={{ background: 'linear-gradient(135deg, #C9A227, #E8D44D)', color: '#3D2C1E' }}
                >
                  Fermer ✨
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function StoryMode({ story, title, adventureId, chapterNum, isOpen, onClose }: StoryModeProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <StoryModeContent
          key={`story-${adventureId}-${chapterNum}`}
          story={story}
          title={title}
          adventureId={adventureId}
          chapterNum={chapterNum}
          onClose={onClose}
        />
      )}
    </AnimatePresence>
  );
}
