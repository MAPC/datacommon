import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'

import chart from './chart';
import search from './search';
import dataset from './dataset';
import municipality from './municipality';

const rootReducer = (history) => combineReducers({
  router: connectRouter(history),
  chart,
  dataset,
  search,
  municipality,
});

export default rootReducer;
