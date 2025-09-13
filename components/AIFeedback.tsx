

import React from 'react';
import type { AIFeedbackData, ResumeData } from '../types';
import type { ToastData } from '../App';
import Button from './ui/Button';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface AIFeedbackProps {
  feedback: AIFeedbackData | null;
  isLoading: boolean;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  setToast: (toast: ToastData | null) => void;
}

const AIFeedback: React.FC<AIFeedbackProps> = ({ feedback, isLoading, setResumeData, setToast }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-lg animate-pulse">
        <SparklesIcon className="w-10 h-10 text-blue-400 mb-3" />
        <p className="font-semibold text-slate-600">Analyzing your resume...</p>
        <p className="text-sm text-slate-500">Our AI is reviewing your details to provide feedback.</p>
      </div>
    );
  }

  if (!feedback) {
    return (
        <div className="text-center p-6 bg-slate-50 rounded-lg">
            <p className="text-slate-500">Enter a target job title and click "Get Feedback" to see an AI analysis of your resume.</p>
        </div>
    );
  }

  const handleApplySuggestion = (change: string) => {
      setResumeData(prev => ({...prev, summary: change}));
      setToast({ message: 'Suggestion applied successfully!', type: 'success' });
  };

  const scoreColor = feedback.score >= 85 ? 'text-green-600' : feedback.score >= 60 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Overall Score</h3>
        <div className="flex items-center justify-center bg-slate-100 p-4 rounded-lg">
          <p className={`text-5xl font-extrabold ${scoreColor}`}>{feedback.score}</p>
          <p className="text-lg font-semibold text-slate-600 self-end mb-1">/100</p>
        </div>
        <p className="text-xs text-slate-500 text-center mt-1">This score estimates your resume's fit for the target role.</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-lg flex items-center gap-2 mb-2 text-green-700">
            <CheckCircleIcon className="w-6 h-6" /> Strengths
          </h4>
          <div className="space-y-3">
            {feedback.strengths.map((item, index) => (
              <div key={index} className="bg-green-50 p-3 rounded-md border border-green-200">
                <p className="font-semibold text-green-900">{item.title}</p>
                <p className="text-sm text-green-800">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-lg flex items-center gap-2 mb-2 text-yellow-700">
            <LightbulbIcon className="w-6 h-6" /> Suggestions for Improvement
          </h4>
          <div className="space-y-3">
            {feedback.suggestions.map((item, index) => (
              <div key={index} className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                <p className="font-semibold text-yellow-900">{item.title}</p>
                <p className="text-sm text-yellow-800">{item.description}</p>
                {item.suggestedChange && (
                    <div className="mt-3 pt-3 border-t border-yellow-200">
                        <p className="text-xs font-semibold text-yellow-800 mb-1">Suggested Rewrite:</p>
                        <p className="text-sm italic text-yellow-800 bg-yellow-100/50 p-2 rounded">"{item.suggestedChange}"</p>
                        <Button
                            variant="secondary"
                            className="mt-2 text-xs py-1 px-2 h-auto bg-white"
                            onClick={() => handleApplySuggestion(item.suggestedChange!)}
                        >
                            Apply Suggestion
                        </Button>
                    </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIFeedback;