import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Presentation,
  Home,
  Sun,
  Moon,
  LogOut,
  Maximize2,
  Minimize2,
  Keyboard,
  Info
} from 'lucide-react';
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Track fullscreen state changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  }, []);

  // Keyboard shortcut for fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'f' || e.key === 'F') {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          toggleFullscreen();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleFullscreen]);

  return (
    <>
      {/* Main Navigation Bar */}
      <motion.div
        className="fixed bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-50"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
      >
        {/* Glow backdrop */}
        <div className={`absolute inset-0 blur-2xl rounded-full scale-150 ${
          isDark
            ? 'bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30'
            : 'bg-gradient-to-r from-cyan-300/40 via-blue-300/40 to-indigo-300/40'
        }`} />

        {/* Main navigation bar */}
        <div className={`relative flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 backdrop-blur-xl rounded-2xl sm:rounded-full shadow-2xl ${
          isDark
            ? 'bg-slate-900/80 border-2 border-white/20'
            : 'bg-white/90 border-2 border-slate-200'
        }`}>
          {/* Home Button */}
          <NavButton onClick={onHome} title="Go to start (Home)" isDark={isDark}>
            <Home className="w-5 h-5 sm:w-5 sm:h-5" />
          </NavButton>

          <Divider isDark={isDark} />

          {/* Previous Button - Large and prominent */}
          <motion.button
            onClick={onPrev}
            disabled={!canGoPrev}
            title="Previous (Left Arrow)"
            className={`
              relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl transition-all duration-200
              ${!canGoPrev
                ? 'opacity-30 cursor-not-allowed'
                : isDark
                  ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }
            `}
            whileHover={canGoPrev ? { scale: 1.05, x: -2 } : {}}
            whileTap={canGoPrev ? { scale: 0.95 } : {}}
          >
            <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8" />
          </motion.button>

          {/* Slide counter with gradient - More prominent */}
          <div className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border-2 min-w-[80px] sm:min-w-[100px] text-center ${
            isDark
              ? 'bg-white/5 border-white/20'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-lg sm:text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
              isDark
                ? 'from-cyan-400 to-purple-400'
                : 'from-cyan-600 to-blue-600'
            }`}>
              {currentSlide + 1}
            </span>
            <span className={`mx-1 sm:mx-2 text-lg sm:text-xl ${isDark ? 'text-white/40' : 'text-slate-400'}`}>/</span>
            <span className={`text-lg sm:text-xl font-medium ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
              {totalSlides}
            </span>
          </div>

          {/* Next Button - Large and prominent with highlight */}
          <motion.button
            onClick={onNext}
            disabled={!canGoNext}
            title="Next (Right Arrow)"
            className={`
              relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl transition-all duration-200
              ${!canGoNext
                ? 'opacity-30 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40'
              }
            `}
            whileHover={canGoNext ? { scale: 1.05, x: 2 } : {}}
            whileTap={canGoNext ? { scale: 0.95 } : {}}
          >
            <ChevronRight className="w-7 h-7 sm:w-8 sm:h-8" />
            {canGoNext && (
              <motion.div
                className="absolute inset-0 rounded-xl sm:rounded-2xl bg-white/20"
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.button>

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
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.div>
          </NavButton>

          {/* Fullscreen Toggle */}
          <NavButton
            onClick={toggleFullscreen}
            active={isFullscreen}
            title={isFullscreen ? 'Exit Fullscreen (F)' : 'Enter Fullscreen (F)'}
            isDark={isDark}
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5" />
            ) : (
              <Maximize2 className="w-5 h-5" />
            )}
          </NavButton>

          {/* Presenter View */}
          <NavButton
            onClick={onPresenter}
            active={isPresenterOpen}
            title="Presenter View (P)"
            isDark={isDark}
          >
            <Presentation className="w-5 h-5" />
          </NavButton>

          {/* Keyboard Shortcuts Info */}
          <NavButton
            onClick={() => setShowShortcuts(!showShortcuts)}
            active={showShortcuts}
            title="Keyboard Shortcuts"
            isDark={isDark}
          >
            <Keyboard className="w-5 h-5" />
          </NavButton>

          <Divider isDark={isDark} />

          {/* Logout */}
          <NavButton
            onClick={onLogout}
            title="Exit Training"
            isDark={isDark}
            danger
          >
            <LogOut className="w-5 h-5" />
          </NavButton>
        </div>

        {/* Keyboard hint - visible by default */}
        <motion.div
          className={`absolute -bottom-8 sm:-bottom-9 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs sm:text-sm whitespace-nowrap ${
            isDark ? 'text-white/50' : 'text-slate-500'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span className={`px-2 py-0.5 rounded ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>←</span>
          <span className={`px-2 py-0.5 rounded ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>→</span>
          <span>Arrow keys to navigate</span>
        </motion.div>
      </motion.div>

      {/* Keyboard Shortcuts Panel */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-32 sm:bottom-36 left-1/2 -translate-x-1/2 z-50"
          >
            <div className={`p-4 sm:p-6 rounded-2xl shadow-2xl backdrop-blur-xl border-2 ${
              isDark
                ? 'bg-slate-900/95 border-white/20'
                : 'bg-white/95 border-slate-200'
            }`}>
              <div className="flex items-center gap-2 mb-4">
                <Keyboard className={`w-5 h-5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  Keyboard Shortcuts
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {[
                  { keys: '← / →', action: 'Previous / Next' },
                  { keys: '↑ / ↓', action: 'Skip Slide' },
                  { keys: 'Home', action: 'First Slide' },
                  { keys: 'End', action: 'Last Slide' },
                  { keys: 'F', action: 'Fullscreen' },
                  { keys: '1-9', action: 'Jump to Slide' },
                ].map((shortcut, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <kbd className={`px-2 py-1 rounded text-xs font-mono min-w-[50px] text-center ${
                      isDark ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {shortcut.keys}
                    </kbd>
                    <span className={`text-sm ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                      {shortcut.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar at top */}
      <div className="fixed top-0 left-0 right-0 z-40 h-1">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
          initial={{ width: 0 }}
          animate={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </>
  );
}

function NavButton({ children, onClick, disabled, title, active, danger, isDark }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        relative p-2.5 sm:p-3 rounded-xl transition-all duration-200
        ${disabled
          ? 'opacity-30 cursor-not-allowed'
          : danger
          ? isDark
            ? 'text-red-400/80 hover:text-red-400 hover:bg-red-500/20'
            : 'text-red-500 hover:text-red-600 hover:bg-red-50'
          : active
          ? isDark
            ? 'bg-gradient-to-r from-cyan-500/30 to-purple-500/30 text-cyan-300 border border-cyan-500/30'
            : 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-600 border border-cyan-200'
          : isDark
            ? 'text-white/70 hover:text-white hover:bg-white/10'
            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
        }
      `}
      whileHover={!disabled ? { scale: 1.1 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {children}
    </motion.button>
  );
}

function Divider({ isDark }) {
  return (
    <div className={`w-px h-8 sm:h-10 bg-gradient-to-b from-transparent to-transparent ${
      isDark ? 'via-white/20' : 'via-slate-300'
    }`} />
  );
}
