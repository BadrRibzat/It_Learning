// src/main.tsx
import { createRoot } from 'react-dom/client';
import './App.css';
import App from './App.tsx';

const root = createRoot(document.getElementById('root')!);
root.render(
  <App />
);
