'use client';

import { motion } from 'framer-motion';
import { useAppStore, type AdventureId } from '@/lib/store';
import AdventureSelector from './AdventureSelector';
import AdventureMap from './AdventureMap';
import ChapterCard from './ChapterCard';
import MirrorInteraction from './MirrorInteraction';
import BreathingExercise from './BreathingExercise';
import PrayerTracker from './PrayerTracker';
import GratitudeJournal from './GratitudeJournal';
import LightChain from './LightChain';
import DivineNames from './DivineNames';
import StarGazing from './StarGazing';
import DuaCard, { DuaCollection } from './DuaCard';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// ---- Adventure 1: Le Miroir Magique ----
const miroirChapters = [
  {
    chapterNum: 1,
    title: 'La Découverte',
    story: 'Un jour, dans un jardin enchanté, un enfant trouve un vieux miroir doré. Quand il regarde dedans, il ne voit pas son visage... il voit une lumière ! Une lumière qui vient de son cœur.',
    lesson: 'Ton cœur a une lumière spéciale. Parfois, on ne la voit pas, mais elle est toujours là.',
    illustration: '🪞',
    activityLabel: 'Regarde dans le miroir',
    adventureId: 'miroir',
  },
  {
    chapterNum: 2,
    title: 'Le Premier Regard',
    story: 'Le miroir montre quelque chose d\'étonnant : quand l\'enfant est gentil, la lumière brille plus fort. Quand il est en colère, la lumière se cache derrière des nuages.',
    lesson: 'Chaque bonne action fait briller ton cœur un peu plus.',
    illustration: '💛',
    activityLabel: 'Trie les actions',
    adventureId: 'miroir',
  },
  {
    chapterNum: 3,
    title: 'La Respiration Magique',
    story: 'L\'enfant apprend à respirer calmement. À chaque inspiration, il imagine qu\'il respire de la lumière dorée. À chaque expiration, il laisse partir les nuages gris.',
    lesson: 'Quand tu respires calmement, tu peux sentir la paix dans ton cœur.',
    illustration: '🌬️',
    activityLabel: 'Exercice de respiration',
    adventureId: 'miroir',
  },
  {
    chapterNum: 4,
    title: 'Le Murmure du Cœur',
    story: 'Dans le silence, l\'enfant entend une petite voix douce. Ce n\'est pas une voix qu\'on entend avec les oreilles, c\'est une voix qu\'on entend avec le cœur. Elle dit des choses belles comme : "Tu es aimé", "Tu es courageux", "Ne t\'inquiète pas".',
    lesson: 'Dieu met dans ton cœur des mots de paix. Écoute-les dans le silence.',
    illustration: '💜',
    activityLabel: 'Écoute les mots du cœur',
    adventureId: 'miroir',
  },
  {
    chapterNum: 5,
    title: 'Le Miroir et la Prière',
    story: 'L\'enfant découvre que quand il prie, le miroir brille d\'une lumière encore plus belle. La prière est comme une conversation avec le Plus Lumineux.',
    lesson: 'La prière est un moment spécial où ton cœur parle à Dieu.',
    illustration: '🤲',
    activityLabel: 'Suivi des prières',
    adventureId: 'miroir',
  },
];

// ---- Adventure 3: La Lumière Intérieure ----
const lumiereChapters = [
  {
    chapterNum: 1,
    title: 'D\'où vient la lumière ?',
    story: 'L\'enfant comprend que la lumière dans son cœur ne vient pas de lui seul. Elle vient de Dieu, la Source de toute lumière. Comme le soleil éclaire la lune, Dieu éclaire nos cœurs.',
    lesson: 'Allah est la Lumière des cieux et de la terre. (Coran 24:35)',
    illustration: '☀️',
    activityLabel: 'Chaîne de lumière',
    adventureId: 'lumiere',
  },
  {
    chapterNum: 2,
    title: 'Les Noms Lumineux',
    story: 'Dieu a de beaux noms. Chaque nom est comme une couleur différente de lumière. Ar-Rahman (Le Très Miséricordieux) est une lumière douce et chaude. Al-Hadi (Le Guide) est une lumière qui montre le chemin.',
    lesson: 'En connaissant les beaux noms de Dieu, tu connais mieux Sa lumière.',
    illustration: '🌟',
    activityLabel: 'Découvre les Noms',
    adventureId: 'lumiere',
  },
  {
    chapterNum: 3,
    title: 'Partager la Lumière',
    story: 'Quand ton cœur est rempli de lumière, tu peux la partager ! Un sourire, une parole gentille, un geste d\'aide — ce sont des rayons de ta lumière qui touchent le cœur des autres.',
    lesson: 'La lumière grandit quand on la partage.',
    illustration: '💛',
    activityLabel: 'Envoie un rayon',
    adventureId: 'lumiere',
  },
  {
    chapterNum: 4,
    title: 'Le Miroir de la Nuit',
    story: 'La nuit, quand tout est calme, le miroir brille le plus fort. C\'est le moment spécial pour parler à Dieu dans le silence. Les étoiles sont comme les lumières de tous les cœurs qui prient.',
    lesson: 'Dans le calme de la nuit, ton cœur entend mieux la voix de Dieu.',
    illustration: '🌙',
    activityLabel: 'Observe les étoiles',
    adventureId: 'lumiere',
  },
];

