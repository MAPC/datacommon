import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';

import chart from './chart';
import dataset from './dataset';
import category from './category';
import searchBar from './searchBar';
import municipality from './municipality';

const rootReducer = combineReducers({
  chart,
  router,
  dataset,
  category,
  searchBar,
  municipality,
});

export default rootReducer;
