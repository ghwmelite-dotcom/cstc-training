import { motion } from 'framer-motion';
import { SlideWrapper } from './SlideContainer';
import { StepReveal } from '../ui/StepReveal';
import { CheckCircle2, AlertCircle, Lightbulb, ArrowRight } from 'lucide-react';

export function ContentSlide({ title, children, step = 0 }) {
  return (
    <SlideWrapper>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mb-4 sm:mb-6 md:mb-8"
      >
        {title}
      </motion.h2>
      {typeof children === 'function' ? children(step) : children}
    </SlideWrapper>
  );
}

export function BulletList({ items, step, icon: Icon = ArrowRight, iconColor = 'text-cyan-500' }) {
  return (
    <div className="space-y-2 sm:space-y-3 md:space-y-4">
      {items.map((item, index) => (
        <StepReveal key={index} step={step} index={index}>
          <div className="flex items-start gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className={`mt-0.5 ${iconColor} flex-shrink-0`}>
              <Icon size={18} className="sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              {typeof item === 'string' ? (
                <p className="text-sm sm:text-base text-slate-700">{item}</p>
              ) : (
                <>
                  <p className="font-semibold text-sm sm:text-base text-slate-800">{item.title}</p>
                  {item.description && (
                    <p className="text-slate-600 text-xs sm:text-sm mt-1">{item.description}</p>
                  )}
                </>
              )}
            </div>
          </div>
        </StepReveal>
      ))}
    </div>
  );
}

export function PainPointList({ items, step }) {
  return (
    <div className="space-y-2 sm:space-y-3 md:space-y-4">
      {items.map((item, index) => (
        <StepReveal key={index} step={step} index={index}>
          <div className="flex items-start gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-red-50 border border-red-100">
            <div className="text-red-500 mt-0.5 flex-shrink-0">
              <AlertCircle size={18} className="sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm sm:text-base text-slate-800">{item.title}</p>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">{item.description}</p>
            </div>
          </div>
        </StepReveal>
      ))}
    </div>
  );
}

export function SolutionList({ items, step }) {
  return (
    <div className="space-y-2 sm:space-y-3 md:space-y-4">
      {items.map((item, index) => (
        <StepReveal key={index} step={step} index={index}>
          <div className="flex items-start gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-emerald-50 border border-emerald-100">
            <div className="text-emerald-500 mt-0.5 flex-shrink-0">
              <CheckCircle2 size={18} className="sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm sm:text-base text-slate-800">{item.title}</p>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">{item.description}</p>
            </div>
          </div>
        </StepReveal>
      ))}
    </div>
  );
}

export function TipBox({ children, step, index = 0 }) {
  return (
    <StepReveal step={step} index={index}>
      <div className="flex items-start gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl bg-amber-50 border border-amber-200 mt-4 sm:mt-5 md:mt-6">
        <div className="text-amber-500 flex-shrink-0">
          <Lightbulb size={20} className="sm:w-6 sm:h-6" />
        </div>
        <div className="text-sm sm:text-base text-slate-700">{children}</div>
      </div>
    </StepReveal>
  );
}

export function TwoColumnLayout({ left, right, step }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
      <StepReveal step={step} index={0}>
        {left}
      </StepReveal>
      <StepReveal step={step} index={1}>
        {right}
      </StepReveal>
    </div>
  );
}

export function ThreeColumnLayout({ items, step }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
      {items.map((item, index) => (
        <StepReveal key={index} step={step} index={index}>
          <div className="text-center p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
            {item.icon && (
              <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl mb-2 sm:mb-3 md:mb-4 ${item.bgColor || 'bg-cyan-100'}`}>
                <item.icon className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 ${item.iconColor || 'text-cyan-600'}`} />
              </div>
            )}
            <h3 className="font-bold text-sm sm:text-base text-slate-800 mb-1 sm:mb-2">{item.title}</h3>
            <p className="text-xs sm:text-sm text-slate-600">{item.description}</p>
          </div>
        </StepReveal>
      ))}
    </div>
  );
}
