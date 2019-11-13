const locations = {
  development: {
    HOST: 'https://localhost:1234',
    BROWSER_API: 'https://prql.mapc.org',
    DS_TOKEN: '16a2637ee33572e46f5609a578b035dc',
    GISDATA_TOKEN: 'e2e3101e16208f04f7415e36052ce59b',
  },

  staging: {
    HOST: 'https://staging.datacommon.mapc.org',
    BROWSER_API: 'https://prql.mapc.org',
    DS_TOKEN: '16a2637ee33572e46f5609a578b035dc',
    GISDATA_TOKEN: 'e2e3101e16208f04f7415e36052ce59b',
  },

  production: {
    HOST: 'https://datacommon.mapc.org',
    BROWSER_API: 'https://prql.mapc.org',
    DS_TOKEN: '16a2637ee33572e46f5609a578b035dc',
    GISDATA_TOKEN: 'e2e3101e16208f04f7415e36052ce59b',
  },
};

export default locations[process.env.NODE_ENV];
