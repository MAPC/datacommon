import types from './types';

import locations from '~/app/constants/locations';


export function fetchAll() {
  return async (dispatch, getState) => {
    if (getState().dataset.cache.length === 0 ) {
      const response = await fetch(`${locations.BROWSER_API}?token=${locations.DS_TOKEN}&query=SELECT * FROM tabular._data_browser WHERE active='Y'`)
      const payload = await response.json();

      return dispatch(update(payload.rows));
    }
  };
}

export function update(datasets = []) {
  return {
    type: types.DATASET.UPDATE,
    datasets
  };
}
