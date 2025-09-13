import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ResumeData, Skill } from '../../types';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { CodeIcon } from '../icons/CodeIcon';
import { TrashIcon } from '../icons/TrashIcon';

interface Props {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

const SkillsForm: React.FC<Props> = ({ resumeData, setResumeData }) => {

  const handleNestedChange = (id: string, field: keyof Skill, value: any) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addItem = () => {
    const newItem: Skill = { id: uuidv4(), category: '', names: '' };
    setResumeData(prev => ({ ...prev, skills: [...prev.skills, newItem] }));
  };

  const removeItem = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(item => item.id !== id),
    }));
  };

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><CodeIcon /> Skills</h2>
      {resumeData.skills.map((skill) => (
        <Card key={skill.id} className="mb-4 relative !p-4 bg-slate-50">
          <Button variant="danger" className="absolute top-2 right-2 p-1 h-auto text-xs" onClick={() => removeItem(skill.id)}><TrashIcon className="w-4 h-4" /></Button>
          <Input label="Category (e.g., Programming Languages)" value={skill.category} onChange={e => handleNestedChange(skill.id, 'category', e.target.value)} />
          <Textarea id={`skills-${skill.id}`} label="Skills (comma-separated)" value={skill.names} onChange={e => handleNestedChange(skill.id, 'names', e.target.value)} placeholder="e.g., JavaScript, React, Node.js" />
        </Card>
      ))}
      <Button onClick={addItem}>Add Skill Category</Button>
    </Card>
  );
};

export default SkillsForm;
