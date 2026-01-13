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
    <div className={`relative min-h-[500px] flex items-center justify-center overflow-hidden rounded-3xl ${
      isDark ? 'bg-slate-900' : 'bg-slate-100'
    }`}>
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${c.bg} opacity-10`} />

      {/* Pulsing rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className={`absolute w-64 h-64 rounded-full border ${c.border} opacity-30`}
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className={`absolute w-96 h-96 rounded-full border ${c.border} opacity-20`}
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        />
      </div>

      <div className="relative z-10 text-center px-8 max-w-4xl">
        {/* Icon with glow */}
        {Icon && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className={`inline-flex items-center justify-center w-24 h-24 mb-6 rounded-2xl bg-gradient-to-br ${c.bg} shadow-2xl ${c.glow}`}
          >
            <Icon className="w-12 h-12 text-white" />
          </motion.div>
        )}

        {/* "Your Turn" badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
            isDark ? 'bg-white/10' : 'bg-slate-800/10'
          }`}
        >
          <Hand className={`w-4 h-4 ${c.text}`} />
          <span className={`text-sm font-bold uppercase tracking-wider ${c.text}`}>
            Your Turn - Do This Now
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`text-4xl md:text-6xl font-black mb-6 ${
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
            className={`inline-block px-6 py-3 rounded-xl ${
              isDark ? 'bg-white/5 border border-white/10' : 'bg-slate-200'
            }`}
          >
            <p className={`text-xl ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
              {subtext}
            </p>
          </motion.div>
        )}

        {/* Visual hint at bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 flex items-center justify-center gap-2"
        >
          <Monitor className={`w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <span className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
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
    <div className={`relative min-h-[500px] flex items-center justify-center overflow-hidden rounded-3xl p-6 md:p-8 ${
      isDark ? 'bg-slate-900' : 'bg-white'
    }`}>
      <div className="w-full max-w-4xl">
        {/* Header with tool branding */}
        <div className="flex items-center gap-4 mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${t.gradient} flex items-center justify-center shadow-lg`}
          >
            <span className="text-2xl">{t.icon}</span>
          </motion.div>
          <div>
            <span className={`text-xs font-bold uppercase tracking-wider ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {t.name}
            </span>
            <h2 className={`text-xl md:text-2xl font-bold ${
              isDark ? 'text-white' : 'text-slate-800'
            }`}>
              {title}
            </h2>
          </div>
        </div>

        {/* Steps with enhanced visuals */}
        <div className="space-y-3">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.12 }}
              className={`flex items-start gap-4 p-4 rounded-xl border ${
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
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-lg shadow-md`}
                >
                  {index + 1}
                </motion.div>
                {/* Connecting line (except for last item) */}
                {index < steps.length - 1 && (
                  <div className={`absolute top-10 left-1/2 w-0.5 h-6 -translate-x-1/2 ${
                    isDark ? 'bg-slate-700' : 'bg-slate-200'
                  }`} />
                )}
              </div>

              {/* Step content */}
              <div className="flex-1 pt-1">
                <p className={`text-lg font-medium ${
                  isDark ? 'text-white' : 'text-slate-800'
                }`}>
                  {step.text}
                </p>
                {step.detail && (
                  <p className={`text-sm mt-1 ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {step.detail}
                  </p>
                )}
                {/* Expected result hint */}
                {step.hint && (
                  <div className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-medium ${
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
    <div className={`relative min-h-[500px] flex items-center justify-center overflow-hidden rounded-3xl p-6 md:p-8 ${
      isDark ? 'bg-slate-900' : 'bg-white'
    }`}>
      <div className="w-full max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-2xl md:text-3xl font-bold text-center mb-8 ${
            isDark ? 'text-white' : 'text-slate-800'
          }`}
        >
          {title}
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {/* Bad example */}
          <motion.div
            initial={{ opacity: 0, x: -30, rotateY: -5 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ delay: 0.2 }}
            className={`p-5 md:p-6 rounded-2xl border-2 relative overflow-hidden ${
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
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">❌</span>
                <span className={`font-bold text-lg ${
                  isDark ? 'text-red-400' : 'text-red-600'
                }`}>
                  Don't Do This
                </span>
              </div>
              <div className={`space-y-2.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {bad.map((item, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-start gap-2"
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
            className={`p-5 md:p-6 rounded-2xl border-2 relative overflow-hidden ${
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
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">✅</span>
                <span className={`font-bold text-lg ${
                  isDark ? 'text-emerald-400' : 'text-emerald-600'
                }`}>
                  Do This Instead
                </span>
              </div>
              <div className={`space-y-2.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {good.map((item, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
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
    <div className={`relative min-h-[500px] flex items-center justify-center overflow-hidden rounded-3xl ${
      isDark ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-slate-100'
    }`}>
      {/* Ambient light effect */}
      <div className={`absolute inset-0 flex items-center justify-center`}>
        <motion.div
          className={`w-96 h-96 rounded-full blur-3xl bg-gradient-to-br ${c.gradient} opacity-10`}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 text-center px-8">
        {/* Icon with enhanced animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 150, damping: 15 }}
          className="relative inline-block mb-8"
        >
          {/* Glow ring */}
          <motion.div
            className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${c.gradient} blur-xl opacity-50`}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className={`relative w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br ${c.gradient} shadow-2xl ${c.glow} flex items-center justify-center`}>
            {Icon && <Icon className="w-14 h-14 md:w-16 md:h-16 text-white" />}
          </div>
        </motion.div>

        {/* Key point badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 ${
            isDark ? 'bg-white/10' : 'bg-slate-800/10'
          }`}
        >
          <Target className={`w-4 h-4 ${c.text}`} />
          <span className={`text-xs font-bold uppercase tracking-wider ${c.text}`}>
            Key Point
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`text-3xl md:text-5xl font-black mb-4 ${
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
            className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed ${
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
    <div className={`relative min-h-[500px] flex items-center justify-center overflow-hidden rounded-3xl p-6 md:p-8 ${
      isDark ? 'bg-slate-900' : 'bg-white'
    }`}>
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`text-2xl md:text-3xl font-bold ${
              isDark ? 'text-white' : 'text-slate-800'
            }`}
          >
            {title}
          </motion.h2>
          {timer && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'
              }`}
            >
              <Clock size={18} />
              <span className="font-bold">{timer}</span>
            </motion.div>
          )}
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`group flex items-center gap-4 p-4 rounded-xl border transition-all ${
                isDark
                  ? 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.15, type: 'spring' }}
                className={`w-7 h-7 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                  isDark
                    ? 'border-slate-600 group-hover:border-emerald-500'
                    : 'border-slate-300 group-hover:border-emerald-500'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${
                  isDark ? 'text-emerald-400' : 'text-emerald-500'
                }`} />
              </motion.div>
              <span className={`text-lg ${
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
          className={`text-center mt-6 text-sm ${
            isDark ? 'text-slate-500' : 'text-slate-400'
          }`}
        >
          Raise your hand if you need help with any of these!
        </motion.p>
      </div>
    </div>
  );
}
