import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Plus,
  Clock,
  MapPin,
  Users,
  Bell,
  Palette,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Star,
  Zap,
  Target,
  Lightbulb,
  Play,
  RotateCcw,
  Trophy,
  Sparkles,
  Video,
  Shield,
  AlertCircle,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

// Challenge configurations
const challenges = [
  {
    id: 1,
    title: 'Create Your First Event',
    description: 'Click on any time slot and create a meeting called "Team Standup"',
    objective: 'Create an event named "Team Standup"',
    points: 100,
    hint: 'Click on an empty time slot to start creating an event',
    validation: (events) => events.some(e => e.title.toLowerCase().includes('standup')),
  },
  {
    id: 2,
    title: 'Color Code Your Calendar',
    description: 'Create a "Focus Time" event and make it cyan/teal colored',
    objective: 'Create a focus time block with cyan color',
    points: 150,
    hint: 'Use the color picker when creating an event to choose cyan',
    validation: (events) => events.some(e => e.title.toLowerCase().includes('focus') && e.color === 'cyan'),
  },
  {
    id: 3,
    title: 'Set a Reminder',
    description: 'Create an event with a 15-minute reminder',
    objective: 'Add a reminder to any event',
    points: 125,
    hint: 'Look for the bell icon when creating an event',
    validation: (events) => events.some(e => e.reminder),
  },
  {
    id: 4,
    title: 'Block Your Time',
    description: 'Create a 2-hour focus block to protect your deep work time',
    objective: 'Create an event that is 2 hours or longer',
    points: 175,
    hint: 'Drag the event edges or set duration to 2 hours',
    validation: (events) => events.some(e => e.duration >= 2),
  },
  {
    id: 5,
    title: 'Add Meeting Details',
    description: 'Create a complete event with title, location, and attendees',
    objective: 'Create an event with all details filled in',
    points: 200,
    hint: 'Fill in all the fields when creating your event',
    validation: (events) => events.some(e => e.title && e.location && e.attendees?.length > 0),
  },
];

