'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, Sparkles, Heart } from 'lucide-react';
import Image from 'next/image';
import { useSoundEffects } from './SoundEffects';
import StoryMode from './StoryMode';

interface ChapterData {
  chapterNum: number;
  title: string;
  story: string;
  lesson: string;
  illustration: string;
  activityLabel: string;
  activity: React.ReactNode;
  adventureId: string;
}

const chapterImages: Record<string, string> = {
  'miroir-1': '/images/magic-mirror-hero.png',
  'miroir-2': '/images/golden-heart.png',
  'miroir-3': '/images/meditation-child.png',
  'miroir-4': '/images/moon-character.png',
  'miroir-5': '/images/starry-night.png',
  'lumiere-1': '/images/enchanted-garden.png',
  'lumiere-2': '/images/golden-heart.png',
  'lumiere-3': '/images/magic-mirror-hero.png',
  'lumiere-4': '/images/starry-night.png',
};

// Word-by-word animation helper
function WordByWordText({ text, className }: { text: string; className?: string }) {
  const words = useMemo(() => text.split(' '), [text]);

  return (
    <span className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className="word-fade-in inline-block"
          style={{ animationDelay: `${0.3 + i * 0.04}s` }}
        >
          {word}{i < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </span>
  );
}

export default function ChapterCard({ data }: { data: ChapterData }) {
  const { chaptersProgress, markChapterRead, markActivityCompleted, favoriteChapters, toggleFavorite } = useAppStore();
  const { play } = useSoundEffects();
  const [expanded, setExpanded] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [showStoryMode, setShowStoryMode] = useState(false);

  const key = `${data.adventureId}-${data.chapterNum}`;
  const progress = chaptersProgress[key] || { read: false, activityCompleted: false };
  const chapterImage = chapterImages[key];
  const isFav = favoriteChapters.includes(key);

  const handleMarkRead = () => {
    markChapterRead(data.adventureId as 'miroir' | 'tresors' | 'lumiere', data.chapterNum);
  };

  const handleActivityComplete = () => {
    markActivityCompleted(data.adventureId as 'miroir' | 'tresors' | 'lumiere', data.chapterNum);
    play('chapter');
  };

  // Determine card styling based on state
  const cardStyle = progress.activityCompleted
    ? 'gradient-border-animated border-transparent bg-primary/5 completion-burst'
    : progress.read
    ? 'border-secondary/30 bg-secondary/5 border-2'
    : 'border-border/50 border-2 shimmer-shine';

  const isNew = !progress.read && !progress.activityCompleted;

  // Calculate thin progress bar percentage
  const progressPercent = progress.activityCompleted ? 100 : progress.read ? 50 : 0;

  return (
    <Card className={`overflow-hidden transition-all duration-300 card-glow-hover ${cardStyle}`}>
      {/* Chapter header - always visible */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => { setExpanded(!expanded); if (!progress.read) handleMarkRead(); }}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded(!expanded); if (!progress.read) handleMarkRead(); } }}
        className="w-full text-left cursor-pointer"
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Numbered circle for chapter */}
              <motion.span 
                className="w-10 h-10 flex items-center justify-center rounded-xl border-2 font-bold text-sm transition-all"
                style={progress.activityCompleted 
                  ? { background: 'linear-gradient(135deg, #C9A227, #E8D44D)', color: '#3D2C1E', borderColor: 'transparent' }
                  : progress.read
                  ? { background: 'rgba(20, 184, 166, 0.1)', color: '#14B8A6', borderColor: 'rgba(20, 184, 166, 0.3)' }
                  : { background: 'rgba(0,0,0,0.05)', color: 'rgba(0,0,0,0.4)', borderColor: 'rgba(0,0,0,0.1)' }
                }
                animate={progress.activityCompleted ? { rotate: [0, 5, -5, 0] } : {}}
                transition={{ duration: 0.5, repeat: progress.activityCompleted ? 2 : 0 }}
              >
                {progress.activityCompleted ? '✨' : data.chapterNum}
              </motion.span>
              <div>
                <CardTitle className="text-base sm:text-lg">
                  {data.title}
                </CardTitle>
                {/* Progress indicator with Nouveau badge */}
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="flex items-center gap-0.5">
                    <span className={`w-2 h-2 rounded-full transition-colors ${progress.read ? 'bg-primary' : 'bg-muted-foreground/20'}`} />
                    <span className={`w-2 h-2 rounded-full transition-colors ${progress.activityCompleted ? 'bg-primary' : 'bg-muted-foreground/20'}`} />
                  </div>
                  {progress.activityCompleted ? (
                    <span className="text-[10px] bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 text-primary px-2 py-0.5 rounded-full font-medium border border-amber-200/40 dark:border-amber-700/20">
                      ✨ Complété
                    </span>
                  ) : progress.read ? (
                    <span className="text-[10px] bg-secondary/15 text-secondary-foreground px-2 py-0.5 rounded-full font-medium">
                      📖 Lu
                    </span>
                  ) : (
                    <span className="text-[10px] bg-gradient-to-r from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 text-rose-600 dark:text-rose-300 px-2 py-0.5 rounded-full font-bold border border-rose-200/50 dark:border-rose-700/30 question-pulse">
                      ✨ Nouveau
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <motion.button
                onClick={(e) => { e.stopPropagation(); toggleFavorite(key); }}
                className="p-1.5 rounded-full hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors"
                whileTap={{ scale: 0.8 }}
                aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              >
                {isFav ? (
                  <motion.span className="text-lg" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.3 }}>❤️</motion.span>
                ) : (
                  <span className="text-lg">🤍</span>
                )}
              </motion.button>
              <motion.div
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              </motion.div>
            </div>
          </div>
        </CardHeader>
      </div>

      {/* Thin progress bar at bottom of collapsed card */}
      {!expanded && (
        <div className="chapter-progress-bar">
          <div className="chapter-progress-bar-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      )}

      {/* Expanded content with smoother animation */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 250, damping: 28, mass: 0.8 }}
            className="expand-smooth"
          >
            <CardContent className="pt-0">
              {/* Illustration */}
              <div className="w-full h-40 sm:h-52 rounded-xl overflow-hidden mb-4 relative">
                {chapterImage ? (
                  <Image
                    src={chapterImage}
                    alt={data.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 672px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    <span className="text-5xl sm:text-6xl">{data.illustration}</span>
                  </div>
                )}
                {/* Gradient overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card to-transparent" />
                {/* Chapter number badge with gradient */}
                <div className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full shadow-md text-white"
                  style={{ background: 'linear-gradient(135deg, #C9A227, #E8D44D)' }}
                >
                  Chapitre {data.chapterNum}
                </div>
              </div>

              {/* Story with book texture, serif typography, and audio */}
              <div className="book-texture rounded-xl p-4 mb-2 border border-amber-200/30 dark:border-amber-700/15 shadow-sm">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-xs text-primary font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="feather-write">📜</span>
                    Histoire
                  </p>
                  <div className="flex items-center gap-1.5">
                    <motion.button
                      onClick={() => setShowStoryMode(true)}
                      className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 border border-amber-200/50 dark:border-amber-700/30 text-amber-700 dark:text-amber-300 hover:shadow-md transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Mode lecture"
                    >
                      📖 Lire
                    </motion.button>
                  </div>
                </div>
                <div className="text-sm sm:text-base leading-[1.85] text-foreground/90" style={{ fontFamily: "'Georgia', 'Times New Roman', 'Noto Serif', serif" }}>
                  <WordByWordText text={data.story} />
                </div>
              </div>

              {/* Decorative divider between story and lesson */}
              <div className="story-divider my-3" />

              {/* Lesson */}
              <div className="bg-gradient-to-r from-teal-50/50 to-cyan-50/50 dark:from-teal-900/8 dark:to-cyan-900/8 rounded-xl p-4 mb-4 border border-teal-200/30 dark:border-teal-700/15 shimmer-shine">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                  <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold uppercase tracking-wider">Leçon</p>
                </div>
                <p className="text-sm font-medium text-foreground/80 leading-relaxed">
                  {data.lesson}
                </p>
              </div>

              {/* Activity toggle with better styling — gradient active state */}
              <Button
                onClick={() => setShowActivity(!showActivity)}
                variant="outline"
                className="w-full mb-3 border-primary/20 hover:bg-primary/10 hover:text-primary transition-all duration-200"
                style={showActivity ? { background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.1), rgba(20, 184, 166, 0.08))', borderColor: 'rgba(201, 162, 39, 0.3)' } : {}}
              >
                {showActivity ? '🔼 Cacher l\'activité' : `🎮 ${data.activityLabel}`}
              </Button>

              {/* Activity content with engaging styling & flowing border */}
              <AnimatePresence>
                {showActivity && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 250, damping: 28, mass: 0.8 }}
                    className="expand-smooth"
                  >
                    <div className="rounded-xl p-4 relative overflow-hidden activity-border-flow"
                      style={{ background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.05), rgba(20, 184, 166, 0.05))' }}
                    >
                      {/* Decorative corner elements */}
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-2xl" />
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-secondary/5 to-transparent rounded-tr-2xl" />
                      
                      {/* Inner content with gradient border */}
                      <div className="border-2 border-dashed border-primary/20 rounded-lg p-3 gradient-border-animated">
                        {data.activity}
                        {!progress.activityCompleted && (
                          <Button
                            onClick={handleActivityComplete}
                            className="w-full mt-4 pulse-gold"
                            size="sm"
                            style={{ background: 'linear-gradient(135deg, #C9A227, #E8D44D)', color: '#3D2C1E' }}
                          >
                            ✨ J&apos;ai terminé l&apos;activité ! (+2 ⭐)
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Story Mode overlay */}
      <StoryMode
        story={data.story}
        title={data.title}
        adventureId={data.adventureId}
        chapterNum={data.chapterNum}
        isOpen={showStoryMode}
        onClose={() => setShowStoryMode(false)}
      />
    </Card>
  );
}
