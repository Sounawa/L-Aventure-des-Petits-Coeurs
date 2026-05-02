'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import BreathingExercise from './BreathingExercise';
import GratitudeJournal from './GratitudeJournal';
import DrawingCanvas from './DrawingCanvas';
import MemoryGame from './MemoryGame';

// ---- Quiz Game ----
const quizQuestions = [
  { question: 'Quand tu es gentil avec quelqu\'un, que fait la lumière de ton cœur ?', options: ['Elle disparaît', 'Elle brille plus fort', 'Elle reste pareille'], correct: 1 },
  { question: 'Que signifie "Alhamdulillah" ?', options: ['Je suis triste', 'Merci à Dieu / Louange à Dieu', 'Je suis fatigué'], correct: 1 },
  { question: 'Quelle qualité te fait attendre sans te fâcher ?', options: ['Le courage', 'La patience', 'L\'honnêteté'], correct: 1 },
  { question: 'Quand tu dis la vérité même si c\'est difficile, c\'est...', options: ['La gentillesse', 'L\'amour', 'L\'honnêteté'], correct: 2 },
  { question: 'Le miroir magique reflète la lumière de...', options: ['Ton visage', 'Ton cœur', 'Tes vêtements'], correct: 1 },
  { question: 'Ar-Rahman signifie...', options: ['Le Guide', 'Le Très Miséricordieux', 'La Paix'], correct: 1 },
  { question: 'Que se passe-t-il quand tu partages ta lumière ?', options: ['Elle diminue', 'Elle grandit', 'Elle disparaît'], correct: 1 },
  { question: 'La prière est comme...', options: ['Un devoir ennuyeux', 'Une conversation avec Dieu', 'Une règle à suivre'], correct: 1 },
  { question: 'Le courage, c\'est...', options: ['Ne jamais avoir peur', 'Faire ce qui est bien même quand on a peur', 'Être le plus fort'], correct: 1 },
  { question: 'D\'où vient la lumière de ton cœur ?', options: ['De toi seul', 'De Dieu', 'De tes parents'], correct: 1 },
];

