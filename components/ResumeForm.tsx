import React from 'react';
import type { ResumeData, FormErrors } from '../types';
import type { ToastData } from '../App';
import Button from './ui/Button';
import PersonalDetailsForm from './forms/PersonalDetailsForm';
import SummaryForm from './forms/SummaryForm';
import ExperienceForm from './forms/ExperienceForm';
import EducationForm from './forms/EducationForm';
import SkillsForm from './forms/SkillsForm';
import ProjectsForm from './forms/ProjectsForm';
import AdditionalInfoForm from './forms/AdditionalInfoForm';


interface ResumeFormProps {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  errors: FormErrors;
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
  setToast: (toast: ToastData | null) => void;
}

const TOTAL_STEPS = 6;

const validateStep = (step: number, data: ResumeData): [boolean, FormErrors] => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (step === 0) { // Personal Details
        newErrors.personalDetails = {};
        if (!data.personalDetails.fullName) {
            newErrors.personalDetails.fullName = 'Full name is required.';
            isValid = false;
        }
        if (!data.personalDetails.email) {
            newErrors.personalDetails.email = 'Email is required.';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(data.personalDetails.email)) {
            newErrors.personalDetails.email = 'Email is invalid.';
            isValid = false;
        }
    }
    // Add more validation logic for other steps as needed

    return [isValid, newErrors];
};


const ResumeForm: React.FC<ResumeFormProps> = (props) => {
  const { resumeData, setResumeData, currentStep, setCurrentStep, errors, setErrors, setToast } = props;
  
  const handleNext = () => {
    const [isValid, newErrors] = validateStep(currentStep, resumeData);
    setErrors(newErrors);
    if (isValid) {
      if (currentStep < TOTAL_STEPS) setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };
  
  const formContent = () => {
    switch (currentStep) {
        case 0:
            return <PersonalDetailsForm resumeData={resumeData} setResumeData={setResumeData} errors={errors} />;
        case 1:
            return <SummaryForm resumeData={resumeData} setResumeData={setResumeData} setToast={setToast} />;
        case 2:
            return <ExperienceForm resumeData={resumeData} setResumeData={setResumeData} setToast={setToast} />;
        case 3:
            return <EducationForm resumeData={resumeData} setResumeData={setResumeData} />;
        case 4:
            return <SkillsForm resumeData={resumeData} setResumeData={setResumeData} />;
        case 5:
            return <ProjectsForm resumeData={resumeData} setResumeData={setResumeData} setToast={setToast} />;
        case 6:
            return <AdditionalInfoForm resumeData={resumeData} setResumeData={setResumeData} setToast={setToast} />;
        default:
            return null;
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-6">
        {formContent()}
      </div>
      <div className="flex justify-between mt-6">
        <Button onClick={handlePrev} disabled={currentStep === 0} variant="secondary">
          Previous
        </Button>
        <Button onClick={handleNext} disabled={currentStep === TOTAL_STEPS}>
          {currentStep === TOTAL_STEPS ? 'Finish' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default ResumeForm;
