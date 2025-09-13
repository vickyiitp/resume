
import React from 'react';
import { TemplateType } from '../types';

interface TemplateSelectorProps {
  selectedTemplate: TemplateType;
  onSelectTemplate: (template: TemplateType) => void;
}

const templates: { id: TemplateType; name: string }[] = [
  { id: TemplateType.MODERN, name: 'Modern' },
  { id: TemplateType.CLASSIC, name: 'Classic' },
  { id: TemplateType.CREATIVE, name: 'Creative' },
  { id: TemplateType.EXECUTIVE, name: 'Executive' },
  { id: TemplateType.TECHNICAL, name: 'Technical' },
];

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selectedTemplate, onSelectTemplate }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">Template</label>
      <div className="flex space-x-2 rounded-lg bg-slate-100 p-1">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template.id)}
            className={`w-full rounded-md py-1.5 text-sm font-medium transition-all
              ${selectedTemplate === template.id
                ? 'bg-white shadow-sm text-blue-700'
                : 'text-slate-600 hover:bg-white/60 hover:text-slate-800'
              }`
            }
          >
            {template.name}
          </button>
        ))}
      </div>
    </div>
  );
};