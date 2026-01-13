import { useState } from 'react';
import { motion } from 'framer-motion';
import { SlideWrapper } from './SlideContainer';
import {
  Mail,
  Send,
  CheckCircle2,
  Calendar,
  Bell,
  QrCode,
  Smartphone,
  ExternalLink,
  ArrowRight,
  Clock,
  BookOpen,
  Users
} from 'lucide-react';

export function FollowUpSlide({ onEmailSubmit, onNameSubmit }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter your name';
    }
    if (!email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitted(true);
    if (onEmailSubmit) onEmailSubmit(email);
    if (onNameSubmit) onNameSubmit(name);
  };

  const followUpContent = [
    { day: 'Day 1', tip: 'Block your first focus time on Google Calendar', icon: Calendar },
    { day: 'Day 3', tip: 'Create your first Trello board for a current project', icon: Clock },
    { day: 'Day 7', tip: 'Check-in: How many times did you update your board?', icon: Bell },
    { day: 'Day 14', tip: 'Try Asana for your most complex project', icon: BookOpen },
    { day: 'Day 30', tip: 'Share your experience with your team', icon: Users },
  ];

  return (
    <SlideWrapper className="bg-gradient-to-br from-emerald-50 to-cyan-50">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-2xl shadow-lg mb-4">
          <Bell className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
          Stay on Track
        </h2>
        <p className="text-slate-500 max-w-xl mx-auto">
          Get helpful reminders and tips delivered to your inbox over the next 30 days
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Sign Up Form */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {!submitted ? (
            <>
              <div className="flex items-center gap-2 mb-6">
                <Mail className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-slate-800">Get Follow-Up Tips</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors((prev) => ({ ...prev, name: null }));
                    }}
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none focus:ring-0 ${
                      errors.name
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-slate-200 focus:border-emerald-500'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Work Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors((prev) => ({ ...prev, email: null }));
                    }}
                    placeholder="your.name@agency.gov"
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none focus:ring-0 ${
                      errors.email
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-slate-200 focus:border-emerald-500'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-shadow"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send className="w-5 h-5" />
                  <span>Subscribe to Tips</span>
                </motion.button>

                <p className="text-xs text-slate-400 text-center">
                  We'll send you helpful reminders over the next 30 days. Unsubscribe anytime.
                </p>
              </form>
            </>
          ) : (
            <motion.div
              className="text-center py-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div
                className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: 2, duration: 0.3 }}
              >
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </motion.div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">You're All Set!</h3>
              <p className="text-slate-500 mb-4">
                Check your inbox for your first tip
              </p>
              <p className="text-sm text-slate-400">
                Subscribed as: <span className="font-medium">{email}</span>
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Right: What You'll Receive */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-cyan-500" />
            <h3 className="font-bold text-slate-800">Your 30-Day Journey</h3>
          </div>

          <div className="space-y-3">
            {followUpContent.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-100 to-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-cyan-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider">
                    {item.day}
                  </span>
                  <p className="text-sm text-slate-600">{item.tip}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom: QR Code & Direct Links */}
      <motion.div
        className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-slate-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* QR Code */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-32 h-32 bg-slate-100 rounded-xl flex items-center justify-center">
              <QRCodeDisplay />
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Smartphone size={16} />
              <span>Scan for mobile access</span>
            </div>
          </div>

          {/* Or divider */}
          <div className="hidden md:flex flex-col items-center gap-2">
            <div className="w-px h-16 bg-slate-200" />
            <span className="text-slate-400 text-sm">or</span>
            <div className="w-px h-16 bg-slate-200" />
          </div>

          {/* Direct Links */}
          <div className="flex-1">
            <h4 className="font-semibold text-slate-800 mb-4">Quick Links to Get Started</h4>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { name: 'Google Calendar', url: 'https://calendar.google.com', color: 'blue' },
                { name: 'Trello', url: 'https://trello.com', color: 'sky' },
                { name: 'Asana', url: 'https://app.asana.com', color: 'rose' },
              ].map((tool) => (
                <a
                  key={tool.name}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-4 py-3 bg-${tool.color}-50 border border-${tool.color}-200 rounded-xl text-${tool.color}-700 font-medium hover:bg-${tool.color}-100 transition-colors`}
                >
                  <span>{tool.name}</span>
                  <ExternalLink size={16} className="ml-auto" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </SlideWrapper>
  );
}

// Simple QR Code Display (SVG pattern)
function QRCodeDisplay() {
  // This creates a simple QR-like pattern. In production, you'd use a real QR library
  const pattern = [
    [1,1,1,1,1,1,1,0,1,1,0,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0],
    [1,0,1,1,0,1,1,1,0,0,1,0,0,1,0,1,1,0,1],
    [0,1,0,0,1,0,0,1,1,0,1,1,0,0,1,0,0,1,0],
    [1,0,1,0,1,0,1,0,1,1,0,0,1,1,0,1,0,1,1],
    [0,0,0,0,0,0,0,0,1,0,1,0,0,1,0,0,1,0,0],
    [1,1,1,1,1,1,1,0,0,1,0,1,1,0,1,1,0,1,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,0,1,0,0,1,0,0],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,0,1,1,0,1,1],
    [1,0,1,1,1,0,1,0,1,0,0,1,0,1,0,0,1,0,0],
    [1,0,1,1,1,0,1,0,0,1,0,0,1,1,1,0,1,1,1],
    [1,0,0,0,0,0,1,0,1,0,1,1,0,0,0,1,0,0,0],
    [1,1,1,1,1,1,1,0,0,1,0,0,1,0,1,1,1,1,1],
  ];

  return (
    <svg viewBox="0 0 19 19" className="w-24 h-24">
      {pattern.map((row, y) =>
        row.map((cell, x) =>
          cell ? (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              fill="#1e293b"
            />
          ) : null
        )
      )}
    </svg>
  );
}
