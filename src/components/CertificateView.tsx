'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';

interface CertificateProps {
  isOpen: boolean;
  onClose: () => void;
  adventureName: string;
  adventureEmoji: string;
}

export default function CertificateView({ isOpen, onClose, adventureName, adventureEmoji }: CertificateProps) {
  const { userName, totalStars, badges } = useAppStore();
  const unlockedBadges = badges.filter(b => b.unlockedAt).length;
  const today = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Certificate card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7, rotateY: -30 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.7, rotateY: 30 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border-4 border-amber-300 dark:border-amber-600"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gold decorative header */}
              <div className="relative bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300 dark:from-amber-700 dark:via-yellow-600 dark:to-amber-700 p-4 text-center overflow-hidden">
                {/* Decorative stars */}
                <motion.span
                  className="absolute top-1 left-4 text-sm opacity-60"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                >
                  ✦
                </motion.span>
                <motion.span
                  className="absolute top-2 right-6 text-sm opacity-60"
                  animate={{ rotate: [360, 0] }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                >
                  ✧
                </motion.span>
                <motion.span
                  className="absolute bottom-1 left-1/3 text-xs opacity-40"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✨
                </motion.span>

                <span className="text-4xl block">{adventureEmoji}</span>
                <h2 className="text-amber-900 dark:text-amber-100 font-extrabold text-lg mt-1 tracking-wide">
                  CERTIFICAT D&apos;AVENTURE
                </h2>
              </div>

              {/* Body */}
              <div className="p-5 text-center">
                {/* Decorative border pattern */}
                <div className="border-2 border-dashed border-amber-200 dark:border-amber-700 rounded-2xl p-4 relative">
                  {/* Corner decorations */}
                  <span className="absolute -top-2 -left-2 text-amber-400 text-xs">❋</span>
                  <span className="absolute -top-2 -right-2 text-amber-400 text-xs">❋</span>
                  <span className="absolute -bottom-2 -left-2 text-amber-400 text-xs">❋</span>
                  <span className="absolute -bottom-2 -right-2 text-amber-400 text-xs">❋</span>

                  <p className="text-xs text-muted-foreground mb-1">Ceci certifie que</p>

                  {/* Name */}
                  <motion.h3
                    className="text-xl font-bold text-gradient-gold my-2"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {userName || 'Petit Voyageur'}
                  </motion.h3>

                  <p className="text-xs text-muted-foreground mb-3">a complété avec succès l&apos;aventure</p>

                  {/* Adventure name */}
                  <motion.div
                    className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-xl py-2 px-4 mb-3 border border-amber-200/50 dark:border-amber-700/30"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <span className="text-lg">{adventureEmoji}</span>
                    <p className="text-sm font-bold text-amber-700 dark:text-amber-300">{adventureName}</p>
                  </motion.div>

                  {/* Stats */}
                  <div className="flex items-center justify-center gap-4 mb-3">
                    <div className="text-center">
                      <span className="text-lg block">⭐</span>
                      <span className="text-xs font-bold text-primary">{totalStars}</span>
                      <p className="text-[9px] text-muted-foreground">étoiles</p>
                    </div>
                    <div className="text-center">
                      <span className="text-lg block">🏅</span>
                      <span className="text-xs font-bold text-primary">{unlockedBadges}</span>
                      <p className="text-[9px] text-muted-foreground">badges</p>
                    </div>
                  </div>

                  {/* Date */}
                  <p className="text-[10px] text-muted-foreground">
                    Délivré le {today}
                  </p>

                  {/* Signature line */}
                  <div className="mt-3 border-t border-amber-200/50 dark:border-amber-700/30 pt-2">
                    <p className="text-[9px] text-muted-foreground italic">
                      L&apos;Alchimie du Miroir — L&apos;Aventure des Petits Cœurs
                    </p>
                    <p className="text-[9px] text-amber-500 mt-0.5">
                      ✦ ✧ ✦
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-5 pb-5 flex gap-2">
                <motion.button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-muted hover:bg-muted/80 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Fermer
                </motion.button>
                <motion.button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-400 to-yellow-400 dark:from-amber-600 dark:to-yellow-600 text-amber-900 dark:text-amber-100 shadow-md"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continuer ✨
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook to check adventure completion and show certificate
export function useAdventureCompletion() {
  const [certificateData, setCertificateData] = useState<{
    show: boolean;
    name: string;
    emoji: string;
  }>({ show: false, name: '', emoji: '' });

  const showCertificate = (adventureName: string, adventureEmoji: string) => {
    setCertificateData({ show: true, name: adventureName, emoji: adventureEmoji });
  };

  const hideCertificate = () => {
    setCertificateData(prev => ({ ...prev, show: false }));
  };

  return { certificateData, showCertificate, hideCertificate };
}