// ---- Chapter 2 Activity: Action Sorting ----
function ActionSortingGame() {
  const [sorted, setSorted] = useState<Record<string, 'shine' | 'hide' | null>>({});
  
  const actions = [
    { id: 'gentil', text: 'Gentil avec maman 😊', correct: 'shine' as const },
    { id: 'crier', text: 'Crier 😡', correct: 'hide' as const },
    { id: 'partager', text: 'Partager un jouet 🧸', correct: 'shine' as const },
    { id: 'mentir', text: 'Mentir 🤥', correct: 'hide' as const },
    { id: 'aider', text: 'Aider un ami 🤝', correct: 'shine' as const },
  ];

  const handleSort = (id: string, choice: 'shine' | 'hide') => {
    setSorted(prev => ({ ...prev, [id]: choice }));
  };

  const correctCount = actions.filter(a => sorted[a.id] === a.correct).length;

  return (
    <div className="space-y-4">
      <p className="text-sm text-center">Est-ce que ça fait briller ou cache la lumière ?</p>
      <div className="space-y-2">
        {actions.map(action => {
          const chosen = sorted[action.id];
          const isCorrect = chosen === action.correct;
          return (
            <div key={action.id} className="bg-card rounded-xl p-3 border border-border">
              <p className="text-sm font-medium mb-2">{action.text}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSort(action.id, 'shine')}
                  disabled={chosen !== null}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                    chosen === 'shine'
                      ? isCorrect ? 'bg-yellow-200 text-amber-800 border-2 border-yellow-400' : 'bg-red-100 text-red-700 border-2 border-red-300'
                      : 'bg-yellow-50 text-amber-700 border border-yellow-200 hover:bg-yellow-100'
                  } ${chosen !== null ? 'opacity-80 cursor-not-allowed' : ''}`}
                >
                  ✨ Fait briller
                </button>
                <button
                  onClick={() => handleSort(action.id, 'hide')}
                  disabled={chosen !== null}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                    chosen === 'hide'
                      ? isCorrect ? 'bg-gray-200 text-gray-700 border-2 border-gray-400' : 'bg-red-100 text-red-700 border-2 border-red-300'
                      : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                  } ${chosen !== null ? 'opacity-80 cursor-not-allowed' : ''}`}
                >
                  ☁️ Cache la lumière
                </button>
              </div>
              {chosen && !isCorrect && (
                <p className="text-xs text-red-500 mt-1">Pas tout à fait... essaie de te rappeler !</p>
              )}
            </div>
          );
        })}
      </div>
      {correctCount === actions.length && (
        <div className="bg-primary/10 rounded-xl p-3 text-center">
          <p className="text-sm font-bold text-primary">🌟 Bravo ! Tu as tout trouvé !</p>
        </div>
      )}
    </div>
  );
}

