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
  ChevronRight,
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
  Clock,
  FileSignature,
  Table,
  Bookmark,
  Eye,
  History,
  Copy,
  Keyboard,
  Info,
  BookOpen,
  Award,
  Heading1,
  Heading2,
  Heading3,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

// Comprehensive challenge configurations for public servants
const challenges = [
  {
    id: 1,
    title: 'Create a Professional Memo',
    description: 'Draft an internal memo with proper structure: heading, date, recipients, subject, and body',
    objective: 'Write a memo with at least 50 characters including "MEMO", "TO:", "FROM:", and "SUBJECT:"',
    points: 150,
    hint: 'Start with "MEMO" at the top, then add TO:, FROM:, DATE:, SUBJECT: fields followed by your message body',
    scenario: 'Your department head needs you to draft a memo about the new flexible work policy.',
    template: 'MEMO\n\nTO: All Department Staff\nFROM: [Your Name]\nDATE: [Today\'s Date]\nSUBJECT: New Flexible Work Policy\n\n[Body of memo...]',
    validation: (state) => {
      const content = state.content.toUpperCase();
      return state.content.length >= 50 &&
             content.includes('MEMO') &&
             content.includes('TO:') &&
             (content.includes('FROM:') || content.includes('SUBJECT:'));
    },
    tips: [
      'Memos should be concise and action-oriented',
      'Always include a clear subject line',
      'Use bullet points for multiple action items',
    ],
  },
  {
    id: 2,
    title: 'Master Text Formatting',
    description: 'Apply bold, italic, and underline formatting to emphasize key information',
    objective: 'Use all three text formatting options: Bold, Italic, and Underline',
    points: 125,
    hint: 'Click the B, I, and U buttons in the toolbar, or use keyboard shortcuts: Ctrl+B, Ctrl+I, Ctrl+U',
    scenario: 'When creating official documents, proper formatting helps readers identify key information quickly.',
    validation: (state) => {
      return state.formatHistory.includes('bold') &&
             state.formatHistory.includes('italic') &&
             state.formatHistory.includes('underline');
    },
    tips: [
      'Bold: Use for headings, important dates, and key terms',
      'Italic: Use for document titles, emphasis, and definitions',
      'Underline: Use sparingly, mainly for hyperlinks or legal references',
    ],
    shortcuts: [
      { keys: 'Ctrl + B', action: 'Bold text' },
      { keys: 'Ctrl + I', action: 'Italic text' },
      { keys: 'Ctrl + U', action: 'Underline text' },
    ],
  },
  {
    id: 3,
    title: 'Structure with Headings',
    description: 'Organize your document using heading levels for clear hierarchy',
    objective: 'Apply at least two different heading styles to structure your document',
    points: 175,
    hint: 'Click the style dropdown (shows "Normal") and select Heading 1, 2, or 3 for different sections',
    scenario: 'Government reports and policy documents require clear section headings for navigation and accessibility.',
    validation: (state) => {
      const headings = state.formatHistory.filter(f => f.startsWith('heading'));
      return headings.length >= 2;
    },
    tips: [
      'Heading 1: Main document title or major sections',
      'Heading 2: Subsections within major sections',
      'Heading 3: Detailed breakdowns within subsections',
      'Headings automatically create a document outline for navigation',
    ],
  },
  {
    id: 4,
    title: 'Create Action Item Lists',
    description: 'Use bulleted and numbered lists to organize tasks and procedures',
    objective: 'Create both a bulleted list AND a numbered list',
    points: 150,
    hint: 'Click the bullet list icon for unordered items, numbered list icon for sequential steps',
    scenario: 'Meeting minutes, action items, and standard operating procedures all require well-organized lists.',
    validation: (state) => {
      return state.formatHistory.includes('bullet') && state.formatHistory.includes('numbered');
    },
    tips: [
      'Numbered lists: Use for sequential steps or ranked items',
      'Bulleted lists: Use for non-sequential items of equal importance',
      'Nest lists for sub-items (Tab to indent, Shift+Tab to outdent)',
      'Keep list items parallel in structure (all start with verbs, all nouns, etc.)',
    ],
  },
  {
    id: 5,
    title: 'Collaborate with Comments',
    description: 'Add comments to facilitate document review and feedback',
    objective: 'Select text and add a comment for team collaboration',
    points: 175,
    hint: 'Highlight text in the document, then click the comment icon in the toolbar',
    scenario: 'Before finalizing policies, documents circulate for review. Comments enable efficient feedback without altering the original text.',
    validation: (state) => state.comments.length > 0,
    tips: [
      'Use @mentions to notify specific colleagues',
      'Comments are perfect for questions, suggestions, or approvals',
      'Resolve comments once addressed to keep track of progress',
      'Comments create an audit trail of document changes',
    ],
    shortcuts: [
      { keys: 'Ctrl + Alt + M', action: 'Insert comment' },
    ],
  },
  {
    id: 6,
    title: 'Document Alignment',
    description: 'Master text alignment for professional document layout',
    objective: 'Use left, center, and right alignment in your document',
    points: 125,
    hint: 'Use the alignment buttons in the toolbar to position text appropriately',
    scenario: 'Proper alignment improves readability: center for titles, left for body text, right for dates or page numbers.',
    validation: (state) => {
      return state.formatHistory.includes('left') &&
             state.formatHistory.includes('center') &&
             state.formatHistory.includes('right');
    },
    tips: [
      'Left align: Standard for body text (easiest to read)',
      'Center: Document titles, section headings, invitations',
      'Right align: Dates, page numbers, letterhead info',
      'Justified: Full-width text blocks (use sparingly)',
    ],
    shortcuts: [
      { keys: 'Ctrl + L', action: 'Left align' },
      { keys: 'Ctrl + E', action: 'Center align' },
      { keys: 'Ctrl + R', action: 'Right align' },
    ],
  },
  {
    id: 7,
    title: 'Meeting Minutes Master',
    description: 'Create a complete meeting minutes document with all essential elements',
    objective: 'Write meeting minutes including: date, attendees, agenda items, action items, and next meeting date',
    points: 200,
    hint: 'Include sections for Meeting Date, Attendees, Agenda, Discussion, Action Items, and Next Meeting',
    scenario: 'As a public servant, documenting meetings ensures accountability and institutional memory.',
    template: 'MEETING MINUTES\n\nDate: [Date]\nTime: [Time]\nLocation: [Location]\n\nAttendees:\n• [Name 1]\n• [Name 2]\n\nAgenda Items:\n1. [Item 1]\n2. [Item 2]\n\nDiscussion Summary:\n[Notes...]\n\nAction Items:\n• [Task] - Assigned to: [Name] - Due: [Date]\n\nNext Meeting: [Date/Time]',
    validation: (state) => {
      const content = state.content.toUpperCase();
      return state.content.length >= 100 &&
             (content.includes('MEETING') || content.includes('MINUTES')) &&
             (content.includes('ATTENDEE') || content.includes('PRESENT')) &&
             (content.includes('ACTION') || content.includes('TASK') || content.includes('AGENDA'));
    },
    tips: [
      'Send minutes within 24 hours of the meeting',
      'Bold action items with owner names and deadlines',
      'Keep notes objective and factual',
      'Use past tense for discussions, future tense for action items',
    ],
  },
  {
    id: 8,
    title: 'Keyboard Shortcut Pro',
    description: 'Demonstrate proficiency with keyboard shortcuts for faster document creation',
    objective: 'Use at least 4 different formatting shortcuts',
    points: 150,
    hint: 'Try Ctrl+B (bold), Ctrl+I (italic), Ctrl+U (underline), Ctrl+L/E/R (alignment)',
    scenario: 'Keyboard shortcuts can save 30+ minutes per day for frequent document creators.',
    validation: (state) => {
      return state.formatHistory.length >= 4;
    },
    tips: [
      'Ctrl + C / Ctrl + V: Copy and paste',
      'Ctrl + Z / Ctrl + Y: Undo and redo',
      'Ctrl + A: Select all text',
      'Ctrl + F: Find text in document',
      'Ctrl + H: Find and replace',
      'Ctrl + S: Save document',
      'Ctrl + P: Print document',
    ],
  },
];

