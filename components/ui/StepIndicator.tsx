import React from 'react';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  onStepClick: (stepIndex: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep, onStepClick }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step, index) => {
          const isCompleted = currentStep > index;
          const isCurrent = currentStep === index;

          const statusClasses = isCompleted || isCurrent
            ? 'border-blue-600'
            : 'border-gray-200';
          
          const textClasses = isCompleted || isCurrent
            ? 'text-blue-600'
            : 'text-gray-500';

          return (
            <li key={step} className="md:flex-1">
              <button
                onClick={() => onStepClick(index)}
                className={`group flex w-full flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0 text-left transition-colors hover:border-blue-400 ${statusClasses}`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <span className={`text-xs font-semibold uppercase tracking-wide transition-colors group-hover:text-blue-500 ${textClasses}`}>{`Step ${index + 1}`}</span>
                <span className="text-sm font-medium transition-colors group-hover:text-slate-900">{step}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};