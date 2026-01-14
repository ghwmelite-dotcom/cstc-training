import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Send,
  Inbox,
  Star,
  Archive,
  Trash2,
  Tag,
  Search,
  Plus,
  X,
  Check,
  Paperclip,
  Reply,
  ReplyAll,
  Forward,
  MoreVertical,
  RefreshCw,
  ChevronDown,
  Clock,
  AlertCircle,
  Zap,
  Target,
  Lightbulb,
  Play,
  RotateCcw,
  Trophy,
  Edit3,
  Filter,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

// Challenge configurations
const challenges = [
  {
    id: 1,
    title: 'Compose Your First Email',
    description: 'Click "Compose" and write an email with a subject and message',
    objective: 'Create and send an email',
    points: 100,
    hint: 'Click the Compose button in the top left',
    validation: (state) => state.sentEmails.length > 0,
  },
  {
    id: 2,
    title: 'Star an Important Email',
    description: 'Mark an email as important by clicking the star icon',
    objective: 'Star any email in your inbox',
    points: 125,
    hint: 'Click the star icon next to any email',
    validation: (state) => state.emails.some(e => e.starred),
  },
  {
    id: 3,
    title: 'Apply a Label',
    description: 'Organize an email by applying a colored label',
    objective: 'Add a label to any email',
    points: 150,
    hint: 'Select an email and click the label icon',
    validation: (state) => state.emails.some(e => e.labels && e.labels.length > 0),
  },
  {
    id: 4,
    title: 'Archive an Email',
    description: 'Clean up your inbox by archiving a read email',
    objective: 'Archive any email',
    points: 125,
    hint: 'Select an email and click the archive button',
    validation: (state) => state.archivedEmails.length > 0,
  },
  {
    id: 5,
    title: 'Reply to an Email',
    description: 'Open an email and send a reply',
    objective: 'Reply to any email in your inbox',
    points: 175,
    hint: 'Click on an email to open it, then click Reply',
    validation: (state) => state.replies.length > 0,
  },
];

// Label colors
const labelColors = [
  { id: 'red', name: 'Urgent', bg: 'bg-red-500', text: 'text-red-500' },
  { id: 'orange', name: 'Follow Up', bg: 'bg-orange-500', text: 'text-orange-500' },
  { id: 'yellow', name: 'Review', bg: 'bg-yellow-500', text: 'text-yellow-500' },
  { id: 'green', name: 'Complete', bg: 'bg-emerald-500', text: 'text-emerald-500' },
  { id: 'blue', name: 'Work', bg: 'bg-blue-500', text: 'text-blue-500' },
  { id: 'purple', name: 'Personal', bg: 'bg-purple-500', text: 'text-purple-500' },
];

// Sample emails
const sampleEmails = [
  {
    id: '1',
    from: 'Sarah Johnson',
    email: 'sarah.j@company.com',
    subject: 'Q4 Planning Meeting - Action Items',
    preview: 'Hi team, Following up on our planning meeting yesterday. Here are the key action items we discussed...',
    body: `Hi team,

Following up on our planning meeting yesterday. Here are the key action items we discussed:

1. Complete budget review by Friday
2. Schedule individual check-ins
3. Prepare Q4 presentation draft

Let me know if you have any questions!

Best,
Sarah`,
    date: 'Jan 14',
    time: '10:30 AM',
    read: false,
    starred: false,
    labels: [],
  },
  {
    id: '2',
    from: 'IT Support',
    email: 'support@company.com',
    subject: 'Password Reset Required',
    preview: 'Your password will expire in 7 days. Please update your password to maintain access to your account...',
    body: `Dear User,

Your password will expire in 7 days. Please update your password to maintain access to your account.

To reset your password:
1. Go to Settings > Security
2. Click "Change Password"
3. Follow the prompts

If you need assistance, contact IT Support.

Thank you,
IT Support Team`,
    date: 'Jan 13',
    time: '3:45 PM',
    read: true,
    starred: false,
    labels: [],
  },
  {
    id: '3',
    from: 'Marketing Team',
    email: 'marketing@company.com',
    subject: 'New Campaign Launch - Your Input Needed',
    preview: 'We are launching a new marketing campaign next month and would love your feedback on the draft materials...',
    body: `Hello!

We're launching a new marketing campaign next month and would love your feedback on the draft materials.

Please review the attached documents and share your thoughts by EOD Thursday.

Key areas to focus on:
- Messaging clarity
- Visual appeal
- Target audience alignment

Thanks for your help!

Marketing Team`,
    date: 'Jan 12',
    time: '9:15 AM',
    read: false,
    starred: false,
    labels: [],
  },
  {
    id: '4',
    from: 'HR Department',
    email: 'hr@company.com',
    subject: 'Benefits Enrollment Reminder',
    preview: 'This is a friendly reminder that open enrollment ends this Friday. Make sure to review and update your benefits...',
    body: `Dear Employee,

This is a friendly reminder that open enrollment ends this Friday, January 17th.

Please make sure to:
- Review your current benefits selections
- Make any necessary changes
- Confirm your beneficiary information

Log into the HR portal to complete your enrollment.

Questions? Contact HR at hr@company.com

Best regards,
HR Department`,
    date: 'Jan 11',
    time: '11:00 AM',
    read: true,
    starred: false,
    labels: [],
  },
];

