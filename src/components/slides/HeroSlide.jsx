import { motion } from 'framer-motion';
import { AnimatedBackground, GlassCard, FloatingShapes } from '../ui/AnimatedBackground';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export function HeroSlide({ title, subtitle, icon: Icon, accentColor = 'cyan', showLogo = false }) {
  const { isDark } = useTheme();

  const colors = {
    cyan: { text: isDark ? 'text-cyan-400' : 'text-cyan-600', glow: 'shadow-cyan-500/50', gradient: 'from-cyan-400 to-blue-500' },
    indigo: { text: isDark ? 'text-indigo-400' : 'text-indigo-600', glow: 'shadow-indigo-500/50', gradient: 'from-indigo-400 to-purple-500' },
    emerald: { text: isDark ? 'text-emerald-400' : 'text-emerald-600', glow: 'shadow-emerald-500/50', gradient: 'from-emerald-400 to-teal-500' },
    rose: { text: isDark ? 'text-rose-400' : 'text-rose-600', glow: 'shadow-rose-500/50', gradient: 'from-rose-400 to-pink-500' },
    amber: { text: isDark ? 'text-amber-400' : 'text-amber-600', glow: 'shadow-amber-500/50', gradient: 'from-amber-400 to-orange-500' },
  };

  const color = colors[accentColor] || colors.cyan;

  return (
    <div className="relative min-h-[400px] sm:min-h-[450px] md:min-h-[500px] flex items-center justify-center overflow-hidden rounded-2xl sm:rounded-3xl">
      {isDark && <AnimatedBackground variant="default" />}
      {!isDark && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 rounded-2xl sm:rounded-3xl" />
      )}
      {isDark && <FloatingShapes />}

      <div className="relative z-10 text-center px-4 sm:px-6 md:px-8 max-w-4xl">
        {/* CSTC Logo */}
        {showLogo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-4 sm:mb-6"
          >
            <motion.div
              className="relative inline-block"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {/* Glow effect behind logo */}
              <div className={`absolute inset-0 blur-2xl opacity-40 ${isDark ? 'bg-cyan-500' : 'bg-blue-400'}`}
                   style={{ transform: 'scale(0.8)' }} />

              {/* Logo image */}
              <img
                src="/cstc-logo.jpg"
                alt="Civil Service Training Centre"
                className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain rounded-xl sm:rounded-2xl shadow-xl"
                style={{
                  filter: isDark ? 'brightness(1.1)' : 'none',
                }}
              />

              {/* Subtle ring animation */}
              <motion.div
                className={`absolute inset-0 rounded-xl sm:rounded-2xl border-2 ${isDark ? 'border-white/20' : 'border-blue-300/50'}`}
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
          </motion.div>
        )}

        {/* Animated icon - only show if no logo */}
        {Icon && !showLogo && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="mb-8 inline-block"
          >
            <div className={`
              relative w-24 h-24 rounded-3xl
              bg-gradient-to-br ${color.gradient}
              flex items-center justify-center
              shadow-2xl ${color.glow}
            `}>
              <Icon className="w-12 h-12 text-white" />

              {/* Orbiting particles */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 1,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  style={{
                    transformOrigin: '50px 50px',
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Title with gradient */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className={`text-3xl sm:text-5xl md:text-7xl font-black mb-4 sm:mb-6 leading-tight ${isDark ? 'text-white' : 'text-slate-800'}`}
        >
          <span className="inline-block">
            {title.split(' ').map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className={i === 0 ? `bg-gradient-to-r ${color.gradient} bg-clip-text text-transparent` : ''}
              >
                {word}{' '}
              </motion.span>
            ))}
          </span>
        </motion.h1>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className={`text-base sm:text-xl md:text-2xl max-w-2xl mx-auto ${isDark ? 'text-white/70' : 'text-slate-600'}`}
          >
            {subtitle}
          </motion.p>
        )}

        {/* Animated line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className={`w-20 sm:w-32 h-1 bg-gradient-to-r ${color.gradient} rounded-full mx-auto mt-4 sm:mt-6 md:mt-8`}
        />

        {/* Scroll hint - with beautiful spacing */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-8 sm:mt-12 md:mt-16 flex flex-col items-center gap-2 sm:gap-3"
        >
          {/* Decorative dots */}
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.3 + i * 0.1 }}
                className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${isDark ? 'bg-white/20' : 'bg-slate-300'}`}
              />
            ))}
          </div>

          <motion.div
            className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-full backdrop-blur-sm border ${
              isDark
                ? 'bg-white/5 border-white/10'
                : 'bg-white/60 border-slate-200'
            }`}
          >
            <span className={`text-xs sm:text-sm font-medium ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
              Press Space or Arrow Keys to continue
            </span>
          </motion.div>

          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="mt-0.5 sm:mt-1"
          >
            <ArrowRight className={`w-4 h-4 sm:w-5 sm:h-5 rotate-90 ${isDark ? 'text-white/30' : 'text-slate-400'}`} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export function SectionHeroSlide({ section, title, subtitle, icon: Icon, variant = 'calendar' }) {
  const { isDark } = useTheme();

  const variants = {
    calendar: { bg: 'calendar', color: 'cyan', gradient: 'from-cyan-400 to-blue-500' },
    trello: { bg: 'trello', color: 'indigo', gradient: 'from-indigo-400 to-purple-500' },
    asana: { bg: 'asana', color: 'rose', gradient: 'from-rose-400 to-orange-500' },
    success: { bg: 'success', color: 'emerald', gradient: 'from-emerald-400 to-teal-500' },
  };

  const config = variants[variant] || variants.calendar;

  return (
    <div className="relative min-h-[400px] sm:min-h-[450px] md:min-h-[500px] flex items-center justify-center overflow-hidden rounded-2xl sm:rounded-3xl">
      {isDark && <AnimatedBackground variant={config.bg} />}
      {!isDark && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100 rounded-2xl sm:rounded-3xl" />
      )}

      <div className="relative z-10 text-center px-4 sm:px-6 md:px-8">
        {/* Section badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-6"
        >
          <span className={`
            inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2
            rounded-full backdrop-blur-sm
            text-xs sm:text-sm font-bold uppercase tracking-wider
            ${isDark
              ? 'bg-white/10 text-white/80'
              : 'bg-white/80 text-slate-600 shadow-sm'
            }
          `}>
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {section}
          </span>
        </motion.div>

        {/* Icon */}
        {Icon && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className={`
              inline-flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 mb-4 sm:mb-6
              rounded-xl sm:rounded-2xl bg-gradient-to-br ${config.gradient}
              shadow-2xl
            `}
          >
            <Icon className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
          </motion.div>
        )}

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`text-3xl sm:text-5xl md:text-6xl font-black mb-3 sm:mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}
        >
          {title}
        </motion.h2>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`text-base sm:text-xl max-w-xl mx-auto ${isDark ? 'text-white/60' : 'text-slate-600'}`}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </div>
  );
}
