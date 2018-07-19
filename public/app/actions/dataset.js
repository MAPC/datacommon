import types from './types';


export function fetchAll() {
  return async (dispatch, getState) => {
    return dispatch(update());
  };
}

export function update() {
  return {
    type: types.DATASET.UPDATE,
  };
}
