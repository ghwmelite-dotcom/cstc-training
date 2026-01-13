import { useTheme } from '../../hooks/useTheme';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Plus, Calendar, Sparkles, Lightbulb, ArrowRight, GripVertical } from 'lucide-react';

const initialData = {
  lists: [
    {
      id: 'todo',
      title: 'To Do',
      cards: [
        { id: '1', title: 'Review policy draft', labels: ['urgent'], assignee: 'JD', dueDate: 'Jan 15' },
        { id: '2', title: 'Schedule stakeholder meeting', labels: ['planning'], assignee: 'SM' },
        { id: '3', title: 'Update project timeline', labels: [], assignee: 'JD' },
      ],
    },
    {
      id: 'progress',
      title: 'In Progress',
      cards: [
        { id: '4', title: 'Draft budget proposal', labels: ['finance'], assignee: 'AK', dueDate: 'Jan 20' },
        { id: '5', title: 'Collect department feedback', labels: [], assignee: 'SM' },
      ],
    },
    {
      id: 'review',
      title: 'Under Review',
      cards: [
        { id: '6', title: 'Annual compliance report', labels: ['urgent', 'compliance'], assignee: 'JD' },
      ],
    },
    {
      id: 'done',
      title: 'Completed',
      cards: [
        { id: '7', title: 'Team onboarding docs', labels: ['hr'], assignee: 'AK' },
      ],
    },
  ],
};

const labelColors = {
  urgent: { bg: 'bg-red-500', glow: 'shadow-red-500/50', name: 'Urgent' },
  planning: { bg: 'bg-blue-500', glow: 'shadow-blue-500/50', name: 'Planning' },
  finance: { bg: 'bg-emerald-500', glow: 'shadow-emerald-500/50', name: 'Finance' },
  compliance: { bg: 'bg-purple-500', glow: 'shadow-purple-500/50', name: 'Compliance' },
  hr: { bg: 'bg-amber-500', glow: 'shadow-amber-500/50', name: 'HR' },
};

