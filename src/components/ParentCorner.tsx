'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ChevronDown, ChevronUp, Lock, Shield, BookOpen, Heart, Users, Lightbulb, Eye, Smartphone } from 'lucide-react';

interface SectionItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}

const VALUES = [
  { emoji: '🤲', title: 'Spiritualité', desc: 'Découvrir la prière et la méditation' },
  { emoji: '💛', title: 'Gratitude', desc: 'Apprendre à être reconnaissant' },
  { emoji: '🌸', title: 'Bienveillance', desc: 'Développer la gentillesse et l\'empathie' },
  { emoji: '💪', title: 'Courage', desc: 'Surmonter ses peurs avec confiance' },
  { emoji: '🧘', title: 'Sérénité', desc: 'Pratiquer la respiration et le calme intérieur' },
  { emoji: '📖', title: 'Sagesse', desc: 'S\'inspirer des enseignements du Coran et des hadiths' },
];

const TIPS = [
  {
    emoji: '👨‍👩‍👧‍👦',
    title: 'Pratiquez ensemble',
    desc: 'Accompagnez votre enfant dans les exercices de respiration et de méditation. C\'est un moment de partage précieux !',
  },
  {
    emoji: '💬',
    title: 'Discutez des histoires',
    desc: 'Après chaque chapitre, demandez à votre enfant ce qu\'il a retenu et compris. Encouragez-le à poser des questions.',
  },
  {
    emoji: '🎉',
    title: 'Célébrez les progrès',
    desc: 'Félicitez votre enfant pour chaque étoile gagnée et chaque badge obtenu. La reconnaissance encourage la persévérance !',
  },
  {
    emoji: '🌙',
    title: 'Utilisez le mode nuit',
    desc: 'Le mode sombre est idéal pour les moments de calme avant le coucher. Il crée une atmosphère apaisante.',
  },
  {
    emoji: '⏰',
    title: 'Une routine quotidienne',
    desc: 'Encouragez votre enfant à pratiquer quelques minutes chaque jour. La régularité est la clé du développement spirituel.',
  },
];

const SOURCES = [
  { name: 'L\'Alchimie du Miroir — Niveau 1 (Initiation)', url: 'https://sounawa.github.io/L-Alchimie-du-Miroir' },
  { name: 'L\'Alchimie du Miroir — Niveau 2 (Approfondissement)', url: 'https://sounawa.github.io/L-Alchimie-du-Miroir-2' },
  { name: 'L\'Alchimie du Miroir — Niveau 3 (Maîtrise)', url: 'https://sounawa.github.io/L-Alchimie-du-Miroir-3' },
  { name: 'L\'Alchimie du Miroir — Thérapie', url: 'https://sounawa.github.io/L-alchimie-du-miroir-therapie/' },
];