const eventColors = [
  { id: 'blue', name: 'Blue', gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-500' },
  { id: 'cyan', name: 'Cyan', gradient: 'from-cyan-500 to-teal-500', bg: 'bg-cyan-500' },
  { id: 'purple', name: 'Purple', gradient: 'from-purple-500 to-purple-600', bg: 'bg-purple-500' },
  { id: 'emerald', name: 'Green', gradient: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-500' },
  { id: 'amber', name: 'Yellow', gradient: 'from-amber-500 to-amber-600', bg: 'bg-amber-500' },
  { id: 'rose', name: 'Red', gradient: 'from-rose-500 to-rose-600', bg: 'bg-rose-500' },
];

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

// Event creation modal
function EventModal({ isOpen, onClose, onSave, slotInfo, isDark }) {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(1);
  const [color, setColor] = useState('blue');
  const [location, setLocation] = useState('');
  const [attendees, setAttendees] = useState('');
  const [reminder, setReminder] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // Reset to defaults when opening
      setTitle('');
      setDuration(1);
      setColor('blue');
      setLocation('');
      setAttendees('');
      setReminder(false);
      setHasVideo(false);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!title.trim()) return;

    onSave({
      id: Date.now(),
      title: title.trim(),
      day: slotInfo.day,
      start: slotInfo.hour,
      duration,
      color,
      location: location.trim(),
      attendees: attendees.split(',').map(a => a.trim()).filter(Boolean),
      reminder,
      hasVideo,
    });

    onClose();
  };

  const handleClose = (e) => {
    if (e) e.stopPropagation();
    onClose();
  };

  // Use Portal to render modal at document.body level
  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          style={{ zIndex: 99999 }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border max-h-[90vh] overflow-y-auto ${
              isDark
                ? 'bg-slate-800 border-slate-700'
                : 'bg-white border-slate-200'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  New Event
                </h3>
                <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                  {days[slotInfo.day - 1]} at {slotInfo.hour}:00
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-white/10 text-white/60' : 'hover:bg-slate-100 text-slate-400'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                Event Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Team Standup"
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white placeholder:text-white/40'
                    : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400'
                }`}
                autoFocus
              />
            </div>

            {/* Duration */}
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                <Clock className="w-4 h-4 inline mr-1" /> Duration
              </label>
              <div className="flex gap-2">
                {[0.5, 1, 1.5, 2, 3].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDuration(d);
                    }}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      duration === d
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                        : isDark
                        ? 'bg-slate-700 text-white/60 hover:bg-slate-600'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {d}h
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                <Palette className="w-4 h-4 inline mr-1" /> Color
              </label>
              <div className="flex gap-2">
                {eventColors.map((c) => (
                  <motion.button
                    key={c.id}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setColor(c.id);
                    }}
                    className={`w-10 h-10 rounded-xl ${c.bg} ${
                      color === c.id ? 'ring-2 ring-offset-2 ring-cyan-400' : ''
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title={c.name}
                  >
                    {color === c.id && <Check className="w-5 h-5 text-white mx-auto" />}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                <MapPin className="w-4 h-4 inline mr-1" /> Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Conference Room A"
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white placeholder:text-white/40'
                    : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400'
                }`}
              />
            </div>

            {/* Attendees */}
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                <Users className="w-4 h-4 inline mr-1" /> Attendees
              </label>
              <input
                type="text"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                placeholder="e.g., john@email.com, jane@email.com"
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white placeholder:text-white/40'
                    : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400'
                }`}
              />
            </div>

            {/* Options */}
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reminder}
                  onChange={(e) => setReminder(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500"
                />
                <Bell className={`w-4 h-4 ${isDark ? 'text-white/60' : 'text-slate-500'}`} />
                <span className={`text-sm ${isDark ? 'text-white/80' : 'text-slate-600'}`}>
                  15 min reminder
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasVideo}
                  onChange={(e) => setHasVideo(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500"
                />
                <Video className={`w-4 h-4 ${isDark ? 'text-white/60' : 'text-slate-500'}`} />
                <span className={`text-sm ${isDark ? 'text-white/80' : 'text-slate-600'}`}>
                  Add video call
                </span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                isDark
                  ? 'bg-slate-700 text-white/80 hover:bg-slate-600'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Cancel
            </button>
            <motion.button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSave();
              }}
              disabled={!title.trim()}
              className={`flex-1 py-3 rounded-xl font-medium bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25 ${
                !title.trim() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              whileHover={title.trim() ? { scale: 1.02 } : {}}
              whileTap={title.trim() ? { scale: 0.98 } : {}}
            >
              <span className="flex items-center justify-center gap-2">
                <Check className="w-5 h-5" />
                Create Event
              </span>
            </motion.button>
          </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render modal in a portal at document.body level
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }
  return modalContent;
}

// Challenge card
function ChallengeCard({ challenge, isActive, isCompleted, onStart, isDark }) {
  return (
    <motion.div
      className={`p-4 rounded-2xl border transition-all ${
        isActive
          ? isDark
            ? 'bg-cyan-500/20 border-cyan-500/50 ring-2 ring-cyan-500/30'
            : 'bg-cyan-50 border-cyan-300 ring-2 ring-cyan-200'
          : isCompleted
          ? isDark
            ? 'bg-emerald-500/10 border-emerald-500/30'
            : 'bg-emerald-50 border-emerald-200'
          : isDark
          ? 'bg-white/5 border-white/10'
          : 'bg-white border-slate-200'
      }`}
      whileHover={!isCompleted ? { scale: 1.02 } : {}}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isCompleted
              ? 'bg-gradient-to-br from-emerald-400 to-emerald-600'
              : isActive
              ? 'bg-gradient-to-br from-cyan-400 to-blue-500'
              : isDark
              ? 'bg-white/10'
              : 'bg-slate-100'
          }`}
        >
          {isCompleted ? (
            <Check className="w-5 h-5 text-white" />
          ) : (
            <span className={`font-bold ${isActive ? 'text-white' : isDark ? 'text-white/60' : 'text-slate-400'}`}>
              {challenge.id}
            </span>
          )}
        </div>

        <div className="flex-1">
          <h4 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {challenge.title}
          </h4>
          <p className={`text-sm mb-2 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
            {challenge.description}
          </p>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-amber-500 text-sm font-medium">
              <Star className="w-4 h-4" />
              {challenge.points} pts
            </span>

            {!isCompleted && !isActive && (
              <motion.button
                onClick={() => onStart(challenge)}
                className="flex items-center gap-1 text-cyan-500 text-sm font-medium hover:text-cyan-400"
                whileHover={{ x: 3 }}
              >
                <Play className="w-4 h-4" />
                Start
              </motion.button>
            )}

            {isActive && (
              <span className="flex items-center gap-1 text-cyan-400 text-sm font-medium animate-pulse">
                <Zap className="w-4 h-4" />
                In Progress
              </span>
            )}

            {isCompleted && (
              <span className="flex items-center gap-1 text-emerald-500 text-sm font-medium">
                <Trophy className="w-4 h-4" />
                Completed!
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Main Calendar Practice component
export function CalendarPractice({ onComplete, progress }) {
  const { isDark } = useTheme();
  const [events, setEvents] = useState([]);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // Handle slot click
  const handleSlotClick = (day, hour) => {
    setSelectedSlot({ day, hour });
    setShowModal(true);
  };

  // Handle event save
  const handleSaveEvent = useCallback((newEvent) => {
    setEvents(prev => [...prev, newEvent]);
  }, []);

  // Check challenge completion
  useEffect(() => {
    if (!activeChallenge) return;

    const isComplete = activeChallenge.validation(events);
    if (isComplete) {
      const timeSpent = (Date.now() - startTimeRef.current) / 1000;

      setCompletedChallenges(prev => [...prev, activeChallenge.id]);
      setShowSuccess(true);

      // Notify parent
      onComplete?.(activeChallenge.id, activeChallenge.points, timeSpent);

      // Clear after delay
      setTimeout(() => {
        setActiveChallenge(null);
        setShowSuccess(false);
      }, 2000);
    }
  }, [events, activeChallenge, onComplete]);

  // Start challenge
  const handleStartChallenge = (challenge) => {
    setActiveChallenge(challenge);
    startTimeRef.current = Date.now();
    setShowHint(false);
  };

  // Reset practice
  const handleReset = () => {
    setEvents([]);
    setActiveChallenge(null);
    setCompletedChallenges([]);
  };

  // Get color gradient for event
  const getColorGradient = (colorId) => {
    return eventColors.find(c => c.id === colorId)?.gradient || 'from-blue-500 to-blue-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Google Calendar Practice
          </h2>
          <p className={`${isDark ? 'text-white/60' : 'text-slate-500'}`}>
            Complete challenges to master calendar management
          </p>
        </div>

        <motion.button
          onClick={handleReset}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            isDark
              ? 'bg-white/10 hover:bg-white/20 text-white'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </motion.button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className={`rounded-2xl overflow-hidden border ${
            isDark ? 'border-white/10' : 'border-slate-200'
          }`}>
            {/* Calendar Header */}
            <div className={`px-4 py-3 flex items-center justify-between ${
              isDark ? 'bg-slate-800' : 'bg-white'
            }`}>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <motion.button
                    className={`p-1.5 rounded-full transition-colors ${
                      isDark ? 'hover:bg-white/10 text-white/60' : 'hover:bg-slate-100 text-slate-400'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronLeft size={20} />
                  </motion.button>
                  <motion.button
                    className={`p-1.5 rounded-full transition-colors ${
                      isDark ? 'hover:bg-white/10 text-white/60' : 'hover:bg-slate-100 text-slate-400'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronRight size={20} />
                  </motion.button>
                </div>
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  January 2026
                </h3>
              </div>
              <button className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                isDark ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                Week
              </button>
            </div>

            {/* Calendar Grid */}
            <div className={`flex ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
              {/* Time column */}
              <div className={`w-16 flex-shrink-0 border-r ${
                isDark ? 'border-white/10' : 'border-slate-200'
              }`}>
                <div className="h-12 border-b border-transparent" />
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className={`h-12 text-xs text-right pr-2 pt-1 ${
                      isDark ? 'text-white/40' : 'text-slate-400'
                    }`}
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
                    <div className={`h-12 border-b flex flex-col items-center justify-center ${
                      isDark ? 'border-white/10' : 'border-slate-200'
                    }`}>
                      <span className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-400'}`}>
                        {day}
                      </span>
                      <motion.span
                        className={`text-lg font-bold ${
                          dayIndex === 2
                            ? 'w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 text-white rounded-full flex items-center justify-center shadow-lg'
                            : isDark ? 'text-white' : 'text-slate-800'
                        }`}
                        whileHover={{ scale: 1.1 }}
                      >
                        {12 + dayIndex}
                      </motion.span>
                    </div>

                    {/* Time slots */}
                    <div className="relative">
                      {hours.map((hour) => (
                        <motion.div
                          key={hour}
                          onClick={() => handleSlotClick(dayIndex + 1, hour)}
                          className={`h-12 border-b border-r cursor-pointer transition-colors ${
                            isDark
                              ? 'border-white/5 hover:bg-cyan-500/10'
                              : 'border-slate-100 hover:bg-cyan-50'
                          }`}
                          whileHover={{ backgroundColor: isDark ? 'rgba(6, 182, 212, 0.1)' : 'rgba(6, 182, 212, 0.05)' }}
                        />
                      ))}

                      {/* Events */}
                      {events
                        .filter((e) => e.day === dayIndex + 1)
                        .map((event) => (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, scale: 0.8, x: -10 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            className={`absolute left-1 right-1 bg-gradient-to-r ${getColorGradient(event.color)} rounded-lg px-2 py-1 text-white text-xs overflow-hidden cursor-pointer shadow-lg group`}
                            style={{
                              top: `${(event.start - 8) * 48 + 4}px`,
                              height: `${event.duration * 48 - 8}px`,
                            }}
                            whileHover={{ scale: 1.02, zIndex: 10 }}
                          >
                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />

                            <div className="relative font-medium truncate">{event.title}</div>
                            {event.duration > 1 && (
                              <div className="relative flex items-center gap-1 mt-0.5 opacity-80">
                                {event.hasVideo && <Video size={10} />}
                                {event.reminder && <Bell size={10} />}
                                <Clock size={10} />
                                <span className="text-[10px]">{event.start}:00</span>
                              </div>
                            )}
                          </motion.div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instruction bar */}
            <motion.div
              className={`px-4 py-3 flex items-center gap-2 border-t ${
                isDark
                  ? 'bg-slate-800 border-white/10'
                  : 'bg-white border-slate-200'
              }`}
            >
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span className={`text-sm ${isDark ? 'text-white/80' : 'text-slate-600'}`}>
                Click on any time slot to create a new event
              </span>
            </motion.div>
          </div>
        </div>

        {/* Challenges sidebar */}
        <div className="space-y-4">
          {/* Active challenge hint */}
          <AnimatePresence>
            {activeChallenge && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 rounded-2xl border-2 border-dashed ${
                  isDark
                    ? 'bg-cyan-500/10 border-cyan-500/50'
                    : 'bg-cyan-50 border-cyan-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      Current Objective
                    </h4>
                    <p className={`text-sm ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                      {activeChallenge.objective}
                    </p>

                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="flex items-center gap-1 text-amber-500 text-sm mt-2 hover:text-amber-400"
                    >
                      <Lightbulb className="w-4 h-4" />
                      {showHint ? 'Hide hint' : 'Need a hint?'}
                    </button>

                    <AnimatePresence>
                      {showHint && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className={`text-sm mt-2 p-2 rounded-lg ${
                            isDark ? 'bg-amber-500/20 text-amber-200' : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {activeChallenge.hint}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Challenges list */}
          <div className={`p-4 rounded-2xl border ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Challenges
            </h3>
            <div className="space-y-3">
              {challenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  isActive={activeChallenge?.id === challenge.id}
                  isCompleted={completedChallenges.includes(challenge.id)}
                  onStart={handleStartChallenge}
                  isDark={isDark}
                />
              ))}
            </div>
          </div>

          {/* Progress */}
          <div className={`p-4 rounded-2xl border ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-700'}`}>
                Progress
              </span>
              <span className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                {completedChallenges.length}/{challenges.length}
              </span>
            </div>
            <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}>
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${(completedChallenges.length / challenges.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveEvent}
        slotInfo={selectedSlot || { day: 1, hour: 9 }}
        isDark={isDark}
      />

      {/* Success celebration */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/50"
              >
                <Trophy className="w-12 h-12 text-white" />
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-white mb-2"
              >
                Challenge Complete!
              </motion.h3>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center gap-2 text-amber-400"
              >
                <Star className="w-5 h-5" />
                <span className="text-xl font-bold">+{activeChallenge?.points} points</span>
              </motion.div>
            </div>

            {/* Confetti particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background: ['#10b981', '#f59e0b', '#6366f1', '#ec4899', '#06b6d4'][i % 5],
                  left: '50%',
                  top: '50%',
                }}
                initial={{ x: 0, y: 0, scale: 0 }}
                animate={{
                  x: (Math.random() - 0.5) * 400,
                  y: (Math.random() - 0.5) * 400,
                  scale: [0, 1, 0],
                  rotate: Math.random() * 360,
                }}
                transition={{ duration: 1, delay: i * 0.02 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
