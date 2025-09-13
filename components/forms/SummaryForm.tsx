import React, { useState } from 'react';
import type { ResumeData } from '../../types';
import type { ToastData } from '../../App';
import { generateSummary } from '../../services/geminiService';
import Card from '../ui/Card';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { DocumentTextIcon } from '../icons/DocumentTextIcon';
import { MagicWandIcon } from '../icons/MagicWandIcon';

interface Props {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  setToast: (toast: ToastData | null) => void;
}

const SummaryForm: React.FC<Props> = ({ resumeData, setResumeData, setToast }) => {
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeData(prev => ({ ...prev, summary: e.target.value }));
  };

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const summary = await generateSummary(resumeData);
      setResumeData(prev => ({ ...prev, summary }));
      setToast({ message: 'AI summary generated successfully!', type: 'success' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setToast({ message, type: 'error' });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2"><DocumentTextIcon /> Professional Summary</h2>
        <Button variant="secondary" onClick={handleGenerateSummary} disabled={isGeneratingSummary} icon={<MagicWandIcon className="w-4 h-4" />}>
          {isGeneratingSummary ? 'Generating...' : 'AI Generate Summary'}
        </Button>
      </div>
      <Textarea id="summary" label="" name="summary" value={resumeData.summary} onChange={handleChange} placeholder="Write a brief summary of your skills and experience." />
    </Card>
  );
};

export default SummaryForm;
