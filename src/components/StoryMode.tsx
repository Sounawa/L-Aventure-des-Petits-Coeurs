'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, type AdventureId } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { X, Play, Pause, BookOpen } from 'lucide-react';

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

function StoryModeContent({ story, title, adventureId, chapterNum, onClose }: Omit<StoryModeProps, 'isOpen'>) {
  const { markChapterRead, darkMode, bedtimeMode } = useAppStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completedRef = useRef(false);

  const paragraphs = useMemo(() => story.split('\n').filter(p => p.trim()), [story]);
  const words = useMemo(() => story.split(/\s+/).filter(w => w.trim()), [story]);
  const totalWords = words.length;

  // Word-by-word highlight animation
  useEffect(() => {
    if (isPlaying && currentWordIndex < totalWords) {
      intervalRef.current = setInterval(() => {
        setCurrentWordIndex(prev => {
          if (prev >= totalWords - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 667); // ~1.5 words per second
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentWordIndex, totalWords]);

  const progress = totalWords > 0 ? (currentWordIndex + 1) / totalWords : 0;

  const handlePlayPause = useCallback(() => {
    if (currentWordIndex >= totalWords - 1) {
      setCurrentWordIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(prev => !prev);
    }
  }, [currentWordIndex, totalWords]);

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

  // Build word map: map from flat word index to paragraph/word-in-paragraph
  const paragraphWordRanges = useMemo(() => {
    const ranges: { start: number; end: number; words: string[] }[] = [];
    let flatIdx = 0;
    for (const para of paragraphs) {
      const paraWords = para.split(/\s+/).filter(w => w.trim());
      ranges.push({ start: flatIdx, end: flatIdx + paraWords.length - 1, words: paraWords });
      flatIdx += paraWords.length;
    }
    return ranges;
  }, [paragraphs]);

  const gradient = darkMode || bedtimeMode
    ? adventureGradients[adventureId] || adventureGradients.miroir
    : adventureLightGradients[adventureId] || adventureLightGradients.miroir;

  const emojis = adventureEmojis[adventureId] || adventureEmojis.miroir;

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
            <BookOpen className={`w-5 h-5 ${darkMode || bedtimeMode ? 'text-amber-300' : 'text-amber-700'}`} />
            <h2 className={`text-lg sm:text-xl font-bold ${darkMode || bedtimeMode ? 'text-amber-100' : 'text-amber-900'}`}>
              {title}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className={`${darkMode || bedtimeMode ? 'text-amber-200 hover:bg-white/10' : 'text-amber-800 hover:bg-amber-200/50'} rounded-full`}
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Story text area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 md:px-16 lg:px-24 pb-24 custom-scrollbar">
          <div className="max-w-3xl mx-auto py-4">
            {paragraphWordRanges.map((range, pIdx) => (
              <p
                key={pIdx}
                className={`text-xl sm:text-2xl leading-relaxed mb-6 ${
                  darkMode || bedtimeMode ? 'text-amber-50/90' : 'text-amber-950/85'
                }`}
              >
                {range.words.map((word, wIdx) => {
                  const flatIndex = range.start + wIdx;
                  const isHighlighted = flatIndex === currentWordIndex;
                  const isPast = flatIndex < currentWordIndex;
                  return (
                    <span
                      key={wIdx}
                      className={`inline transition-all duration-300 ${
                        isHighlighted
                          ? 'bg-amber-300/60 dark:bg-amber-400/50 rounded px-1 -mx-0.5'
                          : isPast
                          ? (darkMode || bedtimeMode ? 'text-amber-100/60' : 'text-amber-900/50')
                          : ''
                      }`}
                    >
                      {word}{' '}
                    </span>
                  );
                })}
              </p>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className={`h-1.5 ${darkMode || bedtimeMode ? 'bg-black/30' : 'bg-amber-200/60'}`}>
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-300"
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(progress * 100, 0)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className={`absolute bottom-4 left-0 right-0 z-20 px-4 sm:px-8 ${isCompleted ? 'hidden' : ''}`}>
          <div className={`max-w-3xl mx-auto rounded-2xl p-4 flex items-center gap-4 ${
            darkMode || bedtimeMode
              ? 'bg-black/40 backdrop-blur-md border border-white/10'
              : 'bg-white/70 backdrop-blur-md border border-amber-200/50'
          }`}>
            {/* Play/Pause */}
            <Button
              onClick={handlePlayPause}
              className={`rounded-full w-12 h-12 p-0 flex-shrink-0 ${
                darkMode || bedtimeMode
                  ? 'bg-amber-400/20 hover:bg-amber-400/30 text-amber-200'
                  : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
              }`}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </Button>

            {/* Progress text */}
            <div className="flex-1 min-w-0">
              <p className={`text-xs ${darkMode || bedtimeMode ? 'text-amber-200/70' : 'text-amber-700/70'}`}>
                {currentWordIndex >= 0 ? `${Math.round(progress * 100)}% lu` : 'Appuie sur ▶ pour commencer la lecture'}
              </p>
            </div>

            {/* Finish button */}
            <Button
              onClick={handleFinishReading}
              className="rounded-full px-4 flex-shrink-0 text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #C9A227, #E8D44D)', color: '#3D2C1E' }}
            >
              J&apos;ai fini de lire ! ⭐
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
                darkMode || bedtimeMode ? 'bg-black/50' : 'bg-amber-100/70'
              } backdrop-blur-sm`}
            >
              <motion.div
                className={`rounded-3xl p-8 sm:p-10 text-center max-w-sm mx-4 ${
                  darkMode || bedtimeMode
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
                <h3 className={`text-2xl font-bold mb-2 ${darkMode || bedtimeMode ? 'text-amber-100' : 'text-amber-900'}`}>
                  Bravo !
                </h3>
                <p className={`text-base mb-4 ${darkMode || bedtimeMode ? 'text-amber-200/80' : 'text-amber-700'}`}>
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
  // StoryModeContent remounts naturally when isOpen toggles (AnimatePresence unmounts on exit)
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
