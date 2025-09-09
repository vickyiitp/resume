import React from 'react';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step, index) => (
          <li key={step} className="md:flex-1">
            {currentStep > index ? (
              <div className="group flex flex-col border-l-4 border-blue-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0">
                <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">{`Step ${index + 1}`}</span>
                <span className="text-sm font-medium">{step}</span>
              </div>
            ) : currentStep === index ? (
              <div className="flex flex-col border-l-4 border-blue-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0" aria-current="step">
                <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">{`Step ${index + 1}`}</span>
                <span className="text-sm font-medium">{step}</span>
              </div>
            ) : (
              <div className="group flex flex-col border-l-4 border-gray-200 py-2 pl-4 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{`Step ${index + 1}`}</span>
                <span className="text-sm font-medium">{step}</span>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
