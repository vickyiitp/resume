import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ResumeData, Certification, Award, Language, VolunteerExperience, BulletPoint } from '../../types';
import type { ToastData } from '../../App';
import { enhanceBulletPoint } from '../../services/geminiService';

import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { Accordion } from '../ui/Accordion';

import { CertificateIcon } from '../icons/CertificateIcon';
import { AwardIcon } from '../icons/AwardIcon';
import { LanguageIcon } from '../icons/LanguageIcon';
import { VolunteerIcon } from '../icons/VolunteerIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { SparklesIcon } from '../icons/SparklesIcon';

interface Props {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  setToast: (toast: ToastData | null) => void;
}

const AdditionalInfoForm: React.FC<Props> = ({ resumeData, setResumeData, setToast }) => {
    const [enhancingBulletId, setEnhancingBulletId] = useState<string | null>(null);

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
        section: 'volunteerExperience',
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
    
    const addBulletPoint = (section: 'volunteerExperience', itemId: string) => {
        const newBullet = { id: uuidv4(), point: '' };
        setResumeData(prev => ({
            ...prev,
            [section]: (prev[section] as any[]).map(item =>
                item.id === itemId ? { ...item, description: [...item.description, newBullet] } : item
            )
        }));
    };

    const removeBulletPoint = (section: 'volunteerExperience', itemId: string, bulletId: string) => {
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

    const handleEnhanceBullet = async (section: 'volunteerExperience', itemId: string, bullet: BulletPoint) => {
        if (!bullet.point) return;
        setEnhancingBulletId(bullet.id);
        try {
            const enhancedPoint = await enhanceBulletPoint(bullet.point);
            handleBulletPointChange(section, itemId, bullet.id, enhancedPoint);
            setToast({ message: 'Bullet point enhanced!', type: 'success' });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'An unknown error occurred.';
            setToast({ message, type: 'error' });
        } finally {
            setEnhancingBulletId(null);
        }
    };

    return (
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
                            <Textarea id={`award-desc-${award.id}`} label="Description (Optional)" value={award.description || ''} onChange={e => handleNestedChange<Award>('awards', award.id, 'description', e.target.value)} />
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
    );
};

export default AdditionalInfoForm;
