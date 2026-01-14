import { motion, AnimatePresence } from 'framer-motion';
import { X, Monitor, Home, ChevronRight, ChevronLeft, Keyboard } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export function KeyboardHelp({ isOpen, onClose }) {
  const { isDark } = useTheme();

  const shortcuts = [
    {
      category: 'Navigation',
      items: [
        { keys: ['→', 'Space', 'Enter'], action: 'Next slide / step' },
        { keys: ['←', 'Backspace'], action: 'Previous slide / step' },
        { keys: ['Home'], action: 'Go to first slide' },
        { keys: ['End'], action: 'Go to last slide' },
        { keys: ['1-9'], action: 'Jump to slide 1-9' },
      ]
    },
    {
      category: 'Controls',
      items: [
        { keys: ['P'], action: 'Open presenter view' },
        { keys: ['F'], action: 'Toggle fullscreen' },
        { keys: ['T'], action: 'Toggle dark/light theme' },
        { keys: ['?'], action: 'Show this help' },
        { keys: ['Esc'], action: 'Close modals / Exit fullscreen' },
      ]
    },
    {
      category: 'Touch / Mouse',
      items: [
        { keys: ['Swipe Left'], action: 'Next slide', isTouch: true },
        { keys: ['Swipe Right'], action: 'Previous slide', isTouch: true },
        { keys: ['Click Right Half'], action: 'Next slide', isTouch: true },
        { keys: ['Click Left Half'], action: 'Previous slide', isTouch: true },
      ]
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`rounded-2xl p-6 max-w-2xl w-full border shadow-2xl ${
              isDark
                ? 'bg-slate-800 border-slate-700'
                : 'bg-white border-slate-200'
            }`}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isDark ? 'bg-cyan-500/20' : 'bg-cyan-100'
                }`}>
                  <Keyboard className={`w-5 h-5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    Keyboard Shortcuts
                  </h2>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Navigate the presentation quickly
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? 'hover:bg-slate-700 text-slate-400 hover:text-white'
                    : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Shortcuts Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {shortcuts.map((section, sectionIndex) => (
                <motion.div
                  key={section.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sectionIndex * 0.1 }}
                >
                  <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {section.category}
                  </h3>
                  <div className="space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className={`flex items-center justify-between p-2 rounded-lg ${
                          isDark ? 'bg-slate-700/50' : 'bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {item.keys.map((key, keyIndex) => (
                            <span key={keyIndex} className="flex items-center gap-1">
                              <kbd className={`px-2 py-1 rounded text-xs font-mono font-medium ${
                                item.isTouch
                                  ? isDark
                                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                    : 'bg-purple-100 text-purple-600 border border-purple-200'
                                  : isDark
                                    ? 'bg-slate-600 text-white border border-slate-500'
                                    : 'bg-white text-slate-700 border border-slate-300 shadow-sm'
                              }`}>
                                {key}
                              </kbd>
                              {keyIndex < item.keys.length - 1 && (
                                <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                  or
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                        <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          {item.action}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer tip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`mt-6 p-3 rounded-xl text-center ${
                isDark ? 'bg-slate-700/50' : 'bg-slate-100'
              }`}
            >
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Press <kbd className={`px-1.5 py-0.5 rounded text-xs ${
                  isDark ? 'bg-slate-600 text-white' : 'bg-white text-slate-700 border border-slate-300'
                }`}>P</kbd> to open Presenter View with speaker notes
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
