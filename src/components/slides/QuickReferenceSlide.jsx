import { useState } from 'react';
import { motion } from 'framer-motion';
import { SlideWrapper } from './SlideContainer';
import {
  Download,
  FileText,
  Calendar,
  LayoutGrid,
  CheckSquare,
  Keyboard,
  ArrowRight,
  Printer,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export function QuickReferenceSlide({ onDownload }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      if (onDownload) onDownload();
      setDownloading(false);
    }, 1500);
  };

  const shortcuts = [
    { keys: ['→', 'Space'], action: 'Next slide/step' },
    { keys: ['←', 'Backspace'], action: 'Previous slide/step' },
    { keys: ['↑', '↓'], action: 'Next/prev slide' },
    { keys: ['P'], action: 'Presenter view' },
    { keys: ['1-9'], action: 'Jump to slide' },
    { keys: ['Home'], action: 'First slide' },
    { keys: ['End'], action: 'Last slide' },
  ];

  const decisionTree = [
    { condition: 'Need to schedule time?', tool: 'Google Calendar', color: 'blue' },
    { condition: 'Tracking a simple workflow?', tool: 'Trello', color: 'sky' },
    { condition: 'Managing a complex project?', tool: 'Asana', color: 'rose' },
  ];

  const weekOneChecklist = [
    { task: 'Block 2 hours of focus time', tool: 'calendar' },
    { task: 'Add one recurring meeting', tool: 'calendar' },
    { task: 'Create a personal task board', tool: 'trello' },
    { task: 'Move 3 tasks through stages', tool: 'trello' },
    { task: 'Create an Asana project', tool: 'asana' },
    { task: 'Add subtasks to one task', tool: 'asana' },
  ];

  return (
    <SlideWrapper className="bg-gradient-to-br from-cyan-50 to-blue-50">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Quick Reference Card</h2>
            <p className="text-sm text-slate-500">Print this and keep it at your desk</p>
          </div>
        </div>

        <motion.button
          onClick={handleDownload}
          disabled={downloading}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium shadow-md transition-all ${
            downloading
              ? 'bg-emerald-500 text-white'
              : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {downloading ? (
            <>
              <CheckCircle2 className="w-5 h-5 animate-pulse" />
              <span>Preparing...</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>Download PDF</span>
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Which Tool to Use */}
        <motion.div
          className="bg-white rounded-xl p-5 shadow-md border border-slate-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-cyan-500" />
            <h3 className="font-bold text-slate-800">Which Tool?</h3>
          </div>

          <div className="space-y-3">
            {decisionTree.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <ArrowRight className={`w-4 h-4 text-${item.color}-500`} />
                <div className="flex-1">
                  <p className="text-sm text-slate-600">{item.condition}</p>
                  <p className={`font-semibold text-${item.color}-600`}>{item.tool}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Keyboard Shortcuts */}
        <motion.div
          className="bg-white rounded-xl p-5 shadow-md border border-slate-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Keyboard className="w-5 h-5 text-violet-500" />
            <h3 className="font-bold text-slate-800">Presentation Keys</h3>
          </div>

          <div className="space-y-2">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex gap-1">
                  {shortcut.keys.map((key, i) => (
                    <span key={i}>
                      <kbd className="px-2 py-1 bg-slate-100 rounded text-xs font-mono font-bold text-slate-600">
                        {key}
                      </kbd>
                      {i < shortcut.keys.length - 1 && (
                        <span className="text-slate-400 mx-1">/</span>
                      )}
                    </span>
                  ))}
                </div>
                <span className="text-slate-500">{shortcut.action}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Week One Checklist */}
        <motion.div
          className="bg-white rounded-xl p-5 shadow-md border border-slate-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <CheckSquare className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-slate-800">Week One Checklist</h3>
          </div>

          <div className="space-y-2">
            {weekOneChecklist.map((item, index) => {
              const toolIcons = {
                calendar: Calendar,
                trello: LayoutGrid,
                asana: CheckSquare,
              };
              const Icon = toolIcons[item.tool];
              const colors = {
                calendar: 'text-blue-500',
                trello: 'text-sky-500',
                asana: 'text-rose-500',
              };

              return (
                <label
                  key={index}
                  className="flex items-start gap-2 text-sm cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-slate-600 group-hover:text-slate-800">
                    {item.task}
                  </span>
                  <Icon className={`w-4 h-4 ${colors[item.tool]} ml-auto`} />
                </label>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Print Hint */}
      <motion.div
        className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Printer size={16} />
        <span>Tip: Press Ctrl+P (Cmd+P on Mac) to print this page directly</span>
      </motion.div>
    </SlideWrapper>
  );
}
