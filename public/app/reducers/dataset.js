import types from '../actions/types';


const defaultState = {
  cache: [],
};

export default function dataset(state = defaultState, action) {

  switch(action.type) {
    case types.DATASET.UPDATE:
      return { ...defaultState, ...state, ...{ cache: action.datasets } };
    default:
      return state;
  }

};
