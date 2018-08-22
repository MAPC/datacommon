import colors from '~/app/constants/colors';

export default {
  'demographics' : {

    'race_ethnicity': {
      type: 'stacked-bar',
      title: 'Race and Ethnicity',
      xAxis: { label: 'Population', format: d => `${d/1000}k` },
      yAxis: { label: 'Year' },
      tables: {
        'tabular.b03002_race_ethnicity_acs_m': {
          yearCol: 'acs_year',
          columns: [
            'acs_year',
            'nhwhi',
            'nhaa',
            'nhna',
            'nhas',
            'nhpi',
            'nhoth',
            'nhmlt',
            'lat',
          ],
        },
      },
      labels: {
        'nhwhi': 'White',
        'nhaa': 'Black or African American',
        'nhna': 'American Indian',
        'nhas': 'Asian',
        'nhpi': 'Native Hawaiian and Other Pacific Islander',
        'nhoth': 'Some Other Race alone',
        'nhmlt': 'Two or More Races',
        'lat': 'Hispanic or Latino',
      },
      colors: {
        'nhwhi': colors.CHART.get('LIGHT_YELLOW'),
        'nhaa': colors.CHART.get('DARK_RED'),
        'nhna': colors.CHART.get('TEAL_BLUE'),
        'nhas': colors.CHART.get('DARK_GREEN'),
        'nhpi': colors.CHART.get('TEAL_GREEN'),
        'nhoth': colors.CHART.get('BLUE'),
        'nhmlt': colors.CHART.get('CYAN'),
        'lat': colors.CHART.get('PINK'),
      },
      source: 'ACS',
      timeframe: '5 yr avg 2012-16',
      datasetId: 6,
      transformer: (tables, chart) => {
        const raceEthnicityData = tables['tabular.b03002_race_ethnicity_acs_m'];
        const tableDef = chart.tables['tabular.b03002_race_ethnicity_acs_m'];
        if (raceEthnicityData.length < 1) { return []; }
        return raceEthnicityData.reduce((acc, row) =>
          acc.concat(Object.keys(row).reduce((set, key) =>
            (tableDef.yearCol == key ? set : set.concat([{
              x: row[key],
              y: row[tableDef.yearCol],
              z: chart.labels[key],
              color: chart.colors[key],
            }]))
          , []))
        , []);
      },
    },

    'pop_by_age': {
      type: 'stacked-bar',
      title: 'Population by Age',
      xAxis: { label: 'Population', format: d => `${d/1000}k` },
      yAxis: { label: 'Year' },
      tables: {
        'tabular.census2010_p12_pop_by_age_m': {
          yearCol: 'years',
          columns: [
            'years',
            'totpop',
            'pop_u18',
            'pop18_24',
            'pop25_34',
            'pop35_39',
            'pop40_44',
            'pop45_49',
            'pop50_54',
            'pop55_59',
            'pop60_61',
            'pop62_64',
            'pop65_66',
            'pop67_69',
            'pop70_74',
            'pop75_79',
            'pop80_84',
            'pop85o',
          ],
        }
      },
      labels: {
        pop_u18: 'Under 18',
        pop18_24: '18-24',
        pop25_34: '25-34',
        pop35_49: '35-49',
        pop50_64: '50-64',
        pop65_74: '65-74',
        pop75o: '75 and over',
      },
      source: '2010 Census',
      timeframe: '2010',
      datasetId: 220,
      transformer: (tables, chart) => {
        const popData = tables['tabular.census2010_p12_pop_by_age_m'];
        if (popData.length < 1) { return []; }
        const row = popData[0];
        const data = {
          pop_u18: row['pop_u18'],
          pop18_24: row['pop18_24'],
          pop25_34: row['pop25_34'],
          pop35_49: row['pop35_39'] + row['pop40_44'] + row['pop45_49'],
          pop50_64: row['pop50_54'] + row['pop55_59'] + row['pop60_61'] + row['pop62_64'],
          pop65_74: row['pop65_66'] + row['pop67_69'] + row['pop70_74'],
          pop75o: row['pop75_79'] + row['pop80_84'] + row['pop85o'],
        };
        return Object.keys(data).map(k => ({
          x: data[k],
          y: row[chart.tables['tabular.census2010_p12_pop_by_age_m'].yearCol],
          z: chart.labels[k],
        }));
      },
    },
  },
  'economy': {
    'industry_types': {
      type: 'stacked-area',
      table: 'tabular.econ_es202_naics_2d_m',
      where: "naicstitle != 'Total, All Industries'",
      columns: {
        'naicstitle': 'NAICS Title',
        'avgemp': 'Avg. Employment',
        'cal_year': 'Year'
      },
    }
  },
  'education': {
  },
  'transportation': {
    'commute_means': {
      type: 'pie',
      table: 'tabular.b08301_means_transportation_to_work_by_residence_acs_m',
      yearCol: 'acs_year',
      columns: {
        'ctvsngl_p': 'Drive (Alone)',
        'carpool_p': 'Drive (Carpool)',
        'pub_p': 'Public Transit',
        'taxi_p': 'Taxi',
        'mcycle_p': 'Motorcycle',
        'bicycle_p': 'Bicycle',
        'walk_p': 'Walk',
        'other_p': 'Other',
      },
    },
  },
};
