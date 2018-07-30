import types from './types';


export function fetch(table, municipality, columns = []) {
  return async (dispatch, getState) => {
    return dispatch(update(table));
  };
};

export function update(table, data) {
  return {
    type: types.CHART.UPDATE,
    table,
    data,
  }
};
