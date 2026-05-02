'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import FloatingStars from '@/components/FloatingStars';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AdventureView from '@/components/AdventureView';
import PracticeSection from '@/components/PracticeSection';
import ActivitiesSection from '@/components/ActivitiesSection';
import Footer from '@/components/Footer';
import HydrationProvider from '@/components/HydrationProvider';

export default function Home() {
  return (
    <HydrationProvider>
      <AppContent />
    </HydrationProvider>
  );
}

function AppContent() {
  const { currentSection } = useAppStore();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <FloatingStars />
      
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
