import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ArrowRight, Sparkles, BookOpen, Target, Award, Users } from 'lucide-react';

export function PinProtection({ children, onAuthenticated }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [traineeName, setTraineeName] = useState('');
  const [isEntering, setIsEntering] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const inputRef = useRef(null);

  // Check if already authenticated this session
  // Require both auth flag AND trainee name to skip welcome screen
  useEffect(() => {
    const authenticated = sessionStorage.getItem('cstc-authenticated');
    const savedName = sessionStorage.getItem('cstc-trainee-name');

    // Only skip welcome if we have BOTH auth and a name
    if (authenticated === 'true' && savedName && savedName.trim()) {
      setIsAuthenticated(true);
      setTraineeName(savedName);
      // Pass the saved name to the callback
      onAuthenticated?.(savedName);
    } else {
      // Clear incomplete auth state and show welcome
      sessionStorage.removeItem('cstc-authenticated');
      sessionStorage.removeItem('cstc-trainee-name');
    }
  }, [onAuthenticated]);

  // Focus input on mount
  useEffect(() => {
    if (!isAuthenticated && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 500);
    }
  }, [isAuthenticated]);

  const handleEnter = () => {
    if (!traineeName.trim()) return;

    setIsEntering(true);
    setShowWelcome(true);

    const name = traineeName.trim();
    setTimeout(() => {
      sessionStorage.setItem('cstc-authenticated', 'true');
      sessionStorage.setItem('cstc-trainee-name', name);
      setIsAuthenticated(true);
      // Pass the trainee name to the callback
      onAuthenticated?.(name);
    }, 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && traineeName.trim()) {
      handleEnter();
    }
  };

  // If authenticated, show children
  if (isAuthenticated) {
    return children;
  }

  const features = [
    { icon: BookOpen, text: 'Google Calendar Mastery', color: 'from-blue-500 to-cyan-500' },
    { icon: Target, text: 'Trello Project Management', color: 'from-purple-500 to-pink-500' },
    { icon: Users, text: 'Gmail Communication', color: 'from-red-500 to-orange-500' },
    { icon: Award, text: 'Google Docs Proficiency', color: 'from-emerald-500 to-teal-500' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto overflow-x-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 min-h-full">
        {/* Animated orbs */}
        <motion.div
          className="absolute w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-cyan-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '-10%', left: '-10%' }}
        />
        <motion.div
          className="absolute w-40 sm:w-56 md:w-80 h-40 sm:h-56 md:h-80 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          style={{ bottom: '-10%', right: '-10%' }}
        />
        <motion.div
          className="absolute w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-emerald-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -80, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '40%', right: '20%' }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Welcome Animation Overlay */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-xl px-4"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-5 md:mb-6 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center"
              >
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3"
              >
                Welcome, {traineeName}!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-white/60 text-sm sm:text-base md:text-lg"
              >
                Preparing your training experience...
              </motion.p>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="w-32 sm:w-40 md:w-48 h-1 mx-auto mt-4 sm:mt-5 md:mt-6 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full origin-left"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-4xl mx-4 my-6 sm:my-8 md:my-auto py-4 sm:py-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Left side - Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col justify-center text-center md:text-left"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
              className="mb-4 sm:mb-6 md:mb-8 flex justify-center md:justify-start"
            >
              <div className="relative inline-block">
                <img
                  src="/cstc-logo.jpg"
                  alt="CSTC Logo"
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl sm:rounded-2xl object-cover shadow-2xl shadow-cyan-500/20 border-2 border-white/20"
                />
                <motion.div
                  className="absolute inset-0 rounded-xl sm:rounded-2xl border-2 border-cyan-400/50"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 md:mb-8 leading-tight">
              Productivity Tools
              <span className="block bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent pb-2">
                Training Program
              </span>
            </h1>

            <p className="text-white/60 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 md:mb-8 leading-relaxed max-w-md mx-auto md:mx-0">
              Enhance your productivity as a public servant by mastering essential digital tools used in modern government operations.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 md:p-3 rounded-lg sm:rounded-xl bg-white/5 border border-white/10"
                >
                  <div className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-md sm:rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0`}>
                    <feature.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white" />
                  </div>
                  <span className="text-white/80 text-[10px] sm:text-xs md:text-sm leading-tight">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right side - Entry form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center mt-4 md:mt-0"
          >
            <div className="w-full max-w-sm bg-white/10 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl overflow-hidden p-4 sm:p-6 md:p-8">
              <div className="text-center mb-4 sm:mb-6 md:mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.5 }}
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-xl sm:rounded-2xl flex items-center justify-center"
                >
                  <User className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </motion.div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">
                  Welcome, Trainee!
                </h2>
                <p className="text-white/60 text-xs sm:text-sm">
                  Enter your name to begin the training
                </p>
              </div>

              {/* Name input */}
              <div className="space-y-3 sm:space-y-4">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={traineeName}
                    onChange={(e) => setTraineeName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Your full name"
                    disabled={isEntering}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white/5 border border-white/20 rounded-lg sm:rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all text-center text-base sm:text-lg disabled:opacity-50"
                  />
                  {traineeName && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                    </motion.div>
                  )}
                </div>

                <motion.button
                  onClick={handleEnter}
                  disabled={!traineeName.trim() || isEntering}
                  className={`w-full py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg flex items-center justify-center gap-2 transition-all ${
                    traineeName.trim() && !isEntering
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30'
                      : 'bg-white/10 text-white/40 cursor-not-allowed'
                  }`}
                  whileHover={traineeName.trim() && !isEntering ? { scale: 1.02 } : {}}
                  whileTap={traineeName.trim() && !isEntering ? { scale: 0.98 } : {}}
                >
                  {isEntering ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Starting...
                    </>
                  ) : (
                    <>
                      Start Training
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </>
                  )}
                </motion.button>
              </div>

              {/* Help text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center text-white/30 text-[10px] sm:text-xs mt-4 sm:mt-6"
              >
                Your name will be used to personalize your experience
              </motion.p>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6 sm:mt-8 md:mt-12"
        >
          <p className="text-white/30 text-[10px] sm:text-xs md:text-sm">
            Civil Service Training Centre &bull; Productivity Tools Training Program
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Hook for getting trainee info
export function useTrainee() {
  const [traineeName, setTraineeName] = useState('');

  useEffect(() => {
    const name = sessionStorage.getItem('cstc-trainee-name');
    if (name) setTraineeName(name);
  }, []);

  return { traineeName };
}

// Hook for checking authentication status
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authenticated = sessionStorage.getItem('cstc-authenticated');
    setIsAuthenticated(authenticated === 'true');
  }, []);

  const logout = () => {
    sessionStorage.removeItem('cstc-authenticated');
    sessionStorage.removeItem('cstc-trainee-name');
    setIsAuthenticated(false);
    window.location.reload();
  };

  return { isAuthenticated, logout };
}
