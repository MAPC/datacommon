import middleware from 'redux-thunk';
import { applyMiddleware, createStore } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from '~/app/reducers/root';


export const history = createHistory();

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
