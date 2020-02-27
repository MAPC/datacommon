import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import './polyfills/string-startsWith';
import './polyfills/array-includes';
import './polyfills/math-log10';
import '../styles/app.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';

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

ReactDOM.render(
  <Index />,
  document.querySelector('#root'),
);
