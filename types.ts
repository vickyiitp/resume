export interface PersonalDetails {
  fullName: string;
  email: string;
  phoneNumber: string;
  location: string;
  linkedin: string;
  website: string;
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
  gpa?: string;
  startDate: string;
  endDate: string;
}

export interface Skill {
  id: string;
  category: string;
  names: string; // Comma-separated list of skills in this category
}

export interface Project {
  id: string;
  name: string;
  description: BulletPoint[];
  technologies: string;
  link: string;
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

export interface FormErrors {
    personalDetails?: {
        fullName?: string;
        email?: string;
        phoneNumber?: string;
        location?: string;
    };
    experience?: ({ jobTitle?: string; company?: string; startDate?: string; endDate?: string; description?: { point?: string }[] })[];
    education?: ({ institution?: string; degree?: string; startDate?: string; endDate?: string; major?: string })[];
    skills?: ({ category?: string; names?: string; })[];
    projects?: ({ name?: string; description?: { point?: string }[] })[];
}

export interface AIFeedbackData {
  score: number;
  strengths: string[];
  improvements: string[];
  overallSummary: string;
}

export enum TemplateType {
    MODERN = 'modern',
    CLASSIC = 'classic',
    CREATIVE = 'creative',
}