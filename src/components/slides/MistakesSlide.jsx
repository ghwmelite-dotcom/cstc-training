import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlideWrapper } from './SlideContainer';
import {
  AlertTriangle,
  X,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  AlertOctagon,
  Lightbulb,
  ArrowRight,
  Calendar,
  LayoutGrid,
  CheckSquare
} from 'lucide-react';

export function MistakesSlide({ mistakes, step = 0 }) {
  const [activeMistake, setActiveMistake] = useState(0);

  const toolIcons = {
    calendar: Calendar,
    trello: LayoutGrid,
    asana: CheckSquare,
  };

  const toolColors = {
    calendar: { bg: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-600' },
    trello: { bg: 'bg-sky-500', light: 'bg-sky-50', text: 'text-sky-600' },
    asana: { bg: 'bg-rose-500', light: 'bg-rose-50', text: 'text-rose-600' },
  };

  const currentMistake = mistakes[activeMistake];
  const ToolIcon = toolIcons[currentMistake.tool] || AlertTriangle;
  const colors = toolColors[currentMistake.tool] || toolColors.calendar;

  const nextMistake = () => setActiveMistake(i => (i + 1) % mistakes.length);
  const prevMistake = () => setActiveMistake(i => (i - 1 + mistakes.length) % mistakes.length);

  return (
    <SlideWrapper className="bg-gradient-to-br from-red-50 to-orange-50">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
            <AlertOctagon className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">
              Common Mistakes
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">What to Avoid</h2>
          </div>
        </div>

        {/* Navigation Pills */}
        <div className="flex items-center gap-2">
          {mistakes.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveMistake(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === activeMistake
                  ? 'bg-red-500 w-8'
                  : 'bg-red-200 hover:bg-red-300'
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMistake}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Tool Badge */}
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-8 h-8 ${colors.bg} rounded-lg flex items-center justify-center`}>
              <ToolIcon className="w-4 h-4 text-white" />
            </div>
            <span className={`text-sm font-medium ${colors.text}`}>
              {currentMistake.tool === 'calendar' ? 'Google Calendar' : currentMistake.tool === 'trello' ? 'Trello' : 'Asana'}
            </span>
          </div>

          {/* Mistake Card */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* The Mistake */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-red-200"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
            >
              {/* Header */}
              <div className="bg-red-500 px-5 py-3 flex items-center gap-2">
                <X className="w-5 h-5 text-white" />
                <span className="font-bold text-white">The Mistake</span>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  {currentMistake.title}
                </h3>
                <p className="text-slate-600 mb-4">
                  {currentMistake.description}
                </p>

                {/* Visual Example */}
                {currentMistake.visual && (
                  <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                    <div className="text-xs text-red-500 font-medium mb-2 uppercase tracking-wider">
                      What it looks like
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-red-200">
                      {currentMistake.visual}
                    </div>
                  </div>
                )}

                {/* Consequences */}
                {currentMistake.consequences && (
                  <div className="mt-4 space-y-2">
                    <div className="text-sm font-semibold text-red-600 flex items-center gap-1">
                      <AlertTriangle size={14} />
                      <span>What happens:</span>
                    </div>
                    {currentMistake.consequences.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* The Fix */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-emerald-200"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              {/* Header */}
              <div className="bg-emerald-500 px-5 py-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span className="font-bold text-white">The Fix</span>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  {currentMistake.fixTitle}
                </h3>
                <p className="text-slate-600 mb-4">
                  {currentMistake.fixDescription}
                </p>

                {/* Fix Steps */}
                {currentMistake.fixSteps && (
                  <div className="space-y-3">
                    {currentMistake.fixSteps.map((step, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg"
                      >
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                          {i + 1}
                        </div>
                        <span className="text-slate-700">{step}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pro Tip */}
                {currentMistake.proTip && (
                  <div className="mt-4 flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-amber-800 text-sm">Pro Tip: </span>
                      <span className="text-amber-700 text-sm">{currentMistake.proTip}</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="flex items-center justify-between mt-6">
        <motion.button
          onClick={prevMistake}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow text-slate-600"
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <ChevronLeft size={20} />
          <span className="hidden sm:inline">Previous</span>
        </motion.button>

        <span className="text-slate-400 text-sm">
          {activeMistake + 1} of {mistakes.length}
        </span>

        <motion.button
          onClick={nextMistake}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow text-slate-600"
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={20} />
        </motion.button>
      </div>
    </SlideWrapper>
  );
}
