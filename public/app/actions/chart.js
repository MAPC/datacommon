import types from './types';
import locations from '~/app/constants/locations';

export function fetchChartData(chartInfo, municipality) {
  return async (dispatch, getState) => {
    const { chart } = getState();
    Object.keys(chartInfo.tables).forEach(async (tableName) => {
      const { yearCol, where, latestYearOnly, years, specialFetch } = chartInfo.tables[tableName];
      const dispatchUpdate = (rows) =>
          dispatch(update(tableName, municipality, rows));
      if (!chart.cache[tableName] || !chart.cache[tableName][municipality]) {
        if (specialFetch) {
          return await specialFetch(municipality.replace('-', ' '), dispatchUpdate);
        }
        const api = `${locations.BROWSER_API}?token=${locations.DS_TOKEN}&query=`;
        const columns = chartInfo.tables[tableName].columns.join(',');
        let query = `${api}SELECT ${columns} FROM ${tableName}`;
        query = `${query} WHERE municipal ilike '${municipality.replace('-', ' ')}'`;

        if (yearCol && latestYearOnly && !years) {
          const yearResponse = await fetch(`${api}SELECT ${yearCol} from ${tableName} ORDER BY ${yearCol} DESC LIMIT 1`);
          const payload = await yearResponse.json() || {};

          if (payload.rows && payload.rows[0] && payload.rows[0][yearCol]) {
            query = `${query} AND ${yearCol} = '${payload.rows[0][yearCol]}'`;
          }
        } else if (years) {
          query = `${query} AND ${yearCol} IN (${years.map(y => `'${y}'`).join(',')})`;
        }

        if (where) {
          query = `${query} AND ${where}`;
        }

        const response = await fetch(query);
        const payload = await response.json() || {};

        return dispatchUpdate(payload.rows || []);
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
