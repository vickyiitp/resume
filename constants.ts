import { v4 as uuidv4 } from 'uuid';
import type { ResumeData } from './types';

export const INITIAL_RESUME_DATA: ResumeData = {
  personalDetails: {
    fullName: '',
    email: '',
    phoneNumber: '',
    location: '',
    website: '',
    linkedin: '',
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
    fullName: 'Jane Doe',
    email: 'jane.doe@example.com',
    phoneNumber: '123-456-7890',
    location: 'San Francisco, CA',
    website: 'janedoe.dev',
    linkedin: 'linkedin.com/in/janedoe',
    photo: 'https://i.pravatar.cc/150?u=janedoe',
  },
  summary:
    'Innovative and results-driven Senior Frontend Developer with 8+ years of experience architecting and developing scalable, user-centric web applications. Proficient in React, TypeScript, and modern JavaScript frameworks. Passionate about creating seamless user experiences and leading high-performing engineering teams.',
  experience: [
    {
      id: uuidv4(),
      jobTitle: 'Senior Frontend Developer',
      company: 'Tech Solutions Inc.',
      location: 'San Francisco, CA',
      startDate: 'Jan 2020',
      endDate: 'Present',
      description: [
        { id: uuidv4(), point: 'Led the development of a new design system, resulting in a 30% increase in development velocity and ensuring UI consistency across all products.' },
        { id: uuidv4(), point: 'Mentored a team of 4 junior developers, fostering a culture of collaboration and continuous learning.' },
        { id: uuidv4(), point: 'Optimized application performance by implementing code-splitting and lazy loading, reducing initial load time by 50%.' },
      ],
    },
    {
      id: uuidv4(),
      jobTitle: 'Frontend Developer',
      company: 'Web Innovators',
      location: 'Palo Alto, CA',
      startDate: 'Jun 2016',
      endDate: 'Dec 2019',
      description: [
        { id: uuidv4(), point: 'Developed and maintained responsive user interfaces for high-traffic e-commerce websites using React and Redux.' },
        { id: uuidv4(), point: 'Collaborated with UX/UI designers to translate wireframes and mockups into functional, pixel-perfect web pages.' },
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
      startDate: '2012',
      endDate: '2016',
    },
  ],
  skills: [
    {
      id: uuidv4(),
      category: 'Programming Languages',
      names: 'JavaScript (ES6+), TypeScript, HTML5, CSS3/SASS',
    },
    {
      id: uuidv4(),
      category: 'Frameworks & Libraries',
      names: 'React, Next.js, Redux, Tailwind CSS, Jest, React Testing Library',
    },
    {
      id: uuidv4(),
      category: 'Tools',
      names: 'Git, Webpack, Babel, Figma, Jira',
    },
  ],
  projects: [
    {
      id: uuidv4(),
      name: 'Project Portfolio Website',
      technologies: 'Next.js, Tailwind CSS, Vercel',
      link: 'janedoe.dev',
      description: [
          { id: uuidv4(), point: 'Designed and developed a personal portfolio to showcase projects and skills.' },
          { id: uuidv4(), point: 'Implemented a fully responsive design ensuring optimal viewing on all devices.' },
      ],
    },
  ],
  certifications: [
      { id: uuidv4(), name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', date: '2022' }
  ],
  awards: [
      { id: uuidv4(), name: 'Developer of the Year', issuer: 'Tech Solutions Inc.', date: '2021', description: 'Awarded for outstanding contributions to the company\'s flagship product.' }
  ],
  languages: [
      { id: uuidv4(), name: 'English', proficiency: 'Native' },
      { id: uuidv4(), name: 'Spanish', proficiency: 'Conversational' },
  ],
  volunteerExperience: [],
};
