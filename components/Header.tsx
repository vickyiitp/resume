import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <div className="container mx-auto px-4 py-3">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">
          AI Resume <span className="text-blue-600">Architect</span>
        </h1>
      </div>
    </header>
  );
};

export default Header;