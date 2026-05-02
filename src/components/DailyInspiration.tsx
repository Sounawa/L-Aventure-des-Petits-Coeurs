'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AudioPlayer from '@/components/AudioPlayer';
import { Share2, Check, Sparkles } from 'lucide-react';

interface Quote {
  text: string;
  source: string;
  type: 'coran' | 'hadith' | 'sagesse';
}

const quotes: Quote[] = [
  { text: "Et Dieu est avec les patients.", source: "Coran 2:153", type: "coran" },
  { text: "Le meilleur d'entre vous est celui qui a le meilleur caractère.", source: "Hadith", type: "hadith" },
  { text: "Un sourire à ton frère est une aumône.", source: "Hadith", type: "hadith" },
  { text: "Dieu est doux et Il aime la douceur.", source: "Hadith", type: "hadith" },
  { text: "La gratitude est la moitié de la foi.", source: "Sagesse", type: "sagesse" },
  { text: "Ton cœur est un trésor, protège-le avec de belles actions.", source: "Sagesse", type: "sagesse" },
  { text: "Et quand Mes serviteurs t'interrogent sur Moi, Je suis tout proche.", source: "Coran 2:186", type: "coran" },
  { text: "Celui qui remercie les gens, remercie Dieu.", source: "Hadith", type: "hadith" },
  { text: "La beauté d'une personne, c'est la beauté de son caractère.", source: "Sagesse", type: "sagesse" },
  { text: "Ne méprise aucune bonne action, même le fait de rencontrer ton frère avec un visage souriant.", source: "Hadith", type: "hadith" },
  { text: "En vérité, avec la difficulté vient la facilité.", source: "Coran 94:6", type: "coran" },
  { text: "La paix est une lumière qui éclaire ton chemin quand tu es bienveillant.", source: "Sagesse", type: "sagesse" },
  { text: "Dieu ne regarde pas vos apparences, mais Il regarde vos cœurs.", source: "Hadith", type: "hadith" },
  { text: "Chaque bonne parole est une aumône.", source: "Hadith", type: "hadith" },
  { text: "Le paradis est aux pieds des mères.", source: "Hadith", type: "hadith" },
  { text: "Et Mon miséricorde embrasse toute chose.", source: "Coran 7:156", type: "coran" },
  { text: "Un petit acte de gentillesse vaut plus qu'un grand trésor.", source: "Sagesse", type: "sagesse" },
  { text: "Celui qui croit en Dieu et au Jour Dernier, qu'il dise du bien ou qu'il se taise.", source: "Hadith", type: "hadith" },
  { text: "La patience est une lumière qui ne s'éteint jamais.", source: "Sagesse", type: "sagesse" },
  { text: "Et Dieu vous a aimés en vous créant si merveilleusement.", source: "Sagesse", type: "sagesse" },
  { text: "Dieu est plus proche de toi que ta propre veine.", source: "Coran 50:16", type: "coran" },
  { text: "Fais du bien, même si c'est peu. Le peu auprès de Dieu est beaucoup.", source: "Sagesse", type: "sagesse" },
  { text: "Le fort n'est pas celui qui domine les autres, mais celui qui se domine soi-même.", source: "Hadith", type: "hadith" },
  { text: "Quiconque rend service à son frère, Dieu le servira.", source: "Hadith", type: "hadith" },
  { text: "Le vrai trésor, c'est ce que tu donnes avec ton cœur.", source: "Sagesse", type: "sagesse" },
  { text: "Et rappelle-toi, car le rappel profite aux croyants.", source: "Coran 51:55", type: "coran" },
  { text: "Vis dans ce monde comme un voyageur qui passe.", source: "Hadith", type: "hadith" },
  { text: "La clé du paradis, c'est la prière. La clé de la prière, c'est la purification.", source: "Hadith", type: "hadith" },
  { text: "Chaque matin est une nouvelle chance de faire le bien.", source: "Sagesse", type: "sagesse" },
  { text: "Ceux qui croient et dont les cœurs s'apaisent à l'évocation de Dieu. N'est-ce point à l'évocation de Dieu que les cœurs s'apaisent ?", source: "Coran 13:28", type: "coran" },
];

function getDailyQuote(): Quote {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return quotes[dayOfYear % quotes.length];
}

function formatDateFrench(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  };
  return date.toLocaleDateString('fr-FR', options);
}

function getTypeEmoji(type: Quote['type']): string {
  switch (type) {
    case 'coran': return '📖';
    case 'hadith': return '🤲';
    case 'sagesse': return '💡';
  }
}

function getTypeLabel(type: Quote['type']): string {
  switch (type) {
    case 'coran': return 'Verset';
    case 'hadith': return 'Hadith';
    case 'sagesse': return 'Sagesse';
  }
}

export default function DailyInspiration() {
  const [copied, setCopied] = useState(false);
  const dailyQuote = useMemo(() => getDailyQuote(), []);
  const formattedDate = useMemo(() => formatDateFrench(new Date()), []);

  const handleShare = async () => {
    const shareText = `"${dailyQuote.text}" — ${dailyQuote.source}\n\n✨ L'Alchimie du Miroir — L'Aventure des Petits Cœurs`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Inspiration du jour',
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Fallback: do nothing
      }
    }
  };

  const typeColorMap: Record<Quote['type'], string> = {
    coran: 'from-amber-400 to-yellow-500',
    hadith: 'from-teal-400 to-emerald-500',
    sagesse: 'from-rose-400 to-pink-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.5 }}
      className="w-full"
    >
      <Card className="relative overflow-hidden border-0 shadow-lg">
        {/* Gold gradient border effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-500 p-[2px]">
          <div className="h-full w-full rounded-xl bg-card" />
        </div>

        {/* Decorative corner sparkles */}
        <div className="absolute top-2 right-3 text-amber-400/40 text-lg pointer-events-none">✦</div>
        <div className="absolute bottom-2 left-3 text-amber-400/30 text-sm pointer-events-none">✧</div>

        <div className="relative z-10">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-xl"
                >
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </motion.span>
                <CardTitle className="text-sm font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                  Inspiration du jour
                </CardTitle>
              </div>
              <span className="text-xs text-muted-foreground capitalize">
                {formattedDate}
              </span>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Type badge */}
            <div className="flex items-center gap-1.5 mb-3">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white bg-gradient-to-r ${typeColorMap[dailyQuote.type]}`}>
                <span>{getTypeEmoji(dailyQuote.type)}</span>
                {getTypeLabel(dailyQuote.type)}
              </span>
            </div>

            {/* Quote text */}
            <motion.blockquote
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="relative mb-4"
            >
              <span className="absolute -left-1 -top-2 text-3xl text-amber-300/40 font-serif pointer-events-none">&ldquo;</span>
              <p className="text-base sm:text-lg font-medium text-foreground/90 leading-relaxed pl-4 italic">
                {dailyQuote.text}
              </p>
              <span className="absolute -right-1 -bottom-4 text-3xl text-amber-300/40 font-serif pointer-events-none">&rdquo;</span>
            </motion.blockquote>

            {/* Source */}
            <p className="text-sm font-semibold text-primary/80 dark:text-primary/70 mb-4 pl-4">
              — {dailyQuote.source}
            </p>

            {/* Action buttons */}
            <div className="flex items-center justify-between pl-4">
              <AudioPlayer text={dailyQuote.text + ". " + dailyQuote.source} size="sm" />

              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-muted-foreground hover:text-primary gap-1.5 h-8 px-3"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span className="text-xs">Copié !</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span className="text-xs">Partager</span>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
}
