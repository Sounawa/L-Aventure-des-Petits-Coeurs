'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import Image from 'next/image';
import AudioPlayer from './AudioPlayer';

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

export default function ChapterCard({ data }: { data: ChapterData }) {
  const { chaptersProgress, markChapterRead, markActivityCompleted } = useAppStore();
  const [expanded, setExpanded] = useState(false);
  const [showActivity, setShowActivity] = useState(false);

  const key = `${data.adventureId}-${data.chapterNum}`;
  const progress = chaptersProgress[key] || { read: false, activityCompleted: false };
  const chapterImage = chapterImages[key];

  const handleMarkRead = () => {
    markChapterRead(data.adventureId as 'miroir' | 'tresors' | 'lumiere', data.chapterNum);
  };

  const handleActivityComplete = () => {
    markActivityCompleted(data.adventureId as 'miroir' | 'tresors' | 'lumiere', data.chapterNum);
  };

  return (
    <Card className={`border-2 overflow-hidden transition-all ${
      progress.activityCompleted 
        ? 'border-primary/40 bg-primary/5' 
        : progress.read 
        ? 'border-secondary/30 bg-secondary/5' 
        : 'border-border/50'
    }`}>
      {/* Chapter header - always visible */}
      <button
        onClick={() => { setExpanded(!expanded); if (!progress.read) handleMarkRead(); }}
        className="w-full text-left"
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.span 
                className="text-2xl w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10"
                animate={progress.activityCompleted ? { rotate: [0, 5, -5, 0] } : {}}
                transition={{ duration: 0.5, repeat: progress.activityCompleted ? 2 : 0 }}
              >
                {progress.read ? (progress.activityCompleted ? '🌟' : '📖') : '📜'}
              </motion.span>
              <div>
                <CardTitle className="text-base sm:text-lg">
                  Chapitre {data.chapterNum} : {data.title}
                </CardTitle>
                {progress.activityCompleted && (
                  <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
                    ✨ Complété
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {expanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
            </div>
          </div>
        </CardHeader>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="pt-0">
              {/* Illustration */}
              <div className="w-full h-40 sm:h-52 rounded-xl overflow-hidden mb-4 relative">
                {chapterImage ? (
                  <Image
                    src={chapterImage}
                    alt={data.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    <span className="text-5xl sm:text-6xl">{data.illustration}</span>
                  </div>
                )}
                {/* Gradient overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
                {/* Chapter number badge */}
                <div className="absolute top-3 left-3 bg-primary/90 text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                  Chapitre {data.chapterNum}
                </div>
              </div>

              {/* Story with audio */}
              <div className="bg-primary/5 rounded-xl p-4 mb-4 border border-primary/10">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-xs text-primary font-semibold uppercase tracking-wider">Histoire</p>
                  <AudioPlayer text={data.story} size="sm" />
                </div>
                <p className="text-sm sm:text-base leading-relaxed text-foreground/90">
                  {data.story}
                </p>
              </div>

              {/* Lesson */}
              <div className="bg-secondary/10 rounded-xl p-4 mb-4 border border-secondary/20">
                <p className="text-sm font-medium text-foreground/80 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                  <span>{data.lesson}</span>
                </p>
              </div>

              {/* Activity toggle */}
              <Button
                onClick={() => setShowActivity(!showActivity)}
                variant="outline"
                className="w-full mb-3 border-primary/20 hover:bg-primary/10 hover:text-primary transition-all"
              >
                {showActivity ? '🔼 Cacher l\'activité' : `🎮 ${data.activityLabel}`}
              </Button>

              {/* Activity content */}
              <AnimatePresence>
                {showActivity && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="border-2 border-dashed border-primary/20 rounded-xl p-4 bg-primary/5">
                      {data.activity}
                      {!progress.activityCompleted && (
                        <Button
                          onClick={handleActivityComplete}
                          className="w-full mt-4 pulse-gold"
                          size="sm"
                        >
                          ✨ J&apos;ai terminé l&apos;activité ! (+2 ⭐)
                        </Button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
