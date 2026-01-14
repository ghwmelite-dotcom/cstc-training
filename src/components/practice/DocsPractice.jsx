import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  Image,
  MessageSquare,
  Undo,
  Redo,
  Type,
  ChevronDown,
  Plus,
  X,
  Check,
  Star,
  Zap,
  Target,
  Lightbulb,
  Play,
  RotateCcw,
  Trophy,
  Users,
  Share2,
  Download,
  Printer,
  MoreVertical,
  Heading1,
  Heading2,
  Heading3,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

// Challenge configurations
const challenges = [
  {
    id: 1,
    title: 'Start Writing',
    description: 'Click on the document and type at least 10 characters',
    objective: 'Write some text in the document',
    points: 100,
    hint: 'Click anywhere in the document area and start typing',
    validation: (state) => state.content.length >= 10,
  },
  {
    id: 2,
    title: 'Format Your Text',
    description: 'Make some text bold using the toolbar or Ctrl+B',
    objective: 'Apply bold formatting to text',
    points: 125,
    hint: 'Select text and click the Bold button or press Ctrl+B',
    validation: (state) => state.formatHistory.includes('bold'),
  },
  {
    id: 3,
    title: 'Add a Heading',
    description: 'Create a heading to organize your document',
    objective: 'Apply heading style to text',
    points: 150,
    hint: 'Select text and choose a heading from the style dropdown',
    validation: (state) => state.formatHistory.some(f => f.startsWith('heading')),
  },
  {
    id: 4,
    title: 'Create a List',
    description: 'Add a bulleted or numbered list',
    objective: 'Create a list in your document',
    points: 125,
    hint: 'Click the list button in the toolbar',
    validation: (state) => state.formatHistory.includes('bullet') || state.formatHistory.includes('numbered'),
  },
  {
    id: 5,
    title: 'Add a Comment',
    description: 'Select text and add a comment for collaboration',
    objective: 'Add a comment to the document',
    points: 175,
    hint: 'Select text and click the comment button, or press Ctrl+Alt+M',
    validation: (state) => state.comments.length > 0,
  },
];

// Comment Modal
function CommentModal({ isOpen, onClose, onSave, selectedText, isDark }) {
  const [comment, setComment] = useState('');
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCanClose(false);
      setComment('');
      const timer = setTimeout(() => setCanClose(true), 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!comment.trim()) return;
    onSave({ text: selectedText, comment: comment.trim(), id: Date.now(), author: 'You', resolved: false });
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
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          style={{ zIndex: 99999 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`px-4 py-3 flex items-center justify-between border-b ${
              isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <MessageSquare className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  Add Comment
                </h3>
              </div>
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

            <div className="p-4 space-y-4">
              {/* Selected text preview */}
              {selectedText && (
                <div className={`p-3 rounded-lg border-l-4 border-blue-500 ${
                  isDark ? 'bg-slate-700/50' : 'bg-blue-50'
                }`}>
                  <p className={`text-sm italic ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                    "{selectedText}"
                  </p>
                </div>
              )}

              {/* Comment input */}
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                  Your comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Type your comment..."
                  rows={3}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                    isDark
                      ? 'bg-slate-700 border-slate-600 text-white placeholder:text-white/40'
                      : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400'
                  }`}
                  autoFocus
                />
              </div>
            </div>

            {/* Actions */}
            <div className={`px-4 py-3 flex justify-end gap-2 border-t ${
              isDark ? 'border-slate-700' : 'border-slate-200'
            }`}>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDark
                    ? 'bg-slate-700 text-white/80 hover:bg-slate-600'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Cancel
              </button>
              <motion.button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleSave(); }}
                disabled={!comment.trim()}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  comment.trim()
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
                whileHover={comment.trim() ? { scale: 1.02 } : {}}
                whileTap={comment.trim() ? { scale: 0.98 } : {}}
              >
                <MessageSquare className="w-4 h-4" />
                Add Comment
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

// Toolbar Button Component
function ToolbarButton({ icon: Icon, label, active, onClick, isDark }) {
  return (
    <motion.button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`p-2 rounded-lg transition-colors ${
        active
          ? isDark ? 'bg-blue-500/30 text-blue-400' : 'bg-blue-100 text-blue-600'
          : isDark ? 'hover:bg-white/10 text-white/70' : 'hover:bg-slate-100 text-slate-600'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={label}
    >
      <Icon className="w-5 h-5" />
    </motion.button>
  );
}

