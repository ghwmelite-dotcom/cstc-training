import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

export function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = useCallback((totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const toggle = () => setIsRunning(r => !r);
  const reset = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-3xl font-mono font-bold text-white">
        {formatTime(seconds)}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={toggle}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          {isRunning ? (
            <Pause size={20} className="text-white" />
          ) : (
            <Play size={20} className="text-white" />
          )}
        </button>
        <button
          onClick={reset}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <RotateCcw size={18} className="text-white/70" />
        </button>
      </div>
    </div>
  );
}
