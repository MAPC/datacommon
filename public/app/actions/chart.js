import types from './types';
import locations from '~/app/constants/locations';


export function fetchChartData(table, municipality, columns = '*', yearCol = null) {
  return async (dispatch, getState) => {
    const { chart } = getState();

    if (!chart.cache[table] || !chart.cache[table][municipality]) {
      let year = null;
      if (yearCol) {
        const yearResponse = await fetch(`${locations.BROWSER_API}SELECT ${yearCol} from ${table} ORDER BY ${yearCol} DESC LIMIT 1`);
        year = (await yearResponse.json()).rows[0][yearCol];
        console.log(year);
      }

      const response = await fetch(`${locations.BROWSER_API}SELECT ${columns} FROM ${table} WHERE municipal ilike '${municipality}' ${year ? (`AND ${yearCol} = ${year}`) : ''}`);
      const payload = await response.json();

      return dispatch(update(table, municipality, payload.rows));
    }
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
