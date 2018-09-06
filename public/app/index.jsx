require('es6-promise').polyfill();
require('isomorphic-fetch');
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';

import { history, store } from './store';
import App from './containers/App';


const Index = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Route path="/" component={App} />
    </ConnectedRouter>
  </Provider>
);

ReactDOM.render(
  <Index />,
  document.querySelector("#root")
);
