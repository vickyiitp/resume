import type { ResumeData } from './types';
import { v4 as uuidv4 } from 'uuid';

export const INITIAL_RESUME_DATA: ResumeData = {
  personalDetails: {
    fullName: '',
    email: '',
    phoneNumber: '',
    location: '',
    linkedin: '',
    website: '',
    photo: null,
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  awards: [],
  languages: [],
  volunteerExperience: [],
};

export const SAMPLE_RESUME_DATA: ResumeData = {
  personalDetails: {
    fullName: 'Alex Doe',
    email: 'alex.doe@example.com',
    phoneNumber: '415-555-0101',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexdoe',
    website: 'alexdoe.dev',
    photo: null,
  },
  summary: 'Innovative and detail-oriented Frontend Developer with 3+ years of experience building and maintaining responsive and scalable web applications. Proficient in React, TypeScript, and modern JavaScript frameworks. Passionate about creating intuitive user interfaces and collaborating in agile environments to deliver high-quality software.',
  experience: [
    {
      id: uuidv4(),
      jobTitle: 'Frontend Developer',
      company: 'Tech Solutions Inc.',
      location: 'Palo Alto, CA',
      startDate: 'Aug 2021',
      endDate: 'Present',
      description: [
        { id: uuidv4(), point: 'Developed and maintained the main customer-facing dashboard using React and TypeScript, resulting in a 20% increase in user engagement.' },
        { id: uuidv4(), point: 'Collaborated with UX/UI designers to implement a new design system, improving code reusability and reducing development time by 15%.' },
        { id: uuidv4(), point: 'Optimized application performance by code-splitting and lazy-loading components, which decreased initial load time by 300ms.' },
      ],
    },
    {
        id: uuidv4(),
        jobTitle: 'Junior Web Developer',
        company: 'Web Innovators LLC',
        location: 'San Jose, CA',
        startDate: 'Jun 2020',
        endDate: 'Jul 2021',
        description: [
          { id: uuidv4(), point: 'Assisted in building responsive marketing websites for various clients using HTML, CSS, and JavaScript.' },
          { id: uuidv4(), point: 'Integrated third-party APIs for analytics and customer support functionalities.' },
        ],
      },
  ],
  education: [
    {
      id: uuidv4(),
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      major: 'Computer Science',
      gpa: '3.8',
      startDate: 'Sep 2016',
      endDate: 'May 2020',
    },
  ],
  skills: [
    { id: uuidv4(), category: 'Programming Languages', names: 'JavaScript (ES6+), TypeScript, HTML5, CSS3/SASS' },
    { id: uuidv4(), category: 'Frameworks & Libraries', names: 'React, Next.js, Redux, Tailwind CSS, Jest' },
    { id: uuidv4(), category: 'Developer Tools', names: 'Git, Webpack, Docker, Vercel, Figma' },
  ],
  projects: [
    {
      id: uuidv4(),
      name: 'Real-Time Chat Application',
      technologies: 'React, Firebase, Tailwind CSS',
      link: 'github.com/alexdoe/chat-app',
      description: [
        { id: uuidv4(), point: 'Built a full-stack chat application featuring real-time messaging, user authentication, and multiple channels.' },
        { id: uuidv4(), point: 'Implemented a clean, responsive UI with React and managed application state efficiently.' },
      ],
    },
  ],
  certifications: [
    { id: uuidv4(), name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', date: '2022' },
  ],
  awards: [],
  languages: [
    { id: uuidv4(), name: 'English', proficiency: 'Native' },
    { id: uuidv4(), name: 'Spanish', proficiency: 'Conversational' },
  ],
  volunteerExperience: [],
};
