import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Add error handling for script loading issues
const handleErrorEvent = (event: Event | ErrorEvent) => {
  const errorEvent = event as ErrorEvent;
  if (
    errorEvent.message &&
    (errorEvent.message.includes('Unexpected token') || 
     errorEvent.message.includes('Failed to load'))
  ) {
    console.warn('Detected script loading error, attempting to recover...');
    // Force a hard reload to clear cache
    window.location.href = '/';
    return true;
  }
  return false;
};

window.addEventListener('error', handleErrorEvent);

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
reportWebVitals(); 