import { useState, useEffect, useCallback, useRef } from 'react';

export function useSlideNavigation(totalSlides, getSlideSteps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const touchStart = useRef(null);
  const touchEnd = useRef(null);

  const totalSteps = getSlideSteps ? getSlideSteps(currentSlide) : 1;

  const goToSlide = useCallback((index) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlide(index);
      setCurrentStep(0);
    }
  }, [totalSlides]);

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(s => s + 1);
    } else if (currentSlide < totalSlides - 1) {
      setCurrentSlide(s => s + 1);
      setCurrentStep(0);
    }
  }, [currentSlide, currentStep, totalSlides, totalSteps]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1);
    } else if (currentSlide > 0) {
      const prevSlideSteps = getSlideSteps ? getSlideSteps(currentSlide - 1) : 1;
      setCurrentSlide(s => s - 1);
      setCurrentStep(prevSlideSteps - 1);
    }
  }, [currentSlide, currentStep, getSlideSteps]);

  const nextSlide = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(s => s + 1);
      setCurrentStep(0);
    }
  }, [currentSlide, totalSlides]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(s => s - 1);
      setCurrentStep(0);
    }
  }, [currentSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.key) {
        case 'ArrowRight':
        case ' ':
        case 'Enter':
          e.preventDefault();
          nextStep();
          break;
        case 'ArrowLeft':
        case 'Backspace':
          e.preventDefault();
          prevStep();
          break;
        case 'ArrowUp':
          e.preventDefault();
          prevSlide();
          break;
        case 'ArrowDown':
          e.preventDefault();
          nextSlide();
          break;
        case 'Home':
          e.preventDefault();
          goToSlide(0);
          break;
        case 'End':
          e.preventDefault();
          goToSlide(totalSlides - 1);
          break;
        case 'Escape':
          // Could be used for presenter mode toggle
          break;
        default:
          // Number keys for quick navigation
          if (e.key >= '1' && e.key <= '9') {
            const slideIndex = parseInt(e.key) - 1;
            if (slideIndex < totalSlides) {
              goToSlide(slideIndex);
            }
          }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextStep, prevStep, nextSlide, prevSlide, goToSlide, totalSlides]);

  // Touch/swipe navigation
  const handleTouchStart = useCallback((e) => {
    touchEnd.current = null;
    touchStart.current = e.targetTouches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e) => {
    touchEnd.current = e.targetTouches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart.current || !touchEnd.current) return;

    const distance = touchStart.current - touchEnd.current;
    const minSwipeDistance = 50;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        nextStep();
      } else {
        prevStep();
      }
    }
  }, [nextStep, prevStep]);

  // Note: Click navigation removed to prevent conflicts with interactive elements
  // Navigation is now done via:
  // - Arrow keys (Left/Right for prev/next, Up/Down for slide jumps)
  // - Touch swipe on mobile devices
  // - Navigation bar buttons

  return {
    currentSlide,
    currentStep,
    totalSteps,
    goToSlide,
    nextStep,
    prevStep,
    nextSlide,
    prevSlide,
    handlers: {
      // Touch handlers for mobile swipe navigation
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    progress: {
      slide: currentSlide,
      step: currentStep,
      totalSlides,
      totalSteps,
      percentage: ((currentSlide + (currentStep / totalSteps)) / totalSlides) * 100,
    },
  };
}
