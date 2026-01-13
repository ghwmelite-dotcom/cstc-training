import { motion } from 'framer-motion';
import { SlideWrapper } from './SlideContainer';
import {
  Building2,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Clock,
  Users,
  CheckCircle2,
  Quote,
  ArrowDown,
  Sparkles
} from 'lucide-react';

export function CaseStudySlide({
  department,
  title,
  challenge,
  solution,
  results,
  quote,
  quotePerson,
  quoteRole,
  beforeAfter,
  step = 0
}) {
  return (
    <SlideWrapper className="bg-gradient-to-br from-slate-50 to-cyan-50">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-600">
              Success Story
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{department}</h2>
          </div>
        </div>
      </motion.div>

      {/* Title */}
      <motion.h3
        className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: step >= 0 ? 1 : 0 }}
      >
        {title}
      </motion.h3>

      {/* Before/After Comparison */}
      {beforeAfter && (
        <motion.div
          className="grid md:grid-cols-2 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: step >= 1 ? 1 : 0.3, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Before */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="w-5 h-5 text-red-500" />
              <span className="font-bold text-red-700">Before</span>
            </div>
            <ul className="space-y-2">
              {beforeAfter.before.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-red-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* After */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              <span className="font-bold text-emerald-700">After</span>
            </div>
            <ul className="space-y-2">
              {beforeAfter.after.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}

      {/* Results Stats */}
      {results && (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: step >= 2 ? 1 : 0.3, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {results.map((result, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl p-4 text-center shadow-md border border-slate-100"
              initial={{ scale: 0.8 }}
              animate={{ scale: step >= 2 ? 1 : 0.8 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <div className={`text-3xl sm:text-4xl font-bold mb-1 ${
                result.positive ? 'text-emerald-500' : 'text-cyan-500'
              }`}>
                {result.value}
              </div>
              <div className="text-xs sm:text-sm text-slate-500">{result.label}</div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Quote */}
      {quote && (
        <motion.div
          className="bg-white rounded-xl p-5 sm:p-6 shadow-md border border-slate-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: step >= 3 ? 1 : 0.3, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex gap-4">
            <Quote className="w-8 h-8 text-cyan-300 flex-shrink-0" />
            <div>
              <p className="text-slate-700 text-lg italic mb-4">"{quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {quotePerson?.charAt(0) || 'A'}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{quotePerson}</p>
                  <p className="text-sm text-slate-500">{quoteRole}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </SlideWrapper>
  );
}

export function BeforeAfterSlide({ title, subtitle, comparisons, step = 0 }) {
  return (
    <SlideWrapper className="bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium mb-4">
          <Sparkles size={16} />
          Transformation
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">{title}</h2>
        {subtitle && <p className="text-slate-400 text-lg">{subtitle}</p>}
      </motion.div>

      {/* Comparisons */}
      <div className="space-y-4">
        {comparisons.map((comparison, index) => (
          <motion.div
            key={index}
            className="grid md:grid-cols-[1fr,auto,1fr] gap-4 items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: step >= index ? 1 : 0.3, x: 0 }}
            transition={{ delay: index * 0.15 }}
          >
            {/* Before */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 text-red-400 text-sm font-medium mb-2">
                <TrendingDown size={16} />
                <span>Before</span>
              </div>
              <p className="text-white">{comparison.before}</p>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-center justify-center">
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ArrowRight className="w-8 h-8 text-cyan-400" />
              </motion.div>
            </div>
            <div className="flex md:hidden items-center justify-center">
              <ArrowDown className="w-6 h-6 text-cyan-400" />
            </div>

            {/* After */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-2">
                <TrendingUp size={16} />
                <span>After</span>
              </div>
              <p className="text-white">{comparison.after}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </SlideWrapper>
  );
}
