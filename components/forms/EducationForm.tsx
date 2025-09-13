import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ResumeData, Education } from '../../types';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { EducationIcon } from '../icons/EducationIcon';
import { TrashIcon } from '../icons/TrashIcon';

interface Props {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

const EducationForm: React.FC<Props> = ({ resumeData, setResumeData }) => {

  const handleNestedChange = (id: string, field: keyof Education, value: any) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addItem = () => {
    const newItem: Education = { id: uuidv4(), institution: '', degree: '', major: '', gpa: '', startDate: '', endDate: '' };
    setResumeData(prev => ({ ...prev, education: [...prev.education, newItem] }));
  };

  const removeItem = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(item => item.id !== id),
    }));
  };
  
  return (
    <Card>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><EducationIcon /> Education</h2>
      {resumeData.education.map((edu) => (
        <Card key={edu.id} className="mb-4 relative !p-4 bg-slate-50">
          <Button variant="danger" className="absolute top-2 right-2 p-1 h-auto text-xs" onClick={() => removeItem(edu.id)}><TrashIcon className="w-4 h-4" /></Button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Institution" value={edu.institution} onChange={e => handleNestedChange(edu.id, 'institution', e.target.value)} />
            <Input label="Degree" value={edu.degree} onChange={e => handleNestedChange(edu.id, 'degree', e.target.value)} />
            <Input label="Major" value={edu.major} onChange={e => handleNestedChange(edu.id, 'major', e.target.value)} />
            <Input label="GPA (Optional)" value={edu.gpa} onChange={e => handleNestedChange(edu.id, 'gpa', e.target.value)} />
            <div className="grid grid-cols-2 gap-2 md:col-span-2">
              <Input label="Start Date" value={edu.startDate} onChange={e => handleNestedChange(edu.id, 'startDate', e.target.value)} placeholder="e.g., 2018"/>
              <Input label="End Date" value={edu.endDate} onChange={e => handleNestedChange(edu.id, 'endDate', e.target.value)} placeholder="e.g., 2022"/>
            </div>
          </div>
        </Card>
      ))}
      <Button onClick={addItem}>Add Education</Button>
    </Card>
  );
};

export default EducationForm;
