'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import dynamic from 'next/dynamic';

const FloatingStars = dynamic(() => import('@/components/FloatingStars'), { ssr: false });
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
import { useState, useEffect } from 'react';

export default function Home() {
  return (
    <HydrationProvider>
      <AppContent />
    </HydrationProvider>
  );
}

function AppContent() {
  const { currentSection, badges } = useAppStore();
  const [celebration, setCelebration] = useState<{ active: boolean; message: string; emoji: string }>({
    active: false,
    message: '',
    emoji: '',
  });

  // Track the previous badge count to detect new unlocks
  const unlockedCount = badges.filter(b => b.unlockedAt).length;
  const [prevBadgeCount, setPrevBadgeCount] = useState(0);

  // Detect new badge unlocks and trigger celebration
  if (unlockedCount > prevBadgeCount && prevBadgeCount > 0) {
    const badge = badges.filter(b => b.unlockedAt).pop();
    if (badge) {
      setPrevBadgeCount(unlockedCount);
      setCelebration({
        active: true,
        message: `Badge débloqué : ${badge.title} !`,
        emoji: badge.emoji,
      });
    }
  } else if (unlockedCount !== prevBadgeCount) {
    setPrevBadgeCount(unlockedCount);
  }

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
