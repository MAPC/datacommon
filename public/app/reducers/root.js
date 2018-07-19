import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';

import searchBar from './searchBar';
import dataset from './dataset';
import category from './category';

const rootReducer = combineReducers({
  router,
  searchBar,
  dataset,
  category,
});

export default rootReducer;
