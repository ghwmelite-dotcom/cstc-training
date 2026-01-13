import { useState, useCallback } from 'react';

export function useQuizState() {
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const submitAnswer = useCallback((questionId, selectedAnswer, correctAnswer) => {
    const isCorrect = selectedAnswer === correctAnswer;

    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        selected: selectedAnswer,
        correct: correctAnswer,
        isCorrect,
      },
    }));

    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));

    return isCorrect;
  }, []);

  const getAnswer = useCallback((questionId) => {
    return answers[questionId];
  }, [answers]);

  const hasAnswered = useCallback((questionId) => {
    return questionId in answers;
  }, [answers]);

  const resetQuiz = useCallback(() => {
    setAnswers({});
    setScore({ correct: 0, total: 0 });
  }, []);

  const getScorePercentage = useCallback(() => {
    if (score.total === 0) return 0;
    return Math.round((score.correct / score.total) * 100);
  }, [score]);

  return {
    answers,
    score,
    submitAnswer,
    getAnswer,
    hasAnswered,
    resetQuiz,
    getScorePercentage,
  };
}
