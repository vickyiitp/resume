export interface PersonalDetails {
  fullName: string;
  email: string;
  phoneNumber: string;
  location: string;
  website: string;
  linkedin: string;
  photo: string | null;
}

export interface BulletPoint {
  id: string;
  point: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: BulletPoint[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  major: string;
  gpa: string;
  startDate: string;
  endDate: string;
}

export interface Skill {
  id: string;
  category: string;
  names: string;
}

export interface Project {
  id: string;
  name: string;
  technologies: string;
  link: string;
  description: BulletPoint[];
}

export interface Certification {
    id: string;
    name: string;
    issuer: string;
    date: string;
}

export interface Award {
    id: string;
    name: string;
    issuer: string;
    date: string;
    description?: string;
}

export interface Language {
    id: string;
    name: string;
    proficiency: string;
}

export interface VolunteerExperience {
    id: string;
    organization: string;
    role: string;
    startDate: string;
    endDate: string;
    description: BulletPoint[];
}

export interface ResumeData {
  personalDetails: PersonalDetails;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  awards: Award[];
  languages: Language[];
  volunteerExperience: VolunteerExperience[];
}

export interface AIFeedbackPoint {
    title: string;
    description: string;
    suggestedChange?: string;
}

export interface AIFeedbackData {
  score: number;
  strengths: AIFeedbackPoint[];
  suggestions: AIFeedbackPoint[];
}

export type FormErrors = {
  [key in keyof ResumeData]?: {
    [key: string]: string;
  };
};

export enum TemplateType {
  MODERN = 'modern',
  CLASSIC = 'classic',
  CREATIVE = 'creative',
  EXECUTIVE = 'executive',
  TECHNICAL = 'technical'
}