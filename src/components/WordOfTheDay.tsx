'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AudioPlayer from '@/components/AudioPlayer';
import { BookOpen } from 'lucide-react';

interface ArabicWord {
  arabic: string;
  transliteration: string;
  french: string;
  explanation: string;
}

const arabicWords: ArabicWord[] = [
  { arabic: 'نور', transliteration: 'Nūr', french: 'Lumière', explanation: 'La lumière qui vient de Dieu et qui éclaire nos cœurs, comme le soleil éclaire le monde.' },
  { arabic: 'قلب', transliteration: 'Qalb', french: 'Cœur', explanation: 'Le cœur est le trésor de l\'être humain. C\'est là que se trouve la lumière divine.' },
  { arabic: 'سلام', transliteration: 'Salām', french: 'Paix', explanation: 'La paix profonde que l\'on ressent quand on se rapproche de Dieu.' },
  { arabic: 'صبر', transliteration: 'Ṣabr', french: 'Patience', explanation: 'La patience est une lumière qui ne s\'éteint jamais, même dans les moments difficiles.' },
  { arabic: 'حب', transliteration: 'Ḥubb', french: 'Amour', explanation: 'L\'amour pur et sincère, le plus beau cadeau que Dieu a mis dans nos cœurs.' },
  { arabic: 'شكر', transliteration: 'Shukr', french: 'Gratitude', explanation: 'Remercier Dieu pour toutes Ses bénédictions. Alhamdulillah !' },
  { arabic: 'رحمة', transliteration: 'Raḥma', french: 'Miséricorde', explanation: 'La tendresse et la compassion de Dieu qui embrassent toute chose.' },
  { arabic: 'دعاء', transliteration: 'Duʿāʾ', french: 'Prière', explanation: 'Parler à Dieu du fond du cœur. C\'est le moment le plus précieux.' },
  { arabic: 'يقين', transliteration: 'Yaqīn', french: 'Certitude', explanation: 'La foi profonde et certaine dans le cœur, comme une montagne inébranlable.' },
  { arabic: 'توكل', transliteration: 'Tawakkul', french: 'Confiance', explanation: 'Faire confiance à Dieu en toutes circonstances. Il est le meilleur des gardiens.' },
  { arabic: 'خير', transliteration: 'Khayr', french: 'Bien', explanation: 'Tout ce qui est bon et bénéfique. Dieu est la source de tout bien.' },
  { arabic: 'حق', transliteration: 'Ḥaqq', french: 'Vérité', explanation: 'La vérité qui guide nos pas. Dire la vérité rend le cœur lumineux.' },
  { arabic: 'توبة', transliteration: 'Tawba', french: 'Repentir', explanation: 'Revenir vers Dieu quand on a fait une erreur. Dieu pardonne toujours.' },
  { arabic: 'ذكر', transliteration: 'Dhikr', french: 'Rappel', explanation: 'Se rappeler de Dieu dans son cœur. Chaque rappel illumine le cœur.' },
  { arabic: 'فتح', transliteration: 'Fatḥ', french: 'Victoire', explanation: 'La victoire qui vient de Dieu, pas seulement dans les batailles mais dans le cœur.' },
  { arabic: 'هدى', transliteration: 'Hudā', french: 'Guidance', explanation: 'La guidance divine qui montre le droit chemin comme une lumière dans l\'obscurité.' },
  { arabic: 'بركة', transliteration: 'Baraka', french: 'Bénédiction', explanation: 'La bénédiction de Dieu qui rend chaque chose meilleure et plus belle.' },
  { arabic: 'عفو', transliteration: 'ʿAfw', french: 'Pardon', explanation: 'Le pardon pur et beau. Pardonner aux autres, c\'est comme donner un cadeau à son cœur.' },
  { arabic: 'إحسان', transliteration: 'Iḥsān', french: 'Excellence', explanation: 'Faire le bien avec beauté et perfection, comme si tu voyais Dieu.' },
  { arabic: 'حكمة', transliteration: 'Ḥikma', french: 'Sagesse', explanation: 'La sagesse qui vient de Dieu, comme une lumière qui guide vers les meilleures décisions.' },
  { arabic: 'أمانة', transliteration: 'Amāna', french: 'Confiance', explanation: 'Être digne de confiance et honnête. C\'est une qualité très aimée par Dieu.' },
  { arabic: 'طمانينة', transliteration: 'Ṭumaʾnīna', french: 'Sérénité', explanation: 'La tranquillité du cœur quand il se souvient de Dieu. Une paix profonde.' },
  { arabic: 'نصير', transliteration: 'Naṣīr', french: 'Protecteur', explanation: 'Dieu est notre protecteur. Il veille sur nous comme un gardien bienveillant.' },
  { arabic: 'سميع', transliteration: 'Samīʿ', french: 'Celui qui entend', explanation: 'Dieu entend toutes les prières, même les murmures silencieux du cœur.' },
  { arabic: 'بصير', transliteration: 'Baṣīr', french: 'Celui qui voit', explanation: 'Dieu voit tout, nos actions et nos intentions secrètes du cœur.' },
  { arabic: 'ودود', transliteration: 'Wadūd', french: 'Le Très Aimant', explanation: 'Dieu est plein d\'amour. Son amour est plus grand que tout ce qu\'on peut imaginer.' },
  { arabic: 'غفور', transliteration: 'Ghafūr', french: 'Le Pardonneur', explanation: 'Dieu pardonne sans cesse. Ses pardons sont comme un océan sans fin.' },
  { arabic: 'شاكر', transliteration: 'Shākir', french: 'Reconnaissant', explanation: 'Dieu est reconnaissant envers nous quand nous faisons le bien, même un tout petit peu.' },
  { arabic: 'لطيف', transliteration: 'Laṭīf', french: 'Le Subtil', explanation: 'Dieu est doux et subtil dans Sa bienveillance. Il prend soin de nous avec tendresse.' },
  { arabic: 'صبور', transliteration: 'Ṣabūr', french: 'Le Patient', explanation: 'Dieu est patient avec nous. Il ne se précipite jamais pour punir, Il donne toujours une chance.' },
];

