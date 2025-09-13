import React from 'react';
import { Accordion } from './ui/Accordion';
import Card from './ui/Card';
import { BookOpenIcon } from './icons/BookOpenIcon';

const tips = [
  {
    title: 'Why Your Resume is Your Most Powerful Tool',
    content: "Your resume is often the first impression a potential employer has of you. It's a marketing document designed to sell your skills and experience. A strong resume can open doors to interviews and opportunities, while a weak one can get you overlooked, even if you're qualified. It's your ticket to getting noticed in a competitive job market."
  },
  {
    title: 'When is a Resume Most Useful?',
    content: "A resume is crucial when you're actively applying for jobs. It's also useful for networking, as you can share it with contacts who might know of opportunities. Keeping it updated is also great for performance reviews, freelance proposals, or even applying for academic programs. Essentially, it's your professional snapshot, ready whenever you need it."
  },
  {
    title: 'Key Sections to Include',
    content: "Every great resume should have these core sections: 1. **Contact Information:** Full name, phone, email, and LinkedIn profile. 2. **Professional Summary:** A 2-3 sentence pitch about who you are and what you bring to the table. 3. **Work Experience:** List your jobs in reverse chronological order, using bullet points with action verbs to describe your achievements. 4. **Education:** Your degree, university, and graduation date. 5. **Skills:** A categorized list of your technical and soft skills."
  },
  {
    title: 'Tips for Writing Compelling Content',
    content: "Focus on achievements, not just duties. Use numbers to quantify your impact (e.g., 'Increased sales by 20%' instead of 'Responsible for sales'). Tailor your resume for each job by using keywords from the job description. Keep it concise, ideally one page for every 10 years of experience. Proofread meticulously to eliminate any typos or grammatical errors."
  },
];

const ResumeTips: React.FC = () => {
  return (
    <div className="mt-12">
      <Card>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-800">
          <BookOpenIcon className="w-6 h-6" />
          Resume Writing Guide
        </h2>
        <p className="mb-6 text-slate-600">
          A great resume is the key to unlocking your next career opportunity. Use these essential tips to craft a document that stands out to recruiters and hiring managers.
        </p>
        <div className="space-y-4">
          {tips.map((tip, index) => (
            <Accordion key={index} title={tip.title} defaultOpen={index === 0}>
              <p className="text-slate-700 leading-relaxed">{tip.content}</p>
            </Accordion>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ResumeTips;
