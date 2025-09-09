import React from 'react';
import type { AIFeedbackData } from '../types';
import Card from './ui/Card';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface AIFeedbackProps {
  feedback: AIFeedbackData | null;
  isLoading: boolean;
}

const AIFeedback: React.FC<AIFeedbackProps> = ({ feedback, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center p-8">
          <SparklesIcon className="w-12 h-12 text-blue-500 animate-pulse" />
          <p className="mt-4 text-lg font-semibold text-slate-700">Analyzing your resume...</p>
          <p className="text-slate-500">Our AI is working its magic!</p>
        </div>
      </Card>
    );
  }

  if (!feedback) {
    return (
      <Card className="bg-blue-50 border-blue-200 border text-center">
         <div className="flex flex-col items-center p-4">
            <SparklesIcon className="w-10 h-10 text-blue-500 mb-3" />
            <h3 className="text-lg font-semibold text-slate-800">Ready for your AI-powered review?</h3>
            <p className="text-slate-600 mt-1 text-sm">Enter a target job title above and click "Get Feedback" to let our AI coach help you land your dream role!</p>
        </div>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><SparklesIcon /> AI Feedback</h2>
      <div className="flex flex-col items-center justify-center bg-slate-50 rounded-lg p-6 mb-6">
        <p className="text-sm font-medium text-slate-600">Resume Score</p>
        <p className={`text-7xl font-bold ${getScoreColor(feedback.score)}`}>{feedback.score}<span className="text-3xl text-slate-400">/100</span></p>
      </div>
      
      <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-2"><LightbulbIcon /> Overall Summary</h3>
            <p className="text-slate-600 text-sm">{feedback.overallSummary}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-2 text-green-600"><CheckCircleIcon /> Strengths</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-600 text-sm">
                {feedback.strengths.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-2 text-red-600"><XCircleIcon /> Areas for Improvement</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-600 text-sm">
                 {feedback.improvements.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
      </div>
    </Card>
  );
};

export default AIFeedback;