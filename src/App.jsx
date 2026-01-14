import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSlideNavigation } from './hooks/useSlideNavigation';
import { usePresenterMode } from './hooks/usePresenterMode';
import { useQuizState } from './hooks/useQuizState';
import { useGamification } from './hooks/useGamification';
import { useTheme } from './hooks/useTheme';
import { PinProtection } from './components/auth/PinProtection';

import { SlideContainer } from './components/slides/SlideContainer';
import { TitleSlide, SectionTitleSlide } from './components/slides/TitleSlide';
import { ContentSlide, BulletList, PainPointList, SolutionList, ThreeColumnLayout } from './components/slides/ContentSlide';
import { QuizSlide } from './components/slides/QuizSlide';
import { TryItNowSlide } from './components/slides/TryItNowSlide';
import { ScenarioSlide } from './components/slides/ScenarioSlide';
import { CaseStudySlide } from './components/slides/CaseStudySlide';
import { MistakesSlide } from './components/slides/MistakesSlide';
import { ResistanceSlide } from './components/slides/ResistanceSlide';
import { QuickReferenceSlide } from './components/slides/QuickReferenceSlide';
import { FollowUpSlide } from './components/slides/FollowUpSlide';

// Stunning new components
import { HeroSlide, SectionHeroSlide } from './components/slides/HeroSlide';
import { GlassContentSlide, GlassBulletList, GlassThreeColumn, GlassStatCard, FeatureShowcase } from './components/slides/GlassContentSlide';
import { ActionSlide, StepByStepSlide, ComparisonSlide, KeyPointSlide, ChecklistSlide } from './components/slides/ActionSlide';
import { MobileSetupSlide, AllGuidesDownloadSlide } from './components/slides/MobileSetupSlide';

import { ProgressBar } from './components/ui/ProgressBar';
import { Navigation } from './components/ui/Navigation';
import { KeyboardHelp } from './components/ui/KeyboardHelp';
import { PresenterView } from './components/presenter/PresenterView';
import {
  PointsDisplay,
  AchievementToast,
  AchievementsPanel,
  CompletionCertificate
} from './components/ui/Gamification';

import { TrelloDemo } from './components/demos/TrelloDemo';
import { CalendarDemo } from './components/demos/CalendarDemo';
import { AsanaDemo } from './components/demos/AsanaDemo';

import { slidesConfig } from './data/slides.jsx';

