import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import './polyfills/string-startsWith';
import './polyfills/array-includes';
import './polyfills/math-log10';
import '../styles/app.scss';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

import { history, store } from './store';
import App from './containers/App';

require('es6-promise').polyfill();
require('isomorphic-fetch');


const Index = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Route path="/" component={App} />
    </ConnectedRouter>
  </Provider>
);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>,
);
