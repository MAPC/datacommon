import types from '../actions/types';


const defaultState = {
  cache: [],
};

export default function muniSelect(state = defaultState, action) {

  switch(action.type) {
    case  types.MUNICIPAL.UPDATE:
      return state;
    default:
      return state;
  }

};
