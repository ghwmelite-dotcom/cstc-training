import { motion } from 'framer-motion';
import { SlideWrapper } from './SlideContainer';

export function TitleSlide({ title, subtitle, icon: Icon, accent = 'cyan' }) {
  const accentColors = {
    cyan: 'from-cyan-500 to-blue-500',
    indigo: 'from-indigo-500 to-purple-500',
    emerald: 'from-emerald-500 to-teal-500',
    amber: 'from-amber-500 to-orange-500',
  };

  return (
    <SlideWrapper className="flex flex-col items-center justify-center text-center">
      {Icon && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${accentColors[accent]} flex items-center justify-center mb-8 shadow-lg`}
        >
          <Icon className="w-10 h-10 text-white" />
        </motion.div>
      )}

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-5xl font-bold text-slate-800 mb-4"
      >
        {title}
      </motion.h1>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-xl text-slate-500 max-w-2xl"
        >
          {subtitle}
        </motion.p>
      )}

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className={`w-24 h-1 bg-gradient-to-r ${accentColors[accent]} rounded-full mt-8`}
      />
    </SlideWrapper>
  );
}

export function SectionTitleSlide({ section, title, subtitle, icon: Icon, accent = 'cyan' }) {
  const accentColors = {
    cyan: 'text-cyan-500',
    indigo: 'text-indigo-500',
    emerald: 'text-emerald-500',
    amber: 'text-amber-500',
  };

  const bgColors = {
    cyan: 'bg-cyan-50',
    indigo: 'bg-indigo-50',
    emerald: 'bg-emerald-50',
    amber: 'bg-amber-50',
  };

  return (
    <SlideWrapper className={`flex flex-col items-center justify-center text-center ${bgColors[accent]}`}>
      <motion.span
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`text-sm font-semibold uppercase tracking-wider ${accentColors[accent]} mb-4`}
      >
        {section}
      </motion.span>

      {Icon && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="mb-6"
        >
          <Icon className={`w-16 h-16 ${accentColors[accent]}`} />
        </motion.div>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-4xl font-bold text-slate-800 mb-4"
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-lg text-slate-600 max-w-xl"
        >
          {subtitle}
        </motion.p>
      )}
    </SlideWrapper>
  );
}
