import React, { useState } from 'react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({ title, children, icon, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 focus:outline-none transition-colors"
      >
        <div className="flex items-center gap-3">
            {icon && <span className="text-slate-500">{icon}</span>}
            <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        </div>
        <svg
          className={`w-6 h-6 transform transition-transform text-slate-500 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="p-4 border-t border-slate-200">
          {children}
        </div>
      )}
    </div>
  );
};
