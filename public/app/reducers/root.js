import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';

import dataset from './dataset';
import searchBar from './searchBar';
import muniSelect from './muniSelect';

const rootReducer = combineReducers({
  router,
  dataset,
  searchBar,
  muniSelect,
});

export default rootReducer;
