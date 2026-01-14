import { useState, useEffect, useRef } from 'react';
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

// Completion Certificate - Enhanced with proper download and responsive design
export function CompletionCertificate({ name, date, points, totalPoints, onClose }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const certificateRef = useRef(null);

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const displayName = name || 'Training Participant';

  const handleDownload = () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      // Create canvas manually for reliable certificate generation
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Set canvas size (A4-ish proportions)
      const width = 800;
      const height = 600;
      canvas.width = width * 2; // 2x for retina quality
      canvas.height = height * 2;
      ctx.scale(2, 2);

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(0.5, '#1e1b4b');
      gradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Border
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 3;
      ctx.strokeRect(20, 20, width - 40, height - 40);

      // Inner border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.strokeRect(40, 40, width - 80, height - 80);

      // Corner decorations
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2;
      // Top left
      ctx.beginPath();
      ctx.moveTo(30, 70);
      ctx.lineTo(30, 30);
      ctx.lineTo(70, 30);
      ctx.stroke();
      // Top right
      ctx.beginPath();
      ctx.moveTo(width - 70, 30);
      ctx.lineTo(width - 30, 30);
      ctx.lineTo(width - 30, 70);
      ctx.stroke();

      ctx.strokeStyle = '#a855f7';
      // Bottom left
      ctx.beginPath();
      ctx.moveTo(30, height - 70);
      ctx.lineTo(30, height - 30);
      ctx.lineTo(70, height - 30);
      ctx.stroke();
      // Bottom right
      ctx.beginPath();
      ctx.moveTo(width - 70, height - 30);
      ctx.lineTo(width - 30, height - 30);
      ctx.lineTo(width - 30, height - 70);
      ctx.stroke();

      // Award icon (simple star)
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      const starX = width / 2;
      const starY = 85;
      const starSize = 30;
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const x = starX + Math.cos(angle) * starSize;
        const y = starY + Math.sin(angle) * starSize;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();

      // Title
      ctx.fillStyle = '#22d3ee';
      ctx.font = 'bold 32px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Certificate of Completion', width / 2, 150);

      // Subtitle
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '16px Arial, sans-serif';
      ctx.fillText('Digital Productivity Tools Training', width / 2, 180);

      // Divider line
      const dividerGradient = ctx.createLinearGradient(width / 2 - 80, 0, width / 2 + 80, 0);
      dividerGradient.addColorStop(0, '#22d3ee');
      dividerGradient.addColorStop(0.5, '#a855f7');
      dividerGradient.addColorStop(1, '#ec4899');
      ctx.strokeStyle = dividerGradient;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 80, 205);
      ctx.lineTo(width / 2 + 80, 205);
      ctx.stroke();

      // "This is to certify that"
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '16px Arial, sans-serif';
      ctx.fillText('This is to certify that', width / 2, 250);

      // Participant name
      ctx.fillStyle = '#a855f7';
      ctx.font = 'bold 36px Arial, sans-serif';
      ctx.fillText(displayName, width / 2, 295);

      // "has successfully completed"
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '16px Arial, sans-serif';
      ctx.fillText('has successfully completed the training on', width / 2, 335);

      // Tools
      const tools = ['Google Calendar', 'Trello', 'Gmail', 'Google Docs'];
      const toolsText = tools.join('  •  ');
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = '14px Arial, sans-serif';
      ctx.fillText(toolsText, width / 2, 380);

      // Points
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 18px Arial, sans-serif';
      ctx.fillText(`★ ${points} / ${totalPoints} Points Earned`, width / 2, 430);

      // Date
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '14px Arial, sans-serif';
      ctx.fillText(`Completed on ${formattedDate}`, width / 2, 470);

      // Footer line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(100, 510);
      ctx.lineTo(width - 100, 510);
      ctx.stroke();

      // Footer text
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '12px Arial, sans-serif';
      ctx.fillText('Civil Service Training Centre • Productivity Tools Training Program', width / 2, 540);

      // Download the canvas
      const link = document.createElement('a');
      const safeName = displayName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_') || 'Participant';
      link.download = `Certificate_${safeName}_${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      setIsDownloading(false);

    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Error generating certificate. Please take a screenshot instead.');
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative my-4 sm:my-8 w-full max-w-[95vw] sm:max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Certificate Content - This is what gets downloaded */}
        <div
          ref={certificateRef}
          data-certificate="true"
          className="relative rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8 md:p-12 w-full border-2 border-purple-500/30"
          style={{
            background: '#0f172a',
            backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
          }}
        >
          {/* Decorative corners - hidden on very small screens */}
          <div className="hidden sm:block absolute top-4 left-4 w-12 sm:w-16 h-12 sm:h-16 border-l-2 border-t-2 border-cyan-400 rounded-tl-2xl" />
          <div className="hidden sm:block absolute top-4 right-4 w-12 sm:w-16 h-12 sm:h-16 border-r-2 border-t-2 border-purple-400 rounded-tr-2xl" />
          <div className="hidden sm:block absolute bottom-4 left-4 w-12 sm:w-16 h-12 sm:h-16 border-l-2 border-b-2 border-purple-400 rounded-bl-2xl" />
          <div className="hidden sm:block absolute bottom-4 right-4 w-12 sm:w-16 h-12 sm:h-16 border-r-2 border-b-2 border-cyan-400 rounded-br-2xl" />

          {/* Inner border - hidden on mobile */}
          <div className="hidden sm:block absolute inset-6 sm:inset-8 border border-white/10 rounded-xl sm:rounded-2xl pointer-events-none" />

          <div className="text-center relative">
            {/* Logo/Icon */}
            <div className="mb-4 sm:mb-6">
              <Award
                className="w-14 h-14 sm:w-20 sm:h-20 mx-auto text-amber-400"
                style={{ filter: 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.5))' }}
              />
            </div>

            {/* Title */}
            <h1
              className="text-xl sm:text-3xl md:text-4xl font-bold text-cyan-400 mb-1 sm:mb-2"
              style={{ textShadow: '0 0 20px rgba(34, 211, 238, 0.3)' }}
            >
              Certificate of Completion
            </h1>
            <p className="text-white/60 mb-4 sm:mb-8 text-sm sm:text-lg">
              Digital Productivity Tools Training
            </p>

            {/* Divider */}
            <div
              className="w-20 sm:w-32 h-1 mx-auto mb-4 sm:mb-8 rounded-full"
              style={{ background: 'linear-gradient(90deg, #22d3ee, #a855f7, #ec4899)' }}
            />

            {/* Recipient */}
            <p className="text-white/60 mb-2 sm:mb-3 text-sm sm:text-lg">This is to certify that</p>
            <h2
              className="text-2xl sm:text-4xl md:text-5xl font-bold text-purple-400 mb-2 sm:mb-3 break-words px-2"
              style={{ textShadow: '0 0 20px rgba(168, 85, 247, 0.4)' }}
            >
              {displayName}
            </h2>
            <p className="text-white/60 mb-4 sm:mb-8 text-sm sm:text-lg">
              has successfully completed the training on
            </p>

            {/* Tools */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-4 sm:mb-8 px-2">
              {['Google Calendar', 'Trello', 'Gmail', 'Google Docs'].map((tool) => (
                <span
                  key={tool}
                  className="px-2 sm:px-4 py-1 sm:py-2 rounded-full border border-white/30 text-white font-medium text-xs sm:text-sm"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                >
                  {tool}
                </span>
              ))}
            </div>

            {/* Score */}
            <div
              className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-full text-amber-400 font-bold mb-4 sm:mb-6 border border-amber-400/50 text-sm sm:text-base"
              style={{ backgroundColor: 'rgba(251, 191, 36, 0.15)' }}
            >
              <Star className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{points} / {totalPoints} Points</span>
            </div>

            {/* Date */}
            <p className="text-white/50 text-xs sm:text-sm mb-4">
              Completed on {formattedDate}
            </p>

            {/* Footer */}
            <div className="mt-4 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10">
              <p className="text-white/40 text-[10px] sm:text-xs">
                Civil Service Training Centre &bull; Productivity Tools Training Program
              </p>
            </div>
          </div>
        </div>

        {/* Actions - Outside the downloadable area */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-4 sm:mt-6 px-2">
          <motion.button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-medium shadow-lg disabled:opacity-70 w-full sm:w-auto"
            whileHover={{ scale: isDownloading ? 1 : 1.02 }}
            whileTap={{ scale: isDownloading ? 1 : 0.98 }}
          >
            {isDownloading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Download Certificate</span>
              </>
            )}
          </motion.button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white/10 text-white/80 rounded-xl font-medium hover:bg-white/20 transition-colors w-full sm:w-auto"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
