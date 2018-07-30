import types from './types';
import locations from '~/app/constants/locations';


export function fetchChartData(table, municipality, columns = '*') {
  return async (dispatch, getState) => {
    const { chart } = getState();
    let data = [];

    if (!chart.cache[table] || !chart.cache[table][municipality]) {
      data = await (
        await fetch(`${locations.BROWSER_API}SELECT ${columns} FROM ${table} WHERE municipal ilike '${municipality}' LIMIT 1`)
      ).json();

      data = data.rows[0];
    }

    return dispatch(update(table, municipality, data));
  };
};


export function update(table, muni, data) {
  return {
    type: types.CHART.UPDATE,
    table,
    muni,
    data,
  }
};
