export default {
  'economy': [
    {
      type: 'stacked-area',
      table: 'tabular.econ_es202_naics_2d_m',
      columns: {
        'naicstitle': 'NAICS Title',
        'avgemp': 'Avg. Employment',
        'cal_year': 'Year'
      },
    }
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