// Annotation callout component
function Annotation({ children, position, delay = 0, color = 'cyan' }) {
  const colors = {
    cyan: 'bg-cyan-500 border-cyan-400',
    amber: 'bg-amber-500 border-amber-400',
    purple: 'bg-purple-500 border-purple-400',
    emerald: 'bg-emerald-500 border-emerald-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
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

export function TrelloDemo({ interactive = true, step = 0 }) {
  const { isDark } = useTheme();
  const [data, setData] = useState(initialData);
  const [draggedCard, setDraggedCard] = useState(null);
  const [draggedFromList, setDraggedFromList] = useState(null);
  const [dropTargetList, setDropTargetList] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle drag start
  const handleDragStart = (e, card, listId) => {
    if (!interactive) return;
    setDraggedCard(card);
    setDraggedFromList(listId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', card.id);
  };

  // Handle drag over list
  const handleDragOver = (e, listId) => {
    if (!interactive) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTargetList(listId);
  };

  // Handle drag leave
  const handleDragLeave = (e, listId) => {
    if (!interactive) return;
    // Only clear if we're actually leaving the list (not entering a child)
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDropTargetList(null);
    }
  };

  // Handle drop
  const handleDrop = (e, targetListId) => {
    if (!interactive || !draggedCard) return;
    e.preventDefault();

    if (draggedFromList === targetListId) {
      // Same list - just reorder (simplified: move to end)
      setDraggedCard(null);
      setDraggedFromList(null);
      setDropTargetList(null);
      return;
    }

    // Move card to new list
    setData(prev => {
      const newLists = prev.lists.map(list => {
        if (list.id === draggedFromList) {
          // Remove from source list
          return {
            ...list,
            cards: list.cards.filter(c => c.id !== draggedCard.id)
          };
        }
        if (list.id === targetListId) {
          // Add to target list
          return {
            ...list,
            cards: [...list.cards, draggedCard]
          };
        }
        return list;
      });
      return { ...prev, lists: newLists };
    });

    // Show success animation
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1500);

    // Clear drag state
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

  return (
    <div className="relative rounded-2xl overflow-hidden">
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? 'from-sky-600 via-indigo-600 to-purple-700' : 'from-sky-100 via-indigo-100 to-purple-100'}`} />

      {/* Animated orbs */}
      <motion.div
        className="absolute w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl"
        animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        style={{ top: '-20%', right: '-10%' }}
      />
      <motion.div
        className="absolute w-48 h-48 bg-purple-400/20 rounded-full blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        style={{ bottom: '-10%', left: '-5%' }}
      />

      {/* Success notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span className="font-medium">Card moved successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <span className="text-white font-bold text-sm">Q1</span>
            </motion.div>
            <div>
              <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-800'}`}>Q1 Policy Review Project</h3>
              <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>4 lists | {data.lists.reduce((acc, l) => acc + l.cards.length, 0)} cards</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg text-white/80 text-sm border border-white/20"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <Sparkles size={14} />
              <span>Filters</span>
            </motion.button>
          </div>
        </div>

        {/* Flow direction indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute top-20 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
        >
          <span className="text-white/60 text-xs">Work flows</span>
          <ArrowRight className="w-4 h-4 text-cyan-400" />
          <span className="text-white/60 text-xs">from left to right</span>
        </motion.div>

        {/* Board */}
        <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin pt-8 relative">
          {data.lists.map((list, listIndex) => (
            <motion.div
              key={list.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: step >= listIndex ? 1 : 0.4, y: 0 }}
              transition={{ delay: listIndex * 0.1 }}
              className="relative"
              onDragOver={(e) => handleDragOver(e, list.id)}
              onDragLeave={(e) => handleDragLeave(e, list.id)}
              onDrop={(e) => handleDrop(e, list.id)}
            >
              {/* List container */}
              <div className={`bg-slate-900/60 backdrop-blur-xl rounded-xl p-3 min-w-[250px] max-w-[250px] border shadow-xl transition-all duration-200 ${
                dropTargetList === list.id && draggedFromList !== list.id
                  ? 'border-cyan-400 ring-2 ring-cyan-400/50 scale-[1.02]'
                  : 'border-white/10'
              }`}>
                {/* List header */}
                <div className="flex items-center justify-between px-2 py-1.5 mb-3">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    {list.title}
                    <span className="text-xs px-2 py-0.5 bg-white/10 rounded-full text-white/60">
                      {list.cards.length}
                    </span>
                  </h4>
                  <button className="p-1 hover:bg-white/10 rounded text-white/40 hover:text-white/80 transition-colors">
                    <MoreHorizontal size={16} />
                  </button>
                </div>

                {/* Cards */}
                <div className="space-y-3 min-h-[50px]">
                  {list.cards.map((card) => (
                    <TrelloCard
                      key={card.id}
                      card={card}
                      listId={list.id}
                      interactive={interactive}
                      isDragging={draggedCard?.id === card.id}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    />
                  ))}

                  {/* Drop zone indicator when empty or dragging */}
                  {dropTargetList === list.id && draggedFromList !== list.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 60 }}
                      className="border-2 border-dashed border-cyan-400/50 rounded-xl bg-cyan-400/10 flex items-center justify-center"
                    >
                      <span className="text-cyan-400 text-sm">Drop here</span>
                    </motion.div>
                  )}
                </div>

                {/* Add card button */}
                <motion.button
                  className="flex items-center gap-2 w-full p-2.5 mt-3 text-white/40 hover:text-white/80 hover:bg-white/5 rounded-lg text-sm transition-all"
                  whileHover={{ x: 5 }}
                >
                  <Plus size={16} />
                  <span>Add a card</span>
                </motion.button>
              </div>

              {/* Floating Annotations per list */}
              <AnimatePresence>
                {listIndex === 0 && step >= 1 && (
                  <Annotation position="-top-2 left-4" delay={0.8} color="cyan">
                    Tasks start here
                  </Annotation>
                )}
                {listIndex === 3 && step >= 2 && (
                  <Annotation position="-top-2 right-4" delay={1} color="emerald">
                    Celebrate done!
                  </Annotation>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {/* Add list button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="min-w-[250px]"
          >
            <button className="w-full p-4 bg-white/5 hover:bg-white/10 border border-dashed border-white/20 rounded-xl text-white/40 hover:text-white/80 transition-all flex items-center justify-center gap-2">
              <Plus size={18} />
              <span>Add another list</span>
            </button>
          </motion.div>
        </div>

        {/* Bottom insight bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-4 bg-slate-900/60 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2.5 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span className="text-white/80 text-sm">
              <span className="text-purple-400 font-medium">Drag cards</span> between lists as work progresses
            </span>
          </div>
          <div className="flex items-center gap-2 text-white/60 text-xs">
            <GripVertical className="w-4 h-4" />
            <span>Try dragging!</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function TrelloCard({ card, listId, interactive, isDragging, onDragStart, onDragEnd }) {
  return (
    <motion.div
      draggable={interactive}
      onDragStart={(e) => onDragStart(e, card, listId)}
      onDragEnd={onDragEnd}
      className={`bg-slate-800/80 rounded-xl p-3.5 shadow-lg border border-white/10 cursor-grab active:cursor-grabbing hover:border-white/30 transition-all group ${
        isDragging ? 'opacity-50 scale-95 ring-2 ring-cyan-400' : ''
      }`}
      whileHover={!isDragging ? { scale: 1.02, y: -2 } : {}}
      whileTap={{ scale: 0.98 }}
      layout
    >
      {/* Labels */}
      {card.labels.length > 0 && (
        <div className="flex gap-1.5 mb-2.5">
          {card.labels.map((label) => (
            <motion.span
              key={label}
              className={`h-1.5 rounded-full ${labelColors[label]?.bg || 'bg-slate-500'} shadow-lg ${labelColors[label]?.glow || ''}`}
              style={{ width: `${Math.max(20, label.length * 6)}px` }}
              whileHover={{ height: '12px' }}
              title={labelColors[label]?.name || label}
            />
          ))}
        </div>
      )}

      {/* Title */}
      <p className="text-sm text-white font-medium mb-3 group-hover:text-cyan-200 transition-colors">
        {card.title}
      </p>

      {/* Footer */}
      <div className="flex items-center gap-2 text-white/40">
        {card.dueDate && (
          <motion.div
            className="flex items-center gap-1.5 text-xs bg-white/5 px-2 py-1 rounded-md"
            whileHover={{ scale: 1.05 }}
          >
            <Calendar size={12} />
            <span>{card.dueDate}</span>
          </motion.div>
        )}
        {card.assignee && (
          <motion.div
            className="ml-auto w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-lg"
            whileHover={{ scale: 1.1 }}
            title={`Assigned to ${card.assignee}`}
          >
            {card.assignee}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
