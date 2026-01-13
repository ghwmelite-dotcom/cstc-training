import { motion } from 'framer-motion';
import { AnimatedBackground, GlassCard } from '../ui/AnimatedBackground';
import { CheckCircle2, AlertCircle, Lightbulb, ArrowRight, Zap } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export function GlassContentSlide({ title, children, variant = 'default', step = 0 }) {
  const { isDark } = useTheme();

  return (
    <div className="relative min-h-[500px] flex items-center justify-center overflow-hidden rounded-3xl">
      {isDark && <AnimatedBackground variant={variant} />}
      {!isDark && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-blue-50/50 to-indigo-100 rounded-3xl" />
      )}

      <div className="relative z-10 w-full max-w-5xl px-6">
        <div className={`rounded-3xl border backdrop-blur-xl p-8 md:p-12 ${
          isDark
            ? 'bg-white/10 border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
            : 'bg-white/80 border-slate-200 shadow-xl'
        }`}>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-3xl md:text-4xl font-bold mb-8 ${
              isDark ? 'text-white' : 'text-slate-800'
            }`}
          >
            {title}
          </motion.h2>
          {typeof children === 'function' ? children(step) : children}
        </div>
      </div>
    </div>
  );
}

export function GlassBulletList({ items, step, type = 'default' }) {
  const { isDark } = useTheme();

  const configs = {
    default: {
      icon: ArrowRight,
      iconBg: isDark ? 'bg-cyan-500/20' : 'bg-cyan-100',
      iconColor: isDark ? 'text-cyan-400' : 'text-cyan-600',
      cardBg: isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:bg-slate-50',
      border: isDark ? 'border-white/10' : 'border-slate-200',
    },
    pain: {
      icon: AlertCircle,
      iconBg: isDark ? 'bg-red-500/20' : 'bg-red-100',
      iconColor: isDark ? 'text-red-400' : 'text-red-600',
      cardBg: isDark ? 'bg-red-500/5 hover:bg-red-500/10' : 'bg-red-50 hover:bg-red-100',
      border: isDark ? 'border-red-500/20' : 'border-red-200',
    },
    solution: {
      icon: CheckCircle2,
      iconBg: isDark ? 'bg-emerald-500/20' : 'bg-emerald-100',
      iconColor: isDark ? 'text-emerald-400' : 'text-emerald-600',
      cardBg: isDark ? 'bg-emerald-500/5 hover:bg-emerald-500/10' : 'bg-emerald-50 hover:bg-emerald-100',
      border: isDark ? 'border-emerald-500/20' : 'border-emerald-200',
    },
    tip: {
      icon: Lightbulb,
      iconBg: isDark ? 'bg-amber-500/20' : 'bg-amber-100',
      iconColor: isDark ? 'text-amber-400' : 'text-amber-600',
      cardBg: isDark ? 'bg-amber-500/5 hover:bg-amber-500/10' : 'bg-amber-50 hover:bg-amber-100',
      border: isDark ? 'border-amber-500/20' : 'border-amber-200',
    },
  };

  const config = configs[type] || configs.default;
  const Icon = config.icon;

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -30 }}
          animate={{
            opacity: step >= index ? 1 : 0.3,
            x: step >= index ? 0 : -30,
          }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className={`
            p-5 rounded-2xl border backdrop-blur-sm
            transition-all duration-300 cursor-default
            ${config.cardBg} ${config.border}
          `}
        >
          <div className="flex items-start gap-4">
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
              ${config.iconBg}
            `}>
              <Icon className={`w-6 h-6 ${config.iconColor}`} />
            </div>
            <div className="flex-1 pt-1">
              <h3 className={`font-bold text-lg mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {typeof item === 'string' ? item : item.title}
              </h3>
              {typeof item !== 'string' && item.description && (
                <p className={`text-sm leading-relaxed ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
                  {item.description}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function GlassThreeColumn({ items, step }) {
  const { isDark } = useTheme();

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{
              opacity: step >= index ? 1 : 0.3,
              y: step >= index ? 0 : 30,
              scale: step >= index ? 1 : 0.9,
            }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className={`
              relative p-6 rounded-2xl
              ${isDark
                ? 'bg-gradient-to-br from-white/10 to-white/5 border border-white/20'
                : 'bg-white border border-slate-200 shadow-lg'
              }
              backdrop-blur-sm
              group cursor-default
              overflow-hidden
            `}
          >
            {/* Glow effect on hover */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${
              isDark
                ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20'
                : 'bg-gradient-to-br from-cyan-100/50 to-blue-100/50'
            }`} />

            <div className="relative z-10 text-center">
              {Icon && (
                <motion.div
                  className={`
                    inline-flex items-center justify-center w-16 h-16 mb-4
                    rounded-2xl bg-gradient-to-br
                    ${item.gradient || 'from-cyan-500 to-blue-500'}
                    shadow-lg
                  `}
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="w-8 h-8 text-white" />
                </motion.div>
              )}
              <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {item.title}
              </h3>
              <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
                {item.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function GlassStatCard({ stats, step }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: step >= index ? 1 : 0.3,
            scale: step >= index ? 1 : 0.5,
          }}
          transition={{
            type: 'spring',
            stiffness: 200,
            delay: index * 0.1,
          }}
          className={`
            p-6 rounded-2xl text-center
            bg-gradient-to-br ${stat.positive ? 'from-emerald-500/20 to-teal-500/20' : 'from-cyan-500/20 to-blue-500/20'}
            border border-white/10
            backdrop-blur-sm
          `}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
            className="text-4xl md:text-5xl font-black text-white mb-2"
          >
            {stat.value}
          </motion.div>
          <div className="text-white/60 text-sm font-medium">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}

export function FeatureShowcase({ icon: Icon, title, features, gradient = 'from-cyan-500 to-blue-500' }) {
  return (
    <div className="relative min-h-[500px] flex items-center overflow-hidden rounded-3xl">
      <AnimatedBackground variant="default" />

      <div className="relative z-10 w-full px-6 py-12">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Icon showcase */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 100 }}
              className={`
                inline-flex items-center justify-center w-32 h-32
                rounded-3xl bg-gradient-to-br ${gradient}
                shadow-2xl mb-8
              `}
            >
              <Icon className="w-16 h-16 text-white" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-black text-white mb-4"
            >
              {title}
            </motion.h2>
          </div>

          {/* Right: Features */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
              >
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">{feature.title}</h4>
                  <p className="text-white/60 text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
