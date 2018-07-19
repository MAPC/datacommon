import types from '../actions/types';


const defaultState = {
  cache: [],
};

export default function dataset(state = defaultState, action) {

  switch(action.type) {
    default:
      return state;
  }

};
