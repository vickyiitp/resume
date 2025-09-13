
import React from 'react';
import { GitHubIcon } from './icons/GitHubIcon';
import { XIcon } from './icons/XIcon';
import { LinkedinIcon } from './icons/LinkedinIcon';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-slate-300 mt-12">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-3">About The Creator - vickyiitp</h3>
            <p className="text-sm leading-relaxed mb-2">
              I am currently pursuing a B.sc at the Indian Institute of Technology, Patna (2nd year). My academic journey is complemented by hands-on experience in full-stack web development, backend engineering, and AI-driven applications.
            </p>
            <p className="text-sm leading-relaxed mb-2">
              As part of my academic curriculum, I successfully completed a Capstone Project, where my team and I developed a full-stack web platform designed to connect startups with contributors (students, freelancers, and professionals). In this project, I played a key role in:
            </p>
            <ul className="list-disc list-inside text-sm leading-relaxed mb-2 pl-4 space-y-1">
                <li>Backend development using Flask and MongoDB</li>
                <li>Database integration for user authentication and project management</li>
                <li>Contributing to frontend development using HTML, CSS, and JavaScript</li>
            </ul>
            <p className="text-sm leading-relaxed mb-2">
              The project was successfully presented at IIT Patna, demonstrating practical problem-solving, teamwork, and technical execution.
            </p>
            <p className="text-sm leading-relaxed mb-2">
              Beyond academics, I actively engage in:
            </p>
             <ul className="list-disc list-inside text-sm leading-relaxed mb-2 pl-4 space-y-1">
                <li>AI research and project development (cybersecurity tools, digital content automation, image processing)</li>
                <li>Content creation and digital products, focusing on knowledge-sharing and monetization strategies</li>
                <li>Entrepreneurial initiatives, including startup ideation and community building for students and professionals</li>
                <li>Personal development, emphasizing fitness, discipline, and productivity.</li>
            </ul>
            <p className="text-sm leading-relaxed">
              I am committed to leveraging my technical expertise, creativity, and entrepreneurial mindset to build impactful solutions at the intersection of technology, AI, and innovation.
            </p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-white mb-3">Connect</h3>
            <div className="flex space-x-4 justify-center md:justify-start">
              <a href="https://github.com/vickyiitp" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="GitHub">
                <GitHubIcon className="w-6 h-6" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="https://x.com/indigolens_in" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="X (formerly Twitter)">
                <XIcon className="w-6 h-6" />
                <span className="sr-only">X (Twitter)</span>
              </a>
              <a href="https://www.linkedin.com/in/vicky-kumar-557166193/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="LinkedIn">
                 <LinkedinIcon className="w-6 h-6" />
                 <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-700 pt-6 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} AI Resume Architect by vickyiitp. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;