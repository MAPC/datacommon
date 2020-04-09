const locations = {
  development: {
    HOST: 'https://localhost:1234',
    BROWSER_API: 'https://prql.mapc.org',
    DS_TOKEN: '96608389a2545f7adac815ea258ad27e',
    GISDATA_TOKEN: '5e567e555ab7a2d22effa249e81cb903',
  },

  staging: {
    HOST: 'https://staging.datacommon.mapc.org',
    BROWSER_API: 'https://prql.mapc.org',
    DS_TOKEN: '96608389a2545f7adac815ea258ad27e',
    GISDATA_TOKEN: '5e567e555ab7a2d22effa249e81cb903',
  },

  production: {
    HOST: 'https://datacommon.mapc.org',
    BROWSER_API: 'https://prql.mapc.org',
    DS_TOKEN: '96608389a2545f7adac815ea258ad27e',
    GISDATA_TOKEN: '5e567e555ab7a2d22effa249e81cb903',
  },
};

export default locations[process.env.NODE_ENV];
