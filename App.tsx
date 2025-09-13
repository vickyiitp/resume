import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ResumeBuilder from './components/ResumeBuilder';
import ResumeTips from './components/ResumeTips';
import { Toast } from './components/ui/Toast';

export type ToastData = {
  message: string;
  type: 'success' | 'error';
}

const App: React.FC = () => {
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
  const [toast, setToast] = useState<ToastData | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      <Header mobileView={mobileView} setMobileView={setMobileView} />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <ResumeBuilder mobileView={mobileView} setToast={setToast} />
        <ResumeTips />
      </main>
      <Footer />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default App;
