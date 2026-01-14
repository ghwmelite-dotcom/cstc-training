import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { CheckCircle2, Circle, Clock, ArrowRight, Hand, Monitor, MousePointer, Zap, Target } from 'lucide-react';

// Big bold action slide - tells participants exactly what to do
export function ActionSlide({ action, subtext, icon: Icon, color = 'cyan' }) {
  const { isDark } = useTheme();

  const colors = {
    cyan: {
      bg: 'from-cyan-500 to-blue-600',
      text: 'text-cyan-400',
      glow: 'shadow-cyan-500/30',
      border: 'border-cyan-500/30'
    },
    green: {
      bg: 'from-emerald-500 to-teal-600',
      text: 'text-emerald-400',
      glow: 'shadow-emerald-500/30',
      border: 'border-emerald-500/30'
    },
    purple: {
      bg: 'from-purple-500 to-indigo-600',
      text: 'text-purple-400',
      glow: 'shadow-purple-500/30',
      border: 'border-purple-500/30'
    },
    orange: {
      bg: 'from-orange-500 to-red-600',
      text: 'text-orange-400',
      glow: 'shadow-orange-500/30',
      border: 'border-orange-500/30'
    },
  };

  const c = colors[color] || colors.cyan;

  return (
    <div className={`relative min-h-[350px] sm:min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden rounded-2xl sm:rounded-3xl ${
      isDark ? 'bg-slate-900' : 'bg-slate-100'
    }`}>
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${c.bg} opacity-10`} />

      {/* Pulsing rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className={`absolute w-40 sm:w-52 md:w-64 h-40 sm:h-52 md:h-64 rounded-full border ${c.border} opacity-30`}
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className={`absolute w-60 sm:w-72 md:w-96 h-60 sm:h-72 md:h-96 rounded-full border ${c.border} opacity-20`}
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        />
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 md:px-8 max-w-4xl">
        {/* Icon with glow */}
        {Icon && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-4 sm:mb-5 md:mb-6 rounded-xl sm:rounded-2xl bg-gradient-to-br ${c.bg} shadow-2xl ${c.glow}`}
          >
            <Icon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
          </motion.div>
        )}

        {/* "Your Turn" badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4 ${
            isDark ? 'bg-white/10' : 'bg-slate-800/10'
          }`}
        >
          <Hand className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${c.text}`} />
          <span className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${c.text}`}>
            Your Turn - Do This Now
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`text-2xl sm:text-4xl md:text-6xl font-black mb-4 sm:mb-5 md:mb-6 ${
            isDark ? 'text-white' : 'text-slate-800'
          }`}
        >
          {action}
        </motion.h1>

        {subtext && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`inline-block px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl ${
              isDark ? 'bg-white/5 border border-white/10' : 'bg-slate-200'
            }`}
          >
            <p className={`text-base sm:text-lg md:text-xl ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
              {subtext}
            </p>
          </motion.div>
        )}

        {/* Visual hint at bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 sm:mt-7 md:mt-8 flex items-center justify-center gap-2"
        >
          <Monitor className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <span className={`text-xs sm:text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            I'll walk around to help!
          </span>
        </motion.div>
      </div>
    </div>
  );
}

// Step-by-step visual guide with numbers and expected results
export function StepByStepSlide({ title, steps, tool }) {
  const { isDark } = useTheme();

  const toolConfig = {
    calendar: { icon: '📅', name: 'Google Calendar', color: 'bg-blue-500', gradient: 'from-blue-500 to-cyan-500' },
    trello: { icon: '📋', name: 'Trello', color: 'bg-indigo-500', gradient: 'from-indigo-500 to-purple-500' },
    asana: { icon: '✅', name: 'Asana', color: 'bg-rose-500', gradient: 'from-rose-500 to-orange-500' },
  };

  const t = toolConfig[tool] || toolConfig.calendar;

  return (
    <div className={`relative min-h-[350px] sm:min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 ${
      isDark ? 'bg-slate-900' : 'bg-white'
    }`}>
      <div className="w-full max-w-4xl">
        {/* Header with tool branding */}
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br ${t.gradient} flex items-center justify-center shadow-lg`}
          >
            <span className="text-lg sm:text-xl md:text-2xl">{t.icon}</span>
          </motion.div>
          <div>
            <span className={`text-xs font-bold uppercase tracking-wider ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {t.name}
            </span>
            <h2 className={`text-lg sm:text-xl md:text-2xl font-bold ${
              isDark ? 'text-white' : 'text-slate-800'
            }`}>
              {title}
            </h2>
          </div>
        </div>

        {/* Steps with enhanced visuals */}
        <div className="space-y-2 sm:space-y-3">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.12 }}
              className={`flex items-start gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl border ${
                isDark
                  ? 'bg-slate-800/50 border-slate-700/50'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              {/* Step number with connecting line */}
              <div className="relative flex-shrink-0">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.12 + 0.1, type: 'spring' }}
                  className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg shadow-md`}
                >
                  {index + 1}
                </motion.div>
                {/* Connecting line (except for last item) */}
                {index < steps.length - 1 && (
                  <div className={`absolute top-8 sm:top-9 md:top-10 left-1/2 w-0.5 h-4 sm:h-5 md:h-6 -translate-x-1/2 ${
                    isDark ? 'bg-slate-700' : 'bg-slate-200'
                  }`} />
                )}
              </div>

              {/* Step content */}
              <div className="flex-1 pt-0.5 sm:pt-1 min-w-0">
                <p className={`text-sm sm:text-base md:text-lg font-medium ${
                  isDark ? 'text-white' : 'text-slate-800'
                }`}>
                  {step.text}
                </p>
                {step.detail && (
                  <p className={`text-xs sm:text-sm mt-1 ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {step.detail}
                  </p>
                )}
                {/* Expected result hint */}
                {step.hint && (
                  <div className={`inline-flex items-center gap-1 sm:gap-1.5 mt-1.5 sm:mt-2 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
                    isDark ? 'bg-cyan-500/15 text-cyan-400' : 'bg-cyan-100 text-cyan-700'
                  }`}>
                    <Zap className="w-3 h-3" />
                    {step.hint}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Enhanced visual comparison slide - Good vs Bad
export function ComparisonSlide({ title, bad, good }) {
  const { isDark } = useTheme();

  return (
    <div className={`relative min-h-[350px] sm:min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 ${
      isDark ? 'bg-slate-900' : 'bg-white'
    }`}>
      <div className="w-full max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-6 md:mb-8 ${
            isDark ? 'text-white' : 'text-slate-800'
          }`}
        >
          {title}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {/* Bad example */}
          <motion.div
            initial={{ opacity: 0, x: -30, rotateY: -5 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ delay: 0.2 }}
            className={`p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border-2 relative overflow-hidden ${
              isDark
                ? 'bg-red-500/10 border-red-500/30'
                : 'bg-red-50 border-red-200'
            }`}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)`,
                backgroundSize: '10px 10px'
              }} />
            </div>

            <div className="relative">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">❌</span>
                <span className={`font-bold text-base sm:text-lg ${
                  isDark ? 'text-red-400' : 'text-red-600'
                }`}>
                  Don't Do This
                </span>
              </div>
              <div className={`space-y-2 sm:space-y-2.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {bad.map((item, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-start gap-2 text-sm sm:text-base"
                  >
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>{item}</span>
                  </motion.p>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Good example */}
          <motion.div
            initial={{ opacity: 0, x: 30, rotateY: 5 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ delay: 0.4 }}
            className={`p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border-2 relative overflow-hidden ${
              isDark
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-emerald-50 border-emerald-200'
            }`}
          >
            {/* Subtle glow */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl ${
              isDark ? 'bg-emerald-500/20' : 'bg-emerald-300/30'
            }`} />

            <div className="relative">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">✅</span>
                <span className={`font-bold text-base sm:text-lg ${
                  isDark ? 'text-emerald-400' : 'text-emerald-600'
                }`}>
                  Do This Instead
                </span>
              </div>
              <div className={`space-y-2 sm:space-y-2.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {good.map((item, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-start gap-2 text-sm sm:text-base"
                  >
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </motion.p>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Enhanced key point slide with more visual impact
export function KeyPointSlide({ icon: Icon, title, subtitle, color = 'cyan' }) {
  const { isDark } = useTheme();

  const colors = {
    cyan: { gradient: 'from-cyan-500 to-blue-600', glow: 'shadow-cyan-500/30', text: 'text-cyan-400' },
    green: { gradient: 'from-emerald-500 to-teal-600', glow: 'shadow-emerald-500/30', text: 'text-emerald-400' },
    emerald: { gradient: 'from-emerald-500 to-teal-600', glow: 'shadow-emerald-500/30', text: 'text-emerald-400' },
    purple: { gradient: 'from-purple-500 to-indigo-600', glow: 'shadow-purple-500/30', text: 'text-purple-400' },
    orange: { gradient: 'from-orange-500 to-red-600', glow: 'shadow-orange-500/30', text: 'text-orange-400' },
  };

  const c = colors[color] || colors.cyan;

  return (
    <div className={`relative min-h-[350px] sm:min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden rounded-2xl sm:rounded-3xl ${
      isDark ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-slate-100'
    }`}>
      {/* Ambient light effect */}
      <div className={`absolute inset-0 flex items-center justify-center`}>
        <motion.div
          className={`w-60 sm:w-72 md:w-96 h-60 sm:h-72 md:h-96 rounded-full blur-3xl bg-gradient-to-br ${c.gradient} opacity-10`}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 md:px-8">
        {/* Icon with enhanced animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 150, damping: 15 }}
          className="relative inline-block mb-4 sm:mb-6 md:mb-8"
        >
          {/* Glow ring */}
          <motion.div
            className={`absolute inset-0 rounded-xl sm:rounded-2xl md:rounded-3xl bg-gradient-to-br ${c.gradient} blur-xl opacity-50`}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className={`relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-xl sm:rounded-2xl md:rounded-3xl bg-gradient-to-br ${c.gradient} shadow-2xl ${c.glow} flex items-center justify-center`}>
            {Icon && <Icon className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white" />}
          </div>
        </motion.div>

        {/* Key point badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full mb-3 sm:mb-4 ${
            isDark ? 'bg-white/10' : 'bg-slate-800/10'
          }`}
        >
          <Target className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${c.text}`} />
          <span className={`text-xs font-bold uppercase tracking-wider ${c.text}`}>
            Key Point
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`text-xl sm:text-3xl md:text-5xl font-black mb-3 sm:mb-4 ${
            isDark ? 'text-white' : 'text-slate-800'
          }`}
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className={`text-sm sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed ${
              isDark ? 'text-white/70' : 'text-slate-600'
            }`}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </div>
  );
}

// Enhanced checklist slide with interactive feel
export function ChecklistSlide({ title, items, timer }) {
  const { isDark } = useTheme();

  return (
    <div className={`relative min-h-[350px] sm:min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 ${
      isDark ? 'bg-slate-900' : 'bg-white'
    }`}>
      <div className="w-full max-w-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`text-xl sm:text-2xl md:text-3xl font-bold ${
              isDark ? 'text-white' : 'text-slate-800'
            }`}
          >
            {title}
          </motion.h2>
          {timer && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full self-start sm:self-auto ${
                isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'
              }`}
            >
              <Clock size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="font-bold text-sm sm:text-base">{timer}</span>
            </motion.div>
          )}
        </div>

        <div className="space-y-2 sm:space-y-3">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`group flex items-center gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl border transition-all ${
                isDark
                  ? 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.15, type: 'spring' }}
                className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                  isDark
                    ? 'border-slate-600 group-hover:border-emerald-500'
                    : 'border-slate-300 group-hover:border-emerald-500'
                }`}
              >
                <CheckCircle2 className={`w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 opacity-0 group-hover:opacity-100 transition-opacity ${
                  isDark ? 'text-emerald-400' : 'text-emerald-500'
                }`} />
              </motion.div>
              <span className={`text-sm sm:text-base md:text-lg ${
                isDark ? 'text-white' : 'text-slate-700'
              }`}>
                {item}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Completion hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: items.length * 0.1 + 0.3 }}
          className={`text-center mt-4 sm:mt-5 md:mt-6 text-xs sm:text-sm ${
            isDark ? 'text-slate-500' : 'text-slate-400'
          }`}
        >
          Raise your hand if you need help with any of these!
        </motion.p>
      </div>
    </div>
  );
}
