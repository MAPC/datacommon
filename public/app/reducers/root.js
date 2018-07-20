import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';

import dataset from './dataset';
import searchBar from './searchBar';
import municipality from './municipality';

const rootReducer = combineReducers({
  router,
  dataset,
  searchBar,
  municipality,
});

export default rootReducer;
