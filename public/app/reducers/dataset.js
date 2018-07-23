import types from '../actions/types';


const defaultState = {
  cache: [],
  categories: [],
};

export default function dataset(state = defaultState, action) {
  let newState = {};

  switch(action.type) {
    case types.DATASET.UPDATE:
      const cache = action.datasets;
      const categories = [...cache.reduce((a,b) => a.add(b.menu1), new Set())].sort();

      newState = { cache, categories };
      break;
  }

  return { ...defaultState, ...state, ...newState };
};
