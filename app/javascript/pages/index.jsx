import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import '../styles/app.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';  
import { store } from './store';  
import App from './containers/App';

const Index = () => (
  <Provider store={store}>
    <BrowserRouter>
      <App /> 
    </BrowserRouter>
  </Provider>
);

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('root');
  if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(<Index />);
  }
});