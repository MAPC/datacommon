import middleware from 'redux-thunk';
import { applyMiddleware, createStore } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from './reducers/root';


export const history = createBrowserHistory();

export const store = ((initialState, history) => (
  createStore(
    rootReducer,
    initialState,
    composeWithDevTools(
      applyMiddleware(
        middleware,
        routerMiddleware(history)
      )
    )
  )
))({}, history);
