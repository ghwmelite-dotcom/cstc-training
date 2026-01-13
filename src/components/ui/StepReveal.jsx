import { motion } from 'framer-motion';

export function StepReveal({ children, step, index, className = '' }) {
  const isVisible = step >= index;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        x: isVisible ? 0 : -20,
      }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StepRevealList({ items, step, renderItem, className = '' }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item, index) => (
        <StepReveal key={index} step={step} index={index}>
          {renderItem ? renderItem(item, index) : item}
        </StepReveal>
      ))}
    </div>
  );
}

export function AnimatedCounter({ value, step, index, duration = 1.5, suffix = '' }) {
  const isVisible = step >= index;

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
    >
      {isVisible && (
        <motion.span
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
        >
          <CountUp end={value} duration={duration} />{suffix}
        </motion.span>
      )}
    </motion.span>
  );
}

function CountUp({ end, duration }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.span
        initial={{ count: 0 }}
        animate={{ count: end }}
        transition={{ duration, ease: 'easeOut' }}
      >
        {({ count }) => Math.round(count || end)}
      </motion.span>
    </motion.span>
  );
}
