import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlideWrapper } from './SlideContainer';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Monitor,
  Smartphone,
  ExternalLink,
  Clock,
  Target,
  Zap
} from 'lucide-react';

export function TryItNowSlide({
  title,
  tool,
  task,
  steps,
  duration = 120,
  tip,
  icon: Icon = Target
}) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsRunning(r => !r);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(duration);
    setIsComplete(false);
    setCompletedSteps([]);
  };

  const toggleStep = (index) => {
    setCompletedSteps(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const markComplete = () => {
    setIsComplete(true);
    setIsRunning(false);
  };

  const toolColors = {
    calendar: { bg: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    trello: { bg: 'bg-sky-500', light: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-200' },
    asana: { bg: 'bg-rose-500', light: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
  };

  const colors = toolColors[tool] || toolColors.calendar;
  const progress = (completedSteps.length / steps.length) * 100;

  return (
    <SlideWrapper className={`${colors.light} relative overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-current transform rotate-12" />
        <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-current" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center shadow-lg`}
              animate={{ rotate: isRunning ? [0, 5, -5, 0] : 0 }}
              transition={{ repeat: isRunning ? Infinity : 0, duration: 0.5 }}
            >
              <Zap className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <span className={`text-xs font-bold uppercase tracking-wider ${colors.text}`}>
                Hands-On Exercise
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{title}</h2>
            </div>
          </div>

          {/* Open Tool Button */}
          <motion.a
            href={tool === 'calendar' ? 'https://calendar.google.com' : tool === 'trello' ? 'https://trello.com' : 'https://app.asana.com'}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-4 py-2 ${colors.bg} text-white rounded-lg font-medium hover:opacity-90 transition-opacity shadow-md`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ExternalLink size={18} />
            <span className="hidden sm:inline">Open {tool === 'calendar' ? 'Google Calendar' : tool === 'trello' ? 'Trello' : 'Asana'}</span>
            <span className="sm:hidden">Open Tool</span>
          </motion.a>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Task & Steps */}
          <div className="space-y-4">
            {/* Task Card */}
            <motion.div
              className={`bg-white rounded-xl p-5 shadow-md border-2 ${colors.border}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg ${colors.light} flex items-center justify-center flex-shrink-0`}>
                  <Target className={`w-5 h-5 ${colors.text}`} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-1">Your Task</h3>
                  <p className="text-slate-600">{task}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Progress</span>
                  <span>{completedSteps.length}/{steps.length} steps</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${colors.bg}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Steps Checklist */}
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <motion.button
                    key={index}
                    onClick={() => toggleStep(index)}
                    className={`w-full flex items-start gap-3 p-3 rounded-lg transition-all text-left ${
                      completedSteps.includes(index)
                        ? `${colors.light} ${colors.border} border`
                        : 'bg-slate-50 hover:bg-slate-100'
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      completedSteps.includes(index)
                        ? `${colors.bg} border-transparent`
                        : 'border-slate-300'
                    }`}>
                      {completedSteps.includes(index) && (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <span className={`text-sm ${completedSteps.includes(index) ? 'text-slate-500 line-through' : 'text-slate-700'}`}>
                        {step}
                      </span>
                    </div>
                    <span className={`text-xs font-medium ${colors.text}`}>
                      {index + 1}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Tip Box */}
            {tip && (
              <motion.div
                className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">💡</span>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-800 text-sm mb-1">Pro Tip</h4>
                  <p className="text-amber-700 text-sm">{tip}</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right: Timer & Status */}
          <div className="space-y-4">
            {/* Timer Card */}
            <motion.div
              className="bg-white rounded-xl p-6 shadow-md text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <Clock className={`w-5 h-5 ${colors.text}`} />
                <span className="text-sm font-medium text-slate-600">Time Remaining</span>
              </div>

              <motion.div
                className={`text-6xl sm:text-7xl font-bold font-mono mb-6 ${
                  timeLeft <= 30 ? 'text-red-500' : timeLeft <= 60 ? 'text-amber-500' : colors.text
                }`}
                animate={{ scale: isRunning && timeLeft <= 10 ? [1, 1.05, 1] : 1 }}
                transition={{ repeat: isRunning && timeLeft <= 10 ? Infinity : 0, duration: 0.5 }}
              >
                {formatTime(timeLeft)}
              </motion.div>

              {/* Timer Controls */}
              <div className="flex items-center justify-center gap-3">
                <motion.button
                  onClick={toggleTimer}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white shadow-md ${
                    isRunning ? 'bg-amber-500 hover:bg-amber-600' : `${colors.bg} hover:opacity-90`
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isRunning ? <Pause size={20} /> : <Play size={20} />}
                  <span>{isRunning ? 'Pause' : 'Start'}</span>
                </motion.button>

                <motion.button
                  onClick={resetTimer}
                  className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RotateCcw size={20} />
                </motion.button>
              </div>
            </motion.div>

            {/* Completion Card */}
            <AnimatePresence>
              {completedSteps.length === steps.length && !isComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 text-center"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 0.5, repeatDelay: 1 }}
                    className="text-4xl mb-3"
                  >
                    🎉
                  </motion.div>
                  <h3 className="font-bold text-emerald-800 mb-2">All Steps Complete!</h3>
                  <p className="text-emerald-600 text-sm mb-4">Ready to mark this exercise as done?</p>
                  <motion.button
                    onClick={markComplete}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-medium shadow-md hover:bg-emerald-600 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <CheckCircle2 size={20} />
                    <span>Mark Complete</span>
                  </motion.button>
                </motion.div>
              )}

              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-6 text-center text-white shadow-xl"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle2 className="w-8 h-8" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2">Exercise Complete!</h3>
                  <p className="text-emerald-100 text-sm">
                    You finished in {formatTime(duration - timeLeft)}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Device Hint */}
            <div className="flex items-center justify-center gap-4 text-slate-400 text-sm">
              <div className="flex items-center gap-1">
                <Monitor size={16} />
                <span>Desktop</span>
              </div>
              <span>or</span>
              <div className="flex items-center gap-1">
                <Smartphone size={16} />
                <span>Mobile</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SlideWrapper>
  );
}
