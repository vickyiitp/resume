
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-white mt-12">
      <div className="container mx-auto px-4 py-6 text-center">
        <p>&copy; {new Date().getFullYear()} AI Resume Architect. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;