import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Plus,
  MoreHorizontal,
  Calendar,
  Tag,
  Users,
  CheckSquare,
  MessageSquare,
  Clock,
  Star,
  Zap,
  Target,
  Lightbulb,
  Play,
  RotateCcw,
  Trophy,
  Sparkles,
  X,
  Check,
  GripVertical,
  Edit3,
  Trash2,
  ArrowRight,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

// Challenge configurations
const challenges = [
  {
    id: 1,
    title: 'Create Your First Card',
    description: 'Add a new card to the "To Do" list',
    objective: 'Create a card in the To Do list',
    points: 100,
    hint: 'Click the "+ Add a card" button in the To Do column',
    validation: (lists) => lists.find(l => l.id === 'todo')?.cards.length > 0,
  },
  {
    id: 2,
    title: 'Move a Card',
    description: 'Drag any card from "To Do" to "In Progress"',
    objective: 'Move a card between lists',
    points: 150,
    hint: 'Click and drag a card, then drop it on another list',
    validation: (lists, actions) => actions.some(a => a.type === 'move'),
  },
  {
    id: 3,
    title: 'Add Labels',
    description: 'Add a label to any card to categorize it',
    objective: 'Add a label to a card',
    points: 125,
    hint: 'Click on a card and select a label color',
    validation: (lists) => lists.some(l => l.cards.some(c => c.labels?.length > 0)),
  },
  {
    id: 4,
    title: 'Set a Due Date',
    description: 'Add a due date to any card',
    objective: 'Add a due date to a card',
    points: 150,
    hint: 'Click on a card and set a due date',
    validation: (lists) => lists.some(l => l.cards.some(c => c.dueDate)),
  },
  {
    id: 5,
    title: 'Complete the Workflow',
    description: 'Move a card all the way from "To Do" to "Done"',
    objective: 'Complete a card\'s journey',
    points: 200,
    hint: 'A card needs to end up in the Done column',
    validation: (lists) => lists.find(l => l.id === 'done')?.cards.length > 0,
  },
];

const labelColors = [
  { id: 'red', name: 'Urgent', bg: 'bg-red-500', glow: 'shadow-red-500/50' },
  { id: 'amber', name: 'Important', bg: 'bg-amber-500', glow: 'shadow-amber-500/50' },
  { id: 'emerald', name: 'On Track', bg: 'bg-emerald-500', glow: 'shadow-emerald-500/50' },
  { id: 'blue', name: 'Planning', bg: 'bg-blue-500', glow: 'shadow-blue-500/50' },
  { id: 'purple', name: 'Review', bg: 'bg-purple-500', glow: 'shadow-purple-500/50' },
  { id: 'pink', name: 'Design', bg: 'bg-pink-500', glow: 'shadow-pink-500/50' },
];

const initialLists = [
  { id: 'todo', title: 'To Do', cards: [] },
  { id: 'progress', title: 'In Progress', cards: [] },
  { id: 'review', title: 'Review', cards: [] },
  { id: 'done', title: 'Done', cards: [] },
];

