import { connect } from 'react-redux';

import * as fmt from '~/app/utils/fmt';
import PercentStackedBarChart from '~/app/components/visualizations/PercentStackedBarChart';


const races = {
  'aa': 'African American',
  'as': 'Asian',
  'lat': 'Latino',
  'mlt': 'Multi',
  'na': 'Native American',
  'nhw': 'Non-hispanic White',
  'oth': 'Other',
  'pi': 'Pacific Islander',
};

const educationLevels = {
  'lh': 'Less than highschool',
  'hs': 'Highschool',
  'sc': 'Some college or associate degree',
  'bd': 'Bachelor degree or higher',
};

const mapStateToProps = (state, { muni, chart }) => {
  const { table, columns } = chart;
  let data = [];

  if (state.chart.cache[table] && state.chart.cache[table][muni]) {
    const chartData = state.chart.cache[table][muni][0];

    Object.keys(races).forEach(race => {
      Object.keys(educationLevels).forEach(education => {
        data.push({
          x: chartData[race + education],
          y: races[race],
          z: educationLevels[education],
        });
      });
    });
  }

  return {
    data,
    xAxis: {
      label: 'Share',
      min: 0,
      max: 100,
      format: fmt.Percent
    },
    yAxis: {
      label: 'Year',
      format: String,
    },
    colors: ['#1F4F43', '#2A9979', '#79BF60', '#283b5d'],
  };
};

const mapDispatchToProps = (dispatch, props) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(PercentStackedBarChart);
