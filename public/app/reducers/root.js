import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';

import chart from './chart';
import search from './search';
import dataset from './dataset';
import municipality from './municipality';

const rootReducer = combineReducers({
  chart,
  router,
  dataset,
  search,
  municipality,
});

export default rootReducer;
