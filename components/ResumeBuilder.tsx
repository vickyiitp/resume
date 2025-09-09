import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import type { ResumeData, AIFeedbackData, FormErrors } from '../types';
import { INITIAL_RESUME_DATA, SAMPLE_RESUME_DATA } from '../constants';
import { getResumeFeedback } from '../services/geminiService';

import ResumeForm from './ResumeForm';
import ResumePreview from './ResumePreview';
import AIFeedback from './AIFeedback';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import { StepIndicator } from './ui/StepIndicator';
import { DownloadIcon } from './icons/DownloadIcon';
import { SparklesIcon } from './icons/SparklesIcon';

const STEPS = [
    'Personal Details',
    'Summary',
    'Experience',
    'Education',
    'Skills',
    'Projects',
    'Additional Info'
];

const ResumeBuilder: React.FC = () => {
    const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_RESUME_DATA);
    const [currentStep, setCurrentStep] = useState(0);
    const [errors, setErrors] = useState<FormErrors>({});
    const [targetJob, setTargetJob] = useState<string>('Frontend Developer');
    const [feedback, setFeedback] = useState<AIFeedbackData | null>(null);
    const [isLoadingFeedback, setIsLoadingFeedback] = useState<boolean>(false);
    const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

    const previewRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        content: () => previewRef.current,
        documentTitle: `${resumeData.personalDetails.fullName || 'Resume'}-resume`,
    });

    const handleGetFeedback = async () => {
        if (!targetJob.trim()) {
            setErrorFeedback('Please enter a target job title.');
            return;
        }
        setIsLoadingFeedback(true);
        setErrorFeedback(null);
        setFeedback(null);
        try {
            const result = await getResumeFeedback(resumeData, targetJob);
            setFeedback(result);
        } catch (err) {
            if (err instanceof Error) {
                setErrorFeedback(err.message);
            } else {
                setErrorFeedback('An unknown error occurred.');
            }
        } finally {
            setIsLoadingFeedback(false);
        }
    };
    
    const loadSampleData = () => {
        setResumeData(SAMPLE_RESUME_DATA);
        setCurrentStep(0);
        setErrors({});
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left Column: Form */}
            <div className="space-y-6">
                <StepIndicator steps={STEPS} currentStep={currentStep} />
                <div className="flex justify-end">
                    <Button onClick={loadSampleData} variant="secondary">Load Sample Data</Button>
                </div>
                <ResumeForm 
                    resumeData={resumeData} 
                    setResumeData={setResumeData} 
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                    errors={errors}
                    setErrors={setErrors}
                />
            </div>

            {/* Right Column: Preview & AI Feedback */}
            <div className="sticky top-24 space-y-6">
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Resume Preview</h2>
                        <Button onClick={handlePrint} variant="secondary" icon={<DownloadIcon />}>
                            Download PDF
                        </Button>
                    </div>
                    <div className="max-h-[80vh] overflow-y-auto bg-slate-50 p-2 rounded-md">
                        <ResumePreview ref={previewRef} resumeData={resumeData} />
                    </div>
                </Card>

                <Card>
                    <h2 className="text-xl font-bold mb-4">AI Feedback</h2>
                    <div className="space-y-4">
                         <div className="flex flex-col sm:flex-row gap-2">
                             <Input
                                label="Target Job Title"
                                value={targetJob}
                                onChange={(e) => setTargetJob(e.target.value)}
                                placeholder="e.g., Senior Software Engineer"
                                className="flex-grow"
                            />
                            <Button onClick={handleGetFeedback} disabled={isLoadingFeedback} className="self-end h-fit" icon={<SparklesIcon className="w-4 h-4" />}>
                                {isLoadingFeedback ? 'Analyzing...' : 'Get Feedback'}
                            </Button>
                        </div>
                        {errorFeedback && <p className="text-red-500 text-sm mt-2">{errorFeedback}</p>}
                    </div>
                    <div className="mt-4">
                        <AIFeedback feedback={feedback} isLoading={isLoadingFeedback} />
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ResumeBuilder;
