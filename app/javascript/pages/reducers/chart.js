import types from '../actions/types';

const defaultState = {
  cache: {},
};

export default function chart(state = defaultState, action) {
  let newState = {};

  switch(action.type) {
    case types.CHART.UPDATE:
      if (!action.table || !action.muni || !action.data) {
        return state;
      }

      const oldTable = state.cache[action.table] || {};
      const newTable = { ...oldTable, [action.muni]: action.data };
      const newCache = { ...state.cache, [action.table]: newTable };

      newState = { ...state, cache: newCache };
      break;

    default:
      return state;
  }

  return { ...state, ...newState };
}