// Challenge Card
function ChallengeCard({ challenge, isActive, isCompleted, onStart, isDark }) {
  return (
    <motion.div
      className={`p-4 rounded-2xl border transition-all ${
        isActive
          ? isDark
            ? 'bg-green-500/20 border-green-500/50 ring-2 ring-green-500/30'
            : 'bg-green-50 border-green-300 ring-2 ring-green-200'
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
              ? 'bg-gradient-to-br from-green-400 to-green-600'
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
                className="flex items-center gap-1 text-green-500 text-sm font-medium hover:text-green-400"
                whileHover={{ x: 3 }}
              >
                <Play className="w-4 h-4" />
                Start
              </motion.button>
            )}

            {isActive && (
              <span className="flex items-center gap-1 text-green-400 text-sm font-medium animate-pulse">
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

// Main Docs Practice Component
export function DocsPractice({ onComplete, progress }) {
  const { isDark } = useTheme();
  const [content, setContent] = useState('');
  const [formatHistory, setFormatHistory] = useState([]);
  const [comments, setComments] = useState([]);
  const [selectedText, setSelectedText] = useState('');
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successChallenge, setSuccessChallenge] = useState(null);
  const [completionQueue, setCompletionQueue] = useState([]);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    align: 'left',
    list: null,
    heading: null,
  });
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const editorRef = useRef(null);
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
    content,
    formatHistory,
    comments,
  }), [content, formatHistory, comments]);

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
        console.log(`Auto-checking Docs challenge ${challenge.id} (${challenge.title}):`, isComplete);
        return isComplete;
      } catch (err) {
        console.error(`Validation error for Docs challenge ${challenge.id}:`, err);
        return false;
      }
    });

    if (newlyCompleted.length > 0) {
      console.log('Newly completed Docs challenges:', newlyCompleted.map(c => c.title));
      setCompletedChallenges(prev => [...prev, ...newlyCompleted.map(c => c.id)]);
      setCompletionQueue(prev => [...prev, ...newlyCompleted]);
    }
  }, [content, formatHistory, comments, completedChallenges, showSuccess, getCurrentState]);

  // Process completion queue
  useEffect(() => {
    if (completionQueue.length > 0 && !showSuccess) {
      showNextCompletion();
    }
  }, [completionQueue, showSuccess, showNextCompletion]);

  // Apply formatting
  const applyFormat = (format) => {
    // Record the format in history
    if (!formatHistory.includes(format)) {
      setFormatHistory(prev => [...prev, format]);
    }

    // Toggle active state
    if (format === 'bold' || format === 'italic' || format === 'underline') {
      setActiveFormats(prev => ({ ...prev, [format]: !prev[format] }));
    } else if (format === 'bullet' || format === 'numbered') {
      setActiveFormats(prev => ({ ...prev, list: prev.list === format ? null : format }));
    } else if (format.startsWith('heading')) {
      setActiveFormats(prev => ({ ...prev, heading: format }));
      setShowHeadingMenu(false);
    } else if (format === 'left' || format === 'center' || format === 'right') {
      setActiveFormats(prev => ({ ...prev, align: format }));
    }
  };

  // Handle text selection
  const handleTextSelect = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim());
    }
  };

  // Add comment
  const handleAddComment = (commentData) => {
    setComments(prev => [...prev, commentData]);
  };

  // Open comment modal
  const openCommentModal = () => {
    if (selectedText) {
      setShowCommentModal(true);
    }
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
    setContent('');
    setFormatHistory([]);
    setComments([]);
    setSelectedText('');
    setActiveChallenge(null);
    setCompletedChallenges([]);
    setCompletionQueue([]);
    setShowSuccess(false);
    setSuccessChallenge(null);
    setActiveFormats({
      bold: false,
      italic: false,
      underline: false,
      align: 'left',
      list: null,
      heading: null,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Google Docs Practice
          </h2>
          <p className={`${isDark ? 'text-white/60' : 'text-slate-500'}`}>
            Master document creation and collaboration
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
        {/* Document Editor */}
        <div className="lg:col-span-3">
          <div className={`rounded-2xl overflow-hidden border ${
            isDark ? 'border-white/10' : 'border-slate-200'
          }`}>
            {/* Document Header */}
            <div className={`px-4 py-2 flex items-center gap-4 border-b ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <input
                    type="text"
                    defaultValue="Untitled Document"
                    className={`font-semibold bg-transparent focus:outline-none focus:border-b-2 focus:border-blue-500 ${
                      isDark ? 'text-white' : 'text-slate-800'
                    }`}
                  />
                  <div className="flex items-center gap-2 text-xs">
                    <span className={isDark ? 'text-white/50' : 'text-slate-400'}>File</span>
                    <span className={isDark ? 'text-white/50' : 'text-slate-400'}>Edit</span>
                    <span className={isDark ? 'text-white/50' : 'text-slate-400'}>View</span>
                    <span className={isDark ? 'text-white/50' : 'text-slate-400'}>Insert</span>
                    <span className={isDark ? 'text-white/50' : 'text-slate-400'}>Format</span>
                  </div>
                </div>
              </div>

              <div className="flex-1" />

              <motion.button
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-medium shadow-lg shadow-blue-500/25"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Share2 className="w-4 h-4" />
                Share
              </motion.button>
            </div>

            {/* Toolbar */}
            <div className={`px-4 py-2 flex items-center gap-1 border-b flex-wrap ${
              isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}>
              {/* Undo/Redo */}
              <ToolbarButton icon={Undo} label="Undo" onClick={() => {}} isDark={isDark} />
              <ToolbarButton icon={Redo} label="Redo" onClick={() => {}} isDark={isDark} />

              <div className={`w-px h-6 mx-1 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />

              {/* Heading dropdown */}
              <div className="relative">
                <motion.button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setShowHeadingMenu(!showHeadingMenu); }}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    isDark ? 'hover:bg-white/10 text-white/70' : 'hover:bg-slate-100 text-slate-600'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <Type className="w-4 h-4" />
                  <span>{activeFormats.heading ? activeFormats.heading.replace('heading', 'Heading ') : 'Normal'}</span>
                  <ChevronDown className="w-4 h-4" />
                </motion.button>

                <AnimatePresence>
                  {showHeadingMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`absolute top-full left-0 mt-1 py-2 rounded-xl shadow-xl border z-20 min-w-[150px] ${
                        isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {[
                        { id: 'normal', label: 'Normal text', icon: Type },
                        { id: 'heading1', label: 'Heading 1', icon: Heading1 },
                        { id: 'heading2', label: 'Heading 2', icon: Heading2 },
                        { id: 'heading3', label: 'Heading 3', icon: Heading3 },
                      ].map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            applyFormat(item.id);
                          }}
                          className={`w-full px-4 py-2 flex items-center gap-2 transition-colors text-left ${
                            isDark ? 'hover:bg-white/10' : 'hover:bg-slate-50'
                          }`}
                        >
                          <item.icon className={`w-4 h-4 ${isDark ? 'text-white/60' : 'text-slate-400'}`} />
                          <span className={`text-sm ${isDark ? 'text-white' : 'text-slate-700'}`}>{item.label}</span>
                          {activeFormats.heading === item.id && (
                            <Check className="w-4 h-4 ml-auto text-blue-500" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className={`w-px h-6 mx-1 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />

              {/* Text formatting */}
              <ToolbarButton
                icon={Bold}
                label="Bold (Ctrl+B)"
                active={activeFormats.bold}
                onClick={() => applyFormat('bold')}
                isDark={isDark}
              />
              <ToolbarButton
                icon={Italic}
                label="Italic (Ctrl+I)"
                active={activeFormats.italic}
                onClick={() => applyFormat('italic')}
                isDark={isDark}
              />
              <ToolbarButton
                icon={Underline}
                label="Underline (Ctrl+U)"
                active={activeFormats.underline}
                onClick={() => applyFormat('underline')}
                isDark={isDark}
              />

              <div className={`w-px h-6 mx-1 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />

              {/* Alignment */}
              <ToolbarButton
                icon={AlignLeft}
                label="Align left"
                active={activeFormats.align === 'left'}
                onClick={() => applyFormat('left')}
                isDark={isDark}
              />
              <ToolbarButton
                icon={AlignCenter}
                label="Align center"
                active={activeFormats.align === 'center'}
                onClick={() => applyFormat('center')}
                isDark={isDark}
              />
              <ToolbarButton
                icon={AlignRight}
                label="Align right"
                active={activeFormats.align === 'right'}
                onClick={() => applyFormat('right')}
                isDark={isDark}
              />

              <div className={`w-px h-6 mx-1 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />

              {/* Lists */}
              <ToolbarButton
                icon={List}
                label="Bulleted list"
                active={activeFormats.list === 'bullet'}
                onClick={() => applyFormat('bullet')}
                isDark={isDark}
              />
              <ToolbarButton
                icon={ListOrdered}
                label="Numbered list"
                active={activeFormats.list === 'numbered'}
                onClick={() => applyFormat('numbered')}
                isDark={isDark}
              />

              <div className={`w-px h-6 mx-1 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />

              {/* Insert */}
              <ToolbarButton icon={Link} label="Insert link" onClick={() => {}} isDark={isDark} />
              <ToolbarButton icon={Image} label="Insert image" onClick={() => {}} isDark={isDark} />
              <ToolbarButton
                icon={MessageSquare}
                label="Add comment"
                onClick={openCommentModal}
                isDark={isDark}
              />
            </div>

            {/* Editor Area */}
            <div className={`flex ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
              {/* Document */}
              <div
                className={`flex-1 min-h-[500px] p-8 ${isDark ? 'bg-slate-800' : 'bg-white'}`}
                style={{ margin: '20px auto', maxWidth: '816px', minHeight: '500px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}
              >
                <textarea
                  ref={editorRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onSelect={handleTextSelect}
                  placeholder="Start typing here..."
                  className={`w-full h-full min-h-[450px] resize-none focus:outline-none text-lg leading-relaxed ${
                    isDark
                      ? 'bg-transparent text-white placeholder:text-white/30'
                      : 'bg-transparent text-slate-800 placeholder:text-slate-300'
                  } ${activeFormats.bold ? 'font-bold' : ''} ${activeFormats.italic ? 'italic' : ''} ${activeFormats.underline ? 'underline' : ''}`}
                  style={{
                    textAlign: activeFormats.align,
                    fontSize: activeFormats.heading === 'heading1' ? '2rem' :
                              activeFormats.heading === 'heading2' ? '1.5rem' :
                              activeFormats.heading === 'heading3' ? '1.25rem' : '1rem',
                    fontWeight: activeFormats.heading ? 'bold' : activeFormats.bold ? 'bold' : 'normal',
                  }}
                />
              </div>

              {/* Comments sidebar */}
              {comments.length > 0 && (
                <div className={`w-64 p-4 border-l ${
                  isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}>
                  <h4 className={`font-semibold mb-3 text-sm ${isDark ? 'text-white' : 'text-slate-700'}`}>
                    Comments ({comments.length})
                  </h4>
                  <div className="space-y-3">
                    {comments.map(comment => (
                      <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-3 rounded-xl border ${
                          isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                            Y
                          </div>
                          <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-700'}`}>
                            {comment.author}
                          </span>
                        </div>
                        <p className={`text-xs mb-2 italic ${isDark ? 'text-white/50' : 'text-slate-400'}`}>
                          "{comment.text}"
                        </p>
                        <p className={`text-sm ${isDark ? 'text-white/80' : 'text-slate-600'}`}>
                          {comment.comment}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
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
                    ? 'bg-green-500/10 border-green-500/50'
                    : 'bg-green-50 border-green-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
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
                className="h-full bg-gradient-to-r from-green-400 to-green-600"
                initial={{ width: 0 }}
                animate={{ width: `${(completedChallenges.length / challenges.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Comment Modal */}
      <CommentModal
        isOpen={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        onSave={handleAddComment}
        selectedText={selectedText}
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
                  background: ['#10b981', '#f59e0b', '#22c55e', '#ec4899', '#06b6d4'][i % 5],
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