function ExpandableSection({ item }: { item: SectionItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="border border-border/60 dark:border-border/40 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center gap-3 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          {item.icon}
        </div>
        <span className="text-sm font-semibold flex-1">{item.title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
              {item.content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export default function ParentCorner() {
  const [isOpen, setIsOpen] = useState(false);

  const sections: SectionItem[] = [
    {
      id: 'about',
      icon: <BookOpen className="w-4 h-4 text-amber-500" />,
      title: 'À propos de l\'application',
      content: (
        <div className="space-y-2">
          <p>
            <strong className="text-foreground">L&apos;Aventure des Petits Cœurs</strong> est une application inspirée du livre spirituel <em>L&apos;Alchimie du Miroir</em>.
          </p>
          <p>
            Elle adapte les enseignements de méditation contemplative, de sagesse islamique et de développement personnel pour les enfants de 6 à 12 ans.
          </p>
          <p>
            À travers 3 aventures magiques, des activités interactives et des prières, votre enfant découvre la lumière de son cœur et apprend à nourrir de belles qualités.
          </p>
        </div>
      ),
    },
    {
      id: 'values',
      icon: <Heart className="w-4 h-4 text-rose-500" />,
      title: 'Valeurs éducatives',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
          {VALUES.map(v => (
            <div
              key={v.title}
              className="flex items-start gap-2 bg-primary/5 rounded-lg p-2.5"
            >
              <span className="text-lg flex-shrink-0">{v.emoji}</span>
              <div>
                <p className="text-xs font-semibold text-foreground">{v.title}</p>
                <p className="text-[11px] text-muted-foreground">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'sources',
      icon: <BookOpen className="w-4 h-4 text-teal-500" />,
      title: 'Sources du contenu',
      content: (
        <div className="space-y-2">
          <p>Le contenu de cette application est inspiré des 4 sites web suivants :</p>
          {SOURCES.map(s => (
            <div
              key={s.name}
              className="flex items-start gap-2 bg-teal-50 dark:bg-teal-900/20 rounded-lg p-2.5 border border-teal-200/40 dark:border-teal-700/30"
            >
              <span className="text-xs">🔗</span>
              <div>
                <p className="text-xs font-medium text-foreground">{s.name}</p>
                <p className="text-[10px] text-muted-foreground break-all">{s.url}</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'privacy',
      icon: <Shield className="w-4 h-4 text-green-500" />,
      title: 'Confidentialité et données',
      content: (
        <div className="space-y-2">
          <div className="flex items-start gap-2 bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200/40 dark:border-green-700/30">
            <Lock className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-green-700 dark:text-green-400">Vos données restent sur votre appareil</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Toutes les données (progression, étoiles, badges) sont stockées uniquement en local sur votre appareil via le stockage du navigateur (localStorage).
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Aucune donnée personnelle n&apos;est envoyée à un serveur. Il n&apos;y a pas de compte, pas de collecte de données, pas de publicité.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200/40 dark:border-blue-700/30">
            <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">Pas de suivi (tracking)</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Cette application n&apos;utilise aucun outil d&apos;analyse, de pistage ou de publicité ciblée.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'age',
      icon: <Users className="w-4 h-4 text-purple-500" />,
      title: 'Âge recommandé',
      content: (
        <div className="space-y-2">
          <div className="flex items-center gap-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200/40 dark:border-purple-700/30">
            <span className="text-2xl">👦👧</span>
            <div>
              <p className="text-sm font-semibold text-purple-700 dark:text-purple-400">6 à 12 ans</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Le contenu est conçu pour les enfants en âge de primaire. Les textes sont simples, les activités sont adaptées à leur niveau de compréhension.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'tips',
      icon: <Lightbulb className="w-4 h-4 text-amber-500" />,
      title: 'Conseils pour les parents',
      content: (
        <div className="space-y-2 mt-1">
          {TIPS.map(tip => (
            <div
              key={tip.title}
              className="flex items-start gap-2.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-2.5 border border-amber-200/40 dark:border-amber-700/30"
            >
              <span className="text-lg flex-shrink-0">{tip.emoji}</span>
              <div>
                <p className="text-xs font-semibold text-foreground">{tip.title}</p>
                <p className="text-[11px] text-muted-foreground">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'device',
      icon: <Smartphone className="w-4 h-4 text-indigo-500" />,
      title: 'Compatible tous appareils',
      content: (
        <div className="space-y-2">
          <p>
            L&apos;application est accessible depuis n&apos;importe quel navigateur web (Chrome, Safari, Firefox, etc.) sur téléphone, tablette ou ordinateur.
          </p>
          <p>
            Pour une meilleure expérience, nous recommandons l&apos;utilisation en mode plein écran sur tablette ou téléphone.
          </p>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Trigger button - used in SettingsPanel */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border border-rose-200/50 dark:border-rose-700/30 hover:shadow-md transition-all"
      >
        <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center">
          <Lock className="w-5 h-5 text-rose-500" />
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold">Espace Parents</p>
          <p className="text-[10px] text-muted-foreground">Informations et conseils</p>
        </div>
        <span className="ml-auto text-lg">👨‍👩‍👧‍👦</span>
      </button>

      {/* Full-screen overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-2 sm:inset-4 md:inset-8 lg:inset-16 z-[110] bg-card rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-rose-400 to-pink-500 p-4 sm:p-5 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👨‍👩‍👧‍👦</span>
                  <div>
                    <h2 className="text-lg font-bold text-white">Espace Parents</h2>
                    <p className="text-xs text-white/80">Pour les parents</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 custom-scrollbar">
                <div className="space-y-2.5">
                  {sections.map(section => (
                    <ExpandableSection key={section.id} item={section} />
                  ))}
                </div>

                {/* Footer note */}
                <div className="text-center pt-4 pb-2">
                  <p className="text-[10px] text-muted-foreground">
                    Fait avec 💛 et 🤲 pour les petits cœurs du monde entier
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    L&apos;Alchimie du Miroir — L&apos;Aventure des Petits Cœurs • v1.0
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
