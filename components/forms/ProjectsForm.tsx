import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ResumeData, Project, BulletPoint } from '../../types';
import type { ToastData } from '../../App';
import { enhanceBulletPoint } from '../../services/geminiService';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { ProjectIcon } from '../icons/ProjectIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { SparklesIcon } from '../icons/SparklesIcon';

interface Props {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  setToast: (toast: ToastData | null) => void;
}

const ProjectsForm: React.FC<Props> = ({ resumeData, setResumeData, setToast }) => {
  const [enhancingBulletId, setEnhancingBulletId] = useState<string | null>(null);

  const handleNestedChange = (id: string, field: keyof Project, value: any) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleBulletPointChange = (itemId: string, bulletId: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(item =>
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
    const newItem: Project = { id: uuidv4(), name: '', technologies: '', link: '', description: [{ id: uuidv4(), point: '' }] };
    setResumeData(prev => ({ ...prev, projects: [...prev.projects, newItem] }));
  };

  const removeItem = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(item => item.id !== id),
    }));
  };

  const addBulletPoint = (itemId: string) => {
    const newBullet = { id: uuidv4(), point: '' };
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(item =>
        item.id === itemId ? { ...item, description: [...item.description, newBullet] } : item
      )
    }));
  };

  const removeBulletPoint = (itemId: string, bulletId: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(item =>
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
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><ProjectIcon /> Projects</h2>
      {resumeData.projects.map((proj) => (
        <Card key={proj.id} className="mb-4 relative !p-4 bg-slate-50">
          <Button variant="danger" className="absolute top-2 right-2 p-1 h-auto text-xs" onClick={() => removeItem(proj.id)}><TrashIcon className="w-4 h-4" /></Button>
          <Input label="Project Name" value={proj.name} onChange={e => handleNestedChange(proj.id, 'name', e.target.value)} />
          <Input label="Technologies" value={proj.technologies} onChange={e => handleNestedChange(proj.id, 'technologies', e.target.value)} placeholder="e.g., React, Tailwind CSS, Firebase" />
          <Input label="Link" value={proj.link} onChange={e => handleNestedChange(proj.id, 'link', e.target.value)} />
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            {proj.description.map((bullet, i) => (
              <div key={bullet.id} className="flex items-center gap-2 mb-2">
                <Input value={bullet.point} onChange={e => handleBulletPointChange(proj.id, bullet.id, e.target.value)} className="flex-grow" placeholder={`Bullet point ${i + 1}`} />
                <Button variant="secondary" onClick={() => handleEnhanceBullet(proj.id, bullet)} disabled={enhancingBulletId === bullet.id} className="p-2 h-auto"><SparklesIcon className={`w-4 h-4 ${enhancingBulletId === bullet.id ? 'animate-pulse' : ''}`} /></Button>
                <Button variant="danger" onClick={() => removeBulletPoint(proj.id, bullet.id)} className="p-2 h-auto"><TrashIcon className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button variant="secondary" onClick={() => addBulletPoint(proj.id)} className="mt-2 text-xs py-1 px-2">Add Bullet Point</Button>
          </div>
        </Card>
      ))}
      <Button onClick={addItem}>Add Project</Button>
    </Card>
  );
};

export default ProjectsForm;
