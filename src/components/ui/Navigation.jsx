import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Presentation, Home, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export function Navigation({
  onPrev,
  onNext,
  onHome,
  onPresenter,
  canGoPrev,
  canGoNext,
  isPresenterOpen,
  currentSlide,
  totalSlides,
}) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
    >
      {/* Glow backdrop */}
      <div className={`absolute inset-0 blur-xl rounded-full ${
        isDark
          ? 'bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20'
          : 'bg-gradient-to-r from-cyan-300/30 via-blue-300/30 to-indigo-300/30'
      }`} />

      {/* Main navigation bar */}
      <div className={`relative flex items-center gap-2 px-5 py-3 backdrop-blur-xl rounded-full shadow-2xl ${
        isDark
          ? 'bg-white/10 border border-white/20'
          : 'bg-white/80 border border-slate-200'
      }`}>
        <NavButton onClick={onHome} title="Go to start (Home)" isDark={isDark}>
          <Home size={18} />
        </NavButton>

        <Divider isDark={isDark} />

        <NavButton
          onClick={onPrev}
          disabled={!canGoPrev}
          title="Previous (Left Arrow)"
          isDark={isDark}
        >
          <ChevronLeft size={22} />
        </NavButton>

        {/* Slide counter with gradient */}
        <div className={`px-4 py-1.5 rounded-full border ${
          isDark
            ? 'bg-white/5 border-white/10'
            : 'bg-slate-100 border-slate-200'
        }`}>
          <span className={`text-sm font-bold bg-gradient-to-r bg-clip-text text-transparent ${
            isDark
              ? 'from-cyan-400 to-purple-400'
              : 'from-cyan-600 to-blue-600'
          }`}>
            {currentSlide + 1}
          </span>
          <span className={`mx-1 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>/</span>
          <span className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
            {totalSlides}
          </span>
        </div>

        <NavButton
          onClick={onNext}
          disabled={!canGoNext}
          title="Next (Right Arrow)"
          isDark={isDark}
          highlight
        >
          <ChevronRight size={22} />
        </NavButton>

        <Divider isDark={isDark} />

        {/* Theme Toggle */}
        <NavButton
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          isDark={isDark}
        >
          <motion.div
            initial={false}
            animate={{ rotate: isDark ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </motion.div>
        </NavButton>

        <NavButton
          onClick={onPresenter}
          active={isPresenterOpen}
          title="Presenter View (P)"
          isDark={isDark}
        >
          <Presentation size={18} />
        </NavButton>
      </div>

      {/* Keyboard hint */}
      <motion.div
        className={`absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap ${
          isDark ? 'text-white/30' : 'text-slate-400'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        Use arrow keys or scroll to navigate
      </motion.div>
    </motion.div>
  );
}

function NavButton({ children, onClick, disabled, title, active, highlight, isDark }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        relative p-2.5 rounded-full transition-all duration-200
        ${disabled
          ? 'opacity-30 cursor-not-allowed'
          : active
          ? isDark
            ? 'bg-gradient-to-r from-cyan-500/30 to-purple-500/30 text-cyan-300'
            : 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-600'
          : highlight
          ? isDark
            ? 'text-white/90 hover:text-white'
            : 'text-slate-700 hover:text-slate-900'
          : isDark
            ? 'text-white/60 hover:text-white hover:bg-white/10'
            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
        }
      `}
      whileHover={!disabled ? { scale: 1.1 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {children}
      {highlight && !disabled && (
        <motion.div
          className={`absolute inset-0 rounded-full ${
            isDark
              ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20'
              : 'bg-gradient-to-r from-cyan-300/30 to-blue-300/30'
          }`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}

function Divider({ isDark }) {
  return (
    <div className={`w-px h-6 bg-gradient-to-b from-transparent to-transparent ${
      isDark ? 'via-white/20' : 'via-slate-300'
    }`} />
  );
}
