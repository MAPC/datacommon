import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import '../styles/app.scss';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';  // 改用 BrowserRouter
import { store } from './store';  // 不需要 import history
import App from './containers/App';

require('es6-promise').polyfill();
require('isomorphic-fetch');

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