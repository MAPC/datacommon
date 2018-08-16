const locations = {
  development: {
    HOST: 'https://localhost:1234',
    BROWSER_API: 'https://prql.mapc.org?token=16a2637ee33572e46f5609a578b035dc&query=',
  },

  production: {
    HOST: 'https://datacommon.mapc.org',
    BROWSER_API: 'https://datacommon.carto.mapc.org/api/v2/sql?q=',
  },
};

export default locations[process.env.NODE_ENV];
