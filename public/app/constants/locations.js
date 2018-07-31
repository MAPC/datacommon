const locations = {
  development: {
    HOST: 'http://localhost:1234',
    BROWSER_API: 'https://datacommon.carto.mapc.org/api/v2/sql?q=',
  },

  production: {
    HOST: 'https://datacommon.mapc.org',
    BROWSER_API: 'https://datacommon.carto.mapc.org/api/v2/sql?q=',
  },
};

export default locations[process.env.NODE_ENV];
