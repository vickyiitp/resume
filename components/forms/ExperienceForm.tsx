import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ResumeData, Experience, BulletPoint } from '../../types';
import type { ToastData } from '../../App';
import { enhanceBulletPoint } from '../../services/geminiService';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { BriefcaseIcon } from '../icons/BriefcaseIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { SparklesIcon } from '../icons/SparklesIcon';

interface Props {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  setToast: (toast: ToastData | null) => void;
}

const ExperienceForm: React.FC<Props> = ({ resumeData, setResumeData, setToast }) => {
  const [enhancingBulletId, setEnhancingBulletId] = useState<string | null>(null);
  
  const handleNestedChange = (id: string, field: keyof Experience, value: any) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };
  
  const handleBulletPointChange = (itemId: string, bulletId: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(item =>
        item.id === itemId ? {
          ...item,
          description: item.description.map((bp: BulletPoint) =>
            bp.id === bulletId ? { ...bp, point: value } : bp
          )
        } : item
      )
    }));
  };

  const addItem = () => {
    const newItem: Experience = { 
      id: uuidv4(), 
      jobTitle: '', 
      company: '', 
      location: '', 
      startDate: '', 
      endDate: '', 
      description: [{id: uuidv4(), point: ''}] 
    };
    setResumeData(prev => ({ ...prev, experience: [...prev.experience, newItem] }));
  };

  const removeItem = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(item => item.id !== id),
    }));
  };
  
  const addBulletPoint = (itemId: string) => {
    const newBullet = { id: uuidv4(), point: '' };
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(item =>
        item.id === itemId ? { ...item, description: [...item.description, newBullet] } : item
      )
    }));
  };

  const removeBulletPoint = (itemId: string, bulletId: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(item =>
        item.id === itemId ? {
          ...item,
          description: item.description.filter((bp: BulletPoint) => bp.id !== bulletId)
        } : item
      )
    }));
  };

  const handleEnhanceBullet = async (itemId: string, bullet: BulletPoint) => {
    if (!bullet.point) return;
    setEnhancingBulletId(bullet.id);
    try {
      const enhancedPoint = await enhanceBulletPoint(bullet.point);
      handleBulletPointChange(itemId, bullet.id, enhancedPoint);
      setToast({ message: 'Bullet point enhanced!', type: 'success' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setToast({ message, type: 'error' });
    } finally {
      setEnhancingBulletId(null);
    }
  };
  
  return (
    <Card>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><BriefcaseIcon /> Work Experience</h2>
      {resumeData.experience.map((exp) => (
        <Card key={exp.id} className="mb-4 relative !p-4 bg-slate-50">
          <Button variant="danger" className="absolute top-2 right-2 p-1 h-auto text-xs" onClick={() => removeItem(exp.id)}><TrashIcon className="w-4 h-4" /></Button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Job Title" value={exp.jobTitle} onChange={e => handleNestedChange(exp.id, 'jobTitle', e.target.value)} />
            <Input label="Company" value={exp.company} onChange={e => handleNestedChange(exp.id, 'company', e.target.value)} />
            <Input label="Location" value={exp.location} onChange={e => handleNestedChange(exp.id, 'location', e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <Input label="Start Date" type="text" value={exp.startDate} onChange={e => handleNestedChange(exp.id, 'startDate', e.target.value)} placeholder="e.g., Jan 2020"/>
              <Input label="End Date" type="text" value={exp.endDate} onChange={e => handleNestedChange(exp.id, 'endDate', e.target.value)} placeholder="e.g., Present"/>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Achievements/Responsibilities</label>
            {exp.description.map((bullet, i) => (
              <div key={bullet.id} className="flex items-center gap-2 mb-2">
                <Input value={bullet.point} onChange={e => handleBulletPointChange(exp.id, bullet.id, e.target.value)} className="flex-grow" placeholder={`Bullet point ${i + 1}`} />
                <Button variant="secondary" onClick={() => handleEnhanceBullet(exp.id, bullet)} disabled={enhancingBulletId === bullet.id} className="p-2 h-auto"><SparklesIcon className={`w-4 h-4 ${enhancingBulletId === bullet.id ? 'animate-pulse' : ''}`} /></Button>
                <Button variant="danger" onClick={() => removeBulletPoint(exp.id, bullet.id)} className="p-2 h-auto"><TrashIcon className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button variant="secondary" onClick={() => addBulletPoint(exp.id)} className="mt-2 text-xs py-1 px-2">Add Bullet Point</Button>
          </div>
        </Card>
      ))}
      <Button onClick={addItem}>Add Experience</Button>
    </Card>
  );
};

export default ExperienceForm;
