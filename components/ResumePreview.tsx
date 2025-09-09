import React from 'react';
import type { ResumeData } from '../types';
import { MailIcon } from './icons/MailIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { LocationIcon } from './icons/LocationIcon';
import { LinkIcon } from './icons/LinkIcon';

interface ResumePreviewProps {
  resumeData: ResumeData;
}

const ResumePreview = React.forwardRef<HTMLDivElement, ResumePreviewProps>(({ resumeData }, ref) => {
  const { personalDetails, summary, experience, education, skills, projects, certifications, languages, awards, volunteerExperience } = resumeData;

  const renderContactInfo = () => {
    const info = [];
    if (personalDetails.email) info.push({ icon: <MailIcon className="w-4 h-4" />, text: personalDetails.email, href: `mailto:${personalDetails.email}` });
    if (personalDetails.phoneNumber) info.push({ icon: <PhoneIcon className="w-4 h-4" />, text: personalDetails.phoneNumber, href: `tel:${personalDetails.phoneNumber}` });
    if (personalDetails.location) info.push({ icon: <LocationIcon className="w-4 h-4" />, text: personalDetails.location });
    if (personalDetails.website) info.push({ icon: <LinkIcon className="w-4 h-4" />, text: personalDetails.website, href: `https://${personalDetails.website.replace(/^https?:\/\//, '')}` });
    if (personalDetails.linkedin) info.push({ icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>, text: personalDetails.linkedin, href: `https://${personalDetails.linkedin.replace(/^https?:\/\//, '')}`});

    return (
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-slate-600 mt-2">
        {info.map((item, index) => (
          <div key={index} className="flex items-center gap-1.5">
            {item.icon}
            {item.href ? (
              <a href={item.href} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline">
                {item.text}
              </a>
            ) : (
              <span>{item.text}</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  const Section: React.FC<{ title: string; children: React.ReactNode; hasContent: boolean }> = ({ title, children, hasContent }) => {
      if (!hasContent) return null;
      return (
        <section className="mb-4">
          <h2 className="text-lg font-bold text-blue-800 border-b-2 border-blue-200 pb-1 mb-2 uppercase tracking-wider">{title}</h2>
          {children}
        </section>
      );
  }

  return (
    <div ref={ref} className="bg-white p-6 shadow-lg rounded-lg border border-slate-200 text-sm font-serif">
      {/* Header */}
      <header className="text-center mb-4">
        {personalDetails.photo && (
            <img src={personalDetails.photo} alt={personalDetails.fullName} className="w-24 h-24 rounded-full mx-auto mb-3 object-cover shadow-md" />
        )}
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">{personalDetails.fullName || 'Your Name'}</h1>
        {renderContactInfo()}
      </header>

      <Section title="Summary" hasContent={!!summary}>
        <p className="text-slate-700">{summary}</p>
      </Section>

      <Section title="Experience" hasContent={experience.length > 0 && experience.some(e => e.jobTitle)}>
        {experience.map((exp) => exp.jobTitle && (
          <div key={exp.id} className="mb-3 break-inside-avoid">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-slate-800">{exp.jobTitle}</h3>
              <p className="text-xs text-slate-500 font-sans whitespace-nowrap pl-2">{exp.startDate}{exp.endDate && ` - ${exp.endDate}`}</p>
            </div>
            <p className="italic text-slate-600">{exp.company}{exp.location && `, ${exp.location}`}</p>
            <ul className="list-disc list-inside mt-1 text-slate-700 space-y-1">
              {exp.description.map(bp => bp.point && <li key={bp.id}>{bp.point}</li>)}
            </ul>
          </div>
        ))}
      </Section>
      
      <Section title="Projects" hasContent={projects.length > 0 && projects.some(p => p.name)}>
        {projects.map((proj) => proj.name && (
          <div key={proj.id} className="mb-3 break-inside-avoid">
             <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-slate-800">{proj.name}</h3>
              {proj.link && <a href={`https://${proj.link.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs font-sans">View Project</a>}
            </div>
            <p className="italic text-slate-600 text-xs">{proj.technologies}</p>
            <ul className="list-disc list-inside mt-1 text-slate-700 space-y-1">
              {proj.description.map(bp => bp.point && <li key={bp.id}>{bp.point}</li>)}
            </ul>
          </div>
        ))}
      </Section>

      <Section title="Education" hasContent={education.length > 0 && education.some(e => e.institution)}>
        {education.map((edu) => edu.institution && (
          <div key={edu.id} className="mb-2">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-slate-800">{edu.institution}</h3>
              <p className="text-xs text-slate-500 font-sans whitespace-nowrap pl-2">{edu.startDate}{edu.endDate && ` - ${edu.endDate}`}</p>
            </div>
            <p className="text-slate-600">{edu.degree}{edu.major && `, ${edu.major}`}</p>
            {edu.gpa && <p className="text-xs text-slate-500">GPA: {edu.gpa}</p>}
          </div>
        ))}
      </Section>

      <Section title="Skills" hasContent={skills.length > 0 && skills.some(s => s.category)}>
        {skills.map((skill) => skill.category && (
          <div key={skill.id} className="flex gap-2 items-baseline mb-1">
            <h4 className="font-bold text-slate-800 w-1/3 text-right">{skill.category}:</h4>
            <p className="text-slate-700 w-2/3">{skill.names}</p>
          </div>
        ))}
      </Section>
      
      <Section title="Certifications" hasContent={certifications.length > 0 && certifications.some(c => c.name)}>
        {certifications.map(cert => cert.name && (
          <div key={cert.id} className="flex justify-between mb-1">
            <p className="text-slate-700">{cert.name} - <span className="italic">{cert.issuer}</span></p>
            <p className="text-xs text-slate-500 font-sans">{cert.date}</p>
          </div>
        ))}
      </Section>

      <Section title="Awards" hasContent={awards.length > 0 && awards.some(a => a.name)}>
        {awards.map(award => award.name && (
            <div key={award.id} className="mb-2">
                 <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-800">{award.name} - <span className="font-normal italic">{award.issuer}</span></h3>
                    <p className="text-xs text-slate-500 font-sans">{award.date}</p>
                </div>
                {award.description && <p className="text-sm text-slate-600">{award.description}</p>}
            </div>
        ))}
      </Section>

      <Section title="Languages" hasContent={languages.length > 0 && languages.some(l => l.name)}>
          <p className="text-slate-700">
              {languages.filter(l => l.name).map(lang => `${lang.name} (${lang.proficiency})`).join('; ')}
          </p>
      </Section>

      <Section title="Volunteer Experience" hasContent={volunteerExperience.length > 0 && volunteerExperience.some(v => v.organization)}>
        {volunteerExperience.map((vol) => vol.organization && (
          <div key={vol.id} className="mb-3 break-inside-avoid">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-slate-800">{vol.role}</h3>
              <p className="text-xs text-slate-500 font-sans whitespace-nowrap pl-2">{vol.startDate}{vol.endDate && ` - ${vol.endDate}`}</p>
            </div>
            <p className="italic text-slate-600">{vol.organization}</p>
            <ul className="list-disc list-inside mt-1 text-slate-700 space-y-1">
              {vol.description.map(bp => bp.point && <li key={bp.id}>{bp.point}</li>)}
            </ul>
          </div>
        ))}
      </Section>

    </div>
  );
});

export default ResumePreview;