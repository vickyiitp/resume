import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Remove the initial loader once React has mounted
const loader = document.getElementById('loader');
if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 300); // Allow for fade-out transition
}
