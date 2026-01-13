import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlideWrapper } from './SlideContainer';
import {
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  ArrowRight,
  Shield,
  Zap,
  Heart,
  Target,
  Users,
  Clock,
  HelpCircle
} from 'lucide-react';

export function ResistanceSlide({ objections, step = 0 }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const iconMap = {
    time: Clock,
    team: Users,
    change: Shield,
    value: Target,
    default: HelpCircle,
  };

  return (
    <SlideWrapper className="bg-gradient-to-br from-violet-50 to-indigo-50">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl shadow-lg mb-4">
          <Shield className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
          Addressing Common Concerns
        </h2>
        <p className="text-slate-500">
          Let's tackle the "yeah, but..." moments together
        </p>
      </motion.div>

      {/* Objections Accordion */}
      <div className="space-y-3 max-w-3xl mx-auto">
        {objections.map((objection, index) => {
          const Icon = iconMap[objection.type] || iconMap.default;
          const isExpanded = expandedIndex === index;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: step >= index ? 1 : 0.4, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100"
            >
              {/* Question Header */}
              <button
                onClick={() => toggleExpand(index)}
                className="w-full p-4 sm:p-5 flex items-center gap-4 text-left hover:bg-slate-50 transition-colors"
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isExpanded
                    ? 'bg-gradient-to-br from-violet-500 to-indigo-500'
                    : 'bg-violet-100'
                }`}>
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isExpanded ? 'text-white' : 'text-violet-600'}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageCircle className="w-4 h-4 text-violet-400" />
                    <span className="text-xs font-medium text-violet-500 uppercase tracking-wider">
                      Common Objection
                    </span>
                  </div>
                  <p className="font-semibold text-slate-800 text-sm sm:text-base">
                    "{objection.objection}"
                  </p>
                </div>

                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                </motion.div>
              </button>

              {/* Answer Panel */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-slate-100">
                      {/* Response */}
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 mb-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Lightbulb className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <span className="font-semibold text-emerald-800 text-sm">Response:</span>
                            <p className="text-emerald-700 mt-1">{objection.response}</p>
                          </div>
                        </div>
                      </div>

                      {/* Quick Win */}
                      {objection.quickWin && (
                        <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                          <Zap className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-amber-800 text-sm">Quick Win: </span>
                            <span className="text-amber-700 text-sm">{objection.quickWin}</span>
                          </div>
                        </div>
                      )}

                      {/* Proof Points */}
                      {objection.proofPoints && (
                        <div className="mt-4 grid sm:grid-cols-2 gap-2">
                          {objection.proofPoints.map((point, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg"
                            >
                              <ArrowRight className="w-4 h-4 text-violet-500" />
                              <span className="text-sm text-slate-600">{point}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: step >= objections.length ? 1 : 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 px-5 py-3 bg-white rounded-full shadow-md border border-slate-100">
          <Heart className="w-5 h-5 text-rose-500" />
          <span className="text-slate-600 text-sm">
            Remember: Change is hard, but the payoff is worth it
          </span>
        </div>
      </motion.div>
    </SlideWrapper>
  );
}
