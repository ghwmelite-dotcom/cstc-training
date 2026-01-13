import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Star,
  Zap,
  Award,
  ChevronUp,
  ChevronDown,
  X,
  Sparkles
} from 'lucide-react';

// Points Display (Top Right Corner) - Glass Style
export function PointsDisplay({ points, totalPoints, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed top-16 right-4 z-40"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 blur-lg opacity-50 rounded-full" />

      <div className="relative flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 text-white font-bold shadow-xl">
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <Star className="w-5 h-5 text-amber-400" />
        </motion.div>
        <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent font-bold">
          {points}
        </span>
        <span className="text-white/40 text-sm">/ {totalPoints}</span>
      </div>
    </motion.button>
  );
}

// Achievement Toast (Popup when achievement unlocked) - Glass Style
export function AchievementToast({ achievement, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.8 }}
      className="fixed top-24 left-1/2 -translate-x-1/2 z-50"
    >
      {/* Glow backdrop */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 to-orange-500/30 blur-2xl rounded-3xl" />

      <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 px-6 py-4 flex items-center gap-4 shadow-2xl">
        <motion.div
          className="text-4xl"
          animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5 }}
        >
          {achievement.icon}
        </motion.div>
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Trophy size={14} />
            Achievement Unlocked!
          </div>
          <h3 className="font-bold text-white">{achievement.title}</h3>
          <p className="text-sm text-white/60">{achievement.description}</p>
        </div>
        <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 px-3 py-1 rounded-full text-amber-400 font-bold">
          <Zap size={16} />
          <span>+{achievement.points}</span>
        </div>
        <button
          onClick={onClose}
          className="text-white/40 hover:text-white/80 ml-2 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </motion.div>
  );
}

// Achievements Panel (Full list) - Glass Style
export function AchievementsPanel({ achievements, isOpen, onClose, points, totalPoints }) {
  if (!isOpen) return null;

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative overflow-hidden px-6 py-5">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Your Achievements</h2>
                <p className="text-white/60 text-sm">
                  {unlockedCount} of {achievements.length} unlocked
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Points Bar */}
          <div className="relative mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/60">Total Points</span>
              <span className="font-bold text-amber-400">{points} / {totalPoints}</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full relative"
                initial={{ width: 0 }}
                animate={{ width: `${(points / totalPoints) * 100}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Achievements List */}
        <div className="p-4 overflow-y-auto max-h-[50vh]">
          <div className="grid gap-3">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-xl border transition-all ${
                  achievement.unlocked
                    ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30'
                    : 'bg-white/5 border-white/10 opacity-60'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`text-3xl ${
                      achievement.unlocked ? '' : 'grayscale opacity-50'
                    }`}
                  >
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold ${
                      achievement.unlocked ? 'text-white' : 'text-white/50'
                    }`}>
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-white/50">
                      {achievement.description}
                    </p>
                  </div>
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
                    achievement.unlocked
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-white/5 text-white/40 border border-white/10'
                  }`}>
                    <Zap size={14} />
                    <span>{achievement.points}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Progress Ring (Circular progress)
export function ProgressRing({ progress, size = 60, strokeWidth = 4 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-white/10"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          className="text-cyan-400"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5 }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-white">{progress}%</span>
      </div>
    </div>
  );
}

// Completion Certificate - Enhanced
export function CompletionCertificate({ name, date, points, totalPoints, onDownload, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, rotateY: -15 }}
        animate={{ scale: 1, rotateY: 0 }}
        exit={{ scale: 0.8 }}
        className="relative bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 rounded-3xl shadow-2xl p-8 max-w-2xl w-full border border-white/20"
        onClick={(e) => e.stopPropagation()}
        id="certificate"
      >
        {/* Decorative corners with glow */}
        <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-cyan-400/50 rounded-tl-2xl" />
        <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-purple-400/50 rounded-tr-2xl" />
        <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-purple-400/50 rounded-bl-2xl" />
        <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-cyan-400/50 rounded-br-2xl" />

        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/20 blur-3xl rounded-full" />

        <div className="text-center relative">
          {/* Header */}
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
          >
            <Award className="w-20 h-20 mx-auto text-amber-400 mb-4" />
          </motion.div>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Certificate of Completion
          </h1>
          <p className="text-white/60 mb-8">
            Digital Productivity Tools Training
          </p>

          {/* Recipient */}
          <p className="text-white/50 mb-2">This is to certify that</p>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
            {name || 'Training Participant'}
          </h2>
          <p className="text-white/50 mb-8">
            has successfully completed the training on
          </p>

          {/* Tools */}
          <div className="flex justify-center gap-4 mb-8">
            {['Google Calendar', 'Trello', 'Asana'].map((tool) => (
              <span
                key={tool}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white/90 font-medium"
              >
                {tool}
              </span>
            ))}
          </div>

          {/* Score */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 rounded-full text-amber-400 font-bold mb-6">
            <Star className="w-5 h-5" />
            <span>{points} / {totalPoints} Points Earned</span>
          </div>

          {/* Date */}
          <p className="text-white/40 text-sm mb-8">
            Completed on {new Date(date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>

          {/* Actions */}
          <div className="flex justify-center gap-4">
            <motion.button
              onClick={onDownload}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-medium shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles size={18} />
              <span>Download Certificate</span>
            </motion.button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-white/10 text-white/80 rounded-xl font-medium hover:bg-white/20 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