function getDailyWord(): ArabicWord {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return arabicWords[dayOfYear % arabicWords.length];
}

export default function WordOfTheDay() {
  const dailyWord = useMemo(() => getDailyWord(), []);

  const audioText = `${dailyWord.french}. ${dailyWord.transliteration}. ${dailyWord.explanation}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.6, duration: 0.5 }}
      className="w-full"
    >
      <Card className="relative overflow-hidden border-0 shadow-lg">
        {/* Gradient border effect - teal/emerald theme */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-teal-400 via-emerald-300 to-teal-500 p-[2px]">
          <div className="h-full w-full rounded-xl bg-card" />
        </div>

        {/* Decorative elements */}
        <div className="absolute top-2 right-3 text-teal-400/30 text-lg pointer-events-none">﷽</div>
        <div className="absolute bottom-2 left-3 text-teal-400/20 text-sm pointer-events-none">✦</div>

        <div className="relative z-10">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <BookOpen className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </motion.span>
                <CardTitle className="text-sm font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider">
                  Mot du jour en arabe
                </CardTitle>
              </div>
              <span className="text-xs text-muted-foreground bg-teal-50 dark:bg-teal-900/30 px-2 py-0.5 rounded-full">
                🌙
              </span>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Arabic word - large, RTL */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.8, type: 'spring', stiffness: 200 }}
              className="text-center my-4"
            >
              <p className="text-5xl sm:text-6xl font-bold text-foreground leading-relaxed" dir="rtl" style={{ fontFamily: "'Amiri', 'Noto Naskh Arabic', serif" }}>
                {dailyWord.arabic}
              </p>
            </motion.div>

            {/* Transliteration and French translation */}
            <div className="text-center mb-4 space-y-1">
              <p className="text-lg font-semibold text-teal-600 dark:text-teal-400 italic">
                {dailyWord.transliteration}
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-900/30 border border-teal-200/50 dark:border-teal-700/30">
                <span className="text-sm font-bold text-teal-700 dark:text-teal-300">
                  {dailyWord.french}
                </span>
              </div>
            </div>

            {/* Explanation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="bg-teal-50/50 dark:bg-teal-900/10 rounded-xl p-3 border border-teal-100/50 dark:border-teal-800/30 mb-3"
            >
              <p className="text-sm text-foreground/80 leading-relaxed">
                💡 {dailyWord.explanation}
              </p>
            </motion.div>

            {/* Audio player */}
            <div className="flex items-center justify-center">
              <AudioPlayer text={audioText} size="md" />
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
}
