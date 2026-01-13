import { motion } from 'framer-motion';

export function AnimatedBackground({ variant = 'default' }) {
  const variants = {
    default: {
      gradient: 'from-slate-900 via-purple-900 to-slate-900',
      orbs: [
        { color: 'bg-purple-500', size: 'w-96 h-96', position: 'top-0 -left-48', delay: 0 },
        { color: 'bg-cyan-500', size: 'w-80 h-80', position: 'top-1/4 -right-40', delay: 2 },
        { color: 'bg-pink-500', size: 'w-72 h-72', position: 'bottom-0 left-1/4', delay: 4 },
      ],
    },
    calendar: {
      gradient: 'from-blue-900 via-indigo-900 to-slate-900',
      orbs: [
        { color: 'bg-blue-500', size: 'w-96 h-96', position: 'top-0 -right-48', delay: 0 },
        { color: 'bg-cyan-400', size: 'w-72 h-72', position: 'bottom-0 -left-36', delay: 2 },
      ],
    },
    trello: {
      gradient: 'from-sky-900 via-indigo-900 to-slate-900',
      orbs: [
        { color: 'bg-sky-500', size: 'w-80 h-80', position: '-top-40 left-1/4', delay: 0 },
        { color: 'bg-indigo-400', size: 'w-96 h-96', position: 'bottom-0 -right-48', delay: 3 },
      ],
    },
    asana: {
      gradient: 'from-rose-900 via-purple-900 to-slate-900',
      orbs: [
        { color: 'bg-rose-500', size: 'w-72 h-72', position: 'top-1/4 -left-36', delay: 0 },
        { color: 'bg-orange-400', size: 'w-80 h-80', position: '-bottom-40 right-1/4', delay: 2 },
      ],
    },
    success: {
      gradient: 'from-emerald-900 via-teal-900 to-slate-900',
      orbs: [
        { color: 'bg-emerald-500', size: 'w-96 h-96', position: '-top-48 -right-48', delay: 0 },
        { color: 'bg-cyan-400', size: 'w-72 h-72', position: 'bottom-1/4 -left-36', delay: 2 },
      ],
    },
  };

  const config = variants[variant] || variants.default;

  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} overflow-hidden`}>
      {/* Animated orbs */}
      {config.orbs.map((orb, index) => (
        <motion.div
          key={index}
          className={`absolute ${orb.size} ${orb.position} ${orb.color} rounded-full blur-3xl opacity-30`}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            delay: Math.random() * 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

export function GlassCard({ children, className = '', intensity = 'medium' }) {
  const intensities = {
    light: 'bg-white/5 border-white/10',
    medium: 'bg-white/10 border-white/20',
    strong: 'bg-white/20 border-white/30',
  };

  return (
    <div className={`
      relative rounded-3xl border backdrop-blur-xl
      ${intensities[intensity]}
      shadow-[0_8px_32px_rgba(0,0,0,0.3)]
      ${className}
    `}>
      {/* Gradient border effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 pointer-events-none" />
      {children}
    </div>
  );
}

export function FloatingShapes() {
  const shapes = [
    { type: 'circle', size: 'w-4 h-4', color: 'bg-cyan-400/30' },
    { type: 'square', size: 'w-3 h-3', color: 'bg-purple-400/30', rotate: true },
    { type: 'circle', size: 'w-2 h-2', color: 'bg-pink-400/30' },
    { type: 'triangle', size: 'w-4 h-4', color: 'bg-amber-400/30' },
  ];

  return (
    <>
      {[...Array(12)].map((_, i) => {
        const shape = shapes[i % shapes.length];
        return (
          <motion.div
            key={i}
            className={`absolute ${shape.size} ${shape.color} ${
              shape.type === 'circle' ? 'rounded-full' :
              shape.type === 'square' ? 'rounded-sm' :
              'clip-triangle'
            }`}
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              rotate: shape.rotate ? [0, 180, 360] : 0,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        );
      })}
    </>
  );
}
