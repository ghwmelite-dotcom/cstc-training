import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlideWrapper } from './SlideContainer';
import {
  MessageSquare,
  User,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Meh
} from 'lucide-react';

export function ScenarioSlide({
  scenario,
  character,
  characterRole,
  options,
  onChoice,
  questionId
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showOutcome, setShowOutcome] = useState(false);

  const handleSelect = (index) => {
    if (showOutcome) return;
    setSelectedOption(index);
    setShowOutcome(true);
    if (onChoice) {
      onChoice(questionId, index, options[index].quality);
    }
  };

  const reset = () => {
    setSelectedOption(null);
    setShowOutcome(false);
  };

  const qualityConfig = {
    best: {
      icon: ThumbsUp,
      color: 'bg-emerald-500',
      lightBg: 'bg-emerald-50',
      border: 'border-emerald-500',
      text: 'text-emerald-700',
      label: 'Excellent Choice!'
    },
    good: {
      icon: CheckCircle2,
      color: 'bg-blue-500',
      lightBg: 'bg-blue-50',
      border: 'border-blue-500',
      text: 'text-blue-700',
      label: 'Good Approach'
    },
    okay: {
      icon: Meh,
      color: 'bg-amber-500',
      lightBg: 'bg-amber-50',
      border: 'border-amber-500',
      text: 'text-amber-700',
      label: 'Could Be Better'
    },
    poor: {
      icon: ThumbsDown,
      color: 'bg-red-500',
      lightBg: 'bg-red-50',
      border: 'border-red-500',
      text: 'text-red-700',
      label: 'Not Recommended'
    }
  };

  const selectedQuality = selectedOption !== null ? qualityConfig[options[selectedOption].quality] : null;

  return (
    <SlideWrapper className="bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header Badge */}
      <motion.div
        className="flex items-center gap-2 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-md">
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Real-World Scenario
          </span>
          <p className="text-sm text-slate-500">What would you do?</p>
        </div>
      </motion.div>

      {/* Scenario Card */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-slate-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Character */}
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
            {character?.charAt(0) || 'U'}
          </div>
          <div>
            <h3 className="font-bold text-slate-800">{character || 'Team Member'}</h3>
            <p className="text-sm text-slate-500">{characterRole || 'Government Employee'}</p>
          </div>
          <div className="ml-auto flex items-center gap-1 text-xs text-slate-400">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span>Just now</span>
          </div>
        </div>

        {/* Scenario Text */}
        <div className="relative">
          <div className="absolute -left-2 top-0 bottom-0 w-1 bg-indigo-200 rounded-full" />
          <p className="text-slate-700 text-lg leading-relaxed pl-4 italic">
            "{scenario}"
          </p>
        </div>
      </motion.div>

      {/* Options */}
      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        {options.map((option, index) => {
          const isSelected = selectedOption === index;
          const quality = qualityConfig[option.quality];

          return (
            <motion.button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={showOutcome}
              className={`relative p-4 rounded-xl text-left transition-all ${
                showOutcome
                  ? isSelected
                    ? `${quality.lightBg} border-2 ${quality.border}`
                    : 'bg-slate-50 opacity-50'
                  : 'bg-white border-2 border-slate-200 hover:border-indigo-300 hover:shadow-md'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={!showOutcome ? { scale: 1.02 } : {}}
              whileTap={!showOutcome ? { scale: 0.98 } : {}}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  showOutcome && isSelected ? quality.color : 'bg-slate-100'
                }`}>
                  {showOutcome && isSelected ? (
                    <quality.icon className="w-4 h-4 text-white" />
                  ) : (
                    <span className={`font-bold text-sm ${showOutcome ? 'text-slate-400' : 'text-slate-600'}`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${showOutcome && !isSelected ? 'text-slate-400' : 'text-slate-700'}`}>
                    {option.text}
                  </p>
                </div>
              </div>

              {/* Arrow indicator */}
              {!showOutcome && (
                <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Outcome Panel */}
      <AnimatePresence>
        {showOutcome && selectedOption !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="overflow-hidden"
          >
            <div className={`rounded-xl p-5 ${selectedQuality.lightBg} border ${selectedQuality.border.replace('border-', 'border-')}`}>
              {/* Quality Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 ${selectedQuality.color} rounded-lg flex items-center justify-center`}>
                    <selectedQuality.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className={`font-bold ${selectedQuality.text}`}>
                    {selectedQuality.label}
                  </span>
                </div>
                <button
                  onClick={reset}
                  className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <RotateCcw size={14} />
                  <span>Try Again</span>
                </button>
              </div>

              {/* Outcome Text */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <ArrowRight className={`w-5 h-5 ${selectedQuality.text} flex-shrink-0 mt-0.5`} />
                  <p className="text-slate-700">{options[selectedOption].outcome}</p>
                </div>

                {options[selectedOption].betterApproach && (
                  <div className="flex items-start gap-3 pt-3 border-t border-slate-200">
                    <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-slate-700">Better approach: </span>
                      <span className="text-slate-600">{options[selectedOption].betterApproach}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SlideWrapper>
  );
}