function QuizGame() {
  const { quizCompleted, quizScore, setQuizCompleted } = useAppStore();
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(quizCompleted);

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const isCorrect = idx === quizQuestions[currentQ].correct;
    const newScore = isCorrect ? score + 1 : score;
    
    if (isCorrect) setScore(newScore);

    setTimeout(() => {
      if (currentQ < quizQuestions.length - 1) {
        setCurrentQ(currentQ + 1);
        setSelected(null);
      } else {
        setFinished(true);
        if (!quizCompleted) {
          setQuizCompleted(newScore);
        }
      }
    }, 1200);
  };

  if (finished) {
    return (
      <div className="flex flex-col items-center gap-4 py-4">
        <motion.span 
          className="text-5xl"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          🏆
        </motion.span>
        <h3 className="text-xl font-bold text-primary">Quiz terminé !</h3>
        <p className="text-lg">
          Score : <span className="font-bold text-primary">{quizCompleted ? quizScore : score}/{quizQuestions.length}</span>
        </p>
        {(quizCompleted ? quizScore : score) >= 7 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-primary/10 rounded-xl p-3 text-center border border-primary/20"
          >
            <p className="text-sm font-medium text-primary">🌟 Bravo ! Tu connais bien les trésors du cœur !</p>
          </motion.div>
        )}
        <Button onClick={() => { setCurrentQ(0); setScore(0); setSelected(null); setFinished(false); }} variant="outline">
          🔄 Recommencer
        </Button>
      </div>
    );
  }

  const q = quizQuestions[currentQ];

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Question {currentQ + 1}/{quizQuestions.length}</span>
        <span className="text-sm font-medium text-primary">{score} ⭐</span>
      </div>
      
      <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
        <motion.div
          className="bg-primary rounded-full h-2.5"
          initial={{ width: 0 }}
          animate={{ width: `${((currentQ + 1) / quizQuestions.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
        <p className="text-base font-medium text-center">{q.question}</p>
      </div>

      <div className="space-y-2">
        {q.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === q.correct;
          return (
            <motion.button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={selected !== null}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                selected !== null
                  ? isCorrect
                    ? 'bg-green-100 text-green-700 border-2 border-green-300 shadow-sm'
                    : isSelected
                    ? 'bg-red-100 text-red-700 border-2 border-red-300'
                    : 'bg-muted/50 text-muted-foreground border-2 border-transparent'
                  : 'bg-card border-2 border-border hover:border-primary/50 hover:shadow-sm'
              } ${selected !== null ? 'cursor-not-allowed' : ''}`}
              whileTap={selected === null ? { scale: 0.98 } : {}}
            >
              <span className="mr-2 inline-block w-5 h-5 rounded-full bg-muted text-center text-xs leading-5 font-bold">
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
              {selected !== null && isCorrect && ' ✅'}
              {selected !== null && isSelected && !isCorrect && ' ❌'}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ---- Coloring Book ----
const coloringShapes = [
  { id: 'mirror', name: 'Miroir', emoji: '🪞', path: 'M30,5 L70,5 Q95,5 95,30 L95,70 Q95,95 70,95 L30,95 Q5,95 5,70 L5,30 Q5,5 30,5 Z' },
  { id: 'heart', name: 'Cœur', emoji: '❤️', path: 'M50,90 C25,70 5,50 5,30 C5,10 25,5 50,30 C75,5 95,10 95,30 C95,50 75,70 50,90 Z' },
  { id: 'star', name: 'Étoile', emoji: '⭐', path: 'M50,5 L61,35 L95,35 L68,57 L79,90 L50,70 L21,90 L32,57 L5,35 L39,35 Z' },
  { id: 'moon', name: 'Lune', emoji: '🌙', path: 'M60,5 C30,5 10,30 10,55 C10,80 30,95 60,95 C40,85 35,65 35,50 C35,35 40,15 60,5 Z' },
];

const colorPalette = [
  '#C9A227', '#2DD4BF', '#F472B6', '#A78BFA', '#FB923C',
  '#EF4444', '#22C55E', '#3B82F6', '#F59E0B', '#EC4899',
  '#8B5CF6', '#14B8A6', '#F97316', '#6366F1', '#84CC16',
];

function ColoringBook() {
  const [selectedShape, setSelectedShape] = useState('heart');
  const [selectedColor, setSelectedColor] = useState('#C9A227');
  const [coloredRegions, setColoredRegions] = useState<Record<string, string>>({});

  const handleRegionClick = (regionId: string) => {
    setColoredRegions(prev => ({ ...prev, [regionId]: selectedColor }));
  };

  const shape = coloringShapes.find(s => s.id === selectedShape)!;

  return (
    <div className="flex flex-col gap-4">
      {/* Shape selection */}
      <div className="flex justify-center gap-2">
        {coloringShapes.map(s => (
          <button
            key={s.id}
            onClick={() => { setSelectedShape(s.id); setColoredRegions({}); }}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              selectedShape === s.id
                ? 'bg-primary/20 border-2 border-primary text-primary shadow-sm'
                : 'bg-card border border-border hover:border-primary/50'
            }`}
          >
            {s.emoji} {s.name}
          </button>
        ))}
      </div>

      {/* Color palette */}
      <div className="flex flex-wrap justify-center gap-2">
        {colorPalette.map(color => (
          <button
            key={color}
            onClick={() => setSelectedColor(color)}
            className={`w-8 h-8 rounded-full border-2 transition-transform shadow-sm ${
              selectedColor === color ? 'border-foreground scale-125' : 'border-transparent hover:scale-110'
            }`}
            style={{ backgroundColor: color }}
            aria-label={`Couleur ${color}`}
          />
        ))}
      </div>

      {/* Canvas */}
      <div className="flex justify-center">
        <svg
          viewBox="0 0 100 100"
          className="w-64 h-64 sm:w-80 sm:h-80 bg-card rounded-2xl border-2 border-border shadow-inner"
        >
          {/* Background */}
          <rect
            x="0" y="0" width="100" height="100"
            fill={coloredRegions['bg'] || '#FFFFFF'}
            onClick={() => handleRegionClick('bg')}
            className="cursor-pointer"
          />
          {/* Shape */}
          <path
            d={shape.path}
            fill={coloredRegions['shape'] || '#F5F5F5'}
            stroke="#3D2C1E"
            strokeWidth="2"
            onClick={() => handleRegionClick('shape')}
            className="cursor-pointer"
          />
          {/* Inner detail */}
          <circle
            cx="50" cy="50" r="15"
            fill={coloredRegions['inner'] || '#FAFAFA'}
            stroke="#3D2C1E"
            strokeWidth="1.5"
            onClick={() => handleRegionClick('inner')}
            className="cursor-pointer"
          />
        </svg>
      </div>

      <Button variant="outline" onClick={() => setColoredRegions({})} className="mx-auto">
        🗑️ Effacer
      </Button>
    </div>
  );
}

// ============ MAIN ACTIVITIES SECTION ============
export default function ActivitiesSection() {
  const [activeActivity, setActiveActivity] = useState<string | null>(null);

  const activities = [
    { id: 'quiz', name: 'Quiz des Trésors', emoji: '🏆', desc: '10 questions sur les trésors du cœur', color: 'from-amber-100 to-yellow-200', darkColor: 'from-amber-900/30 to-yellow-800/30' },
    { id: 'coloring', name: 'Coloriage', emoji: '🎨', desc: 'Colorie des formes magiques', color: 'from-pink-100 to-rose-200', darkColor: 'from-pink-900/30 to-rose-800/30' },
    { id: 'drawing', name: 'Dessin Libre', emoji: '✏️', desc: 'Dessine avec des pinceaux magiques', color: 'from-teal-100 to-cyan-200', darkColor: 'from-teal-900/30 to-cyan-800/30' },
    { id: 'memory', name: 'Jeu de Mémoire', emoji: '🧩', desc: 'Trouve les paires cachées', color: 'from-purple-100 to-violet-200', darkColor: 'from-purple-900/30 to-violet-800/30' },
    { id: 'breathing', name: 'Respiration', emoji: '🌬️', desc: 'Exercice de respiration 4-2-6', color: 'from-blue-100 to-indigo-200', darkColor: 'from-blue-900/30 to-indigo-800/30' },
    { id: 'journal', name: 'Gratitude', emoji: '💛', desc: 'Note ce pour quoi tu es reconnaissant(e)', color: 'from-amber-100 to-orange-200', darkColor: 'from-amber-900/30 to-orange-800/30' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center py-2">
        <h2 className="text-2xl font-bold shimmer-text">🎮 Activités</h2>
        <p className="text-sm text-muted-foreground mt-1">Amuse-toi tout en apprenant !</p>
      </div>

      {!activeActivity ? (
        <div className="grid grid-cols-2 gap-3">
          {activities.map((act, i) => (
            <motion.button
              key={act.id}
              onClick={() => setActiveActivity(act.id)}
              className={`bg-gradient-to-br ${act.color} dark:${act.darkColor} rounded-2xl p-4 sm:p-5 text-center border-2 border-white/30 dark:border-white/10 shadow-md hover:shadow-lg transition-all`}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <span className="text-3xl sm:text-4xl block">{act.emoji}</span>
              <p className="text-sm sm:text-base font-bold mt-2">{act.name}</p>
              <p className="text-[10px] sm:text-xs text-foreground/60 mt-1">{act.desc}</p>
            </motion.button>
          ))}
        </div>
      ) : (
        <Card className="border-2 border-primary/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-xl">{activities.find(a => a.id === activeActivity)?.emoji}</span>
                {activities.find(a => a.id === activeActivity)?.name}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setActiveActivity(null)} className="text-muted-foreground">
                ← Retour
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {activeActivity === 'quiz' && <QuizGame />}
            {activeActivity === 'coloring' && <ColoringBook />}
            {activeActivity === 'drawing' && <DrawingCanvas />}
            {activeActivity === 'memory' && <MemoryGame />}
            {activeActivity === 'breathing' && <BreathingExercise />}
            {activeActivity === 'journal' && <GratitudeJournal />}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
