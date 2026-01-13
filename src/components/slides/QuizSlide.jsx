import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, HelpCircle, Sparkles, Zap } from 'lucide-react';
import { AnimatedBackground } from '../ui/AnimatedBackground';
import { useTheme } from '../../hooks/useTheme';

export function QuizSlide({ question, options, correctAnswer, questionId, onAnswer, existingAnswer }) {
  const { isDark } = useTheme();
  const [selected, setSelected] = useState(existingAnswer?.selected ?? null);
  const [showFeedback, setShowFeedback] = useState(existingAnswer !== undefined);

  const handleSelect = (index) => {
    if (showFeedback) return;

    setSelected(index);
    setShowFeedback(true);

    if (onAnswer) {
      onAnswer(questionId, index, correctAnswer);
    }
  };

  const isCorrect = selected === correctAnswer;

  return (
    <div className="relative min-h-[500px] flex items-center justify-center overflow-hidden rounded-3xl">
      {isDark && <AnimatedBackground variant="default" />}
      {!isDark && (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 rounded-3xl" />
      )}

      <div className="relative z-10 w-full max-w-4xl px-6">
        <div className={`rounded-3xl border backdrop-blur-xl p-8 md:p-10 ${isDark ? 'bg-white/10 border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)]' : 'bg-white/80 border-slate-200 shadow-xl'}`}>
          {/* Header badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <span className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>
              Knowledge Check
            </span>
          </motion.div>

          {/* Question */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-2xl md:text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-slate-800'}`}
          >
            {question}
          </motion.h2>

          {/* Options */}
          <div className="space-y-4">
            {options.map((option, index) => {
              const isSelected = selected === index;
              const isCorrectOption = index === correctAnswer;
              const showAsCorrect = showFeedback && isCorrectOption;
              const showAsWrong = showFeedback && isSelected && !isCorrectOption;

              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleSelect(index)}
                  disabled={showFeedback}
                  whileHover={!showFeedback ? { scale: 1.02, x: 10 } : {}}
                  whileTap={!showFeedback ? { scale: 0.98 } : {}}
                  className={`w-full p-5 rounded-2xl text-left transition-all flex items-center gap-4 border backdrop-blur-sm group ${
                    showAsCorrect
                      ? 'bg-emerald-500/20 border-emerald-400/50 shadow-lg shadow-emerald-500/20'
                      : showAsWrong
                      ? 'bg-red-500/20 border-red-400/50 shadow-lg shadow-red-500/20'
                      : isSelected
                      ? 'bg-purple-500/20 border-purple-400/50'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  } ${showFeedback ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  {/* Option letter */}
                  <motion.span
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                      showAsCorrect
                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg'
                        : showAsWrong
                        ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg'
                        : isSelected
                        ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg'
                        : 'bg-white/10 text-white/60 group-hover:bg-white/20 group-hover:text-white'
                    }`}
                    whileHover={!showFeedback ? { rotate: [0, -5, 5, 0] } : {}}
                  >
                    {String.fromCharCode(65 + index)}
                  </motion.span>

                  {/* Option text */}
                  <span className={`flex-1 ${
                    showAsCorrect ? 'text-emerald-200 font-medium' :
                    showAsWrong ? 'text-red-200' :
                    isSelected ? 'text-purple-200 font-medium' :
                    'text-white/80 group-hover:text-white'
                  }`}>
                    {option}
                  </span>

                  {/* Result icons */}
                  {showFeedback && isCorrectOption && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                    </motion.div>
                  )}
                  {showAsWrong && (
                    <motion.div
                      initial={{ scale: 0, rotate: 180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      <XCircle className="w-7 h-7 text-red-400" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Feedback message */}
          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className={`mt-8 p-5 rounded-2xl border backdrop-blur-sm ${
                  isCorrect
                    ? 'bg-emerald-500/10 border-emerald-400/30'
                    : 'bg-amber-500/10 border-amber-400/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  {isCorrect ? (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg"
                      >
                        <Sparkles className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <span className="font-bold text-emerald-300 text-lg block">Correct!</span>
                        <span className="text-emerald-200/70 text-sm">Great job, you got it right!</span>
                      </div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.3 }}
                        className="ml-auto flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full text-emerald-400"
                      >
                        <Zap size={16} />
                        <span className="font-bold">+25</span>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                        <XCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <span className="font-bold text-amber-300 text-lg block">Not quite</span>
                        <span className="text-amber-200/70 text-sm">
                          The correct answer is <strong>{String.fromCharCode(65 + correctAnswer)}</strong>
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
