import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Shield, Delete, Eye, EyeOff, CheckCircle2, XCircle, Fingerprint } from 'lucide-react';

// Configure your PIN here (in production, this would be environment-based)
const CORRECT_PIN = '2026';

export function PinProtection({ children, onAuthenticated }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockCountdown, setLockCountdown] = useState(0);

  // Check if already authenticated this session
  useEffect(() => {
    const authenticated = sessionStorage.getItem('cstc-authenticated');
    if (authenticated === 'true') {
      setIsAuthenticated(true);
      onAuthenticated?.();
    }
  }, [onAuthenticated]);

  // Lockout countdown timer
  useEffect(() => {
    if (lockCountdown > 0) {
      const timer = setTimeout(() => setLockCountdown(lockCountdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (lockCountdown === 0 && isLocked) {
      setIsLocked(false);
      setAttempts(0);
    }
  }, [lockCountdown, isLocked]);

  // Handle PIN verification
  const verifyPin = useCallback(() => {
    if (pin === CORRECT_PIN) {
      setSuccess(true);
      setError(false);
      setTimeout(() => {
        sessionStorage.setItem('cstc-authenticated', 'true');
        setIsAuthenticated(true);
        onAuthenticated?.();
      }, 1200);
    } else {
      setError(true);
      setPin('');
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      // Lock after 5 failed attempts
      if (newAttempts >= 5) {
        setIsLocked(true);
        setLockCountdown(30); // 30 second lockout
      }

      setTimeout(() => setError(false), 600);
    }
  }, [pin, attempts, onAuthenticated]);

  // Handle keypad input
  const handleKeyPress = (key) => {
    if (isLocked || success) return;

    if (key === 'delete') {
      setPin(prev => prev.slice(0, -1));
    } else if (key === 'clear') {
      setPin('');
    } else if (pin.length < 6) {
      const newPin = pin + key;
      setPin(newPin);

      // Auto-verify when PIN reaches expected length
      if (newPin.length === CORRECT_PIN.length) {
        setTimeout(() => {
          if (newPin === CORRECT_PIN) {
            setSuccess(true);
            setError(false);
            setTimeout(() => {
              sessionStorage.setItem('cstc-authenticated', 'true');
              setIsAuthenticated(true);
              onAuthenticated?.();
            }, 1200);
          } else {
            setError(true);
            setPin('');
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            if (newAttempts >= 5) {
              setIsLocked(true);
              setLockCountdown(30);
            }
            setTimeout(() => setError(false), 600);
          }
        }, 100);
      }
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isAuthenticated || isLocked || success) return;

      if (e.key >= '0' && e.key <= '9') {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleKeyPress('delete');
      } else if (e.key === 'Escape') {
        handleKeyPress('clear');
      } else if (e.key === 'Enter' && pin.length > 0) {
        verifyPin();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated, isLocked, success, pin, handleKeyPress, verifyPin]);

  // If authenticated, show children
  if (isAuthenticated) {
    return children;
  }

  const keypadNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'delete'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        {/* Animated orbs */}
        <motion.div
          className="absolute w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '-10%', left: '-10%' }}
        />
        <motion.div
          className="absolute w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          style={{ bottom: '-10%', right: '-10%' }}
        />
        <motion.div
          className="absolute w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"
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

      {/* Main container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Glass card */}
        <motion.div
          animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="relative px-8 pt-10 pb-6 text-center">
            {/* Success overlay */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center z-20"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Unlock className="w-16 h-16 text-emerald-400 mx-auto mb-3" />
                    </motion.div>
                    <p className="text-emerald-400 font-semibold text-lg">Access Granted</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Logo/Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="relative inline-block mb-6"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <motion.div
                  animate={isLocked ? { rotate: [0, -10, 10, -10, 0] } : {}}
                  transition={{ duration: 0.5, repeat: isLocked ? Infinity : 0, repeatDelay: 2 }}
                >
                  {isLocked ? (
                    <Lock className="w-10 h-10 text-white" />
                  ) : (
                    <Shield className="w-10 h-10 text-white" />
                  )}
                </motion.div>
              </div>

              {/* Pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-cyan-400/50"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-white mb-2">
              CSTC Training Portal
            </h1>
            <p className="text-white/60 text-sm">
              Enter your PIN to access the presentation
            </p>
          </div>

          {/* PIN Display */}
          <div className="px-8 pb-6">
            <div className="flex justify-center items-center gap-3 mb-2">
              {[...Array(CORRECT_PIN.length)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{
                    scale: 1,
                    backgroundColor: pin.length > i
                      ? error
                        ? 'rgb(239, 68, 68)'
                        : success
                          ? 'rgb(34, 197, 94)'
                          : 'rgb(6, 182, 212)'
                      : 'rgba(255, 255, 255, 0.1)'
                  }}
                  transition={{ delay: i * 0.05 }}
                  className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center transition-all duration-200 ${
                    pin.length > i
                      ? error
                        ? 'border-red-500 shadow-lg shadow-red-500/30'
                        : success
                          ? 'border-emerald-500 shadow-lg shadow-emerald-500/30'
                          : 'border-cyan-500 shadow-lg shadow-cyan-500/30'
                      : 'border-white/20'
                  }`}
                >
                  {pin.length > i && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-white text-xl font-bold"
                    >
                      {showPin ? pin[i] : '•'}
                    </motion.span>
                  )}
                </motion.div>
              ))}

              {/* Show/Hide toggle */}
              <button
                onClick={() => setShowPin(!showPin)}
                className="ml-2 p-2 text-white/40 hover:text-white/80 transition-colors"
              >
                {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Error/Lock message */}
            <AnimatePresence>
              {(error || isLocked) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-center gap-2 text-red-400 text-sm mb-4"
                >
                  <XCircle className="w-4 h-4" />
                  {isLocked ? (
                    <span>Too many attempts. Try again in {lockCountdown}s</span>
                  ) : (
                    <span>Incorrect PIN. {5 - attempts} attempts remaining.</span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Keypad */}
          <div className="px-8 pb-8">
            <div className="grid grid-cols-3 gap-3">
              {keypadNumbers.map((key, index) => (
                <motion.button
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.03 }}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleKeyPress(key)}
                  disabled={isLocked || success}
                  className={`
                    h-16 rounded-xl font-semibold text-xl transition-all duration-200
                    ${isLocked || success ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    ${key === 'delete' || key === 'clear'
                      ? 'bg-white/5 text-white/60 hover:text-white'
                      : 'bg-white/10 text-white hover:shadow-lg hover:shadow-cyan-500/20'
                    }
                    border border-white/10 backdrop-blur-sm
                  `}
                >
                  {key === 'delete' ? (
                    <Delete className="w-6 h-6 mx-auto" />
                  ) : key === 'clear' ? (
                    <span className="text-sm">Clear</span>
                  ) : (
                    key
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 pb-6 text-center">
            <p className="text-white/30 text-xs">
              Civil Service Training Centre • Productivity Tools Training
            </p>
          </div>
        </motion.div>

        {/* Keyboard hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-white/30 text-sm mt-6"
        >
          You can also use your keyboard to enter the PIN
        </motion.p>
      </motion.div>
    </div>
  );
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
    setIsAuthenticated(false);
    window.location.reload();
  };

  return { isAuthenticated, logout };
}