// Compose Modal
function ComposeModal({ isOpen, onClose, onSend, replyTo, isDark }) {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCanClose(false);
      const timer = setTimeout(() => setCanClose(true), 150);

      if (replyTo) {
        setTo(replyTo.email);
        setSubject(`Re: ${replyTo.subject}`);
        setBody(`\n\n---\nOn ${replyTo.date}, ${replyTo.from} wrote:\n${replyTo.body}`);
      } else {
        setTo('');
        setSubject('');
        setBody('');
      }

      return () => clearTimeout(timer);
    }
  }, [isOpen, replyTo]);

  const handleSend = () => {
    if (!to.trim() || !subject.trim()) return;
    onSend({ to, subject, body, isReply: !!replyTo, replyToId: replyTo?.id });
    onClose();
  };

  const handleBackdropClick = (e) => {
    e.stopPropagation();
    if (canClose) onClose();
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          style={{ zIndex: 99999 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            className={`w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`px-4 py-3 flex items-center justify-between border-b ${
              isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'
            }`}>
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {replyTo ? 'Reply' : 'New Message'}
              </h3>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className={`p-1.5 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-white/10 text-white/60' : 'hover:bg-slate-200 text-slate-400'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>To:</span>
                <input
                  type="email"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="recipient@email.com"
                  className={`flex-1 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? 'bg-slate-700 text-white placeholder:text-white/40'
                      : 'bg-slate-100 text-slate-800 placeholder:text-slate-400'
                  }`}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Subject:</span>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Email subject"
                  className={`flex-1 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? 'bg-slate-700 text-white placeholder:text-white/40'
                      : 'bg-slate-100 text-slate-800 placeholder:text-slate-400'
                  }`}
                />
              </div>

              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your message..."
                rows={8}
                className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                  isDark
                    ? 'bg-slate-700 text-white placeholder:text-white/40'
                    : 'bg-slate-100 text-slate-800 placeholder:text-slate-400'
                }`}
              />
            </div>

            {/* Actions */}
            <div className={`px-4 py-3 flex items-center justify-between border-t ${
              isDark ? 'border-slate-700' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className={`p-2 rounded-lg transition-colors ${
                    isDark ? 'hover:bg-white/10 text-white/60' : 'hover:bg-slate-100 text-slate-400'
                  }`}
                >
                  <Paperclip className="w-5 h-5" />
                </button>
              </div>

              <motion.button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleSend(); }}
                disabled={!to.trim() || !subject.trim()}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all ${
                  to.trim() && subject.trim()
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
                whileHover={to.trim() && subject.trim() ? { scale: 1.02 } : {}}
                whileTap={to.trim() && subject.trim() ? { scale: 0.98 } : {}}
              >
                <Send className="w-4 h-4" />
                Send
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }
  return modalContent;
}

// Email View Modal
function EmailViewModal({ isOpen, onClose, email, onReply, onStar, onArchive, onLabel, isDark }) {
  const [canClose, setCanClose] = useState(false);
  const [showLabels, setShowLabels] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCanClose(false);
      setShowLabels(false);
      const timer = setTimeout(() => setCanClose(true), 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    e.stopPropagation();
    if (canClose) onClose();
  };

  if (!email) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          style={{ zIndex: 99999 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`w-full max-w-3xl max-h-[80vh] rounded-2xl shadow-2xl border overflow-hidden flex flex-col ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`px-6 py-4 border-b flex-shrink-0 ${
              isDark ? 'border-slate-700' : 'border-slate-200'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {email.subject}
                  </h2>
                  <div className="flex items-center gap-2 flex-wrap">
                    {email.labels?.map(labelId => {
                      const label = labelColors.find(l => l.id === labelId);
                      return label ? (
                        <span key={labelId} className={`text-xs px-2 py-0.5 rounded-full text-white ${label.bg}`}>
                          {label.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onClose(); }}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark ? 'hover:bg-white/10 text-white/60' : 'hover:bg-slate-100 text-slate-400'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Email Info */}
            <div className={`px-6 py-3 border-b flex items-center justify-between ${
              isDark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-100 bg-slate-50'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                  'bg-gradient-to-br from-blue-500 to-purple-500'
                }`}>
                  {email.from.charAt(0)}
                </div>
                <div>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>{email.from}</p>
                  <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>{email.email}</p>
                </div>
              </div>
              <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                {email.date} at {email.time}
              </p>
            </div>

            {/* Actions */}
            <div className={`px-6 py-2 border-b flex items-center gap-2 ${
              isDark ? 'border-slate-700' : 'border-slate-200'
            }`}>
              <motion.button
                type="button"
                onClick={(e) => { e.stopPropagation(); onReply(); }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isDark ? 'hover:bg-white/10 text-white/80' : 'hover:bg-slate-100 text-slate-600'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Reply className="w-4 h-4" />
                Reply
              </motion.button>

              <motion.button
                type="button"
                onClick={(e) => { e.stopPropagation(); onStar(); }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  email.starred
                    ? 'text-yellow-500'
                    : isDark ? 'hover:bg-white/10 text-white/80' : 'hover:bg-slate-100 text-slate-600'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Star className={`w-4 h-4 ${email.starred ? 'fill-yellow-500' : ''}`} />
                {email.starred ? 'Starred' : 'Star'}
              </motion.button>

              <motion.button
                type="button"
                onClick={(e) => { e.stopPropagation(); onArchive(); }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isDark ? 'hover:bg-white/10 text-white/80' : 'hover:bg-slate-100 text-slate-600'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Archive className="w-4 h-4" />
                Archive
              </motion.button>

              <div className="relative">
                <motion.button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setShowLabels(!showLabels); }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isDark ? 'hover:bg-white/10 text-white/80' : 'hover:bg-slate-100 text-slate-600'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Tag className="w-4 h-4" />
                  Label
                </motion.button>

                <AnimatePresence>
                  {showLabels && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`absolute top-full left-0 mt-1 py-2 rounded-xl shadow-xl border z-10 min-w-[150px] ${
                        isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {labelColors.map(label => (
                        <button
                          key={label.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onLabel(label.id);
                            setShowLabels(false);
                          }}
                          className={`w-full px-4 py-2 flex items-center gap-2 transition-colors ${
                            isDark ? 'hover:bg-white/10' : 'hover:bg-slate-50'
                          }`}
                        >
                          <span className={`w-3 h-3 rounded-full ${label.bg}`} />
                          <span className={`text-sm ${isDark ? 'text-white' : 'text-slate-700'}`}>{label.name}</span>
                          {email.labels?.includes(label.id) && (
                            <Check className="w-4 h-4 ml-auto text-emerald-500" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Body */}
            <div className={`flex-1 overflow-y-auto p-6 ${isDark ? 'text-white/90' : 'text-slate-700'}`}>
              <pre className="whitespace-pre-wrap font-sans">{email.body}</pre>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }
  return modalContent;
}

// Email Row Component
function EmailRow({ email, onSelect, onStar, isSelected, isDark }) {
  const handleClick = (e) => {
    e.stopPropagation();
    onSelect(email);
  };

  const handleStarClick = (e) => {
    e.stopPropagation();
    onStar(email.id);
  };

  return (
    <motion.div
      onClick={handleClick}
      className={`flex items-center gap-3 px-4 py-3 border-b cursor-pointer transition-all ${
        isSelected
          ? isDark ? 'bg-blue-500/20 border-blue-500/30' : 'bg-blue-50 border-blue-200'
          : !email.read
          ? isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
          : isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-100'
      } ${isDark ? 'hover:bg-slate-700/50' : 'hover:bg-slate-100'}`}
      whileHover={{ x: 2 }}
    >
      {/* Star */}
      <button
        type="button"
        onClick={handleStarClick}
        className={`flex-shrink-0 transition-colors ${
          email.starred ? 'text-yellow-500' : isDark ? 'text-white/30 hover:text-white/60' : 'text-slate-300 hover:text-slate-400'
        }`}
      >
        <Star className={`w-5 h-5 ${email.starred ? 'fill-yellow-500' : ''}`} />
      </button>

      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${
        'bg-gradient-to-br from-blue-500 to-purple-500'
      }`}>
        {email.from.charAt(0)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-medium truncate ${
            !email.read
              ? isDark ? 'text-white' : 'text-slate-900'
              : isDark ? 'text-white/70' : 'text-slate-600'
          }`}>
            {email.from}
          </span>
          {email.labels?.map(labelId => {
            const label = labelColors.find(l => l.id === labelId);
            return label ? (
              <span key={labelId} className={`w-2 h-2 rounded-full flex-shrink-0 ${label.bg}`} />
            ) : null;
          })}
        </div>
        <div className="flex items-center gap-2">
          <span className={`truncate ${
            !email.read
              ? isDark ? 'text-white/90 font-medium' : 'text-slate-800 font-medium'
              : isDark ? 'text-white/60' : 'text-slate-500'
          }`}>
            {email.subject}
          </span>
          <span className={`text-sm truncate ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
            - {email.preview}
          </span>
        </div>
      </div>

      {/* Date */}
      <span className={`text-sm flex-shrink-0 ${
        !email.read
          ? isDark ? 'text-white font-medium' : 'text-slate-800 font-medium'
          : isDark ? 'text-white/50' : 'text-slate-400'
      }`}>
        {email.date}
      </span>
    </motion.div>
  );
}

// Challenge Card
function ChallengeCard({ challenge, isActive, isCompleted, onStart, isDark }) {
  return (
    <motion.div
      className={`p-4 rounded-2xl border transition-all ${
        isActive
          ? isDark
            ? 'bg-blue-500/20 border-blue-500/50 ring-2 ring-blue-500/30'
            : 'bg-blue-50 border-blue-300 ring-2 ring-blue-200'
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
              ? 'bg-gradient-to-br from-blue-400 to-blue-600'
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
                className="flex items-center gap-1 text-blue-500 text-sm font-medium hover:text-blue-400"
                whileHover={{ x: 3 }}
              >
                <Play className="w-4 h-4" />
                Start
              </motion.button>
            )}

            {isActive && (
              <span className="flex items-center gap-1 text-blue-400 text-sm font-medium animate-pulse">
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

// Main Gmail Practice Component
export function GmailPractice({ onComplete, progress }) {
  const { isDark } = useTheme();
  const [emails, setEmails] = useState(sampleEmails);
  const [sentEmails, setSentEmails] = useState([]);
  const [archivedEmails, setArchivedEmails] = useState([]);
  const [replies, setReplies] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showCompose, setShowCompose] = useState(false);
  const [showEmailView, setShowEmailView] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successChallenge, setSuccessChallenge] = useState(null);
  const [completionQueue, setCompletionQueue] = useState([]);
  const [activeFolder, setActiveFolder] = useState('inbox');
  const successTimeoutRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  // Get current state for validation
  const getCurrentState = useCallback(() => ({
    emails,
    sentEmails,
    archivedEmails,
    replies,
  }), [emails, sentEmails, archivedEmails, replies]);

  // Handle showing next challenge completion
  const showNextCompletion = useCallback(() => {
    setCompletionQueue(prev => {
      if (prev.length === 0) return prev;

      const [next, ...rest] = prev;
      setSuccessChallenge(next);
      setShowSuccess(true);

      onComplete?.(next.id, next.points, 0);

      successTimeoutRef.current = setTimeout(() => {
        setShowSuccess(false);
        setSuccessChallenge(null);

        if (rest.length > 0) {
          setTimeout(() => showNextCompletion(), 300);
        }
      }, 2000);

      return rest;
    });
  }, [onComplete]);

  // Auto-validate all challenges
  useEffect(() => {
    if (showSuccess) return;

    const state = getCurrentState();
    const newlyCompleted = challenges.filter(challenge => {
      if (completedChallenges.includes(challenge.id)) return false;

      try {
        const isComplete = challenge.validation(state);
        console.log(`Auto-checking Gmail challenge ${challenge.id} (${challenge.title}):`, isComplete);
        return isComplete;
      } catch (err) {
        console.error(`Validation error for Gmail challenge ${challenge.id}:`, err);
        return false;
      }
    });

    if (newlyCompleted.length > 0) {
      console.log('Newly completed Gmail challenges:', newlyCompleted.map(c => c.title));
      setCompletedChallenges(prev => [...prev, ...newlyCompleted.map(c => c.id)]);
      setCompletionQueue(prev => [...prev, ...newlyCompleted]);
    }
  }, [emails, sentEmails, archivedEmails, replies, completedChallenges, showSuccess, getCurrentState]);

  // Process completion queue
  useEffect(() => {
    if (completionQueue.length > 0 && !showSuccess) {
      showNextCompletion();
    }
  }, [completionQueue, showSuccess, showNextCompletion]);

  // Send email
  const handleSendEmail = (emailData) => {
    if (emailData.isReply) {
      setReplies(prev => [...prev, { ...emailData, id: Date.now(), date: new Date().toLocaleDateString() }]);
    } else {
      setSentEmails(prev => [...prev, { ...emailData, id: Date.now(), date: new Date().toLocaleDateString() }]);
    }
    setReplyTo(null);
  };

  // Star email
  const handleStarEmail = (emailId) => {
    setEmails(prev =>
      prev.map(e => e.id === emailId ? { ...e, starred: !e.starred } : e)
    );
  };

  // Archive email
  const handleArchiveEmail = (emailId) => {
    const email = emails.find(e => e.id === emailId);
    if (email) {
      setArchivedEmails(prev => [...prev, email]);
      setEmails(prev => prev.filter(e => e.id !== emailId));
      setShowEmailView(false);
      setSelectedEmail(null);
    }
  };

  // Add label to email
  const handleLabelEmail = (emailId, labelId) => {
    setEmails(prev =>
      prev.map(e => {
        if (e.id === emailId) {
          const hasLabel = e.labels?.includes(labelId);
          return {
            ...e,
            labels: hasLabel
              ? e.labels.filter(l => l !== labelId)
              : [...(e.labels || []), labelId]
          };
        }
        return e;
      })
    );
  };

  // Open email
  const handleOpenEmail = (email) => {
    setSelectedEmail(email);
    setShowEmailView(true);
    // Mark as read
    setEmails(prev =>
      prev.map(e => e.id === email.id ? { ...e, read: true } : e)
    );
  };

  // Reply to email
  const handleReply = () => {
    setReplyTo(selectedEmail);
    setShowEmailView(false);
    setShowCompose(true);
  };

  // Start challenge
  const handleStartChallenge = useCallback((challenge) => {
    setActiveChallenge(challenge);
    setShowHint(false);
  }, []);

  // Reset
  const handleReset = () => {
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
    }
    setEmails(sampleEmails);
    setSentEmails([]);
    setArchivedEmails([]);
    setReplies([]);
    setSelectedEmail(null);
    setActiveChallenge(null);
    setCompletedChallenges([]);
    setCompletionQueue([]);
    setShowSuccess(false);
    setSuccessChallenge(null);
  };

  // Get displayed emails based on folder
  const displayedEmails = activeFolder === 'inbox' ? emails :
    activeFolder === 'starred' ? emails.filter(e => e.starred) :
    activeFolder === 'sent' ? sentEmails :
    activeFolder === 'archived' ? archivedEmails : emails;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Gmail Practice
          </h2>
          <p className={`${isDark ? 'text-white/60' : 'text-slate-500'}`}>
            Master email management and communication
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

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Email Client */}
        <div className="lg:col-span-3">
          <div className={`rounded-2xl overflow-hidden border ${
            isDark ? 'border-white/10' : 'border-slate-200'
          }`}>
            {/* Toolbar */}
            <div className={`px-4 py-3 flex items-center gap-4 border-b ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <motion.button
                onClick={(e) => { e.stopPropagation(); setShowCompose(true); }}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="w-5 h-5" />
                Compose
              </motion.button>

              <div className={`flex-1 flex items-center gap-2 px-4 py-2 rounded-xl ${
                isDark ? 'bg-slate-700' : 'bg-slate-100'
              }`}>
                <Search className={`w-5 h-5 ${isDark ? 'text-white/40' : 'text-slate-400'}`} />
                <input
                  type="text"
                  placeholder="Search emails..."
                  className={`flex-1 bg-transparent focus:outline-none ${
                    isDark ? 'text-white placeholder:text-white/40' : 'text-slate-800 placeholder:text-slate-400'
                  }`}
                />
              </div>

              <button className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-white/10 text-white/60' : 'hover:bg-slate-100 text-slate-400'
              }`}>
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>

            {/* Sidebar + Email List */}
            <div className="flex">
              {/* Sidebar */}
              <div className={`w-48 border-r flex-shrink-0 ${
                isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}>
                {[
                  { id: 'inbox', icon: Inbox, label: 'Inbox', count: emails.filter(e => !e.read).length },
                  { id: 'starred', icon: Star, label: 'Starred', count: emails.filter(e => e.starred).length },
                  { id: 'sent', icon: Send, label: 'Sent', count: sentEmails.length },
                  { id: 'archived', icon: Archive, label: 'Archived', count: archivedEmails.length },
                ].map(folder => (
                  <button
                    key={folder.id}
                    onClick={() => setActiveFolder(folder.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                      activeFolder === folder.id
                        ? isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'
                        : isDark ? 'text-white/70 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <folder.icon className="w-5 h-5" />
                    <span className="flex-1 text-left text-sm font-medium">{folder.label}</span>
                    {folder.count > 0 && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        activeFolder === folder.id
                          ? 'bg-blue-500 text-white'
                          : isDark ? 'bg-white/10 text-white/60' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {folder.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Email List */}
              <div className={`flex-1 min-h-[400px] ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                {displayedEmails.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-12">
                    <Mail className={`w-12 h-12 mb-4 ${isDark ? 'text-white/20' : 'text-slate-300'}`} />
                    <p className={`text-sm ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                      No emails in this folder
                    </p>
                  </div>
                ) : (
                  displayedEmails.map(email => (
                    <EmailRow
                      key={email.id}
                      email={email}
                      onSelect={handleOpenEmail}
                      onStar={handleStarEmail}
                      isSelected={selectedEmail?.id === email.id}
                      isDark={isDark}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Challenges Sidebar */}
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
                    ? 'bg-blue-500/10 border-blue-500/50'
                    : 'bg-blue-50 border-blue-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
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
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                initial={{ width: 0 }}
                animate={{ width: `${(completedChallenges.length / challenges.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Compose Modal */}
      <ComposeModal
        isOpen={showCompose}
        onClose={() => { setShowCompose(false); setReplyTo(null); }}
        onSend={handleSendEmail}
        replyTo={replyTo}
        isDark={isDark}
      />

      {/* Email View Modal */}
      <EmailViewModal
        isOpen={showEmailView}
        onClose={() => setShowEmailView(false)}
        email={selectedEmail}
        onReply={handleReply}
        onStar={() => handleStarEmail(selectedEmail?.id)}
        onArchive={() => handleArchiveEmail(selectedEmail?.id)}
        onLabel={(labelId) => handleLabelEmail(selectedEmail?.id, labelId)}
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
                <span className="text-xl font-bold">+{successChallenge?.points || 0} points</span>
              </motion.div>
            </div>

            {/* Confetti */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#06b6d4'][i % 5],
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
