import { useTheme } from '../../hooks/useTheme';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  ChevronDown,
  Circle,
  CheckCircle2,
  Calendar,
  User,
  Flag,
  MoreHorizontal,
  Plus,
  List,
  LayoutGrid,
  GanttChart,
  Sparkles
} from 'lucide-react';

const projectData = {
  name: 'Q1 Digital Transformation Initiative',
  sections: [
    {
      id: 'planning',
      title: 'Planning Phase',
      tasks: [
        { id: '1', title: 'Define project scope and objectives', completed: true, assignee: 'Sarah M.', dueDate: 'Jan 5', priority: 'high' },
        { id: '2', title: 'Identify key stakeholders', completed: true, assignee: 'John D.', dueDate: 'Jan 8', priority: 'medium' },
        { id: '3', title: 'Create project timeline', completed: true, assignee: 'Sarah M.', dueDate: 'Jan 10', priority: 'high' },
      ],
    },
    {
      id: 'execution',
      title: 'Execution Phase',
      tasks: [
        {
          id: '4',
          title: 'Develop training materials',
          completed: false,
          assignee: 'Alex K.',
          dueDate: 'Jan 20',
          priority: 'high',
          subtasks: [
            { id: '4a', title: 'Create slide deck', completed: true },
            { id: '4b', title: 'Write participant guide', completed: false },
            { id: '4c', title: 'Prepare exercises', completed: false },
          ]
        },
        { id: '5', title: 'Set up pilot department', completed: false, assignee: 'John D.', dueDate: 'Jan 25', priority: 'medium' },
        { id: '6', title: 'Conduct training sessions', completed: false, assignee: 'Sarah M.', dueDate: 'Feb 1', priority: 'high' },
      ],
    },
    {
      id: 'review',
      title: 'Review & Feedback',
      tasks: [
        { id: '7', title: 'Collect participant feedback', completed: false, assignee: 'Alex K.', dueDate: 'Feb 10', priority: 'medium' },
        { id: '8', title: 'Analyze adoption metrics', completed: false, assignee: 'John D.', dueDate: 'Feb 15', priority: 'low' },
      ],
    },
  ],
};

const priorityColors = {
  high: 'text-red-400',
  medium: 'text-amber-400',
  low: 'text-blue-400',
};

export function AsanaDemo({ step = 0 }) {
  const { isDark } = useTheme();
  const [expandedSections, setExpandedSections] = useState(['planning', 'execution', 'review']);
  const [expandedTasks, setExpandedTasks] = useState(['4']);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleTask = (taskId) => {
    setExpandedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  return (
    <div className="relative rounded-2xl overflow-hidden">
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? 'from-rose-600 via-purple-600 to-indigo-700' : 'from-rose-100 via-purple-100 to-indigo-100'}`} />

      {/* Animated orbs */}
      <motion.div
        className="absolute w-64 h-64 bg-rose-400/20 rounded-full blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        style={{ top: '-15%', right: '-10%' }}
      />

      <div className="relative">
        {/* Header */}
        <div className="border-b border-white/10">
          <div className="px-6 py-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">{projectData.name}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm">
                  <span className="text-white/50">8 tasks</span>
                  <span className="text-white/50">3 completed</span>
                  <span className="text-emerald-400 font-medium">37% complete</span>
                </div>
              </div>
              <motion.button
                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg text-white/80 text-sm border border-white/20"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                <Plus size={16} />
                <span>Add Task</span>
              </motion.button>
            </div>
          </div>

          {/* View tabs */}
          <div className="px-6 flex items-center gap-1 bg-slate-900/30">
            <button className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-cyan-400 border-b-2 border-cyan-400">
              <List size={16} />
              <span>List</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-white/50 hover:text-white/80 transition-colors">
              <LayoutGrid size={16} />
              <span>Board</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-white/50 hover:text-white/80 transition-colors">
              <GanttChart size={16} />
              <span>Timeline</span>
            </button>
          </div>
        </div>

        {/* Task list */}
        <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto bg-slate-900/30 backdrop-blur-sm">
          {projectData.sections.map((section, sectionIndex) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: step >= sectionIndex ? 1 : 0.3 }}
              transition={{ delay: sectionIndex * 0.15 }}
            >
              {/* Section header */}
              <motion.button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-3 flex items-center gap-2 bg-white/5 hover:bg-white/10 transition-colors"
                whileHover={{ x: 3 }}
              >
                {expandedSections.includes(section.id) ? (
                  <ChevronDown size={16} className="text-white/40" />
                ) : (
                  <ChevronRight size={16} className="text-white/40" />
                )}
                <span className="font-bold text-white">{section.title}</span>
                <span className="text-xs px-2 py-0.5 bg-white/10 rounded-full text-white/50 ml-2">
                  {section.tasks.length}
                </span>
              </motion.button>

              {/* Tasks */}
              {expandedSections.includes(section.id) && (
                <div>
                  {section.tasks.map((task, taskIndex) => (
                    <div key={task.id}>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: taskIndex * 0.05 }}
                        className="px-6 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors group"
                      >
                        {task.subtasks ? (
                          <button onClick={() => toggleTask(task.id)} className="text-white/40 hover:text-white/80 transition-colors">
                            {expandedTasks.includes(task.id) ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronRight size={16} />
                            )}
                          </button>
                        ) : (
                          <div className="w-4" />
                        )}

                        <motion.button
                          className="text-white/30 hover:text-white/60"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {task.completed ? (
                            <CheckCircle2 size={18} className="text-emerald-400" />
                          ) : (
                            <Circle size={18} />
                          )}
                        </motion.button>

                        <span className={`flex-1 text-sm ${task.completed ? 'text-white/40 line-through' : 'text-white/90'}`}>
                          {task.title}
                        </span>

                        <div className="flex items-center gap-4 text-white/40">
                          <div className="flex items-center gap-1.5 text-xs bg-white/5 px-2 py-1 rounded-md">
                            <Calendar size={12} />
                            <span>{task.dueDate}</span>
                          </div>

                          <div className={`${priorityColors[task.priority]}`}>
                            <Flag size={14} />
                          </div>

                          <motion.div
                            className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white shadow-lg"
                            whileHover={{ scale: 1.1 }}
                          >
                            {task.assignee.split(' ').map(n => n[0]).join('')}
                          </motion.div>

                          <button className="opacity-0 group-hover:opacity-100 transition-opacity text-white/40 hover:text-white/80">
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                      </motion.div>

                      {/* Subtasks */}
                      {task.subtasks && expandedTasks.includes(task.id) && (
                        <div className="bg-white/5">
                          {task.subtasks.map((subtask) => (
                            <motion.div
                              key={subtask.id}
                              className="pl-20 pr-6 py-2.5 flex items-center gap-3 hover:bg-white/5 transition-colors"
                              whileHover={{ x: 3 }}
                            >
                              <motion.button
                                className="text-white/30 hover:text-white/60"
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                {subtask.completed ? (
                                  <CheckCircle2 size={16} className="text-emerald-400" />
                                ) : (
                                  <Circle size={16} />
                                )}
                              </motion.button>
                              <span className={`text-sm ${subtask.completed ? 'text-white/40 line-through' : 'text-white/70'}`}>
                                {subtask.title}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