function App() {
  const directionRef = useRef(1);
  const quizState = useQuizState();
  const { isPresenterView, isPresenterOpen, openPresenterView, syncState } = usePresenterMode();
  const { isDark } = useTheme();

  // Gamification
  const gamification = useGamification(slidesConfig.length, 3);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  const getSlideSteps = (slideIndex) => {
    return slidesConfig[slideIndex]?.steps || 1;
  };

  const {
    currentSlide,
    currentStep,
    goToSlide,
    nextStep,
    prevStep,
    handlers,
    progress,
  } = useSlideNavigation(slidesConfig.length, getSlideSteps);

  // Track slide progress for gamification
  useEffect(() => {
    gamification.updateSlideProgress(currentSlide);
  }, [currentSlide]);

  // Sync quiz scores
  useEffect(() => {
    gamification.updateQuizScore(quizState.score.correct, quizState.score.total);
  }, [quizState.score]);

  // Track navigation direction for animations
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowDown') {
        directionRef.current = 1;
      } else if (e.key === 'ArrowLeft' || e.key === 'Backspace' || e.key === 'ArrowUp') {
        directionRef.current = -1;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync state with presenter view
  useEffect(() => {
    syncState({ currentSlide, currentStep });
  }, [currentSlide, currentStep, syncState]);

  // Listen for navigation from presenter view
  useEffect(() => {
    const channel = new BroadcastChannel('presenter-sync');
    channel.onmessage = (event) => {
      if (event.data.type === 'navigate') {
        if (event.data.action === 'next') {
          directionRef.current = 1;
          nextStep();
        } else if (event.data.action === 'prev') {
          directionRef.current = -1;
          prevStep();
        }
      }
    };
    return () => channel.close();
  }, [nextStep, prevStep]);

  // Keyboard shortcuts for presenter mode and help
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'p' || e.key === 'P') {
        if (!isPresenterView) {
          openPresenterView();
        }
      } else if (e.key === '?') {
        e.preventDefault();
        setShowKeyboardHelp(prev => !prev);
      } else if (e.key === 'Escape') {
        setShowKeyboardHelp(false);
        setShowAchievements(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresenterView, openPresenterView]);

  // Handle scenario choices
  const handleScenarioChoice = (questionId, choice, quality) => {
    gamification.completeScenario();
  };

  // Handle exercise completion
  const handleExerciseComplete = () => {
    gamification.completeExercise();
  };

  // Handle follow-up email
  const handleEmailSubmit = (email) => {
    console.log('Email submitted:', email);
  };

  const handleNameSubmit = (name) => {
    gamification.setParticipantName(name);
  };

  // Handle PDF download
  const handleDownloadPDF = () => {
    window.print();
  };

  // Map accent colors to variants
  const accentToVariant = {
    cyan: 'calendar',
    indigo: 'trello',
    emerald: 'success',
    rose: 'asana',
    amber: 'asana',
  };

  // Generate slide components
  const slides = useMemo(() => {
    return slidesConfig.map((slide, index) => {
      const isActive = currentSlide === index;
      const step = isActive ? currentStep : 0;

      let component;
      switch (slide.type) {
        case 'title':
          component = (
            <HeroSlide
              title={slide.title}
              subtitle={slide.subtitle}
              icon={slide.icon}
              accentColor={slide.accent || 'cyan'}
              showLogo={slide.showLogo || false}
            />
          );
          break;

        case 'section':
          component = (
            <SectionHeroSlide
              section={slide.section}
              title={slide.title}
              subtitle={slide.subtitle}
              icon={slide.icon}
              variant={accentToVariant[slide.accent] || 'calendar'}
            />
          );
          break;

        case 'content':
          component = (
            <GlassContentSlide title={slide.title} step={step}>
              {(s) => (
                <>
                  {slide.listType === 'pain' && (
                    <GlassBulletList items={slide.items} step={s} type="pain" />
                  )}
                  {slide.listType === 'solution' && (
                    <GlassBulletList items={slide.items} step={s} type="solution" />
                  )}
                  {slide.listType === 'bullet' && (
                    <GlassBulletList items={slide.items} step={s} type="default" />
                  )}
                </>
              )}
            </GlassContentSlide>
          );
          break;

        case 'columns':
          component = (
            <GlassContentSlide title={slide.title} step={step}>
              {(s) => <GlassThreeColumn items={slide.columns} step={s} />}
            </GlassContentSlide>
          );
          break;

        case 'demo':
          component = (
            <GlassContentSlide title={slide.title} step={step}>
              {() => (
                <div className={`rounded-2xl p-4 backdrop-blur-sm border ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'
                }`}>
                  {slide.demoType === 'calendar' && <CalendarDemo step={step} />}
                  {slide.demoType === 'trello' && <TrelloDemo step={step} interactive={isActive} />}
                  {slide.demoType === 'asana' && <AsanaDemo step={step} />}
                </div>
              )}
            </GlassContentSlide>
          );
          break;

        case 'quiz':
          component = (
            <QuizSlide
              question={slide.question}
              options={slide.options}
              correctAnswer={slide.correctAnswer}
              questionId={slide.questionId}
              onAnswer={quizState.submitAnswer}
              existingAnswer={quizState.getAnswer(slide.questionId)}
            />
          );
          break;

        case 'tryitnow':
          component = (
            <TryItNowSlide
              title={slide.title}
              tool={slide.tool}
              task={slide.task}
              steps={slide.steps}
              duration={slide.duration}
              tip={slide.tip}
            />
          );
          break;

        case 'scenario':
          component = (
            <ScenarioSlide
              scenario={slide.scenario}
              character={slide.character}
              characterRole={slide.characterRole}
              options={slide.options}
              questionId={slide.questionId}
              onChoice={handleScenarioChoice}
            />
          );
          break;

        case 'casestudy':
          component = (
            <CaseStudySlide
              department={slide.department}
              title={slide.title}
              beforeAfter={slide.beforeAfter}
              results={slide.results}
              quote={slide.quote}
              quotePerson={slide.quotePerson}
              quoteRole={slide.quoteRole}
              step={step}
            />
          );
          break;

        case 'mistakes':
          component = (
            <MistakesSlide mistakes={slide.mistakes} step={step} />
          );
          break;

        case 'resistance':
          component = (
            <ResistanceSlide objections={slide.objections} step={step} />
          );
          break;

        case 'quickreference':
          component = (
            <QuickReferenceSlide onDownload={handleDownloadPDF} />
          );
          break;

        case 'followup':
          component = (
            <FollowUpSlide
              onEmailSubmit={handleEmailSubmit}
              onNameSubmit={handleNameSubmit}
            />
          );
          break;

        case 'action':
          component = (
            <ActionSlide
              action={slide.action}
              subtext={slide.subtext}
              icon={slide.icon}
              color={slide.color}
            />
          );
          break;

        case 'stepbystep':
          component = (
            <StepByStepSlide
              title={slide.title}
              steps={slide.steps}
              tool={slide.tool}
            />
          );
          break;

        case 'comparison':
          component = (
            <ComparisonSlide
              title={slide.title}
              bad={slide.bad}
              good={slide.good}
            />
          );
          break;

        case 'keypoint':
          component = (
            <KeyPointSlide
              icon={slide.icon}
              title={slide.title}
              subtitle={slide.subtitle}
              color={slide.color}
            />
          );
          break;

        case 'checklist':
          component = (
            <ChecklistSlide
              title={slide.title}
              items={slide.items}
              timer={slide.timer}
            />
          );
          break;

        case 'mobilesetup':
          component = (
            <MobileSetupSlide tool={slide.tool} />
          );
          break;

        case 'allguides':
          component = (
            <AllGuidesDownloadSlide />
          );
          break;

        default:
          component = (
            <ContentSlide title={slide.title || 'Untitled'}>
              <p className="text-slate-500">Slide content</p>
            </ContentSlide>
          );
      }

      return {
        ...slide,
        component,
      };
    });
  }, [currentSlide, currentStep, quizState, isDark]);

  // Render presenter view if in presenter mode
  if (isPresenterView) {
    return (
      <PinProtection>
        <PresenterView slides={slides} currentSlide={currentSlide} currentStep={currentStep} />
      </PinProtection>
    );
  }

  const currentSlideConfig = slidesConfig[currentSlide];

  return (
    <PinProtection>
      <div
        className="h-screen w-screen overflow-hidden select-none relative"
        {...handlers}
      >
      {/* Animated background - theme aware */}
      <div className={`absolute inset-0 transition-colors duration-500 ${
        isDark
          ? 'bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900'
          : 'bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100'
      }`}>
        {/* Animated mesh gradient */}
        <div className="absolute inset-0 opacity-50">
          <motion.div
            className={`absolute w-[500px] h-[500px] rounded-full blur-3xl ${
              isDark ? 'bg-purple-600/30' : 'bg-blue-400/30'
            }`}
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            style={{ top: '-10%', left: '-10%' }}
          />
          <motion.div
            className={`absolute w-[400px] h-[400px] rounded-full blur-3xl ${
              isDark ? 'bg-cyan-500/20' : 'bg-cyan-300/30'
            }`}
            animate={{
              x: [0, -80, 0],
              y: [0, 80, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            style={{ top: '50%', right: '-5%' }}
          />
          <motion.div
            className={`absolute w-[300px] h-[300px] rounded-full blur-3xl ${
              isDark ? 'bg-pink-500/20' : 'bg-indigo-300/30'
            }`}
            animate={{
              x: [0, 60, 0],
              y: [0, -60, 0],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            style={{ bottom: '-5%', left: '30%' }}
          />
        </div>
        {/* Grid pattern overlay */}
        <div
          className={`absolute inset-0 ${isDark ? 'opacity-10' : 'opacity-5'}`}
          style={{
            backgroundImage: isDark
              ? `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`
              : `linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Progress bar with glow effect */}
      <div className="relative z-20">
        <ProgressBar
          progress={progress.percentage}
          totalSlides={slidesConfig.length}
          currentSlide={currentSlide}
        />
      </div>

      {/* Points Display */}
      <PointsDisplay
        points={gamification.points}
        totalPoints={gamification.totalPoints}
        onClick={() => setShowAchievements(true)}
      />

      {/* Main slide content with scrolling */}
      <div className="relative z-10 h-full pt-12 sm:pt-16 pb-24 sm:pb-28 md:pb-32 px-2 sm:px-4 md:px-6 overflow-hidden">
        <SlideContainer
          slideKey={currentSlide}
          direction={directionRef.current}
        >
          {slides[currentSlide]?.component}
        </SlideContainer>
      </div>

      <Navigation
        onPrev={prevStep}
        onNext={nextStep}
        onHome={() => goToSlide(0)}
        onPresenter={openPresenterView}
        onLogout={() => {
          sessionStorage.removeItem('cstc-authenticated');
          window.location.reload();
        }}
        canGoPrev={currentSlide > 0 || currentStep > 0}
        canGoNext={currentSlide < slidesConfig.length - 1 || currentStep < (currentSlideConfig?.steps || 1) - 1}
        isPresenterOpen={isPresenterOpen}
        currentSlide={currentSlide}
        totalSlides={slidesConfig.length}
      />

      {/* Quiz score display with glass effect */}
      {quizState.score.total > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`fixed bottom-6 right-6 backdrop-blur-xl rounded-xl border px-4 py-2 text-sm hidden sm:block shadow-lg ${
            isDark
              ? 'bg-white/10 border-white/20'
              : 'bg-white/80 border-slate-200'
          }`}
        >
          <span className={isDark ? 'text-white/60' : 'text-slate-500'}>Quiz Score: </span>
          <span className="font-bold text-emerald-500">
            {quizState.score.correct}/{quizState.score.total}
          </span>
        </motion.div>
      )}

      {/* Achievement Toasts */}
      <AnimatePresence>
        {gamification.newAchievements.map((achievement) => (
          <AchievementToast
            key={achievement.id}
            achievement={achievement}
            onClose={gamification.clearNewAchievements}
          />
        ))}
      </AnimatePresence>

      {/* Achievements Panel */}
      <AnimatePresence>
        {showAchievements && (
          <AchievementsPanel
            achievements={gamification.getAllAchievements()}
            isOpen={showAchievements}
            onClose={() => setShowAchievements(false)}
            points={gamification.points}
            totalPoints={gamification.totalPoints}
          />
        )}
      </AnimatePresence>

      {/* Completion Certificate */}
      <AnimatePresence>
        {showCertificate && gamification.completedAt && (
          <CompletionCertificate
            name={gamification.participantName}
            date={gamification.completedAt}
            points={gamification.points}
            totalPoints={gamification.totalPoints}
            onDownload={handleDownloadPDF}
            onClose={() => setShowCertificate(false)}
          />
        )}
      </AnimatePresence>

      {/* Keyboard Help Overlay */}
      <KeyboardHelp
        isOpen={showKeyboardHelp}
        onClose={() => setShowKeyboardHelp(false)}
      />
      </div>
    </PinProtection>
  );
}

export default App;
