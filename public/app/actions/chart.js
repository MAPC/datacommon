import types from './types';
import locations from '~/app/constants/locations';


export function fetchChartData(chartInfo, municipality) {
  return async (dispatch, getState) => {
    const { chart } = getState();
    const { table, yearCol, where } = chartInfo;
    const columns = Object.keys(chartInfo.columns).join(',');

    if (!chart.cache[table] || !chart.cache[table][municipality]) {
      let query = `${locations.BROWSER_API}SELECT ${columns} FROM ${table}`;
      query = `${query} WHERE municipal ilike '${municipality}'`;

      if (yearCol) {
        const yearResponse = await fetch(`${locations.BROWSER_API}SELECT ${yearCol} from ${table} ORDER BY ${yearCol} DESC LIMIT 1`);
        const payload = await yearResponse.json() || {};

        if (payload.rows && payload.rows[0] && payload.rows[0][yearCol]) {
          query = `${query} AND ${yearCol} = '${payload.rows[0][yearCol]}'`;
        }
      }

      if (where) {
        query = `${query} AND ${where}`;
      }

      const response = await fetch(query);
      const payload = await response.json() || {};

      return dispatch(update(table, municipality, payload.rows || []));
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
