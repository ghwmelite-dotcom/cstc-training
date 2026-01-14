import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Presentation, Home, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export function Navigation({
  onPrev,
  onNext,
  onHome,
  onPresenter,
  onLogout,
  canGoPrev,
  canGoNext,
  isPresenterOpen,
  currentSlide,
  totalSlides,
}) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.div
      className="fixed bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-50"
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
      <div className={`relative flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 sm:py-3 backdrop-blur-xl rounded-full shadow-2xl ${
        isDark
          ? 'bg-white/10 border border-white/20'
          : 'bg-white/80 border border-slate-200'
      }`}>
        <NavButton onClick={onHome} title="Go to start (Home)" isDark={isDark}>
          <Home className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
        </NavButton>

        <Divider isDark={isDark} />

        <NavButton
          onClick={onPrev}
          disabled={!canGoPrev}
          title="Previous (Left Arrow)"
          isDark={isDark}
        >
          <ChevronLeft className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
        </NavButton>

        {/* Slide counter with gradient */}
        <div className={`px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full border ${
          isDark
            ? 'bg-white/5 border-white/10'
            : 'bg-slate-100 border-slate-200'
        }`}>
          <span className={`text-xs sm:text-sm font-bold bg-gradient-to-r bg-clip-text text-transparent ${
            isDark
              ? 'from-cyan-400 to-purple-400'
              : 'from-cyan-600 to-blue-600'
          }`}>
            {currentSlide + 1}
          </span>
          <span className={`mx-0.5 sm:mx-1 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>/</span>
          <span className={`text-xs sm:text-sm ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
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
          <ChevronRight className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
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
            {isDark ? <Sun className="w-4 h-4 sm:w-[18px] sm:h-[18px]" /> : <Moon className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />}
          </motion.div>
        </NavButton>

        <NavButton
          onClick={onPresenter}
          active={isPresenterOpen}
          title="Presenter View (P)"
          isDark={isDark}
        >
          <Presentation className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
        </NavButton>

        <Divider isDark={isDark} />

        <NavButton
          onClick={onLogout}
          title="Lock Presentation"
          isDark={isDark}
          danger
        >
          <LogOut className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
        </NavButton>
      </div>

      {/* Keyboard hint - hidden on mobile */}
      <motion.div
        className={`absolute -bottom-7 sm:-bottom-8 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs whitespace-nowrap hidden sm:block ${
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

function NavButton({ children, onClick, disabled, title, active, highlight, danger, isDark }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        relative p-2 sm:p-2.5 rounded-full transition-all duration-200
        ${disabled
          ? 'opacity-30 cursor-not-allowed'
          : danger
          ? isDark
            ? 'text-red-400/70 hover:text-red-400 hover:bg-red-500/20'
            : 'text-red-400 hover:text-red-500 hover:bg-red-50'
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
    <div className={`w-px h-5 sm:h-6 bg-gradient-to-b from-transparent to-transparent ${
      isDark ? 'via-white/20' : 'via-slate-300'
    }`} />
  );
}
