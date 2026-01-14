import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Trello,
  Trophy,
  Star,
  Zap,
  Target,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Clock,
  Award,
  Flame,
  GraduationCap,
  Play,
  RotateCcw,
  Mail,
  FileText,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { CalendarPractice } from './CalendarPractice';
import { TrelloPractice } from './TrelloPractice';
import { GmailPractice } from './GmailPractice';
import { DocsPractice } from './DocsPractice';

// Floating particles component
function FloatingParticles({ count = 20, isDark }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-1 h-1 rounded-full ${
            isDark ? 'bg-white/20' : 'bg-indigo-500/20'
          }`}
          initial={{
            x: Math.random() * 100 + '%',
            y: '100%',
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            y: '-100%',
            x: `calc(${Math.random() * 100}% + ${Math.sin(i) * 50}px)`,
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: 'linear',
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
}

// Animated gradient orb
function GradientOrb({ className, colors, delay = 0 }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      style={{ background: `linear-gradient(135deg, ${colors})` }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
        x: [0, 30, 0],
        y: [0, -20, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    />
  );
}

// Tool card for selection
function ToolCard({ tool, isSelected, onClick, progress, isDark }) {
  const icons = {
    calendar: Calendar,
    trello: Trello,
    gmail: Mail,
    docs: FileText,
  };
  const Icon = icons[tool.id];

  return (
    <motion.button
      onClick={onClick}
      className={`relative group w-full p-6 rounded-3xl border-2 transition-all duration-300 overflow-hidden ${
        isSelected
          ? isDark
            ? 'border-cyan-400 bg-cyan-500/10'
            : 'border-cyan-500 bg-cyan-50'
          : isDark
          ? 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg'
      }`}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Gradient background on hover */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
      />

      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

      <div className="relative flex items-start gap-4">
        {/* Icon */}
        <motion.div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${tool.gradient} shadow-lg`}
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
        >
          <Icon className="w-8 h-8 text-white" />
        </motion.div>

        <div className="flex-1 text-left">
          <h3
            className={`text-xl font-bold mb-1 ${
              isDark ? 'text-white' : 'text-slate-800'
            }`}
          >
            {tool.name}
          </h3>
          <p
            className={`text-sm mb-3 ${
              isDark ? 'text-white/60' : 'text-slate-500'
            }`}
          >
            {tool.description}
          </p>

          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <div
              className={`flex-1 h-2 rounded-full overflow-hidden ${
                isDark ? 'bg-white/10' : 'bg-slate-100'
              }`}
            >
              <motion.div
                className={`h-full bg-gradient-to-r ${tool.gradient}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
            <span
              className={`text-sm font-medium ${
                isDark ? 'text-white/80' : 'text-slate-600'
              }`}
            >
              {progress}%
            </span>
          </div>
        </div>

        {/* Arrow */}
        <motion.div
          className={`self-center ${isDark ? 'text-white/40' : 'text-slate-400'}`}
          animate={{ x: isSelected ? 5 : 0 }}
        >
          <ChevronRight className="w-6 h-6" />
        </motion.div>
      </div>

      {/* Completion badge */}
      {progress === 100 && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="absolute top-3 right-3"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <Trophy className="w-4 h-4 text-white" />
          </div>
        </motion.div>
      )}
    </motion.button>
  );
}

// Stats card
function StatCard({ icon: Icon, label, value, color, isDark }) {
  return (
    <motion.div
      className={`p-4 rounded-2xl border ${
        isDark
          ? 'bg-white/5 border-white/10'
          : 'bg-white border-slate-200 shadow-sm'
      }`}
      whileHover={{ scale: 1.05, y: -2 }}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${color}`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p
            className={`text-2xl font-bold ${
              isDark ? 'text-white' : 'text-slate-800'
            }`}
          >
            {value}
          </p>
          <p
            className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}
          >
            {label}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Achievement badge
