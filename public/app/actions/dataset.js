import types from './types';


export function fetchAll() {
  return async (dispatch, getState) => {
    let datasets = getState().dataset.cache;

    if (datasets.length === 0 ) {
      datasets = await (
        await fetch('https://datacommon.carto.mapc.org/api/v2/sql?q=select%20*%20from%20table_data_browser%20where%20schemaname%3D%27tabular%27%20or%20schemaname%3D%27mapc%27%20and%20active%3D%27Y%27')
      ).json();
    }

    return dispatch(update(datasets.rows));
  };
}

export function update(datasets = []) {
  return {
    type: types.DATASET.UPDATE,
    datasets
  };
}
