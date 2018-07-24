import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';

import search from './search';
import dataset from './dataset';
import municipality from './municipality';

const rootReducer = combineReducers({
  router,
  dataset,
  search,
  municipality,
});

export default rootReducer;
