import ReactDOM from 'react-dom/client';
import Scene from './objects/Scene';
import React from 'react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Scene />
  </React.StrictMode>
);