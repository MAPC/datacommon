export default {
  'demographics' : [
    {
      type: 'stacked-bar',
      table: 'tabular.b03002_race_ethnicity_acs_m',
      xAxis: { label: 'Population' },
      yAxis: { label: 'Year' },
      yearCol: 'acs_year',
      columns: {
        'acs_year': 'Year',
        'totpop': 'Total Population',
        'nhwhi': 'White',
        'nhaa': 'Black or African American',
        'nhna': 'American Indian',
        'nhas': 'Asian',
        'nhpi': 'Native Hawaiian and Other Pacific Islander',
        'nhoth': 'Some Other Race alone',
        'nhmlt': 'Two or More Races',
        'lat': 'Hispanic or Latino',
      },
      source: 'ACS',
      timeframe: '5 yr avg 2012-16',
      datasetId: 6,
    }
  ],
  'economy': [
    {
      type: 'stacked-area',
      table: 'tabular.econ_es202_naics_2d_m',
      where: "naicstitle != 'Total, All Industries'",
      columns: {
        'naicstitle': 'NAICS Title',
        'avgemp': 'Avg. Employment',
        'cal_year': 'Year'
      },
    }
  ],
  'education': [
  ],
  'transportation': [
    {
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
    }
  ],
};
