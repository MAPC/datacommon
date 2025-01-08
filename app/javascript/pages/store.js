import { applyMiddleware, createStore } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { composeWithDevTools } from 'redux-devtools-extension';
import {thunk} from 'redux-thunk';
import ReactGA from 'react-ga';

import rootReducer from './reducers/root';

ReactGA.initialize('UA-5547782-35');

// Create a custom browser history object
export const history = createBrowserHistory();

const trackPage = (page) => {
  ReactGA.pageview(page);
};

// Middleware for tracking page views with Google Analytics
const gaTrackingMiddleware = (store) => (next) => (action) => {
  if (action.type === '@@router/LOCATION_CHANGE') {
    const nextPage = `${action.payload.location.pathname}${action.payload.location.search}`;
    trackPage(nextPage);
  }
  return next(action);
};

// Pass the history to rootReducer directly
export const store = createStore(
  rootReducer(history),
  composeWithDevTools(
    applyMiddleware(
      gaTrackingMiddleware,
      thunk,
      routerMiddleware(history)
    )
  )
);
