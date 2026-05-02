'use client';

import { motion } from 'framer-motion';

interface DuaCardProps {
  arabic: string;
  transliteration: string;
  translation: string;
  context?: string;
  emoji?: string;
}

const duas: DuaCardProps[] = [
  {
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
    transliteration: 'Bismillahir Rahmanir Rahim',
    translation: 'Au nom de Dieu, le Tout-Miséricordieux, le Très-Miséricordieux',
    context: 'On dit Bismillah avant chaque action importante',
    emoji: '🌟',
  },
  {
    arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    transliteration: 'Alhamdulillahi Rabbil Alamin',
    translation: 'Louange à Dieu, Seigneur des mondes',
    context: 'On dit Alhamdulillah pour remercier Dieu',
    emoji: '💛',
  },
  {
    arabic: 'رَبِّ زِدْنِي عِلْمًا',
    transliteration: 'Rabbi zidni ilma',
    translation: 'Mon Seigneur, augmente ma connaissance',
    context: 'Une prière pour demander le savoir',
    emoji: '📖',
  },
  {
    arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي',
    transliteration: 'Rabbi ishrah li sadri',
    translation: 'Mon Seigneur, ouvre mon cœur',
    context: 'Une prière de Moïse pour demander la force',
    emoji: '💜',
  },
  {
    arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
    transliteration: 'Allahumma innaka Afuwwun tuhibbul afwa fa fu anni',
    translation: 'Ô Dieu, Tu es le Pardonneur, Tu aimes le pardon, pardonne-moi',
    context: 'Une prière spéciale pour demander le pardon',
    emoji: '🌸',
  },
  {
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    transliteration: 'Subhanallahi wa bihamdihi',
    translation: 'Gloire à Dieu et par Sa louange',
    context: 'Un dhikr simple qui fait briller le cœur',
    emoji: '✨',
  },
];

export { duas };
export type { DuaCardProps };

export default function DuaCard({ arabic, transliteration, translation, context, emoji }: DuaCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-primary/5 via-card to-secondary/5 rounded-2xl p-5 border border-primary/15 shadow-sm relative overflow-hidden"
    >
      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-3xl" />

      {/* Emoji badge */}
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{emoji}</span>
      </div>

      {/* Arabic text - large and centered */}
      <p className="text-2xl sm:text-3xl text-right font-arabic leading-loose text-foreground/90 mb-3" dir="rtl" lang="ar">
        {arabic}
      </p>

      {/* Transliteration */}
      <p className="text-sm italic text-primary/80 mb-2 text-center">
        {transliteration}
      </p>

      {/* Translation */}
      <p className="text-sm text-foreground/80 text-center leading-relaxed">
        &ldquo;{translation}&rdquo;
      </p>

      {/* Context */}
      {context && (
        <div className="mt-3 pt-3 border-t border-primary/10">
          <p className="text-xs text-muted-foreground text-center">
            💡 {context}
          </p>
        </div>
      )}
    </motion.div>
  );
}

// A collection of Dua cards for the adventures
export function DuaCollection() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-center text-muted-foreground mb-3">
        Apprends ces belles prières 🤲
      </p>
      {duas.map((dua, i) => (
        <DuaCard key={i} {...dua} />
      ))}
    </div>
  );
}
