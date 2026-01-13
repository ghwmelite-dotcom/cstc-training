import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';

export function ProgressBar({ progress, totalSlides, currentSlide }) {
  const { isDark } = useTheme();

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Glowing progress bar */}
      <div className={`h-1 ${isDark ? 'bg-white/10' : 'bg-slate-200'} backdrop-blur-sm`}>
        <motion.div
          className="h-full relative"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {/* Gradient fill */}
          <div className={`absolute inset-0 bg-gradient-to-r ${
            isDark
              ? 'from-cyan-500 via-purple-500 to-pink-500'
              : 'from-cyan-500 via-blue-500 to-indigo-500'
          }`} />
          {/* Glow effect */}
          <div className={`absolute inset-0 bg-gradient-to-r blur-sm opacity-70 ${
            isDark
              ? 'from-cyan-500 via-purple-500 to-pink-500'
              : 'from-cyan-500 via-blue-500 to-indigo-500'
          }`} />
          {/* Shine animation */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      </div>

      {/* Slide indicator - compact pills */}
      <motion.div
        className={`absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-2 backdrop-blur-xl rounded-full border ${
          isDark
            ? 'bg-white/5 border-white/10'
            : 'bg-white/80 border-slate-200 shadow-sm'
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {Array.from({ length: Math.min(totalSlides, 15) }).map((_, i) => {
          // Show compressed view if too many slides
          const actualIndex = totalSlides > 15
            ? Math.round((i / 14) * (totalSlides - 1))
            : i;
          const isCurrent = actualIndex === currentSlide;
          const isPast = actualIndex < currentSlide;

          return (
            <motion.div
              key={i}
              className="relative"
              whileHover={{ scale: 1.3 }}
            >
              <div
                className={`
                  w-2 h-2 rounded-full transition-all duration-300
                  ${isCurrent
                    ? `w-6 bg-gradient-to-r ${isDark ? 'from-cyan-400 to-purple-400' : 'from-cyan-500 to-blue-500'}`
                    : isPast
                    ? isDark ? 'bg-cyan-400/60' : 'bg-cyan-500/60'
                    : isDark ? 'bg-white/20' : 'bg-slate-300'
                  }
                `}
              />
              {isCurrent && (
                <motion.div
                  className={`absolute inset-0 rounded-full blur-md opacity-60 bg-gradient-to-r ${
                    isDark ? 'from-cyan-400 to-purple-400' : 'from-cyan-500 to-blue-500'
                  }`}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
