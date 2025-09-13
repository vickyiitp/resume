import React, { useState } from 'react';
import { TemplateType } from '../types';
import type { ResumeData, AIFeedbackData, FormErrors } from '../types';
import { INITIAL_RESUME_DATA, SAMPLE_RESUME_DATA } from '../constants';
import { getResumeFeedback, suggestJobTitles } from '../services/geminiService';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { ToastData } from '../App';

import ResumeForm from './ResumeForm';
import ResumePreview from './ResumePreview';
import AIFeedback from './AIFeedback';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import { StepIndicator } from './ui/StepIndicator';
import { DownloadIcon } from './icons/DownloadIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { RefreshIcon } from './icons/RefreshIcon';
import { TemplateSelector } from './TemplateSelector';
import { ClipboardListIcon } from './icons/ClipboardListIcon';


const STEPS = [
    'Personal Details',
    'Summary',
    'Experience',
    'Education',
    'Skills',
    'Projects',
    'Additional Info'
];

interface ResumeBuilderProps {
  mobileView: 'editor' | 'preview';
  setToast: (toast: ToastData | null) => void;
}

const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ mobileView, setToast }) => {
    const [resumeData, setResumeData] = useLocalStorage<ResumeData>('resumeData', INITIAL_RESUME_DATA);
    const [currentStep, setCurrentStep] = useState(0);
    const [errors, setErrors] = useState<FormErrors>({});
    const [targetJob, setTargetJob] = useState<string>('Frontend Developer');
    const [feedback, setFeedback] = useState<AIFeedbackData | null>(null);
    const [isLoadingFeedback, setIsLoadingFeedback] = useState<boolean>(false);
    const [errorFeedback, setErrorFeedback] = useState<string | null>(null);
    const [template, setTemplate] = useState<TemplateType>(TemplateType.MODERN);
    const [suggestedJobs, setSuggestedJobs] = useState<string[]>([]);
    const [isSuggestingJobs, setIsSuggestingJobs] = useState<boolean>(false);

    const handlePrint = () => {
        window.print();
    };

    const handleGetFeedback = async () => {
        if (!targetJob.trim()) {
            setErrorFeedback('Please enter a target job title.');
            return;
        }
        setIsLoadingFeedback(true);
        setErrorFeedback(null);
        setFeedback(null);
        setSuggestedJobs([]);
        try {
            const result = await getResumeFeedback(resumeData, targetJob);
            setFeedback(result);
            setToast({ message: 'AI analysis complete!', type: 'success' });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setErrorFeedback(errorMessage);
            setToast({ message: errorMessage, type: 'error' });
        } finally {
            setIsLoadingFeedback(false);
        }
    };
    
    const handleSuggestJobs = async () => {
        setIsSuggestingJobs(true);
        setErrorFeedback(null);
        setSuggestedJobs([]);
        try {
            const titles = await suggestJobTitles(resumeData);
            setSuggestedJobs(titles);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred while suggesting titles.';
             setErrorFeedback(errorMessage);
             setToast({ message: errorMessage, type: 'error' });
        } finally {
            setIsSuggestingJobs(false);
        }
    }

    const loadSampleData = () => {
        setResumeData(SAMPLE_RESUME_DATA);
        setCurrentStep(0);
        setErrors({});
        setToast({ message: 'Sample data loaded.', type: 'success' });
    }
    
    const clearAllData = () => {
        if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            setResumeData(INITIAL_RESUME_DATA);
            setCurrentStep(0);
            setErrors({});
            setFeedback(null);
            setSuggestedJobs([]);
            setToast({ message: 'All data has been cleared.', type: 'success' });
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left Column: Form */}
            <div id="editor-column" className={`space-y-6 ${mobileView === 'preview' ? 'hidden' : ''} lg:block`}>
                <StepIndicator steps={STEPS} currentStep={currentStep} onStepClick={setCurrentStep} />
                <div className="flex justify-end gap-2">
                    <Button onClick={clearAllData} variant="danger" icon={<RefreshIcon className="w-4 h-4" />}>
                        Clear All Data
                    </Button>
                    <Button onClick={loadSampleData} variant="secondary">Load Sample Data</Button>
                </div>
                <ResumeForm 
                    resumeData={resumeData} 
                    setResumeData={setResumeData} 
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                    errors={errors}
                    setErrors={setErrors}
                    setToast={setToast}
                />
            </div>

            {/* Right Column: Preview & AI Feedback */}
            <div className={`space-y-6 lg:sticky lg:top-24 ${mobileView === 'editor' ? 'hidden' : ''} lg:block`}>
                <Card id="preview-card">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Resume Preview</h2>
                        <Button onClick={handlePrint} variant="secondary" icon={<DownloadIcon />}>
                            Download PDF
                        </Button>
                    </div>
                    <TemplateSelector selectedTemplate={template} onSelectTemplate={setTemplate} />
                    <div id="resume-preview-wrapper" className="mt-4 max-h-[80vh] overflow-y-auto bg-slate-50 p-2 rounded-md">
                        <ResumePreview resumeData={resumeData} template={template} />
                    </div>
                </Card>

                <div id="ai-tools-column">
                    <Card>
                        <h2 className="text-xl font-bold mb-4">AI Analysis</h2>
                        <div className="space-y-4">
                            <Input
                                id="target-job"
                                label="Target Job Title"
                                value={targetJob}
                                onChange={(e) => setTargetJob(e.target.value)}
                                placeholder="e.g., Senior Software Engineer"
                            />
                            <div className="flex gap-2 justify-end">
                                <Button onClick={handleSuggestJobs} disabled={isSuggestingJobs} variant="secondary" icon={<ClipboardListIcon className="w-4 h-4" />}>
                                    {isSuggestingJobs ? 'Thinking...' : 'Suggest Titles'}
                                </Button>
                                <Button onClick={handleGetFeedback} disabled={isLoadingFeedback} icon={<SparklesIcon className="w-4 h-4" />}>
                                    {isLoadingFeedback ? 'Analyzing...' : 'Get Feedback'}
                                </Button>
                            </div>
                            
                            {suggestedJobs.length > 0 && (
                                <div className="pt-2">
                                    <p className="text-sm font-medium text-slate-600 mb-2">Suggested Job Titles:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {suggestedJobs.map((job, index) => (
                                            <button key={`${job}-${index}`} onClick={() => setTargetJob(job)} className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors">
                                                {job}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {errorFeedback && <p className="text-red-500 text-sm mt-2" aria-live="polite">{errorFeedback}</p>}
                        </div>
                        <div className="mt-4" aria-live="polite">
                            <AIFeedback 
                                feedback={feedback} 
                                isLoading={isLoadingFeedback} 
                                setResumeData={setResumeData}
                                setToast={setToast}
                            />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilder;
