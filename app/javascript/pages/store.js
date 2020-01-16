import middleware from 'redux-thunk';
import { applyMiddleware, createStore } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import { composeWithDevTools } from 'redux-devtools-extension';
import ReactGA from 'react-ga';

import rootReducer from './reducers/root';

ReactGA.initialize('UA-5547782-35');

export const history = createBrowserHistory();

const trackPage = (page) => {
  ReactGA.pageview(page);
};

const gaTrackingMiddleware = (store) => (next) => (action) => {
  if (action.type === '@@router/LOCATION_CHANGE') {
    const nextPage = `${action.payload.pathname}${action.payload.search}`;
    trackPage(nextPage);
  }
  return next(action);
};


export const store = ((initialState, history) => (
  createStore(
    rootReducer,
    initialState,
    composeWithDevTools(
      applyMiddleware(
        gaTrackingMiddleware,
        middleware,
        routerMiddleware(history),
      ),
    ),
  )
))({}, history);
