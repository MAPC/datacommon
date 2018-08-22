import types from './types';
import locations from '~/app/constants/locations';


export function fetchChartData(chartInfo, municipality) {
  return async (dispatch, getState) => {
    const { chart } = getState();
    Object.keys(chartInfo.tables).forEach(async (tableName) => {
      const { table, yearCol, latestYearOnly, where } = chartInfo.tables[tableName];

      const columns = chartInfo.tables[tableName].columns.join(',');

      if (!chart.cache[tableName] || !chart.cache[tableName][municipality]) {
        let query = `${locations.BROWSER_API}SELECT ${columns} FROM ${tableName}`;
        query = `${query} WHERE municipal ilike '${municipality}'`;

        if (yearCol && latestYearOnly) {
          const yearResponse = await fetch(`${locations.BROWSER_API}SELECT ${yearCol} from ${tableName} ORDER BY ${yearCol} DESC LIMIT 1`);
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

        return dispatch(update(tableName, municipality, payload.rows || []));
      }
    });
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
