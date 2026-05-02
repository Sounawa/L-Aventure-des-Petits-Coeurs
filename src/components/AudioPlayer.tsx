'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';

interface AudioPlayerProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function AudioPlayer({ text, size = 'md', className = '' }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 18,
  };

  const playAudio = useCallback(async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TTS API only available in dev/server mode, not on static GitHub Pages
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Audio generation failed');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setError('Erreur de lecture');
        setIsPlaying(false);
        setIsLoading(false);
      };

      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      setError('Écoute non disponible');
      console.error('Audio player error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [text, isPlaying]);

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <motion.button
        onClick={playAudio}
        disabled={isLoading}
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-all ${
          isPlaying
            ? 'bg-primary text-primary-foreground shadow-md pulse-gold'
            : 'bg-primary/10 text-primary hover:bg-primary/20'
        } disabled:opacity-50`}
        whileTap={{ scale: 0.9 }}
        aria-label={isPlaying ? 'Arrêter la lecture' : 'Écouter l\'histoire'}
      >
        {isLoading ? (
          <Loader2 size={iconSizes[size]} className="animate-spin" />
        ) : isPlaying ? (
          <VolumeX size={iconSizes[size]} />
        ) : (
          <Volume2 size={iconSizes[size]} />
        )}
      </motion.button>

      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="flex items-center gap-0.5 overflow-hidden"
          >
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-0.5 bg-primary rounded-full"
                animate={{
                  height: [4, 12, 6, 14, 4],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-[10px] text-destructive"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
