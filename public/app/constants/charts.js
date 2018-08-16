export default {
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
    {
      type: 'percent-stacked-bar',
      table: 'tabular.c15002_educational_attainment_by_race_acs_m',
      yearCol: 'acs_year',
      columns: {
        'nhwlh': '',
        'nhwhs': '',
        'nhwsc': '',
        'nhwbd': '',
        'aalh': '',
        'aahs': '',
        'aasc': '',
        'aabd': '',
        'nalh': '',
        'nahs': '',
        'nasc': '',
        'nabd': '',
        'aslh': '',
        'ashs': '',
        'assc': '',
        'asbd': '',
        'pilh': '',
        'pihs': '',
        'pisc': '',
        'pibd': '',
        'othlh': '',
        'othhs': '',
        'othsc': '',
        'othbd': '',
        'mltlh': '',
        'mlths': '',
        'mltsc': '',
        'mltbd': '',
        'latlh': '',
        'laths': '',
        'latsc': '',
        'latbd': '',
      },
    },
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
