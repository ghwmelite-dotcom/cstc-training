import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer } from './Timer';
import {
  ChevronLeft,
  ChevronRight,
  Monitor,
  MessageCircle,
  MousePointer,
  HelpCircle,
  Target,
  Clock,
  Lightbulb,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

// Parse legacy notes format into structured format
function parseNotes(notes) {
  if (!notes) return null;

  // If already structured, return as-is
  if (typeof notes === 'object' && notes.say) {
    return notes;
  }

  // Parse legacy string format
  if (typeof notes === 'string') {
    const parsed = {
      say: '',
      do: [],
      ifAsked: [],
      keyPoint: '',
      time: ''
    };

    // Extract time
    const timeMatch = notes.match(/⏱️\s*TIME:\s*(.+?)(?:\n|$)/i);
    if (timeMatch) {
      parsed.time = timeMatch[1].trim();
    }

    // Extract "SAY THIS" section
    const sayMatch = notes.match(/📋\s*SAY THIS:?\s*\n([\s\S]*?)(?=(?:💡|⏱️|❓|👀|🎉|$))/i);
    if (sayMatch) {
      parsed.say = sayMatch[1]
        .trim()
        .replace(/^["']|["']$/g, '')
        .replace(/\n\n+/g, '\n\n');
    }

    // Extract tips as key points
    const tipMatch = notes.match(/💡\s*TIP:?\s*(.+?)(?:\n|$)/i);
    if (tipMatch) {
      parsed.keyPoint = tipMatch[1].trim();
    }

    // Extract "IF ASKED" sections
    const ifAskedMatches = notes.matchAll(/❓\s*IF ASKED\s*["']?([^"'\n]+)["']?:?\s*\n?→?\s*["']?([^"'\n]+)["']?/gi);
    for (const match of ifAskedMatches) {
      parsed.ifAsked.push({
        q: match[1].trim(),
        a: match[2].trim()
      });
    }

    // Extract action items from "WALK AROUND" or similar
    const walkMatch = notes.match(/👀\s*WALK AROUND:?\s*([\s\S]*?)(?=(?:⏱️|❓|$))/i);
    if (walkMatch) {
      const actions = walkMatch[1].match(/[-•]\s*(.+)/g);
      if (actions) {
        parsed.do = actions.map(a => a.replace(/^[-•]\s*/, '').trim());
      }
    }

    return parsed;
  }

  return null;
}

// Section component for notes
function NotesSection({ icon: Icon, title, children, color = 'cyan' }) {
  const colors = {
    cyan: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    amber: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    emerald: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    purple: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    rose: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border p-4 ${colors[color]}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-5 h-5" />
        <span className="font-semibold text-sm uppercase tracking-wide">{title}</span>
      </div>
      <div className="text-slate-100">
        {children}
      </div>
    </motion.div>
  );
}

export function PresenterView({ slides, currentSlide, currentStep }) {
  const [syncedState, setSyncedState] = useState({ slide: currentSlide, step: currentStep });
  const [showGuide, setShowGuide] = useState(() => {
    return !localStorage.getItem('presenter-guide-dismissed');
  });

  useEffect(() => {
    const channel = new BroadcastChannel('presenter-sync');

    channel.onmessage = (event) => {
      if (event.data.type === 'sync-state') {
        setSyncedState({
          slide: event.data.currentSlide,
          step: event.data.currentStep,
        });
      }
    };

    // Keyboard navigation
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        sendNavigation('next');
      } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
        e.preventDefault();
        sendNavigation('prev');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Notify main window that presenter view is ready
    channel.postMessage({ type: 'presenter-ready' });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      channel.postMessage({ type: 'presenter-closed' });
      channel.close();
    };
  }, []);

  const slide = slides[syncedState.slide] || slides[0];
  const nextSlide = slides[syncedState.slide + 1];
  const parsedNotes = parseNotes(slide.notes);

  // Calculate progress
  const progress = ((syncedState.slide + 1) / slides.length) * 100;

  const sendNavigation = (action) => {
    const channel = new BroadcastChannel('presenter-sync');
    channel.postMessage({ type: 'navigate', action });
    channel.close();
  };

  const dismissGuide = () => {
    localStorage.setItem('presenter-guide-dismissed', 'true');
    setShowGuide(false);
  };

  return (
    <div className="presenter-view h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Quick Start Guide Modal */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={dismissGuide}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-2xl p-8 max-w-lg w-full border border-slate-700 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Monitor className="w-8 h-8 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Welcome, Presenter!</h2>
                <p className="text-slate-400">Here's everything you need to know</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Monitor className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Setup</h3>
                    <p className="text-sm text-slate-400">Main window shows slides to audience. This window is your private dashboard.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Scripts</h3>
                    <p className="text-sm text-slate-400">Read the "What to Say" sections naturally. They're written conversationally.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ChevronRight className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Controls</h3>
                    <p className="text-sm text-slate-400">
                      <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-xs mr-1">→</kbd> or
                      <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-xs mx-1">SPACE</kbd> = Next &nbsp;
                      <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-xs mr-1">←</kbd> = Previous
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={dismissGuide}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl transition-colors"
              >
                Got it, let's start!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex-shrink-0 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-cyan-400" />
              <h1 className="text-lg font-semibold text-white">Presenter View</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-cyan-400">{syncedState.slide + 1}</span>
              <span className="text-slate-500">/</span>
              <span className="text-lg text-slate-400">{slides.length}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Time recommendation */}
            {parsedNotes?.time && (
              <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 font-medium text-sm">{parsedNotes.time}</span>
              </div>
            )}
            <Timer />
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* Left: Slide Previews */}
        <div className="w-1/2 flex flex-col gap-3 overflow-hidden">
          {/* Current Slide */}
          <div className="flex-1 bg-slate-800/50 rounded-xl p-3 flex flex-col min-h-0 border border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Current Slide</span>
              <span className="text-xs text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded">
                {slide.title || slide.id || `Slide ${syncedState.slide + 1}`}
              </span>
            </div>
            <div className="flex-1 bg-white rounded-lg overflow-hidden min-h-0 shadow-lg">
              <div className="w-full h-full overflow-auto">
                <div className="transform scale-[0.5] origin-top-left w-[200%]">
                  {slide.component}
                </div>
              </div>
            </div>
          </div>

          {/* Next Slide Preview */}
          <div className="h-36 flex-shrink-0 bg-slate-800/50 rounded-xl p-3 flex flex-col border border-slate-700/50">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">Up Next</span>
            <div className="flex-1 bg-white rounded-lg overflow-hidden shadow-md">
              {nextSlide ? (
                <div className="w-full h-full overflow-hidden">
                  <div className="transform scale-[0.2] origin-top-left w-[500%] pointer-events-none opacity-90">
                    {nextSlide.component}
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
                  <div className="text-center">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                    <span className="text-sm font-medium">End of Presentation</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Speaker Notes */}
        <div className="w-1/2 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {parsedNotes ? (
              <>
                {/* What to Say */}
                {parsedNotes.say && (
                  <NotesSection icon={MessageCircle} title="What to Say" color="cyan">
                    <p className="text-base leading-relaxed whitespace-pre-wrap">
                      {parsedNotes.say}
                    </p>
                  </NotesSection>
                )}

                {/* Key Point */}
                {parsedNotes.keyPoint && (
                  <NotesSection icon={Target} title="Key Point" color="amber">
                    <p className="text-base font-medium">
                      {parsedNotes.keyPoint}
                    </p>
                  </NotesSection>
                )}

                {/* Do This */}
                {parsedNotes.do && parsedNotes.do.length > 0 && (
                  <NotesSection icon={MousePointer} title="Do This" color="emerald">
                    <ul className="space-y-2">
                      {parsedNotes.do.map((action, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-400 mt-1">•</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </NotesSection>
                )}

                {/* If Asked */}
                {parsedNotes.ifAsked && parsedNotes.ifAsked.length > 0 && (
                  <NotesSection icon={HelpCircle} title="If Asked" color="purple">
                    <div className="space-y-3">
                      {parsedNotes.ifAsked.map((qa, i) => (
                        <div key={i} className="bg-slate-800/50 rounded-lg p-3">
                          <p className="text-purple-300 text-sm mb-1">"{qa.q}"</p>
                          <p className="text-slate-100">→ {qa.a}</p>
                        </div>
                      ))}
                    </div>
                  </NotesSection>
                )}
              </>
            ) : slide.notes ? (
              /* Fallback for unparseable notes */
              <NotesSection icon={MessageCircle} title="Speaker Notes" color="cyan">
                <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {slide.notes}
                </pre>
              </NotesSection>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                <div className="text-center">
                  <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg">No speaker notes for this slide</p>
                  <p className="text-sm mt-1 opacity-75">The slide content speaks for itself!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex-shrink-0 bg-slate-800/80 backdrop-blur-sm border-t border-slate-700/50 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Stats */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <span className="text-3xl font-bold text-cyan-400">{syncedState.slide + 1}</span>
              <span className="text-xs text-slate-500 block mt-1">Current</span>
            </div>
            <div className="w-px h-10 bg-slate-700" />
            <div className="text-center">
              <span className="text-3xl font-bold text-slate-400">{slides.length - syncedState.slide - 1}</span>
              <span className="text-xs text-slate-500 block mt-1">Remaining</span>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => sendNavigation('prev')}
              disabled={syncedState.slide === 0}
              className="flex items-center gap-2 px-8 py-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all text-white font-semibold text-lg shadow-lg hover:shadow-xl disabled:shadow-none"
            >
              <ChevronLeft size={24} />
              <span>Previous</span>
            </button>

            <button
              onClick={() => sendNavigation('next')}
              disabled={syncedState.slide === slides.length - 1}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all text-white font-semibold text-lg shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 disabled:shadow-none"
            >
              <span>Next</span>
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Keyboard hints */}
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <kbd className="px-2.5 py-1.5 bg-slate-700 rounded-lg text-xs font-mono">←</kbd>
              <span>Previous</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2.5 py-1.5 bg-slate-700 rounded-lg text-xs font-mono">→</kbd>
              <span>Next</span>
            </div>
            <button
              onClick={() => setShowGuide(true)}
              className="px-3 py-1.5 text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-colors text-xs"
            >
              Show Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
