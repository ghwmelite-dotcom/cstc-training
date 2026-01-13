import { motion, AnimatePresence } from 'framer-motion';

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
    scale: 0.8,
    rotateY: direction > 0 ? 15 : -15,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
  },
  exit: (direction) => ({
    x: direction < 0 ? 200 : -200,
    opacity: 0,
    scale: 0.8,
    rotateY: direction < 0 ? 15 : -15,
  }),
};

export function SlideContainer({ children, slideKey, direction = 1 }) {
  return (
    <div className="relative w-full h-full overflow-hidden" style={{ perspective: '1500px' }}>
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={slideKey}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 200, damping: 25 },
            opacity: { duration: 0.4 },
            scale: { duration: 0.4 },
            rotateY: { duration: 0.4 },
          }}
          className="absolute inset-0 flex flex-col p-4 md:p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="w-full max-w-7xl mx-auto my-auto">
            {children}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function SlideWrapper({ children, className = '', variant = 'default' }) {
  const variants = {
    default: 'bg-white shadow-2xl',
    dark: 'bg-slate-900 shadow-2xl shadow-purple-500/10',
    glass: 'bg-white/10 backdrop-blur-xl border border-white/20',
    gradient: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        rounded-3xl p-8 md:p-12 min-h-[500px]
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
