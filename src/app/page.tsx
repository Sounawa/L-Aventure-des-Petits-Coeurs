'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import dynamic from 'next/dynamic';
import { useState, useEffect, useRef } from 'react';

// Only FloatingStars needs dynamic SSR: false (uses browser APIs)
const FloatingStars = dynamic(() => import('@/components/FloatingStars').catch(() => {
  // Retry once on chunk load failure
  return import('@/components/FloatingStars');
}), {
  ssr: false,
  loading: () => null,
});
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AdventureView from '@/components/AdventureView';
import PracticeSection from '@/components/PracticeSection';
import ActivitiesSection from '@/components/ActivitiesSection';
import Footer from '@/components/Footer';
import HydrationProvider from '@/components/HydrationProvider';
import CelebrationOverlay from '@/components/CelebrationOverlay';
import OnboardingFlow from '@/components/OnboardingFlow';
import InteractiveGuide from '@/components/InteractiveGuide';
import ErrorBoundary from '@/components/ErrorBoundary';
import StarReward from '@/components/StarReward';
import { useStarReward } from '@/components/StarReward';

export default function Home() {
  return (
    <ErrorBoundary>
      <HydrationProvider>
        <AppContent />
      </HydrationProvider>
    </ErrorBoundary>
  );
}

function AppContent() {
  const { currentSection, badges, _hydrated, totalStars } = useAppStore();
  const [celebration, setCelebration] = useState<{ active: boolean; message: string; emoji: string }>({
    active: false,
    message: '',
    emoji: '',
  });

  // Star reward hook
  const { triggerStarReward, starRewardProps } = useStarReward();
  const prevStarsRef = useRef(0);

  // Track star changes and trigger star reward animation
  useEffect(() => {
    if (!_hydrated) return;
    if (totalStars > prevStarsRef.current && prevStarsRef.current > 0) {
      const diff = totalStars - prevStarsRef.current;
      // Trigger from center of screen
      triggerStarReward(diff);
    }
    prevStarsRef.current = totalStars;
  }, [totalStars, _hydrated, triggerStarReward]);

  // Track the previous badge count to detect new unlocks
  const prevBadgeCountRef = useRef(0);
  const unlockedCount = badges.filter(b => b.unlockedAt).length;

  // Detect new badge unlocks and trigger celebration
  useEffect(() => {
    if (!_hydrated) return;
    const prevCount = prevBadgeCountRef.current;
    if (unlockedCount > prevCount && prevCount > 0) {
      const badge = badges.filter(b => b.unlockedAt).pop();
      if (badge) {
        requestAnimationFrame(() => {
          setCelebration({
            active: true,
            message: `Badge débloqué : ${badge.title} !`,
            emoji: badge.emoji,
          });
        });
      }
    }
    prevBadgeCountRef.current = unlockedCount;
  }, [unlockedCount, badges, _hydrated]);

  // Auto-dismiss celebration
  useEffect(() => {
    if (celebration.active) {
      const timer = setTimeout(() => {
        setCelebration(prev => ({ ...prev, active: false }));
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [celebration.active]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <FloatingStars />
      
      {/* Celebration overlay */}
      <CelebrationOverlay
        isActive={celebration.active}
        message={celebration.message}
        emoji={celebration.emoji}
        onComplete={() => setCelebration(prev => ({ ...prev, active: false }))}
      />

      {/* Star reward animation */}
      <StarReward {...starRewardProps} />

      {/* Onboarding overlay for first-time users */}
      <OnboardingFlow />

      {/* Interactive guide for first-time users */}
      <InteractiveGuide />

      {/* Main content */}
      <main className="flex-1 relative z-10 pt-14 pb-20">
        <div className="px-4 max-w-2xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {currentSection === 'accueil' && (
              <motion.div
                key="accueil"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <HeroSection />
              </motion.div>
            )}

            {currentSection === 'aventures' && (
              <motion.div
                key="aventures"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AdventureView />
              </motion.div>
            )}

            {currentSection === 'pratique' && (
              <motion.div
                key="pratique"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <PracticeSection />
              </motion.div>
            )}

            {currentSection === 'activites' && (
              <motion.div
                key="activites"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ActivitiesSection />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8">
            <Footer />
          </div>
        </div>
      </main>

      {/* Navigation */}
      <Navigation />
    </div>
  );
}
