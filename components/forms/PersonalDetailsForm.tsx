import React from 'react';
import type { ResumeData, FormErrors } from '../../types';
import Card from '../ui/Card';
import Input from '../ui/Input';
import ImageUpload from '../ui/ImageUpload';
import { UserIcon } from '../icons/UserIcon';

interface Props {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  errors: FormErrors;
}

const PersonalDetailsForm: React.FC<Props> = ({ resumeData, setResumeData, errors }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResumeData(prev => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        [name]: value,
      },
    }));
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
  
  const { personalDetails } = resumeData;

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><UserIcon /> Personal Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input id="fullName" label="Full Name*" name="fullName" value={personalDetails.fullName} onChange={handleChange} error={errors.personalDetails?.fullName} aria-invalid={!!errors.personalDetails?.fullName} />
        <Input id="email" label="Email*" name="email" type="email" value={personalDetails.email} onChange={handleChange} error={errors.personalDetails?.email} aria-invalid={!!errors.personalDetails?.email}/>
        <Input id="phoneNumber" label="Phone Number" name="phoneNumber" value={personalDetails.phoneNumber} onChange={handleChange} />
        <Input id="location" label="Location" name="location" value={personalDetails.location} onChange={handleChange} placeholder="e.g., San Francisco, CA" />
        <Input id="linkedin" label="LinkedIn Profile" name="linkedin" value={personalDetails.linkedin} onChange={handleChange} />
        <Input id="website" label="Website/Portfolio" name="website" value={personalDetails.website} onChange={handleChange} />
        <div className="md:col-span-2">
          <ImageUpload
            photo={personalDetails.photo}
            onPhotoChange={handlePhotoChange}
            onPhotoRemove={() => setResumeData(p => ({ ...p, personalDetails: { ...p.personalDetails, photo: null } }))}
          />
        </div>
      </div>
    </Card>
  );
};

export default PersonalDetailsForm;
