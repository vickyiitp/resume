import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ResumeBuilder from './components/ResumeBuilder';
import ResumeTips from './components/ResumeTips';

const App: React.FC = () => {
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');

  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      <Header mobileView={mobileView} setMobileView={setMobileView} />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <ResumeBuilder mobileView={mobileView} />
        <ResumeTips />
      </main>
      <Footer />
    </div>
  );
};

export default App;