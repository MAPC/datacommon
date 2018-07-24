import types from '../actions/types';


const defaultState = {
  cache: [],
  categories: [],
};

export default function dataset(state = defaultState, action) {
  let newState = {};

  switch(action.type) {
    case types.DATASET.UPDATE:
      const cache = action.datasets.map(row => ({ id: row.id, title: row.menu3 }));
      const categories = [...action.datasets.reduce((a,b) => a.add(b.menu1), new Set())].sort();

      newState = { cache, categories };
      break;
  }

  return { ...defaultState, ...state, ...newState };
};
