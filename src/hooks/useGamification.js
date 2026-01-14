import { useState, useCallback, useEffect } from 'react';

const ACHIEVEMENTS = [
  {
    id: 'first_slide',
    title: 'Getting Started',
    description: 'Completed your first slide',
    icon: '🚀',
    points: 10,
    condition: (state) => state.slidesViewed >= 1,
  },
  {
    id: 'halfway',
    title: 'Halfway There',
    description: 'Reached the halfway point',
    icon: '⭐',
    points: 25,
    condition: (state) => state.progress >= 50,
  },
  {
    id: 'quiz_master',
    title: 'Quiz Master',
    description: 'Answered all quiz questions correctly',
    icon: '🏆',
    points: 50,
    condition: (state) => state.quizScore.total > 0 && state.quizScore.correct === state.quizScore.total,
  },
  {
    id: 'quick_learner',
    title: 'Quick Learner',
    description: 'Answered a quiz correctly on first try',
    icon: '⚡',
    points: 15,
    condition: (state) => state.quizScore.correct >= 1,
  },
  {
    id: 'exercise_complete',
    title: 'Hands-On Hero',
    description: 'Completed a Try It Now exercise',
    icon: '💪',
    points: 30,
    condition: (state) => state.exercisesCompleted >= 1,
  },
  {
    id: 'all_exercises',
    title: 'Practice Makes Perfect',
    description: 'Completed all hands-on exercises',
    icon: '🎯',
    points: 75,
    condition: (state) => state.exercisesCompleted >= state.totalExercises,
  },
  {
    id: 'scenario_navigator',
    title: 'Scenario Navigator',
    description: 'Made your first scenario decision',
    icon: '🧭',
    points: 20,
    condition: (state) => state.scenariosCompleted >= 1,
  },
  {
    id: 'fully_engaged',
    title: 'Fully Engaged',
    description: 'Interacted with all interactive elements',
    icon: '🌟',
    points: 100,
    condition: (state) => state.fullyEngaged,
  },
  {
    id: 'completion',
    title: 'Training Complete',
    description: 'Finished the entire training',
    icon: '🎓',
    points: 150,
    condition: (state) => state.progress >= 100,
  },
];

export function useGamification(totalSlides, totalExercises = 3) {
  const [state, setState] = useState(() => {
    // Load trainee name from session storage on init
    const savedName = typeof window !== 'undefined'
      ? sessionStorage.getItem('cstc-trainee-name') || ''
      : '';

    return {
      points: 0,
      slidesViewed: 0,
      maxSlideReached: 0,
      progress: 0,
      quizScore: { correct: 0, total: 0 },
      exercisesCompleted: 0,
      scenariosCompleted: 0,
      totalExercises,
      fullyEngaged: false,
      unlockedAchievements: [],
      newAchievements: [],
      participantName: savedName,
      completedAt: null,
    };
  });

  // Sync trainee name when it changes in session storage
  useEffect(() => {
    const handleStorageChange = () => {
      const name = sessionStorage.getItem('cstc-trainee-name');
      if (name && name !== state.participantName) {
        setState(prev => ({ ...prev, participantName: name }));
      }
    };

    // Check on mount in case auth happened after initial load
    handleStorageChange();

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const checkAchievements = useCallback((currentState) => {
    const newlyUnlocked = [];

    ACHIEVEMENTS.forEach((achievement) => {
      if (
        !currentState.unlockedAchievements.includes(achievement.id) &&
        achievement.condition(currentState)
      ) {
        newlyUnlocked.push(achievement);
      }
    });

    if (newlyUnlocked.length > 0) {
      const newPoints = newlyUnlocked.reduce((sum, a) => sum + a.points, 0);
      setState((prev) => ({
        ...prev,
        points: prev.points + newPoints,
        unlockedAchievements: [
          ...prev.unlockedAchievements,
          ...newlyUnlocked.map((a) => a.id),
        ],
        newAchievements: newlyUnlocked,
      }));
    }

    return newlyUnlocked;
  }, []);

  const updateSlideProgress = useCallback((slideIndex) => {
    setState((prev) => {
      const newMaxSlide = Math.max(prev.maxSlideReached, slideIndex);
      const progress = Math.round(((newMaxSlide + 1) / totalSlides) * 100);
      const newState = {
        ...prev,
        slidesViewed: prev.slidesViewed + (slideIndex > prev.maxSlideReached ? 1 : 0),
        maxSlideReached: newMaxSlide,
        progress,
      };
      setTimeout(() => checkAchievements(newState), 100);
      return newState;
    });
  }, [totalSlides, checkAchievements]);

  const updateQuizScore = useCallback((correct, total) => {
    setState((prev) => {
      const newState = {
        ...prev,
        quizScore: { correct, total },
      };
      setTimeout(() => checkAchievements(newState), 100);
      return newState;
    });
  }, [checkAchievements]);

  const completeExercise = useCallback(() => {
    setState((prev) => {
      const newState = {
        ...prev,
        exercisesCompleted: prev.exercisesCompleted + 1,
      };
      setTimeout(() => checkAchievements(newState), 100);
      return newState;
    });
  }, [checkAchievements]);

  const completeScenario = useCallback(() => {
    setState((prev) => {
      const newState = {
        ...prev,
        scenariosCompleted: prev.scenariosCompleted + 1,
      };
      setTimeout(() => checkAchievements(newState), 100);
      return newState;
    });
  }, [checkAchievements]);

  const setParticipantName = useCallback((name) => {
    setState((prev) => ({
      ...prev,
      participantName: name,
    }));
  }, []);

  const markComplete = useCallback(() => {
    setState((prev) => ({
      ...prev,
      completedAt: new Date().toISOString(),
    }));
  }, []);

  const clearNewAchievements = useCallback(() => {
    setState((prev) => ({
      ...prev,
      newAchievements: [],
    }));
  }, []);

  const getAchievementById = useCallback((id) => {
    return ACHIEVEMENTS.find((a) => a.id === id);
  }, []);

  const getAllAchievements = useCallback(() => {
    return ACHIEVEMENTS.map((achievement) => ({
      ...achievement,
      unlocked: state.unlockedAchievements.includes(achievement.id),
    }));
  }, [state.unlockedAchievements]);

  return {
    ...state,
    updateSlideProgress,
    updateQuizScore,
    completeExercise,
    completeScenario,
    setParticipantName,
    markComplete,
    clearNewAchievements,
    getAchievementById,
    getAllAchievements,
    totalPoints: ACHIEVEMENTS.reduce((sum, a) => sum + a.points, 0),
  };
}
