const locations {
  development: {
    HOST: 'http://localhost:1234',
    BROWSER: 'https://datacommon.carto.mapc.org/api/v2/sql?q=',
  },

  production: {
    HOST: 'http://localhost:1234',
    BROWSER: 'https://datacommon.carto.mapc.org/api/v2/sql?q=',
  },
};

export default locations[process.env.NODE_ENV];
