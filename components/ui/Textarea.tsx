
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, id, error, ...props }) => {
  const errorClasses = 'border-red-500 focus:ring-red-500 focus:border-red-500';
  const baseClasses = 'block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm';

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <textarea
        id={id}
        rows={4}
        className={`${baseClasses} ${error ? errorClasses : ''}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Textarea;