// ---- Chapter 4 Activity: Heart Whispers ----
function HeartWhispers() {
  const [touched, setTouched] = useState<Set<string>>(new Set());
  
  const words = [
    { word: 'Aimé', message: 'Tu es aimé par Dieu plus que tu ne l\'imagines 💛' },
    { word: 'Courageux', message: 'Tu es courageux, même quand tu as peur ⭐' },
    { word: 'Paix', message: 'La paix est dans ton cœur, écoute-la 🕊️' },
    { word: 'Lumière', message: 'Ta lumière intérieure brille toujours ✨' },
    { word: 'Espoir', message: 'Il y a toujours de l\'espoir avec Dieu 🌱' },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-center">Touche les mots flottants pour écouter ton cœur 💜</p>
      <div className="flex flex-wrap justify-center gap-3">
        {words.map((w) => {
          const isTouched = touched.has(w.word);
          return (
            <motion.button
              key={w.word}
              onClick={() => setTouched(prev => new Set([...prev, w.word]))}
              className={`px-4 py-3 rounded-2xl text-base font-bold transition-all ${
                isTouched
                  ? 'bg-primary/20 text-primary border-2 border-primary/30 shadow-md'
                  : 'bg-card border-2 border-border hover:border-primary/50 hover:shadow-sm'
              }`}
              whileTap={{ scale: 0.9 }}
              animate={isTouched ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {isTouched && '✨ '}{w.word}
            </motion.button>
          );
        })}
      </div>
      {touched.size > 0 && (
        <div className="space-y-2 mt-3">
          {words.filter(w => touched.has(w.word)).map(w => (
            <motion.div
              key={w.word}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-primary/5 rounded-xl p-3 text-sm"
            >
              {w.message}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- Treasure Card ----
function TreasureCard({ 
  emoji, title, arabicName, story, lesson, activityLabel, activity, treasureId 
}: {
  emoji: string;
  title: string;
  arabicName: string;
  story: string;
  lesson: string;
  activityLabel: string;
  activity: React.ReactNode;
  treasureId: string;
}) {
  const { treasuresProgress, collectTreasure } = useAppStore();
  const [expanded, setExpanded] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const isCollected = treasuresProgress[treasureId]?.collected;

  return (
    <Card className={`border-2 ${isCollected ? 'border-primary/50 bg-primary/5' : 'border-border'}`}>
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{isCollected ? emoji : '🔒'}</span>
              <div>
                <CardTitle className="text-base">{title}</CardTitle>
                <p className="text-xs text-muted-foreground">{arabicName}</p>
              </div>
            </div>
            {isCollected && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">💎 Collecté</span>}
          </div>
        </CardHeader>
      </button>

      {expanded && (
        <CardContent className="pt-0">
          <div className="bg-primary/5 rounded-xl p-4 mb-3">
            <p className="text-sm leading-relaxed">{story}</p>
          </div>
          <div className="bg-secondary/10 rounded-xl p-3 mb-3 border border-secondary/20">
            <p className="text-sm font-medium text-foreground/80">💡 {lesson}</p>
          </div>
          <Button variant="outline" onClick={() => setShowActivity(!showActivity)} className="w-full mb-2">
            {showActivity ? 'Cacher' : `🎮 ${activityLabel}`}
          </Button>
          {showActivity && (
            <div className="border-2 border-dashed border-primary/20 rounded-xl p-4 bg-primary/5 mt-2">
              {activity}
              {!isCollected && (
                <Button onClick={() => collectTreasure(treasureId)} className="w-full mt-4" size="sm">
                  💎 J&apos;ai trouvé ce trésor !
                </Button>
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

// ---- Kindness Spinner ----
function KindnessSpinner() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  
  const acts = [
    'Fais un câlin à quelqu\'un 🤗',
    'Dis un mot gentil à un ami 💬',
    'Aide à ranger tes jouets 🧹',
    'Dessine un beau dessin pour quelqu\'un 🎨',
    'Partage quelque chose avec quelqu\'un 🤝',
    'Dis "merci" à quelqu\'un qui t\'aide 🙏',
    'Fais rire quelqu\'un 😄',
    'Écoute quelqu\'un qui a besoin de parler 👂',
  ];

  const spin = () => {
    setSpinning(true);
    setResult(null);
    setTimeout(() => {
      setResult(acts[Math.floor(Math.random() * acts.length)]);
      setSpinning(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Button onClick={spin} disabled={spinning}>
        {spinning ? '🔄 Tourne...' : '🎡 Tourne la roue !'}
      </Button>
      {result && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="bg-accent/10 rounded-2xl p-4 text-center border-2 border-accent/20 max-w-xs"
        >
          <p className="text-sm font-bold">{result}</p>
        </motion.div>
      )}
    </div>
  );
}

// ---- True or False Quiz ----
function HonestyQuiz() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  
  const scenarios = [
    { text: 'Tu as cassé un vase et tu dis que c\'est le chat.', honest: false },
    { text: 'Tu dis à ton ami que tu l\'aimes même si tu es fâché.', honest: true },
    { text: 'Tu as eu une mauvaise note et tu la montres à tes parents.', honest: true },
    { text: 'Tu as pris un bonbon sans demander et tu dis que non.', honest: false },
    { text: 'Tu dis la vérité même si tu as peur d\'être puni.', honest: true },
  ];

  return (
    <div className="space-y-3">
      {scenarios.map((s, i) => {
        const answered = answers[i];
        const isCorrect = answered === s.honest;
        return (
          <div key={i} className="bg-card rounded-xl p-3 border border-border">
            <p className="text-sm mb-2">{s.text}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setAnswers(prev => ({ ...prev, [i]: true }))}
                disabled={answered !== undefined}
                className={`flex-1 py-2 rounded-lg text-xs font-medium ${
                  answered === true
                    ? isCorrect ? 'bg-green-100 text-green-700 border-2 border-green-300' : 'bg-red-100 text-red-700 border-2 border-red-300'
                    : 'bg-green-50 border border-green-200'
                } ${answered !== undefined ? 'opacity-80' : ''}`}
              >
                💎 Honnête
              </button>
              <button
                onClick={() => setAnswers(prev => ({ ...prev, [i]: false }))}
                disabled={answered !== undefined}
                className={`flex-1 py-2 rounded-lg text-xs font-medium ${
                  answered === false
                    ? isCorrect ? 'bg-green-100 text-green-700 border-2 border-green-300' : 'bg-red-100 text-red-700 border-2 border-red-300'
                    : 'bg-red-50 border border-red-200'
                } ${answered !== undefined ? 'opacity-80' : ''}`}
              >
                😟 Pas honnête
              </button>
            </div>
          </div>
        );
      })}
      {Object.keys(answers).length === scenarios.length && (
        <p className="text-center text-sm font-bold text-primary">
          🌟 Bravo ! La vérité mène au bien !
        </p>
      )}
    </div>
  );
}

// ---- Patience Garden ----
function PatienceGarden() {
  const [waterCount, setWaterCount] = useState(0);
  const stages = ['🌱', '🌿', '🪴', '🌸', '🌺'];
  const stageIndex = Math.min(Math.floor(waterCount / 3), stages.length - 1);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-32 h-32 rounded-2xl bg-gradient-to-b from-sky-100 to-green-100 flex items-center justify-center border-2 border-green-200">
        <motion.span
          className="text-5xl"
          key={stageIndex}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          {stages[stageIndex]}
        </motion.span>
      </div>
      <Button onClick={() => setWaterCount(prev => prev + 1)} variant="outline">
        💧 Arroser la plante
      </Button>
      <p className="text-xs text-muted-foreground">
        Arrosages : {waterCount} — {stageIndex < stages.length - 1 ? 'Continue, la patience fait grandir !' : '🌸 Ta fleur a éclos !'}
      </p>
    </div>
  );
}

// ---- Floating Hearts Activity ----
function FloatingHearts() {
  const [hearts, setHearts] = useState<{ id: number; x: number }[]>([]);
  const heartId = useState(0);

  const addHeart = () => {
    const id = heartId[0] + 1;
    heartId[1](id);
    const x = 20 + Math.random() * 60;
    setHearts(prev => [...prev.slice(-10), { id, x }]);
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== id));
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-center">Envoie de l&apos;amour à quelqu&apos;un que tu aimes ❤️</p>
      <div className="relative w-full h-48 bg-gradient-to-b from-pink-50 to-rose-50 rounded-2xl overflow-hidden border border-rose-200">
        {hearts.map(heart => (
          <motion.span
            key={heart.id}
            className="absolute text-2xl"
            style={{ left: `${heart.x}%`, bottom: 0 }}
            initial={{ y: 0, opacity: 1, scale: 1 }}
            animate={{ y: -180, opacity: 0, scale: 1.5 }}
            transition={{ duration: 3, ease: 'easeOut' }}
          >
            ❤️
          </motion.span>
        ))}
      </div>
      <Button onClick={addHeart} className="bg-rose-400 hover:bg-rose-500">
        ❤️ Envoyer de l&apos;amour
      </Button>
    </div>
  );
}

// ---- Courage Activity ----
function CourageActivity() {
  const [courageText, setCourageText] = useState('');
  const [saved, setSaved] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-center">Écris un acte courageux que tu as fait ⭐</p>
      <Input
        value={courageText}
        onChange={(e) => { setCourageText(e.target.value); setSaved(false); }}
        placeholder="J'ai été courageux quand..."
      />
      <Button
        onClick={() => setSaved(true)}
        disabled={!courageText.trim()}
      >
        {saved ? '⭐ Enregistré !' : '⭐ Enregistrer mon acte courageux'}
      </Button>
      {saved && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-yellow-50 rounded-xl p-3 text-center border border-yellow-200"
        >
          <p className="text-sm font-medium">🌟 Tu es courageux ! Avec Dieu, tu es plus fort que ta peur !</p>
        </motion.div>
      )}
    </div>
  );
}

// ---- Light Source Activity ----
function LightSourceActivity() {
  const [clicks, setClicks] = useState(0);
  const maxClicks = 5;

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-center">Appuie pour voir comment la lumière passe du soleil à ton cœur ☀️</p>
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        {/* Sun */}
        <motion.span
          className="text-4xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ☀️
        </motion.span>
        {/* Light ray */}
        {clicks >= 1 && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 30 }}
            className="h-1 bg-gradient-to-r from-yellow-300 to-yellow-100 rounded-full"
          />
        )}
        {/* Moon */}
        <motion.span
          className="text-3xl"
          animate={clicks >= 1 ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🌙
        </motion.span>
        {/* Light ray */}
        {clicks >= 2 && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 30 }}
            className="h-1 bg-gradient-to-r from-amber-200 to-amber-100 rounded-full"
          />
        )}
        {/* Heart */}
        <motion.span
          className="text-3xl"
          animate={clicks >= 2 ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          💛
        </motion.span>
      </div>
      <Button onClick={() => setClicks(prev => Math.min(prev + 1, maxClicks))} disabled={clicks >= maxClicks}>
        {clicks >= maxClicks ? '✨ La lumière brille !' : '✨ Fais passer la lumière'}
      </Button>
      {clicks >= 2 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-primary font-medium text-center"
        >
          Comme le soleil éclaire la lune, Dieu éclaire nos cœurs ✨
        </motion.p>
      )}
    </div>
  );
}

// ============ MAIN ADVENTURE VIEW ============
export default function AdventureView() {
  const { currentAdventure } = useAppStore();

  return (
    <div className="flex flex-col gap-4">
      {/* Adventure Map - visual journey */}
      <Card className="border-2 border-primary/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <span>🗺️</span>
            Carte de l&apos;Aventure
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <AdventureMap />
        </CardContent>
      </Card>

      <AdventureSelector />

      <motion.div
        key={currentAdventure}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {currentAdventure === 'miroir' && (
          <div className="space-y-4">
            <div className="text-center py-3 relative">
              <motion.div
                className="absolute -top-1 left-1/4 text-sm opacity-20"
                animate={{ y: [0, -5, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >✨</motion.div>
              <motion.div
                className="absolute -top-1 right-1/4 text-sm opacity-20"
                animate={{ y: [0, -5, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              >🌟</motion.div>
              <h2 className="text-2xl font-bold shimmer-text">🪞 Le Miroir Magique</h2>
              <p className="text-sm text-muted-foreground mt-1">5 chapitres pour découvrir le miroir enchanté</p>
            </div>
            {miroirChapters.map((ch) => (
              <ChapterCard
                key={ch.chapterNum}
                data={{
                  ...ch,
                  activity: ch.chapterNum === 1 ? <MirrorInteraction /> :
                    ch.chapterNum === 2 ? <ActionSortingGame /> :
                    ch.chapterNum === 3 ? <BreathingExercise /> :
                    ch.chapterNum === 4 ? <HeartWhispers /> :
                    <PrayerTracker />,
                }}
              />
            ))}
          </div>
        )}

        {currentAdventure === 'tresors' && (
          <div className="space-y-4">
            <div className="text-center py-3 relative">
              <motion.div
                className="absolute -top-1 left-1/4 text-sm opacity-20"
                animate={{ y: [0, -5, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >✨</motion.div>
              <motion.div
                className="absolute -top-1 right-1/4 text-sm opacity-20"
                animate={{ y: [0, -5, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              >💎</motion.div>
              <h2 className="text-2xl font-bold text-gradient-teal">💎 Les Trésors du Cœur</h2>
              <p className="text-sm text-muted-foreground mt-1">6 trésors précieux à collecter</p>
            </div>
            
            <TreasureCard
              emoji="💛"
              title="La Gratitude"
              arabicName="Al-Shukr"
              story="Le trésor de la gratitude, c'est comme un soleil dans le cœur. Quand tu dis 'merci', ton cœur brille."
              lesson="Dis Alhamdulillah pour chaque belle chose dans ta vie."
              activityLabel="Journal de gratitude"
              activity={<GratitudeJournal />}
              treasureId="gratitude"
            />

            <TreasureCard
              emoji="🌿"
              title="La Patience"
              arabicName="As-Sabr"
              story="La patience, c'est comme un arbre qui pousse doucement. Même quand c'est difficile, l'arbre continue de grandir."
              lesson="Allah est avec les patients."
              activityLabel="Jardin de la patience"
              activity={<PatienceGarden />}
              treasureId="patience"
            />

            <TreasureCard
              emoji="🌸"
              title="La Gentillesse"
              arabicName="Al-Ihsan"
              story="La gentillesse, c'est comme une fleur qu'on offre. Quand tu es gentil, tu offres un peu de la beauté de ton cœur."
              lesson="La gentillesse rend le monde plus beau."
              activityLabel="Roue de la gentillesse"
              activity={<KindnessSpinner />}
              treasureId="gentillesse"
            />

            <TreasureCard
              emoji="⭐"
              title="Le Courage"
              arabicName="Ash-Shuja'a"
              story="Le courage, ce n'est pas ne pas avoir peur. C'est faire ce qui est bien même quand on a peur. Chaque petit acte de courage fait briller ton cœur."
              lesson="Avec Dieu, tu es plus fort que ta peur."
              activityLabel="Mon acte courageux"
              activity={<CourageActivity />}
              treasureId="courage"
            />

            <TreasureCard
              emoji="💎"
              title="L'Honnêteté"
              arabicName="As-Sidq"
              story="L'honnêteté, c'est comme un diamant pur. Quand tu dis la vérité, ton cœur est transparent et clair comme le cristal."
              lesson="La vérité mène au bien."
              activityLabel="Vrai ou Faux"
              activity={<HonestyQuiz />}
              treasureId="honnêteté"
            />

            <TreasureCard
              emoji="❤️"
              title="L'Amour"
              arabicName="Al-Mahabba"
              story="L'amour, c'est le plus grand trésor. Aimer Dieu, aimer ta famille, aimer tes amis — c'est ça qui fait briller le miroir le plus fort."
              lesson="Aimer et être aimé, c'est le plus beau cadeau de Dieu."
              activityLabel="Envoyer de l'amour"
              activity={<FloatingHearts />}
              treasureId="amour"
            />
          </div>
        )}

        {currentAdventure === 'lumiere' && (
          <div className="space-y-4">
            <div className="text-center py-3 relative">
              <motion.div
                className="absolute -top-1 left-1/4 text-sm opacity-20"
                animate={{ y: [0, -5, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >✨</motion.div>
              <motion.div
                className="absolute -top-1 right-1/4 text-sm opacity-20"
                animate={{ y: [0, -5, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              >🌙</motion.div>
              <h2 className="text-2xl font-bold text-gradient-rose">✨ La Lumière Intérieure</h2>
              <p className="text-sm text-muted-foreground mt-1">4 chapitres pour comprendre la lumière divine</p>
            </div>
            {lumiereChapters.map((ch) => (
              <ChapterCard
                key={ch.chapterNum}
                data={{
                  ...ch,
                  activity: ch.chapterNum === 1 ? <LightSourceActivity /> :
                    ch.chapterNum === 2 ? <DivineNames /> :
                    ch.chapterNum === 3 ? <LightChain /> :
                    <StarGazing />,
                }}
              />
            ))}
            
            {/* Dua/Prayer cards section */}
            <Card className="border-2 border-primary/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-xl">🤲</span>
                  Belles Prières à Apprendre
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DuaCollection />
              </CardContent>
            </Card>
          </div>
        )}
      </motion.div>
    </div>
  );
}