function AchievementBadge({ achievement, isDark }) {
  return (
    <motion.div
      className={`relative p-3 rounded-xl border ${
        achievement.unlocked
          ? isDark
            ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/30'
            : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
          : isDark
          ? 'bg-white/5 border-white/10 opacity-50'
          : 'bg-slate-50 border-slate-200 opacity-50'
      }`}
      whileHover={{ scale: 1.05 }}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            achievement.unlocked
              ? 'bg-gradient-to-br from-amber-400 to-orange-500'
              : isDark
              ? 'bg-white/10'
              : 'bg-slate-200'
          }`}
        >
          {achievement.unlocked ? (
            <achievement.icon className="w-5 h-5 text-white" />
          ) : (
            <span className="text-lg">?</span>
          )}
        </div>
        <div>
          <p
            className={`text-sm font-medium ${
              isDark ? 'text-white' : 'text-slate-800'
            }`}
          >
            {achievement.unlocked ? achievement.name : '???'}
          </p>
          <p
            className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}
          >
            {achievement.unlocked ? achievement.description : 'Keep practicing!'}
          </p>
        </div>
      </div>

      {achievement.unlocked && (
        <motion.div
          className="absolute -top-1 -right-1"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
        </motion.div>
      )}
    </motion.div>
  );
}

// Main Practice Platform component
export function PracticePlatform() {
  const { isDark } = useTheme();
  const [selectedTool, setSelectedTool] = useState(null);
  const [practiceProgress, setPracticeProgress] = useState({
    calendar: { completed: 0, total: 5, challenges: [] },
    trello: { completed: 0, total: 5, challenges: [] },
    gmail: { completed: 0, total: 5, challenges: [] },
    docs: { completed: 0, total: 5, challenges: [] },
  });
  const [stats, setStats] = useState({
    totalPoints: 0,
    streak: 0,
    challengesCompleted: 0,
    timeSpent: 0,
  });
  const [achievements, setAchievements] = useState([
    { id: 1, name: 'First Steps', description: 'Complete your first challenge', icon: Star, unlocked: false },
    { id: 2, name: 'Calendar Pro', description: 'Master all calendar challenges', icon: Calendar, unlocked: false },
    { id: 3, name: 'Trello Master', description: 'Master all Trello challenges', icon: Trello, unlocked: false },
    { id: 4, name: 'Gmail Guru', description: 'Master all Gmail challenges', icon: Mail, unlocked: false },
    { id: 5, name: 'Docs Expert', description: 'Master all Docs challenges', icon: FileText, unlocked: false },
    { id: 6, name: 'Speed Demon', description: 'Complete a challenge in under 30s', icon: Zap, unlocked: false },
    { id: 7, name: 'Perfect Score', description: 'Get 100% on any challenge', icon: Target, unlocked: false },
    { id: 8, name: 'On Fire', description: 'Complete 3 challenges in a row', icon: Flame, unlocked: false },
  ]);

  const tools = [
    {
      id: 'calendar',
      name: 'Google Calendar',
      description: 'Master time blocking, event creation, and smart scheduling',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'trello',
      name: 'Trello',
      description: 'Learn board management, card workflows, and team collaboration',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      id: 'gmail',
      name: 'Gmail',
      description: 'Master email composition, organization, and inbox management',
      gradient: 'from-red-500 to-orange-500',
    },
    {
      id: 'docs',
      name: 'Google Docs',
      description: 'Learn document creation, formatting, and collaboration',
      gradient: 'from-green-500 to-emerald-500',
    },
  ];

  const handleChallengeComplete = useCallback((tool, challengeId, score, timeSpent) => {
    setPracticeProgress(prev => ({
      ...prev,
      [tool]: {
        ...prev[tool],
        completed: prev[tool].completed + 1,
        challenges: [...prev[tool].challenges, { id: challengeId, score, timeSpent }],
      },
    }));

    setStats(prev => ({
      ...prev,
      totalPoints: prev.totalPoints + score,
      challengesCompleted: prev.challengesCompleted + 1,
      timeSpent: prev.timeSpent + timeSpent,
    }));

    // Check for achievements
    setAchievements(prev => {
      const updated = [...prev];

      // First Steps
      if (!updated[0].unlocked) {
        updated[0].unlocked = true;
      }

      // Speed Demon
      if (timeSpent < 30 && !updated[3].unlocked) {
        updated[3].unlocked = true;
      }

      // Perfect Score
      if (score >= 100 && !updated[4].unlocked) {
        updated[4].unlocked = true;
      }

      return updated;
    });
  }, []);

  const getProgress = (toolId) => {
    const progress = practiceProgress[toolId];
    return Math.round((progress.completed / progress.total) * 100);
  };

  // Reset to hub
  const handleBackToHub = () => {
    setSelectedTool(null);
  };

  return (
    <div className="relative w-full min-h-[600px] rounded-3xl overflow-hidden">
      {/* Animated background */}
      <div
        className={`absolute inset-0 ${
          isDark
            ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900'
            : 'bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50'
        }`}
      >
        <GradientOrb
          className="w-96 h-96 -top-48 -left-48"
          colors={isDark ? '#6366f1, #8b5cf6' : '#c7d2fe, #ddd6fe'}
        />
        <GradientOrb
          className="w-80 h-80 -bottom-40 -right-40"
          colors={isDark ? '#06b6d4, #3b82f6' : '#a5f3fc, #bfdbfe'}
          delay={2}
        />
        <GradientOrb
          className="w-64 h-64 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          colors={isDark ? '#ec4899, #f97316' : '#fbcfe8, #fed7aa'}
          delay={4}
        />
        <FloatingParticles count={15} isDark={isDark} />
      </div>

      {/* Grid pattern */}
      <div
        className={`absolute inset-0 ${isDark ? 'opacity-5' : 'opacity-[0.02]'}`}
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${
            isDark ? 'white' : 'black'
          } 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8">
        <AnimatePresence mode="wait">
          {!selectedTool ? (
            // Hub View
            <motion.div
              key="hub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 mb-4"
                >
                  <GraduationCap className="w-5 h-5 text-cyan-400" />
                  <span
                    className={`text-sm font-medium ${
                      isDark ? 'text-cyan-300' : 'text-cyan-600'
                    }`}
                  >
                    Interactive Practice Lab
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`text-3xl md:text-4xl font-bold mb-3 ${
                    isDark ? 'text-white' : 'text-slate-800'
                  }`}
                >
                  Master Your{' '}
                  <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Productivity Tools
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className={`text-lg ${
                    isDark ? 'text-white/60' : 'text-slate-500'
                  }`}
                >
                  Practice with hands-on challenges and become a pro
                </motion.p>
              </div>

              {/* Stats Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
              >
                <StatCard
                  icon={Star}
                  label="Total Points"
                  value={stats.totalPoints}
                  color="from-amber-400 to-orange-500"
                  isDark={isDark}
                />
                <StatCard
                  icon={Flame}
                  label="Day Streak"
                  value={stats.streak}
                  color="from-red-400 to-pink-500"
                  isDark={isDark}
                />
                <StatCard
                  icon={Target}
                  label="Challenges"
                  value={stats.challengesCompleted}
                  color="from-emerald-400 to-cyan-500"
                  isDark={isDark}
                />
                <StatCard
                  icon={Clock}
                  label="Minutes"
                  value={Math.round(stats.timeSpent / 60)}
                  color="from-blue-400 to-indigo-500"
                  isDark={isDark}
                />
              </motion.div>

              {/* Tool Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4 mb-8"
              >
                <h2
                  className={`text-lg font-semibold ${
                    isDark ? 'text-white' : 'text-slate-800'
                  }`}
                >
                  Choose Your Practice
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {tools.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      isSelected={selectedTool === tool.id}
                      onClick={() => setSelectedTool(tool.id)}
                      progress={getProgress(tool.id)}
                      isDark={isDark}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Achievements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2
                    className={`text-lg font-semibold ${
                      isDark ? 'text-white' : 'text-slate-800'
                    }`}
                  >
                    Achievements
                  </h2>
                  <span
                    className={`text-sm ${
                      isDark ? 'text-white/50' : 'text-slate-500'
                    }`}
                  >
                    {achievements.filter((a) => a.unlocked).length}/{achievements.length} unlocked
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {achievements.map((achievement) => (
                    <AchievementBadge
                      key={achievement.id}
                      achievement={achievement}
                      isDark={isDark}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ) : (
            // Practice View
            <motion.div
              key="practice"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {/* Back button */}
              <motion.button
                onClick={handleBackToHub}
                className={`flex items-center gap-2 mb-6 px-4 py-2 rounded-xl transition-all ${
                  isDark
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
                whileHover={{ x: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Hub</span>
              </motion.button>

              {/* Practice Component */}
              {selectedTool === 'calendar' && (
                <CalendarPractice
                  onComplete={(challengeId, score, time) =>
                    handleChallengeComplete('calendar', challengeId, score, time)
                  }
                  progress={practiceProgress.calendar}
                />
              )}
              {selectedTool === 'trello' && (
                <TrelloPractice
                  onComplete={(challengeId, score, time) =>
                    handleChallengeComplete('trello', challengeId, score, time)
                  }
                  progress={practiceProgress.trello}
                />
              )}
              {selectedTool === 'gmail' && (
                <GmailPractice
                  onComplete={(challengeId, score, time) =>
                    handleChallengeComplete('gmail', challengeId, score, time)
                  }
                  progress={practiceProgress.gmail}
                />
              )}
              {selectedTool === 'docs' && (
                <DocsPractice
                  onComplete={(challengeId, score, time) =>
                    handleChallengeComplete('docs', challengeId, score, time)
                  }
                  progress={practiceProgress.docs}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
