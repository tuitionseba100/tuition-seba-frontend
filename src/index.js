import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client'; // Notice the change to 'react-dom/client'
import App from './App';
import 'react-toastify/dist/ReactToastify.css'; // for toast notifications


const root = ReactDOM.createRoot(document.getElementById('root')); // Create the root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