// Card modal for editing
function CardModal({ isOpen, onClose, card, onSave, onDelete, isDark }) {
  const [title, setTitle] = useState(card?.title || '');
  const [description, setDescription] = useState(card?.description || '');
  const [labels, setLabels] = useState(card?.labels || []);
  const [dueDate, setDueDate] = useState(card?.dueDate || '');
  const [checklist, setChecklist] = useState(card?.checklist || []);
  const [newCheckItem, setNewCheckItem] = useState('');

  useEffect(() => {
    if (card) {
      setTitle(card.title || '');
      setDescription(card.description || '');
      setLabels(card.labels || []);
      setDueDate(card.dueDate || '');
      setChecklist(card.checklist || []);
    }
  }, [card]);

  const toggleLabel = (labelId) => {
    setLabels(prev =>
      prev.includes(labelId)
        ? prev.filter(l => l !== labelId)
        : [...prev, labelId]
    );
  };

  const addCheckItem = () => {
    if (!newCheckItem.trim()) return;
    setChecklist(prev => [...prev, { id: Date.now(), text: newCheckItem, done: false }]);
    setNewCheckItem('');
  };

  const toggleCheckItem = (itemId) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, done: !item.done } : item
      )
    );
  };

  const handleSave = () => {
    onSave({
      ...card,
      title,
      description,
      labels,
      dueDate,
      checklist,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
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
          {/* Header */}
          <div className={`px-6 py-4 border-b flex items-center justify-between ${
            isDark ? 'border-slate-700' : 'border-slate-200'
          }`}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Card title..."
              className={`text-xl font-bold bg-transparent focus:outline-none flex-1 ${
                isDark ? 'text-white placeholder:text-white/40' : 'text-slate-800 placeholder:text-slate-400'
              }`}
            />
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-white/10 text-white/60' : 'hover:bg-slate-100 text-slate-400'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
            {/* Labels */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                <Tag className="w-4 h-4 inline mr-1" /> Labels
              </label>
              <div className="flex flex-wrap gap-2">
                {labelColors.map((label) => (
                  <motion.button
                    key={label.id}
                    onClick={() => toggleLabel(label.id)}
                    className={`px-3 py-1.5 rounded-lg text-white text-sm font-medium transition-all ${label.bg} ${
                      labels.includes(label.id)
                        ? 'ring-2 ring-offset-2 ring-white/50 shadow-lg ' + label.glow
                        : 'opacity-60 hover:opacity-100'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {labels.includes(label.id) && <Check className="w-3 h-3 inline mr-1" />}
                    {label.name}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                <Calendar className="w-4 h-4 inline mr-1" /> Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
            </div>

            {/* Description */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                <MessageSquare className="w-4 h-4 inline mr-1" /> Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a more detailed description..."
                rows={3}
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white placeholder:text-white/40'
                    : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400'
                }`}
              />
            </div>

            {/* Checklist */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                <CheckSquare className="w-4 h-4 inline mr-1" /> Checklist
              </label>
              <div className="space-y-2 mb-3">
                {checklist.map((item) => (
                  <motion.div
                    key={item.id}
                    className={`flex items-center gap-3 p-2 rounded-lg ${
                      isDark ? 'bg-slate-700/50' : 'bg-slate-50'
                    }`}
                    whileHover={{ x: 2 }}
                  >
                    <button
                      onClick={() => toggleCheckItem(item.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        item.done
                          ? 'bg-emerald-500 border-emerald-500'
                          : isDark
                          ? 'border-white/30'
                          : 'border-slate-300'
                      }`}
                    >
                      {item.done && <Check className="w-3 h-3 text-white" />}
                    </button>
                    <span className={`flex-1 ${
                      item.done
                        ? 'line-through opacity-50'
                        : isDark ? 'text-white' : 'text-slate-700'
                    }`}>
                      {item.text}
                    </span>
                  </motion.div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCheckItem}
                  onChange={(e) => setNewCheckItem(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCheckItem()}
                  placeholder="Add an item..."
                  className={`flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${
                    isDark
                      ? 'bg-slate-700 border-slate-600 text-white placeholder:text-white/40'
                      : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400'
                  }`}
                />
                <motion.button
                  onClick={addCheckItem}
                  className="px-3 py-2 bg-indigo-500 text-white rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className={`px-6 py-4 border-t flex justify-between ${
            isDark ? 'border-slate-700' : 'border-slate-200'
          }`}>
            {card?.id && (
              <motion.button
                onClick={() => {
                  onDelete(card.id);
                  onClose();
                }}
                className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </motion.button>
            )}
            <motion.button
              onClick={handleSave}
              disabled={!title.trim()}
              className={`flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium shadow-lg shadow-indigo-500/25 ml-auto ${
                !title.trim() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              whileHover={title.trim() ? { scale: 1.02 } : {}}
              whileTap={title.trim() ? { scale: 0.98 } : {}}
            >
              <Check className="w-4 h-4" />
              Save Card
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Single Trello card component
function TrelloCard({ card, listId, onEdit, onDragStart, onDragEnd, isDragging, isDark }) {
  return (
    <motion.div
      draggable
      onDragStart={(e) => onDragStart(e, card, listId)}
      onDragEnd={onDragEnd}
      onClick={() => onEdit(card)}
      className={`p-3 rounded-xl border cursor-grab active:cursor-grabbing transition-all group ${
        isDragging
          ? 'opacity-50 scale-95 ring-2 ring-indigo-400'
          : isDark
          ? 'bg-slate-800 border-white/10 hover:border-white/30'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
      }`}
      whileHover={!isDragging ? { scale: 1.02, y: -2 } : {}}
      layout
    >
      {/* Labels */}
      {card.labels?.length > 0 && (
        <div className="flex gap-1.5 mb-2">
          {card.labels.map((labelId) => {
            const label = labelColors.find(l => l.id === labelId);
            return (
              <motion.span
                key={labelId}
                className={`h-1.5 rounded-full ${label?.bg}`}
                style={{ width: `${Math.max(24, (label?.name.length || 3) * 6)}px` }}
                whileHover={{ height: '14px', width: 'auto', padding: '0 8px' }}
                title={label?.name}
              />
            );
          })}
        </div>
      )}

      {/* Title */}
      <p className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-slate-700'}`}>
        {card.title}
      </p>

      {/* Meta info */}
      <div className="flex items-center gap-2 flex-wrap">
        {card.dueDate && (
          <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
            isDark ? 'bg-white/10 text-white/60' : 'bg-slate-100 text-slate-500'
          }`}>
            <Clock className="w-3 h-3" />
            {new Date(card.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}

        {card.checklist?.length > 0 && (
          <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
            card.checklist.every(c => c.done)
              ? 'bg-emerald-500/20 text-emerald-500'
              : isDark ? 'bg-white/10 text-white/60' : 'bg-slate-100 text-slate-500'
          }`}>
            <CheckSquare className="w-3 h-3" />
            {card.checklist.filter(c => c.done).length}/{card.checklist.length}
          </span>
        )}

        {card.description && (
          <span className={`flex items-center gap-1 text-xs ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
            <MessageSquare className="w-3 h-3" />
          </span>
        )}

        {/* Drag handle */}
        <span className={`ml-auto opacity-0 group-hover:opacity-100 transition-opacity ${
          isDark ? 'text-white/40' : 'text-slate-400'
        }`}>
          <GripVertical className="w-4 h-4" />
        </span>
      </div>
    </motion.div>
  );
}

// Challenge card
function ChallengeCard({ challenge, isActive, isCompleted, onStart, isDark }) {
  return (
    <motion.div
      className={`p-4 rounded-2xl border transition-all ${
        isActive
          ? isDark
            ? 'bg-indigo-500/20 border-indigo-500/50 ring-2 ring-indigo-500/30'
            : 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-200'
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
              ? 'bg-gradient-to-br from-indigo-400 to-purple-500'
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
                className="flex items-center gap-1 text-indigo-500 text-sm font-medium hover:text-indigo-400"
                whileHover={{ x: 3 }}
              >
                <Play className="w-4 h-4" />
                Start
              </motion.button>
            )}

            {isActive && (
              <span className="flex items-center gap-1 text-indigo-400 text-sm font-medium animate-pulse">
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

// Main Trello Practice component
export function TrelloPractice({ onComplete, progress }) {
  const { isDark } = useTheme();
  const [lists, setLists] = useState(initialLists);
  const [actions, setActions] = useState([]);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [editingCard, setEditingCard] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [addingToList, setAddingToList] = useState(null);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [draggedCard, setDraggedCard] = useState(null);
  const [draggedFromList, setDraggedFromList] = useState(null);
  const [dropTargetList, setDropTargetList] = useState(null);
  const startTimeRef = useRef(null);

  // Handle drag start
  const handleDragStart = (e, card, listId) => {
    setDraggedCard(card);
    setDraggedFromList(listId);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Handle drag over
  const handleDragOver = (e, listId) => {
    e.preventDefault();
    setDropTargetList(listId);
  };

  // Handle drop
  const handleDrop = (e, targetListId) => {
    e.preventDefault();
    if (!draggedCard || draggedFromList === targetListId) {
      setDraggedCard(null);
      setDraggedFromList(null);
      setDropTargetList(null);
      return;
    }

    setLists(prev => {
      return prev.map(list => {
        if (list.id === draggedFromList) {
          return { ...list, cards: list.cards.filter(c => c.id !== draggedCard.id) };
        }
        if (list.id === targetListId) {
          return { ...list, cards: [...list.cards, draggedCard] };
        }
        return list;
      });
    });

    setActions(prev => [...prev, { type: 'move', from: draggedFromList, to: targetListId, card: draggedCard.id }]);

    setDraggedCard(null);
    setDraggedFromList(null);
    setDropTargetList(null);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedCard(null);
    setDraggedFromList(null);
    setDropTargetList(null);
  };

  // Add new card
  const handleAddCard = (listId) => {
    if (!newCardTitle.trim()) return;

    const newCard = {
      id: Date.now().toString(),
      title: newCardTitle.trim(),
      labels: [],
      dueDate: '',
      description: '',
      checklist: [],
    };

    setLists(prev =>
      prev.map(list =>
        list.id === listId
          ? { ...list, cards: [...list.cards, newCard] }
          : list
      )
    );

    setNewCardTitle('');
    setAddingToList(null);
  };

  // Save card edits
  const handleSaveCard = (updatedCard) => {
    setLists(prev =>
      prev.map(list => ({
        ...list,
        cards: list.cards.map(c =>
          c.id === updatedCard.id ? updatedCard : c
        ),
      }))
    );
  };

  // Delete card
  const handleDeleteCard = (cardId) => {
    setLists(prev =>
      prev.map(list => ({
        ...list,
        cards: list.cards.filter(c => c.id !== cardId),
      }))
    );
  };

  // Check challenge completion
  useEffect(() => {
    if (!activeChallenge) return;

    const isComplete = activeChallenge.validation(lists, actions);
    if (isComplete) {
      const timeSpent = (Date.now() - startTimeRef.current) / 1000;

      setCompletedChallenges(prev => [...prev, activeChallenge.id]);
      setShowSuccess(true);

      onComplete?.(activeChallenge.id, activeChallenge.points, timeSpent);

      setTimeout(() => {
        setActiveChallenge(null);
        setShowSuccess(false);
      }, 2000);
    }
  }, [lists, actions, activeChallenge, onComplete]);

  // Start challenge
  const handleStartChallenge = (challenge) => {
    setActiveChallenge(challenge);
    startTimeRef.current = Date.now();
    setShowHint(false);
  };

  // Reset
  const handleReset = () => {
    setLists(initialLists);
    setActions([]);
    setActiveChallenge(null);
    setCompletedChallenges([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Trello Practice
          </h2>
          <p className={`${isDark ? 'text-white/60' : 'text-slate-500'}`}>
            Master the art of visual task management
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

      {/* Board area */}
      <div className="grid lg:grid-cols-4 gap-4">
        {/* Trello Board */}
        <div className="lg:col-span-3">
          {/* Board header */}
          <div className={`flex items-center justify-between mb-4 p-4 rounded-xl ${
            isDark ? 'bg-indigo-500/20' : 'bg-indigo-50'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <div>
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  Practice Board
                </h3>
                <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                  {lists.reduce((acc, l) => acc + l.cards.length, 0)} cards across {lists.length} lists
                </p>
              </div>
            </div>

            {/* Flow indicator */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              isDark ? 'bg-slate-800/50' : 'bg-white'
            }`}>
              <span className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Flow</span>
              <ArrowRight className={`w-4 h-4 ${isDark ? 'text-indigo-400' : 'text-indigo-500'}`} />
            </div>
          </div>

          {/* Lists */}
          <div className="flex gap-4 overflow-x-auto pb-4">
            {lists.map((list) => (
              <motion.div
                key={list.id}
                className={`min-w-[280px] max-w-[280px] rounded-xl p-3 border transition-all ${
                  dropTargetList === list.id && draggedFromList !== list.id
                    ? 'ring-2 ring-indigo-400 border-indigo-400'
                    : isDark
                    ? 'bg-slate-800/50 border-white/10'
                    : 'bg-slate-100 border-slate-200'
                }`}
                onDragOver={(e) => handleDragOver(e, list.id)}
                onDrop={(e) => handleDrop(e, list.id)}
              >
                {/* List header */}
                <div className="flex items-center justify-between px-2 py-2 mb-3">
                  <h4 className={`font-bold text-sm flex items-center gap-2 ${
                    isDark ? 'text-white' : 'text-slate-700'
                  }`}>
                    {list.title}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      isDark ? 'bg-white/10 text-white/60' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {list.cards.length}
                    </span>
                  </h4>
                  <button className={`p-1 rounded hover:bg-white/10 ${
                    isDark ? 'text-white/40' : 'text-slate-400'
                  }`}>
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                {/* Cards */}
                <div className="space-y-2 min-h-[60px]">
                  {list.cards.map((card) => (
                    <TrelloCard
                      key={card.id}
                      card={card}
                      listId={list.id}
                      onEdit={(c) => {
                        setEditingCard(c);
                        setShowModal(true);
                      }}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      isDragging={draggedCard?.id === card.id}
                      isDark={isDark}
                    />
                  ))}

                  {/* Drop zone */}
                  {dropTargetList === list.id && draggedFromList !== list.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 60 }}
                      className="border-2 border-dashed border-indigo-400/50 rounded-xl bg-indigo-400/10 flex items-center justify-center"
                    >
                      <span className="text-indigo-400 text-sm">Drop here</span>
                    </motion.div>
                  )}
                </div>

                {/* Add card */}
                {addingToList === list.id ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3"
                  >
                    <input
                      type="text"
                      value={newCardTitle}
                      onChange={(e) => setNewCardTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddCard(list.id)}
                      placeholder="Enter card title..."
                      className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        isDark
                          ? 'bg-slate-700 text-white placeholder:text-white/40'
                          : 'bg-white text-slate-800 placeholder:text-slate-400'
                      }`}
                      autoFocus
                    />
                    <div className="flex gap-2 mt-2">
                      <motion.button
                        onClick={() => handleAddCard(list.id)}
                        className="flex-1 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium rounded-lg"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Add Card
                      </motion.button>
                      <button
                        onClick={() => {
                          setAddingToList(null);
                          setNewCardTitle('');
                        }}
                        className={`px-3 py-2 rounded-lg ${
                          isDark ? 'hover:bg-white/10 text-white/60' : 'hover:bg-slate-200 text-slate-500'
                        }`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.button
                    onClick={() => setAddingToList(list.id)}
                    className={`flex items-center gap-2 w-full p-2.5 mt-3 rounded-lg text-sm transition-all ${
                      isDark
                        ? 'text-white/40 hover:text-white/80 hover:bg-white/5'
                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200'
                    }`}
                    whileHover={{ x: 4 }}
                  >
                    <Plus className="w-4 h-4" />
                    Add a card
                  </motion.button>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Challenges sidebar */}
        <div className="space-y-4">
          {/* Active challenge */}
          <AnimatePresence>
            {activeChallenge && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 rounded-2xl border-2 border-dashed ${
                  isDark
                    ? 'bg-indigo-500/10 border-indigo-500/50'
                    : 'bg-indigo-50 border-indigo-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center flex-shrink-0">
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
                className="h-full bg-gradient-to-r from-indigo-400 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${(completedChallenges.length / challenges.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Card Modal */}
      <CardModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingCard(null);
        }}
        card={editingCard}
        onSave={handleSaveCard}
        onDelete={handleDeleteCard}
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

            {/* Confetti */}
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
