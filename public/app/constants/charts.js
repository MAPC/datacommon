export default {
  'demographics': [
    {
      table: '',
      columns: [''],
    },
  ],
  'transportation': [
    {
      type: 'pie',
      table: 'b08301_means_transportation_to_work_by_residence_acs_m',
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
