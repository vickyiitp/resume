import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ResumeData, Experience, Education, Skill, Project, Certification, Award, Language, VolunteerExperience, BulletPoint, FormErrors } from '../types';
import { enhanceBulletPoint, generateSummary } from '../services/geminiService';

import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Button from './ui/Button';
import Card from './ui/Card';
import { Accordion } from './ui/Accordion';
import ImageUpload from './ui/ImageUpload';

import { UserIcon } from './icons/UserIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { EducationIcon } from './icons/EducationIcon';
import { CodeIcon } from './icons/CodeIcon';
import { ProjectIcon } from './icons/ProjectIcon';
import { CertificateIcon } from './icons/CertificateIcon';
import { AwardIcon } from './icons/AwardIcon';
import { LanguageIcon } from './icons/LanguageIcon';
import { VolunteerIcon } from './icons/VolunteerIcon';
import { TrashIcon } from './icons/TrashIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { MagicWandIcon } from './icons/MagicWandIcon';

interface ResumeFormProps {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  errors: FormErrors;
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
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


const ResumeForm: React.FC<ResumeFormProps> = ({ resumeData, setResumeData, currentStep, setCurrentStep, errors, setErrors }) => {
  const [enhancingBulletId, setEnhancingBulletId] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const handleSimpleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
        const [section, field] = name.split('.');
        setResumeData(prev => ({
          ...prev,
          [section]: {
            ...(prev[section] as object),
            [field]: value,
          },
        }));
    } else {
        setResumeData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setResumeData(prev => ({
          ...prev,
          personalDetails: { ...prev.personalDetails, photo: reader.result as string },
        }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleNestedChange = <T extends { id: string }>(
    section: keyof ResumeData,
    id: string,
    field: keyof T,
    value: any
  ) => {
    setResumeData(prev => ({
      ...prev,
      [section]: (prev[section] as any[]).map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };
  
  const handleBulletPointChange = (
      section: 'experience' | 'projects' | 'volunteerExperience',
      itemId: string,
      bulletId: string,
      value: string
  ) => {
      setResumeData(prev => ({
          ...prev,
          [section]: (prev[section] as any[]).map(item =>
              item.id === itemId ? {
                  ...item,
                  description: item.description.map((bp: BulletPoint) =>
                      bp.id === bulletId ? { ...bp, point: value } : bp
                  )
              } : item
          )
      }));
  };

  const addNestedItem = <T,>(section: keyof ResumeData, newItem: T) => {
    setResumeData(prev => ({
      ...prev,
      [section]: [...(prev[section] as T[]), newItem],
    }));
  };

  const removeNestedItem = (section: keyof ResumeData, id: string) => {
    setResumeData(prev => ({
      ...prev,
      [section]: (prev[section] as { id: string }[]).filter(item => item.id !== id),
    }));
  };
  
  const addBulletPoint = (section: 'experience' | 'projects' | 'volunteerExperience', itemId: string) => {
    const newBullet = { id: uuidv4(), point: '' };
    setResumeData(prev => ({
        ...prev,
        [section]: (prev[section] as any[]).map(item =>
            item.id === itemId ? { ...item, description: [...item.description, newBullet] } : item
        )
    }));
  };

  const removeBulletPoint = (section: 'experience' | 'projects' | 'volunteerExperience', itemId: string, bulletId: string) => {
      setResumeData(prev => ({
          ...prev,
          [section]: (prev[section] as any[]).map(item =>
              item.id === itemId ? {
                  ...item,
                  description: item.description.filter((bp: BulletPoint) => bp.id !== bulletId)
              } : item
          )
      }));
  };

  const handleEnhanceBullet = async (section: 'experience' | 'projects' | 'volunteerExperience', itemId: string, bullet: BulletPoint) => {
      setEnhancingBulletId(bullet.id);
      try {
          const enhancedPoint = await enhanceBulletPoint(bullet.point);
          handleBulletPointChange(section, itemId, bullet.id, enhancedPoint);
      } finally {
          setEnhancingBulletId(null);
      }
  };

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
        const summary = await generateSummary(resumeData);
        setResumeData(prev => ({ ...prev, summary }));
    } catch (err) {
        alert(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
        setIsGeneratingSummary(false);
    }
  };
  
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
  
  const formContent = (
    <div className="space-y-6">
        {currentStep === 0 && (
            <Card>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><UserIcon /> Personal Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Full Name*" name="personalDetails.fullName" value={resumeData.personalDetails.fullName} onChange={handleSimpleChange} error={errors.personalDetails?.fullName} />
                    <Input label="Email*" name="personalDetails.email" type="email" value={resumeData.personalDetails.email} onChange={handleSimpleChange} error={errors.personalDetails?.email} />
                    <Input label="Phone Number" name="personalDetails.phoneNumber" value={resumeData.personalDetails.phoneNumber} onChange={handleSimpleChange} />
                    <Input label="Location" name="personalDetails.location" value={resumeData.personalDetails.location} onChange={handleSimpleChange} placeholder="e.g., San Francisco, CA" />
                    <Input label="LinkedIn Profile" name="personalDetails.linkedin" value={resumeData.personalDetails.linkedin} onChange={handleSimpleChange} />
                    <Input label="Website/Portfolio" name="personalDetails.website" value={resumeData.personalDetails.website} onChange={handleSimpleChange} />
                    <div className="md:col-span-2">
                        <ImageUpload
                            photo={resumeData.personalDetails.photo}
                            onPhotoChange={handlePhotoChange}
                            onPhotoRemove={() => setResumeData(p => ({...p, personalDetails: {...p.personalDetails, photo: null}}))}
                        />
                    </div>
                </div>
            </Card>
        )}
        {currentStep === 1 && (
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2"><DocumentTextIcon /> Professional Summary</h2>
                    <Button variant="secondary" onClick={handleGenerateSummary} disabled={isGeneratingSummary} icon={<MagicWandIcon className="w-4 h-4" />}>
                        {isGeneratingSummary ? 'Generating...' : 'AI Generate Summary'}
                    </Button>
                </div>
                <Textarea label="" name="summary" value={resumeData.summary} onChange={handleSimpleChange} placeholder="Write a brief summary of your skills and experience." />
            </Card>
        )}
        {currentStep === 2 && (
            <Card>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><BriefcaseIcon /> Work Experience</h2>
                {resumeData.experience.map((exp) => (
                    <Card key={exp.id} className="mb-4 relative !p-4 bg-slate-50">
                        <Button variant="danger" className="absolute top-2 right-2 p-1 h-auto text-xs" onClick={() => removeNestedItem('experience', exp.id)}><TrashIcon className="w-4 h-4" /></Button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Job Title" value={exp.jobTitle} onChange={e => handleNestedChange<Experience>('experience', exp.id, 'jobTitle', e.target.value)} />
                            <Input label="Company" value={exp.company} onChange={e => handleNestedChange<Experience>('experience', exp.id, 'company', e.target.value)} />
                            <Input label="Location" value={exp.location} onChange={e => handleNestedChange<Experience>('experience', exp.id, 'location', e.target.value)} />
                            <div className="grid grid-cols-2 gap-2">
                                <Input label="Start Date" type="text" value={exp.startDate} onChange={e => handleNestedChange<Experience>('experience', exp.id, 'startDate', e.target.value)} />
                                <Input label="End Date" type="text" value={exp.endDate} onChange={e => handleNestedChange<Experience>('experience', exp.id, 'endDate', e.target.value)} />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Achievements/Responsibilities</label>
                            {exp.description.map((bullet, i) => (
                                <div key={bullet.id} className="flex items-center gap-2 mb-2">
                                    <Input value={bullet.point} onChange={e => handleBulletPointChange('experience', exp.id, bullet.id, e.target.value)} className="flex-grow" placeholder={`Bullet point ${i + 1}`} />
                                    <Button variant="secondary" onClick={() => handleEnhanceBullet('experience', exp.id, bullet)} disabled={enhancingBulletId === bullet.id} className="p-2 h-auto"><SparklesIcon className={`w-4 h-4 ${enhancingBulletId === bullet.id ? 'animate-pulse' : ''}`} /></Button>
                                    <Button variant="danger" onClick={() => removeBulletPoint('experience', exp.id, bullet.id)} className="p-2 h-auto"><TrashIcon className="w-4 h-4" /></Button>
                                </div>
                            ))}
                            <Button variant="secondary" onClick={() => addBulletPoint('experience', exp.id)} className="mt-2 text-xs py-1 px-2">Add Bullet Point</Button>
                        </div>
                    </Card>
                ))}
                <Button onClick={() => addNestedItem<Experience>('experience', { id: uuidv4(), jobTitle: '', company: '', location: '', startDate: '', endDate: '', description: [{id: uuidv4(), point: ''}] })}>Add Experience</Button>
            </Card>
        )}
        {currentStep === 3 && (
             <Card>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><EducationIcon /> Education</h2>
                {resumeData.education.map((edu) => (
                    <Card key={edu.id} className="mb-4 relative !p-4 bg-slate-50">
                        <Button variant="danger" className="absolute top-2 right-2 p-1 h-auto text-xs" onClick={() => removeNestedItem('education', edu.id)}><TrashIcon className="w-4 h-4" /></Button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Institution" value={edu.institution} onChange={e => handleNestedChange<Education>('education', edu.id, 'institution', e.target.value)} />
                            <Input label="Degree" value={edu.degree} onChange={e => handleNestedChange<Education>('education', edu.id, 'degree', e.target.value)} />
                            <Input label="Major" value={edu.major} onChange={e => handleNestedChange<Education>('education', edu.id, 'major', e.target.value)} />
                            <Input label="GPA (Optional)" value={edu.gpa} onChange={e => handleNestedChange<Education>('education', edu.id, 'gpa', e.target.value)} />
                            <div className="grid grid-cols-2 gap-2 md:col-span-2">
                                <Input label="Start Date" value={edu.startDate} onChange={e => handleNestedChange<Education>('education', edu.id, 'startDate', e.target.value)} />
                                <Input label="End Date" value={edu.endDate} onChange={e => handleNestedChange<Education>('education', edu.id, 'endDate', e.target.value)} />
                            </div>
                        </div>
                    </Card>
                ))}
                <Button onClick={() => addNestedItem<Education>('education', { id: uuidv4(), institution: '', degree: '', major: '', gpa: '', startDate: '', endDate: '' })}>Add Education</Button>
            </Card>
        )}
        {currentStep === 4 && (
            <Card>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><CodeIcon /> Skills</h2>
                {resumeData.skills.map((skill) => (
                    <Card key={skill.id} className="mb-4 relative !p-4 bg-slate-50">
                        <Button variant="danger" className="absolute top-2 right-2 p-1 h-auto text-xs" onClick={() => removeNestedItem('skills', skill.id)}><TrashIcon className="w-4 h-4" /></Button>
                        <Input label="Category (e.g., Programming Languages)" value={skill.category} onChange={e => handleNestedChange<Skill>('skills', skill.id, 'category', e.target.value)} />
                        <Textarea label="Skills (comma-separated)" value={skill.names} onChange={e => handleNestedChange<Skill>('skills', skill.id, 'names', e.target.value)} placeholder="e.g., JavaScript, React, Node.js" />
                    </Card>
                ))}
                <Button onClick={() => addNestedItem<Skill>('skills', { id: uuidv4(), category: '', names: '' })}>Add Skill Category</Button>
            </Card>
        )}
        {currentStep === 5 && (
            <Card>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><ProjectIcon /> Projects</h2>
                {resumeData.projects.map((proj) => (
                    <Card key={proj.id} className="mb-4 relative !p-4 bg-slate-50">
                        <Button variant="danger" className="absolute top-2 right-2 p-1 h-auto text-xs" onClick={() => removeNestedItem('projects', proj.id)}><TrashIcon className="w-4 h-4" /></Button>
                        <Input label="Project Name" value={proj.name} onChange={e => handleNestedChange<Project>('projects', proj.id, 'name', e.target.value)} />
                        <Input label="Technologies" value={proj.technologies} onChange={e => handleNestedChange<Project>('projects', proj.id, 'technologies', e.target.value)} placeholder="e.g., React, Tailwind CSS, Firebase"/>
                        <Input label="Link" value={proj.link} onChange={e => handleNestedChange<Project>('projects', proj.id, 'link', e.target.value)} />
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                            {proj.description.map((bullet, i) => (
                                <div key={bullet.id} className="flex items-center gap-2 mb-2">
                                    <Input value={bullet.point} onChange={e => handleBulletPointChange('projects', proj.id, bullet.id, e.target.value)} className="flex-grow" placeholder={`Bullet point ${i + 1}`} />
                                    <Button variant="secondary" onClick={() => handleEnhanceBullet('projects', proj.id, bullet)} disabled={enhancingBulletId === bullet.id} className="p-2 h-auto"><SparklesIcon className={`w-4 h-4 ${enhancingBulletId === bullet.id ? 'animate-pulse' : ''}`} /></Button>
                                    <Button variant="danger" onClick={() => removeBulletPoint('projects', proj.id, bullet.id)} className="p-2 h-auto"><TrashIcon className="w-4 h-4" /></Button>
                                </div>
                            ))}
                            <Button variant="secondary" onClick={() => addBulletPoint('projects', proj.id)} className="mt-2 text-xs py-1 px-2">Add Bullet Point</Button>
                        </div>
                    </Card>
                ))}
                <Button onClick={() => addNestedItem<Project>('projects', { id: uuidv4(), name: '', technologies: '', link: '', description: [{id: uuidv4(), point: ''}] })}>Add Project</Button>
            </Card>
        )}
        {currentStep === 6 && (
            <div className="space-y-4">
                <Accordion title="Certifications" icon={<CertificateIcon />}>
                    {resumeData.certifications.map((cert) => (
                        <Card key={cert.id} className="mb-4 relative !p-4 bg-slate-50">
                            <Button variant="danger" className="absolute top-2 right-2 p-1 h-auto text-xs" onClick={() => removeNestedItem('certifications', cert.id)}><TrashIcon className="w-4 h-4" /></Button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Certification Name" value={cert.name} onChange={e => handleNestedChange<Certification>('certifications', cert.id, 'name', e.target.value)} />
                                <Input label="Issuing Organization" value={cert.issuer} onChange={e => handleNestedChange<Certification>('certifications', cert.id, 'issuer', e.target.value)} />
                                <Input label="Date Issued" value={cert.date} onChange={e => handleNestedChange<Certification>('certifications', cert.id, 'date', e.target.value)} />
                            </div>
                        </Card>
                    ))}
                    <Button onClick={() => addNestedItem<Certification>('certifications', { id: uuidv4(), name: '', issuer: '', date: '' })}>Add Certification</Button>
                </Accordion>
                <Accordion title="Awards" icon={<AwardIcon />}>
                     {resumeData.awards.map((award) => (
                        <Card key={award.id} className="mb-4 relative !p-4 bg-slate-50">
                            <Button variant="danger" className="absolute top-2 right-2 p-1 h-auto text-xs" onClick={() => removeNestedItem('awards', award.id)}><TrashIcon className="w-4 h-4" /></Button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Award Name" value={award.name} onChange={e => handleNestedChange<Award>('awards', award.id, 'name', e.target.value)} />
                                <Input label="Awarding Body" value={award.issuer} onChange={e => handleNestedChange<Award>('awards', award.id, 'issuer', e.target.value)} />
                                <Input label="Date Received" value={award.date} onChange={e => handleNestedChange<Award>('awards', award.id, 'date', e.target.value)} />
                            </div>
                            <div className="mt-4">
                              <Textarea label="Description (Optional)" value={award.description || ''} onChange={e => handleNestedChange<Award>('awards', award.id, 'description', e.target.value)} />
                            </div>
                        </Card>
                    ))}
                    <Button onClick={() => addNestedItem<Award>('awards', { id: uuidv4(), name: '', issuer: '', date: '' })}>Add Award</Button>
                </Accordion>
                <Accordion title="Languages" icon={<LanguageIcon />}>
                    {resumeData.languages.map((lang) => (
                        <Card key={lang.id} className="mb-4 relative !p-4 bg-slate-50">
                            <Button variant="danger" className="absolute top-2 right-2 p-1 h-auto text-xs" onClick={() => removeNestedItem('languages', lang.id)}><TrashIcon className="w-4 h-4" /></Button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Language" value={lang.name} onChange={e => handleNestedChange<Language>('languages', lang.id, 'name', e.target.value)} />
                                <Input label="Proficiency" value={lang.proficiency} onChange={e => handleNestedChange<Language>('languages', lang.id, 'proficiency', e.target.value)} placeholder="e.g., Native, Fluent, Conversational"/>
                            </div>
                        </Card>
                    ))}
                    <Button onClick={() => addNestedItem<Language>('languages', { id: uuidv4(), name: '', proficiency: '' })}>Add Language</Button>
                </Accordion>
                <Accordion title="Volunteer Experience" icon={<VolunteerIcon />}>
                  {resumeData.volunteerExperience.map((vol) => (
                    <Card key={vol.id} className="mb-4 relative !p-4 bg-slate-50">
                        <Button variant="danger" className="absolute top-2 right-2 p-1 h-auto text-xs" onClick={() => removeNestedItem('volunteerExperience', vol.id)}><TrashIcon className="w-4 h-4" /></Button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Role" value={vol.role} onChange={e => handleNestedChange<VolunteerExperience>('volunteerExperience', vol.id, 'role', e.target.value)} />
                            <Input label="Organization" value={vol.organization} onChange={e => handleNestedChange<VolunteerExperience>('volunteerExperience', vol.id, 'organization', e.target.value)} />
                            <div className="grid grid-cols-2 gap-2">
                                <Input label="Start Date" type="text" value={vol.startDate} onChange={e => handleNestedChange<VolunteerExperience>('volunteerExperience', vol.id, 'startDate', e.target.value)} />
                                <Input label="End Date" type="text" value={vol.endDate} onChange={e => handleNestedChange<VolunteerExperience>('volunteerExperience', vol.id, 'endDate', e.target.value)} />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                            {vol.description.map((bullet, i) => (
                                <div key={bullet.id} className="flex items-center gap-2 mb-2">
                                    <Input value={bullet.point} onChange={e => handleBulletPointChange('volunteerExperience', vol.id, bullet.id, e.target.value)} className="flex-grow" placeholder={`Bullet point ${i + 1}`} />
                                    <Button variant="secondary" onClick={() => handleEnhanceBullet('volunteerExperience', vol.id, bullet)} disabled={enhancingBulletId === bullet.id} className="p-2 h-auto"><SparklesIcon className={`w-4 h-4 ${enhancingBulletId === bullet.id ? 'animate-pulse' : ''}`} /></Button>
                                    <Button variant="danger" onClick={() => removeBulletPoint('volunteerExperience', vol.id, bullet.id)} className="p-2 h-auto"><TrashIcon className="w-4 h-4" /></Button>
                                </div>
                            ))}
                            <Button variant="secondary" onClick={() => addBulletPoint('volunteerExperience', vol.id)} className="mt-2 text-xs py-1 px-2">Add Bullet Point</Button>
                        </div>
                    </Card>
                ))}
                    <Button onClick={() => addNestedItem<VolunteerExperience>('volunteerExperience', { id: uuidv4(), organization: '', role: '', startDate: '', endDate: '', description: [{id: uuidv4(), point: ''}] })}>Add Volunteer Role</Button>
                </Accordion>
            </div>
        )}
    </div>
  );

  return (
    <div className="space-y-4">
      {formContent}
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