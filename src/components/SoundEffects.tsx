'use client';

import { useCallback } from 'react';
import { useAppStore } from '@/lib/store';

// Web Audio API sound effects for the children's app
class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  private getCtx(): AudioContext | null {
    if (!this.enabled) return null;
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      } catch {
        return null;
      }
    }
    return this.ctx;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  // Play a simple tone
  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.15) {
    const ctx = this.getCtx();
    if (!ctx) return;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }

  // Success chime - two ascending notes
  success() {
    this.playTone(523.25, 0.15, 'sine', 0.12); // C5
    setTimeout(() => this.playTone(659.25, 0.2, 'sine', 0.12), 100); // E5
    setTimeout(() => this.playTone(783.99, 0.3, 'sine', 0.1), 200); // G5
  }

  // Star earned - magical sparkle
  starEarned() {
    this.playTone(880, 0.1, 'sine', 0.1); // A5
    setTimeout(() => this.playTone(1108.73, 0.15, 'sine', 0.08), 80); // C#6
    setTimeout(() => this.playTone(1318.51, 0.2, 'sine', 0.06), 160); // E6
  }

  // Click - soft tap
  click() {
    this.playTone(600, 0.05, 'sine', 0.08);
  }

  // Badge unlock - triumphant fanfare
  badgeUnlock() {
    this.playTone(523.25, 0.15, 'triangle', 0.1); // C5
    setTimeout(() => this.playTone(659.25, 0.15, 'triangle', 0.1), 120); // E5
    setTimeout(() => this.playTone(783.99, 0.15, 'triangle', 0.1), 240); // G5
    setTimeout(() => this.playTone(1046.5, 0.4, 'triangle', 0.08), 360); // C6
  }

  // Complete chapter - gentle harp-like
  chapterComplete() {
    const notes = [440, 523.25, 659.25, 783.99]; // A4, C5, E5, G5
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.3, 'sine', 0.08), i * 120);
    });
  }

  // Error/wrong - gentle low buzz
  wrong() {
    this.playTone(220, 0.15, 'sine', 0.08);
    setTimeout(() => this.playTone(196, 0.2, 'sine', 0.06), 100);
  }

  // Breathing exercise - soft ambient
  breathIn() {
    this.playTone(392, 0.8, 'sine', 0.04); // G4 - soft
  }

  breathOut() {
    this.playTone(349.23, 1.2, 'sine', 0.03); // F4 - even softer
  }

  // Treasure collected - magical
  treasure() {
    this.playTone(659.25, 0.1, 'sine', 0.1); // E5
    setTimeout(() => this.playTone(783.99, 0.1, 'sine', 0.1), 80); // G5
    setTimeout(() => this.playTone(987.77, 0.15, 'sine', 0.1), 160); // B5
    setTimeout(() => this.playTone(1174.66, 0.3, 'sine', 0.08), 240); // D6
  }
}

// Singleton
let soundEngine: SoundEngine | null = null;

export function getSoundEngine(): SoundEngine {
  if (!soundEngine) {
    soundEngine = new SoundEngine();
  }
  return soundEngine;
}

// React hook for sound effects
export function useSoundEffects() {
  const { soundEffects } = useAppStore();

  const play = useCallback((effect: 'success' | 'star' | 'click' | 'badge' | 'chapter' | 'wrong' | 'breathIn' | 'breathOut' | 'treasure') => {
    const engine = getSoundEngine();
    engine.setEnabled(soundEffects);
    
    switch (effect) {
      case 'success': engine.success(); break;
      case 'star': engine.starEarned(); break;
      case 'click': engine.click(); break;
      case 'badge': engine.badgeUnlock(); break;
      case 'chapter': engine.chapterComplete(); break;
      case 'wrong': engine.wrong(); break;
      case 'breathIn': engine.breathIn(); break;
      case 'breathOut': engine.breathOut(); break;
      case 'treasure': engine.treasure(); break;
    }
  }, [soundEffects]);

  return { play, enabled: soundEffects };
}
