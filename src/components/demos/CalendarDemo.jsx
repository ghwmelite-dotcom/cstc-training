import { useTheme } from '../../hooks/useTheme';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Video, MapPin, Users, Clock, Lightbulb, Shield } from 'lucide-react';

const events = [
  { id: 1, day: 1, start: 9, duration: 1, title: 'Team Standup', color: 'from-blue-500 to-blue-600', type: 'recurring' },
  { id: 2, day: 1, start: 11, duration: 2, title: 'Budget Review', color: 'from-purple-500 to-purple-600', type: 'meeting', hasVideo: true },
  { id: 3, day: 2, start: 10, duration: 1.5, title: 'Policy Workshop', color: 'from-emerald-500 to-emerald-600', type: 'workshop' },
  { id: 4, day: 2, start: 14, duration: 1, title: '1:1 with Director', color: 'from-amber-500 to-amber-600', type: 'meeting' },
  { id: 5, day: 3, start: 9, duration: 2, title: 'FOCUS TIME', color: 'from-cyan-500 to-teal-500', type: 'focus', isFocus: true },
  { id: 6, day: 3, start: 13, duration: 2, title: 'Stakeholder Presentation', color: 'from-red-500 to-red-600', type: 'important', hasVideo: true },
  { id: 7, day: 4, start: 10, duration: 1, title: 'Training Session', color: 'from-cyan-500 to-cyan-600', type: 'training' },
  { id: 8, day: 4, start: 15, duration: 1, title: 'Sprint Planning', color: 'from-indigo-500 to-indigo-600', type: 'meeting' },
  { id: 9, day: 5, start: 9, duration: 1, title: 'Team Standup', color: 'from-blue-500 to-blue-600', type: 'recurring' },
  { id: 10, day: 5, start: 11, duration: 1, title: 'All Hands Meeting', color: 'from-rose-500 to-rose-600', type: 'company', hasVideo: true },
];

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

// Annotation callout component
function Annotation({ children, position, delay = 0, color = 'cyan' }) {
  const colors = {
    cyan: 'bg-cyan-500 border-cyan-400',
    amber: 'bg-amber-500 border-amber-400',
    emerald: 'bg-emerald-500 border-emerald-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
      className={`absolute ${position} z-30`}
    >
      <div className={`${colors[color]} text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg border backdrop-blur-sm flex items-center gap-1.5`}>
        <Lightbulb className="w-3 h-3" />
        {children}
      </div>
    </motion.div>
  );
}

export function CalendarDemo({ step = 0 }) {
  const { isDark } = useTheme();

  return (
    <div className="relative rounded-2xl overflow-hidden">
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? 'from-blue-600 via-indigo-600 to-purple-700' : 'from-blue-100 via-indigo-100 to-purple-100'}`} />

      {/* Animated orbs */}
      <motion.div
        className="absolute w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        style={{ top: '-20%', left: '-10%' }}
      />

      <div className="relative">
        {/* Header */}
        <div className="bg-slate-900/40 backdrop-blur-sm border-b border-white/10 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <motion.button
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft size={20} className="text-white/60" />
              </motion.button>
              <motion.button
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight size={20} className="text-white/60" />
              </motion.button>
            </div>
            <h3 className="font-bold text-white">January 2025</h3>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all">
              Today
            </button>
            <button className="px-3 py-1.5 text-sm font-medium bg-white/20 backdrop-blur-sm text-white rounded-lg border border-white/20">
              Week
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex bg-slate-900/30 backdrop-blur-sm">
          {/* Time column */}
          <div className="w-16 flex-shrink-0 border-r border-white/10 bg-slate-900/30">
            <div className="h-12 border-b border-white/10" />
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-12 text-xs text-white/40 text-right pr-2 pt-1"
              >
                {hour}:00
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="flex flex-1 relative">
            {days.map((day, dayIndex) => (
              <div key={day} className="flex-1 min-w-[100px] relative">
                {/* Day header */}
                <div className="h-12 border-b border-white/10 flex flex-col items-center justify-center">
                  <span className="text-xs text-white/50">{day}</span>
                  <motion.span
                    className={`text-lg font-bold ${
                      dayIndex === 2
                        ? 'w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50'
                        : 'text-white/90'
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {13 + dayIndex}
                  </motion.span>
                </div>

                {/* Time slots */}
                <div className="relative">
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className="h-12 border-b border-r border-white/5"
                    />
                  ))}

                  {/* Events */}
                  {events
                    .filter((e) => e.day === dayIndex + 1)
                    .map((event, eventIndex) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, scale: 0.8, x: -10 }}
                        animate={{
                          opacity: step >= eventIndex ? 1 : 0.3,
                          scale: 1,
                          x: 0,
                        }}
                        transition={{ delay: eventIndex * 0.05 }}
                        whileHover={{ scale: 1.02, zIndex: 10 }}
                        className={`absolute left-1 right-1 bg-gradient-to-r ${event.color} rounded-lg px-2 py-1 text-white text-xs overflow-hidden cursor-pointer shadow-lg group ${
                          event.isFocus ? 'ring-2 ring-white/50 ring-offset-2 ring-offset-transparent' : ''
                        }`}
                        style={{
                          top: `${(event.start - 8) * 48 + 4}px`,
                          height: `${event.duration * 48 - 8}px`,
                        }}
                      >
                        {/* Shine effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />

                        {/* Focus time special icon */}
                        {event.isFocus && (
                          <Shield className="absolute top-1 right-1 w-4 h-4 text-white/80" />
                        )}

                        <div className="relative font-medium truncate">{event.title}</div>
                        {event.duration > 1 && (
                          <div className="relative flex items-center gap-1 mt-0.5 opacity-80">
                            {event.hasVideo && <Video size={10} />}
                            <Clock size={10} />
                            <span className="text-[10px]">{event.start}:00</span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                </div>
              </div>
            ))}

            {/* Floating Annotations */}
            <AnimatePresence>
              {step >= 1 && (
                <Annotation position="top-16 left-4" delay={0.5} color="cyan">
                  Colors = different event types
                </Annotation>
              )}

              {step >= 2 && (
                <Annotation position="top-28 right-4" delay={0.7} color="amber">
                  Gaps = breathing room
                </Annotation>
              )}

              {step >= 3 && (
                <Annotation position="top-16 left-1/3" delay={0.9} color="emerald">
                  FOCUS TIME blocks your calendar
                </Annotation>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom insight bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-slate-900/60 backdrop-blur-sm border-t border-white/10 px-4 py-2 flex items-center justify-center gap-2"
        >
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span className="text-white/80 text-sm">
            Notice: Not every slot is booked. A good calendar has <span className="text-cyan-400 font-medium">breathing room</span>.
          </span>
        </motion.div>
      </div>
    </div>
  );
}
