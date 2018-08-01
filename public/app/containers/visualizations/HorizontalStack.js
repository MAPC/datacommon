import { connect } from 'react-redux';

import HorizontalStack from '~/app/components/visualizations/HorizontalStack';


const mapStateToProps = (state, { muni, chart }) => {
  //const { table, columns } = chart;
  // let data = [];
  //
  // if (state.chart.cache[table] && state.chart.cache[table][muni]) {
  //   const chartData = state.chart.cache[table][muni];
  //   data = Object.keys(chartData).map(key => ({ value: chartData[key], label: columns[key] }));
  // }

  return {
    xAxis: {
      label: 'Share',
    },
    yAxis: {
      label: 'Year'
    },
    categories: ['Less than High School', 'High School, or Equivalent', 'Some College', 'Bachelors or Highers'],
    data: [{
      x: 10.3,
      y: '2005-2009',
      z: 'Less than High School',
    },
    {
      x: 20.8,
      y: '2005-2009',
      z: 'High School, or Equivalent',
    },
    {
      x: 15.4,
      y: '2005-2009',
      z: 'Some College',
    },
    {
      x: 53.1,
      y: '2005-2009',
      z: 'Bachelors or Highers',
    },
    {
      x: 8.4,
      y: '2012-2016',
      z: 'Less than High School',
    },
    {
      x: 15.6,
      y: '2012-2016',
      z: 'High School, or Equivalent',
    },
    {
      x: 20.4,
      y: '2012-2016',
      z: 'Some College',
    },
    {
      x: 55.6,
      y: '2012-2016',
      z: 'Bachelors or Highers',
    },
    ],
    colors: ['#1F4F43', '#2A9979', '#79BF60', '#283b5d'],
  };
};

const mapDispatchToProps = (dispatch, props) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(HorizontalStack);
