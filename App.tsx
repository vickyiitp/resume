
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ResumeBuilder from './components/ResumeBuilder';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <ResumeBuilder />
      </main>
      <Footer />
    </div>
  );
};

export default App;
