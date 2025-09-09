
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, id, error, ...props }) => {
  const errorClasses = 'border-red-500 focus:ring-red-500 focus:border-red-500';
  const baseClasses = 'block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm';

  return (
    <div>
      {label && <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>}
      <input
        id={id}
        className={`${baseClasses} ${error ? errorClasses : ''}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Input;