// Quick Tips Panel Component
function QuickTipsPanel({ isDark }) {
  const [expanded, setExpanded] = useState(false);

  const productivityTips = [
    {
      icon: Clock,
      title: 'Save Time with Templates',
      description: 'Create templates for recurring documents like memos, reports, and meeting agendas. Access via File → New → From template.',
    },
    {
      icon: Users,
      title: 'Real-time Collaboration',
      description: 'Multiple people can edit simultaneously. Use the Share button to invite colleagues with view, comment, or edit access.',
    },
    {
      icon: History,
      title: 'Version History',
      description: 'Access File → Version history to see all changes, who made them, and restore previous versions if needed.',
    },
    {
      icon: Keyboard,
      title: 'Voice Typing',
      description: 'Use Tools → Voice typing to dictate documents hands-free. Great for long reports or when your hands are busy.',
    },
    {
      icon: Bookmark,
      title: 'Bookmarks & Links',
      description: 'Create internal bookmarks (Insert → Bookmark) to link between sections of long documents.',
    },
    {
      icon: Table,
      title: 'Tables for Data',
      description: 'Use Insert → Table to organize data. Tables are searchable and can be sorted unlike images.',
    },
  ];

  return (
    <motion.div
      className={`rounded-2xl border overflow-hidden ${
        isDark ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30' : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'
      }`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full p-4 flex items-center justify-between ${isDark ? 'hover:bg-white/5' : 'hover:bg-white/50'}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Productivity Tips
            </h3>
            <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
              Master Google Docs for government work
            </p>
          </div>
        </div>
        <motion.div animate={{ rotate: expanded ? 90 : 0 }}>
          <ChevronRight className={`w-5 h-5 ${isDark ? 'text-white/60' : 'text-slate-400'}`} />
        </motion.div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className={`p-4 pt-0 space-y-3 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              {productivityTips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white'}`}
                >
                  <div className="flex items-start gap-3">
                    <tip.icon className={`w-5 h-5 mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
                    <div>
                      <h4 className={`font-medium text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {tip.title}
                      </h4>
                      <p className={`text-xs mt-1 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                        {tip.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Keyboard Shortcuts Reference
function KeyboardShortcutsPanel({ isDark }) {
  const [expanded, setExpanded] = useState(false);

  const shortcuts = [
    { category: 'Text Formatting', items: [
      { keys: 'Ctrl + B', action: 'Bold' },
      { keys: 'Ctrl + I', action: 'Italic' },
      { keys: 'Ctrl + U', action: 'Underline' },
      { keys: 'Ctrl + Shift + X', action: 'Strikethrough' },
    ]},
    { category: 'Paragraph', items: [
      { keys: 'Ctrl + L', action: 'Align left' },
      { keys: 'Ctrl + E', action: 'Align center' },
      { keys: 'Ctrl + R', action: 'Align right' },
      { keys: 'Ctrl + J', action: 'Justify' },
    ]},
    { category: 'Navigation', items: [
      { keys: 'Ctrl + Home', action: 'Go to beginning' },
      { keys: 'Ctrl + End', action: 'Go to end' },
      { keys: 'Ctrl + F', action: 'Find' },
      { keys: 'Ctrl + H', action: 'Find and replace' },
    ]},
    { category: 'Document', items: [
      { keys: 'Ctrl + S', action: 'Save' },
      { keys: 'Ctrl + P', action: 'Print' },
      { keys: 'Ctrl + Z', action: 'Undo' },
      { keys: 'Ctrl + Y', action: 'Redo' },
    ]},
  ];

  return (
    <motion.div
      className={`rounded-2xl border overflow-hidden ${
        isDark ? 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/30' : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200'
      }`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full p-4 flex items-center justify-between ${isDark ? 'hover:bg-white/5' : 'hover:bg-white/50'}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <Keyboard className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Keyboard Shortcuts
            </h3>
            <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
              Work faster with shortcuts
            </p>
          </div>
        </div>
        <motion.div animate={{ rotate: expanded ? 90 : 0 }}>
          <ChevronRight className={`w-5 h-5 ${isDark ? 'text-white/60' : 'text-slate-400'}`} />
        </motion.div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className={`p-4 pt-0 space-y-4 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              {shortcuts.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-white/50' : 'text-slate-400'}`}>
                    {category.category}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {category.items.map((shortcut, i) => (
                      <div key={i} className={`flex items-center justify-between p-2 rounded-lg ${isDark ? 'bg-white/5' : 'bg-white'}`}>
                        <span className={`text-xs ${isDark ? 'text-white/70' : 'text-slate-600'}`}>{shortcut.action}</span>
                        <kbd className={`px-2 py-0.5 rounded text-xs font-mono ${isDark ? 'bg-slate-700 text-emerald-400' : 'bg-slate-100 text-emerald-600'}`}>
                          {shortcut.keys}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

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
              {selectedText && (
                <div className={`p-3 rounded-lg border-l-4 border-blue-500 ${
                  isDark ? 'bg-slate-700/50' : 'bg-blue-50'
                }`}>
                  <p className={`text-sm italic ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                    "{selectedText}"
                  </p>
                </div>
              )}

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                  Your comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Add your feedback, suggestion, or question..."
                  rows={3}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                    isDark
                      ? 'bg-slate-700 border-slate-600 text-white placeholder:text-white/40'
                      : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400'
                  }`}
                  autoFocus
                />
              </div>

              <div className={`p-3 rounded-lg ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                <div className="flex items-start gap-2">
                  <Info className={`w-4 h-4 mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
                  <p className={`text-xs ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                    <strong>Pro tip:</strong> Use @name to mention colleagues. They'll receive a notification to review your comment.
                  </p>
                </div>
              </div>
            </div>

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

// Template Modal
function TemplateModal({ isOpen, onClose, onSelect, isDark }) {
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCanClose(false);
      const timer = setTimeout(() => setCanClose(true), 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const templates = [
    {
      id: 'memo',
      title: 'Internal Memo',
      icon: FileSignature,
      content: `MEMORANDUM

TO: [Recipient Name/Department]
FROM: [Your Name]
DATE: ${new Date().toLocaleDateString()}
SUBJECT: [Brief Subject Line]

Purpose:
[State the purpose of this memo in 1-2 sentences]

Background:
[Provide relevant context]

Key Points:
• [Point 1]
• [Point 2]
• [Point 3]

Action Required:
[Specify what action is needed and by when]

Please contact me if you have any questions.`,
    },
    {
      id: 'minutes',
      title: 'Meeting Minutes',
      icon: Clock,
      content: `MEETING MINUTES

Meeting Title: [Title]
Date: ${new Date().toLocaleDateString()}
Time: [Start Time] - [End Time]
Location: [Room/Virtual Link]
Facilitator: [Name]
Note Taker: [Name]

ATTENDEES:
• [Name 1] - [Role/Department]
• [Name 2] - [Role/Department]

ABSENT:
• [Name] - [Reason if known]

AGENDA ITEMS:

1. [First Agenda Item]
   Discussion: [Summary of discussion]
   Decision: [What was decided]

2. [Second Agenda Item]
   Discussion: [Summary of discussion]
   Decision: [What was decided]

ACTION ITEMS:
| Task | Assigned To | Due Date | Status |
|------|-------------|----------|--------|
| [Task 1] | [Name] | [Date] | Pending |
| [Task 2] | [Name] | [Date] | Pending |

NEXT MEETING:
Date: [Date]
Time: [Time]
Location: [Location]

Minutes prepared by: [Your Name]
Approved by: [Supervisor Name] on [Date]`,
    },
    {
      id: 'report',
      title: 'Status Report',
      icon: FileText,
      content: `STATUS REPORT

Report Period: [Start Date] to [End Date]
Prepared by: [Your Name]
Department: [Department Name]
Date: ${new Date().toLocaleDateString()}

EXECUTIVE SUMMARY:
[2-3 sentence overview of key accomplishments and status]

COMPLETED THIS PERIOD:
✓ [Accomplishment 1]
✓ [Accomplishment 2]
✓ [Accomplishment 3]

IN PROGRESS:
→ [Task 1] - [% Complete] - Expected completion: [Date]
→ [Task 2] - [% Complete] - Expected completion: [Date]

UPCOMING:
• [Planned task 1]
• [Planned task 2]

CHALLENGES/BLOCKERS:
⚠ [Issue 1] - [Proposed solution or help needed]
⚠ [Issue 2] - [Proposed solution or help needed]

METRICS:
• [Key metric 1]: [Value]
• [Key metric 2]: [Value]

RECOMMENDATIONS:
[Any recommendations for management consideration]`,
    },
    {
      id: 'policy',
      title: 'Policy Draft',
      icon: BookOpen,
      content: `[DEPARTMENT NAME]
POLICY DOCUMENT

Policy Title: [Title]
Policy Number: [XXX-XXX]
Effective Date: [Date]
Review Date: [Date]
Approved by: [Authority]

1. PURPOSE
[Explain why this policy exists and what it aims to achieve]

2. SCOPE
This policy applies to:
• [Who or what is covered]
• [Any exceptions]

3. DEFINITIONS
[Term 1]: [Definition]
[Term 2]: [Definition]

4. POLICY STATEMENT
[Main policy content - what is required/prohibited]

5. PROCEDURES
5.1 [First procedure]
    a) [Step 1]
    b) [Step 2]
    c) [Step 3]

5.2 [Second procedure]
    a) [Step 1]
    b) [Step 2]

6. RESPONSIBILITIES
6.1 [Role 1] is responsible for:
    • [Responsibility]

6.2 [Role 2] is responsible for:
    • [Responsibility]

7. COMPLIANCE
[Consequences of non-compliance]

8. RELATED DOCUMENTS
• [Related policy/procedure 1]
• [Related policy/procedure 2]

9. VERSION HISTORY
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | [Date] | [Name] | Initial release |`,
    },
  ];

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
            className={`w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`px-6 py-4 flex items-center justify-between border-b ${
              isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'
            }`}>
              <div>
                <h3 className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  Document Templates
                </h3>
                <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                  Start with a professional template for government documents
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className={`p-2 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-white/10 text-white/60' : 'hover:bg-slate-200 text-slate-400'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
              {templates.map((template) => (
                <motion.button
                  key={template.id}
                  onClick={(e) => { e.stopPropagation(); onSelect(template.content); onClose(); }}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isDark
                      ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-700 hover:border-blue-500'
                      : 'bg-white border-slate-200 hover:border-blue-500 hover:shadow-lg'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isDark ? 'bg-blue-500/20' : 'bg-blue-100'
                    }`}>
                      <template.icon className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                    </div>
                    <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      {template.title}
                    </h4>
                  </div>
                  <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-400'}`}>
                    {template.content.substring(0, 100)}...
                  </p>
                </motion.button>
              ))}
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
function ToolbarButton({ icon: Icon, label, active, onClick, isDark, shortcut }) {
  return (
    <motion.button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`p-2 rounded-lg transition-colors relative group ${
        active
          ? isDark ? 'bg-blue-500/30 text-blue-400' : 'bg-blue-100 text-blue-600'
          : isDark ? 'hover:bg-white/10 text-white/70' : 'hover:bg-slate-100 text-slate-600'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={label}
    >
      <Icon className="w-5 h-5" />
      {shortcut && (
        <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
          isDark ? 'bg-slate-700 text-white' : 'bg-slate-800 text-white'
        }`}>
          {label} <span className="opacity-60">({shortcut})</span>
        </div>
      )}
    </motion.button>
  );
}

// Enhanced Challenge Card
function ChallengeCard({ challenge, isActive, isCompleted, onStart, onShowDetails, isDark }) {
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

        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {challenge.title}
          </h4>
          <p className={`text-sm mb-2 line-clamp-2 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
            {challenge.description}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1 text-amber-500 text-sm font-medium">
              <Star className="w-4 h-4" />
              {challenge.points}
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
                Active
              </span>
            )}

            {isCompleted && (
              <span className="flex items-center gap-1 text-emerald-500 text-sm font-medium">
                <Trophy className="w-4 h-4" />
                Done!
              </span>
            )}

            <button
              onClick={() => onShowDetails(challenge)}
              className={`ml-auto flex items-center gap-1 text-xs ${isDark ? 'text-white/40 hover:text-white/60' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Eye className="w-3 h-3" />
              Tips
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Challenge Details Modal
function ChallengeDetailsModal({ challenge, isOpen, onClose, isDark }) {
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCanClose(false);
      const timer = setTimeout(() => setCanClose(true), 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    e.stopPropagation();
    if (canClose) onClose();
  };

  if (!challenge) return null;

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
            className={`w-full max-w-lg rounded-2xl shadow-2xl border overflow-hidden ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`px-6 py-4 border-b ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {challenge.title}
                  </h3>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onClose(); }}
                  className={`p-2 rounded-lg ${isDark ? 'hover:bg-white/10 text-white/60' : 'hover:bg-slate-200 text-slate-400'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {challenge.scenario && (
                <div className={`p-4 rounded-xl ${isDark ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
                  <h4 className={`font-medium mb-2 flex items-center gap-2 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
                    <Target className="w-4 h-4" />
                    Scenario
                  </h4>
                  <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
                    {challenge.scenario}
                  </p>
                </div>
              )}

              <div>
                <h4 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  Objective
                </h4>
                <p className={`text-sm ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                  {challenge.objective}
                </p>
              </div>

              {challenge.tips && challenge.tips.length > 0 && (
                <div>
                  <h4 className={`font-medium mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    Pro Tips
                  </h4>
                  <ul className="space-y-2">
                    {challenge.tips.map((tip, i) => (
                      <li key={i} className={`text-sm flex items-start gap-2 ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                        <span className="text-amber-500 mt-1">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {challenge.shortcuts && challenge.shortcuts.length > 0 && (
                <div>
                  <h4 className={`font-medium mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    <Keyboard className="w-4 h-4 text-emerald-500" />
                    Keyboard Shortcuts
                  </h4>
                  <div className="space-y-1">
                    {challenge.shortcuts.map((shortcut, i) => (
                      <div key={i} className={`flex items-center justify-between p-2 rounded-lg ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                        <span className={`text-sm ${isDark ? 'text-white/70' : 'text-slate-600'}`}>{shortcut.action}</span>
                        <kbd className={`px-2 py-0.5 rounded text-xs font-mono ${isDark ? 'bg-slate-700 text-emerald-400' : 'bg-slate-200 text-emerald-600'}`}>
                          {shortcut.keys}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {challenge.template && (
                <div>
                  <h4 className={`font-medium mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    <Copy className="w-4 h-4 text-purple-500" />
                    Template Structure
                  </h4>
                  <pre className={`text-xs p-3 rounded-lg overflow-x-auto ${isDark ? 'bg-slate-900 text-white/70' : 'bg-slate-100 text-slate-600'}`}>
                    {challenge.template}
                  </pre>
                </div>
              )}
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

// Main Docs Practice Component
export function DocsPractice({ onComplete, progress }) {
  const { isDark } = useTheme();
  const [content, setContent] = useState('');
  const [documentTitle, setDocumentTitle] = useState('Untitled Document');
  const [formatHistory, setFormatHistory] = useState([]);
  const [comments, setComments] = useState([]);
  const [selectedText, setSelectedText] = useState('');
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showChallengeDetails, setShowChallengeDetails] = useState(null);
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
  const [wordCount, setWordCount] = useState(0);
  const editorRef = useRef(null);
  const successTimeoutRef = useRef(null);

  // Update word count
  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(w => w.length > 0);
    setWordCount(words.length);
  }, [content]);

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
        return isComplete;
      } catch (err) {
        return false;
      }
    });

    if (newlyCompleted.length > 0) {
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
    if (!formatHistory.includes(format)) {
      setFormatHistory(prev => [...prev, format]);
    }

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

  // Use template
  const handleUseTemplate = (templateContent) => {
    setContent(templateContent);
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
    setDocumentTitle('Untitled Document');
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

  const totalPoints = challenges.reduce((sum, c) => sum + c.points, 0);
  const earnedPoints = challenges.filter(c => completedChallenges.includes(c.id)).reduce((sum, c) => sum + c.points, 0);

  return (
    <div className="space-y-6" data-no-slide-nav>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Google Docs Mastery
          </h2>
          <p className={`${isDark ? 'text-white/60' : 'text-slate-500'}`}>
            Create professional documents for government work
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => setShowTemplateModal(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              isDark
                ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30'
                : 'bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FileSignature className="w-4 h-4" />
            Templates
          </motion.button>

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
      </div>

      {/* Progress Overview */}
      <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Trophy className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-amber-500'}`} />
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {completedChallenges.length}/{challenges.length} Challenges
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Star className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-amber-500'}`} />
              <span className={`font-semibold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                {earnedPoints}/{totalPoints} Points
              </span>
            </div>
          </div>
          <div className={`text-sm ${isDark ? 'text-white/50' : 'text-slate-400'}`}>
            {wordCount} words
          </div>
        </div>
        <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}>
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${(completedChallenges.length / challenges.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Document Editor */}
        <div className="lg:col-span-2">
          <div className={`rounded-2xl overflow-hidden border ${
            isDark ? 'border-white/10' : 'border-slate-200'
          }`}>
            {/* Document Header */}
            <div
              className={`px-4 py-2 flex items-center gap-4 border-b ${
                isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 flex-1">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={documentTitle}
                    onChange={(e) => setDocumentTitle(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className={`font-semibold bg-transparent focus:outline-none focus:border-b-2 focus:border-blue-500 w-full ${
                      isDark ? 'text-white' : 'text-slate-800'
                    }`}
                  />
                  <div className="flex items-center gap-3 text-xs">
                    <span className={isDark ? 'text-white/50' : 'text-slate-400'}>File</span>
                    <span className={isDark ? 'text-white/50' : 'text-slate-400'}>Edit</span>
                    <span className={isDark ? 'text-white/50' : 'text-slate-400'}>View</span>
                    <span className={isDark ? 'text-white/50' : 'text-slate-400'}>Insert</span>
                    <span className={isDark ? 'text-white/50' : 'text-slate-400'}>Format</span>
                    <span className={isDark ? 'text-white/50' : 'text-slate-400'}>Tools</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  className={`p-2 rounded-lg ${isDark ? 'hover:bg-white/10 text-white/60' : 'hover:bg-slate-100 text-slate-500'}`}
                  whileHover={{ scale: 1.05 }}
                  title="Version history"
                >
                  <History className="w-5 h-5" />
                </motion.button>
                <motion.button
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-medium shadow-lg shadow-blue-500/25"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </motion.button>
              </div>
            </div>

            {/* Toolbar */}
            <div className={`px-4 py-2 flex items-center gap-1 border-b flex-wrap ${
              isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`} onClick={(e) => e.stopPropagation()}>
              <ToolbarButton icon={Undo} label="Undo" onClick={() => {}} isDark={isDark} shortcut="Ctrl+Z" />
              <ToolbarButton icon={Redo} label="Redo" onClick={() => {}} isDark={isDark} shortcut="Ctrl+Y" />

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
                  <span className="hidden sm:inline">{activeFormats.heading ? activeFormats.heading.replace('heading', 'H') : 'Normal'}</span>
                  <ChevronDown className="w-4 h-4" />
                </motion.button>

                <AnimatePresence>
                  {showHeadingMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`absolute top-full left-0 mt-1 py-2 rounded-xl shadow-xl border z-20 min-w-[180px] ${
                        isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {[
                        { id: 'normal', label: 'Normal text', icon: Type, desc: 'Body text' },
                        { id: 'heading1', label: 'Heading 1', icon: Heading1, desc: 'Main title' },
                        { id: 'heading2', label: 'Heading 2', icon: Heading2, desc: 'Section' },
                        { id: 'heading3', label: 'Heading 3', icon: Heading3, desc: 'Subsection' },
                      ].map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            applyFormat(item.id);
                          }}
                          className={`w-full px-4 py-2 flex items-center gap-3 transition-colors text-left ${
                            isDark ? 'hover:bg-white/10' : 'hover:bg-slate-50'
                          }`}
                        >
                          <item.icon className={`w-4 h-4 ${isDark ? 'text-white/60' : 'text-slate-400'}`} />
                          <div className="flex-1">
                            <span className={`text-sm ${isDark ? 'text-white' : 'text-slate-700'}`}>{item.label}</span>
                            <span className={`text-xs ml-2 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>{item.desc}</span>
                          </div>
                          {activeFormats.heading === item.id && (
                            <Check className="w-4 h-4 text-blue-500" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className={`w-px h-6 mx-1 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />

              <ToolbarButton icon={Bold} label="Bold" shortcut="Ctrl+B" active={activeFormats.bold} onClick={() => applyFormat('bold')} isDark={isDark} />
              <ToolbarButton icon={Italic} label="Italic" shortcut="Ctrl+I" active={activeFormats.italic} onClick={() => applyFormat('italic')} isDark={isDark} />
              <ToolbarButton icon={Underline} label="Underline" shortcut="Ctrl+U" active={activeFormats.underline} onClick={() => applyFormat('underline')} isDark={isDark} />

              <div className={`w-px h-6 mx-1 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />

              <ToolbarButton icon={AlignLeft} label="Align left" shortcut="Ctrl+L" active={activeFormats.align === 'left'} onClick={() => applyFormat('left')} isDark={isDark} />
              <ToolbarButton icon={AlignCenter} label="Center" shortcut="Ctrl+E" active={activeFormats.align === 'center'} onClick={() => applyFormat('center')} isDark={isDark} />
              <ToolbarButton icon={AlignRight} label="Align right" shortcut="Ctrl+R" active={activeFormats.align === 'right'} onClick={() => applyFormat('right')} isDark={isDark} />

              <div className={`w-px h-6 mx-1 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />

              <ToolbarButton icon={List} label="Bullet list" active={activeFormats.list === 'bullet'} onClick={() => applyFormat('bullet')} isDark={isDark} />
              <ToolbarButton icon={ListOrdered} label="Numbered list" active={activeFormats.list === 'numbered'} onClick={() => applyFormat('numbered')} isDark={isDark} />

              <div className={`w-px h-6 mx-1 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />

              <ToolbarButton icon={Link} label="Insert link" onClick={() => {}} isDark={isDark} />
              <ToolbarButton icon={Image} label="Insert image" onClick={() => {}} isDark={isDark} />
              <ToolbarButton icon={Table} label="Insert table" onClick={() => {}} isDark={isDark} />
              <ToolbarButton icon={MessageSquare} label="Add comment" onClick={openCommentModal} isDark={isDark} shortcut="Ctrl+Alt+M" />
            </div>

            {/* Editor Area */}
            <div
              className={`flex ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}
              onClick={(e) => e.stopPropagation()}
              style={{ minHeight: '400px' }}
            >
              {/* Document */}
              <div
                className={`flex-1 min-h-[400px] p-6 md:p-8 ${isDark ? 'bg-slate-800' : 'bg-white'}`}
                style={{ margin: '16px auto', maxWidth: '816px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}
                onClick={(e) => e.stopPropagation()}
              >
                <textarea
                  ref={editorRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onSelect={handleTextSelect}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  placeholder="Start typing your document here...

Try creating a memo, meeting minutes, or use a template from the Templates button above."
                  className={`w-full h-full min-h-[350px] resize-none focus:outline-none text-base leading-relaxed ${
                    isDark
                      ? 'bg-transparent text-white placeholder:text-white/30'
                      : 'bg-transparent text-slate-800 placeholder:text-slate-300'
                  } ${activeFormats.bold ? 'font-bold' : ''} ${activeFormats.italic ? 'italic' : ''} ${activeFormats.underline ? 'underline' : ''}`}
                  style={{
                    textAlign: activeFormats.align,
                    fontSize: activeFormats.heading === 'heading1' ? '1.75rem' :
                              activeFormats.heading === 'heading2' ? '1.375rem' :
                              activeFormats.heading === 'heading3' ? '1.125rem' : '1rem',
                    fontWeight: activeFormats.heading ? 'bold' : activeFormats.bold ? 'bold' : 'normal',
                    lineHeight: activeFormats.heading ? '1.3' : '1.6',
                  }}
                />
              </div>

              {/* Comments sidebar */}
              {comments.length > 0 && (
                <div className={`w-56 p-3 border-l hidden md:block ${
                  isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}>
                  <h4 className={`font-semibold mb-3 text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-700'}`}>
                    <MessageSquare className="w-4 h-4" />
                    Comments ({comments.length})
                  </h4>
                  <div className="space-y-2">
                    {comments.map(comment => (
                      <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-2 rounded-lg border ${
                          isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                            Y
                          </div>
                          <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-slate-700'}`}>
                            {comment.author}
                          </span>
                        </div>
                        <p className={`text-xs mb-1 italic ${isDark ? 'text-white/50' : 'text-slate-400'}`}>
                          "{comment.text.substring(0, 30)}..."
                        </p>
                        <p className={`text-xs ${isDark ? 'text-white/80' : 'text-slate-600'}`}>
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

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Active challenge objective */}
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
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      Current Challenge
                    </h4>
                    <p className={`text-sm mt-1 ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                      {activeChallenge.objective}
                    </p>

                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="flex items-center gap-1 text-amber-500 text-sm mt-2 hover:text-amber-400"
                    >
                      <Lightbulb className="w-4 h-4" />
                      {showHint ? 'Hide hint' : 'Show hint'}
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
            <h3 className={`font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <Award className="w-5 h-5 text-purple-500" />
              Challenges
            </h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {challenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  isActive={activeChallenge?.id === challenge.id}
                  isCompleted={completedChallenges.includes(challenge.id)}
                  onStart={handleStartChallenge}
                  onShowDetails={setShowChallengeDetails}
                  isDark={isDark}
                />
              ))}
            </div>
          </div>

          {/* Quick Tips */}
          <QuickTipsPanel isDark={isDark} />

          {/* Keyboard Shortcuts */}
          <KeyboardShortcutsPanel isDark={isDark} />
        </div>
      </div>

      {/* Modals */}
      <CommentModal
        isOpen={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        onSave={handleAddComment}
        selectedText={selectedText}
        isDark={isDark}
      />

      <TemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onSelect={handleUseTemplate}
        isDark={isDark}
      />

      <ChallengeDetailsModal
        challenge={showChallengeDetails}
        isOpen={!!showChallengeDetails}
        onClose={() => setShowChallengeDetails(null)}
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
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white/80 mb-2"
              >
                {successChallenge?.title}
              </motion.p>
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
