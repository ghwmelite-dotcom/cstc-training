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
        className="text-3xl font-bold text-slate-800 mb-8"
      >
        {title}
      </motion.h2>
      {typeof children === 'function' ? children(step) : children}
    </SlideWrapper>
  );
}

export function BulletList({ items, step, icon: Icon = ArrowRight, iconColor = 'text-cyan-500' }) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <StepReveal key={index} step={step} index={index}>
          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className={`mt-0.5 ${iconColor}`}>
              <Icon size={20} />
            </div>
            <div>
              {typeof item === 'string' ? (
                <p className="text-slate-700">{item}</p>
              ) : (
                <>
                  <p className="font-semibold text-slate-800">{item.title}</p>
                  {item.description && (
                    <p className="text-slate-600 text-sm mt-1">{item.description}</p>
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
    <div className="space-y-4">
      {items.map((item, index) => (
        <StepReveal key={index} step={step} index={index}>
          <div className="flex items-start gap-4 p-4 rounded-xl bg-red-50 border border-red-100">
            <div className="text-red-500 mt-0.5">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="font-semibold text-slate-800">{item.title}</p>
              <p className="text-slate-600 text-sm mt-1">{item.description}</p>
            </div>
          </div>
        </StepReveal>
      ))}
    </div>
  );
}

export function SolutionList({ items, step }) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <StepReveal key={index} step={step} index={index}>
          <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
            <div className="text-emerald-500 mt-0.5">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="font-semibold text-slate-800">{item.title}</p>
              <p className="text-slate-600 text-sm mt-1">{item.description}</p>
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
      <div className="flex items-start gap-4 p-5 rounded-xl bg-amber-50 border border-amber-200 mt-6">
        <div className="text-amber-500">
          <Lightbulb size={24} />
        </div>
        <div className="text-slate-700">{children}</div>
      </div>
    </StepReveal>
  );
}

export function TwoColumnLayout({ left, right, step }) {
  return (
    <div className="grid grid-cols-2 gap-8">
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
    <div className="grid grid-cols-3 gap-6">
      {items.map((item, index) => (
        <StepReveal key={index} step={step} index={index}>
          <div className="text-center p-6 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
            {item.icon && (
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 ${item.bgColor || 'bg-cyan-100'}`}>
                <item.icon className={`w-7 h-7 ${item.iconColor || 'text-cyan-600'}`} />
              </div>
            )}
            <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
            <p className="text-sm text-slate-600">{item.description}</p>
          </div>
        </StepReveal>
      ))}
    </div>
  );
}
