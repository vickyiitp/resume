import React from 'react';

interface HeaderProps {
  mobileView: 'editor' | 'preview';
  setMobileView: (view: 'editor' | 'preview') => void;
}

const Header: React.FC<HeaderProps> = ({ mobileView, setMobileView }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex flex-col items-start leading-none">
            <h1 className="text-2xl font-extrabold text-slate-800">
                AI Resume Architect
            </h1>
            <span className="text-lg font-bold text-blue-600 font-dancing-script -mt-1">
                by vickyiitp
            </span>
        </div>
        
        {/* Mobile View Toggle */}
        <div className="lg:hidden">
          <div className="flex space-x-1 rounded-lg bg-slate-100 p-1">
            <button
              onClick={() => setMobileView('editor')}
              className={`w-full rounded-md px-3 py-1 text-sm font-medium transition-all ${
                mobileView === 'editor'
                  ? 'bg-white shadow-sm text-blue-700'
                  : 'text-slate-600 hover:bg-white/60'
              }`}
            >
              Editor
            </button>
            <button
              onClick={() => setMobileView('preview')}
              className={`w-full rounded-md px-3 py-1 text-sm font-medium transition-all ${
                mobileView === 'preview'
                  ? 'bg-white shadow-sm text-blue-700'
                  : 'text-slate-600 hover:bg-white/60'
              }`}
            >
              Preview
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
