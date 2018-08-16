import { connect } from 'react-redux';

import HorizontalStackedBarChart from '~/app/components/visualizations/HorizontalStackedBarChart';


const mapStateToProps = (state, { muni, chart }) => {
  return {
    xAxis: {
      label: 'Share',
    },
    yAxis: {
      label: 'Year'
    },
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
      x: 3.1,
      y: '2005-2009',
      z: 'Bachelors or Highers',
    },

    {
      x: 8.4,
      y: '2012-2015',
      z: 'Less than High School',
    },
    {
      x: 15.6,
      y: '2012-2015',
      z: 'High School, or Equivalent',
    },
    {
      x: 20.4,
      y: '2012-2015',
      z: 'Some College',
    },
    {
      x: 55.6,
      y: '2012-2015',
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
    // colors: ['#1F4F43', '#2A9979', '#79BF60', '#283b5d'],
  };
};

const mapDispatchToProps = (dispatch, props) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(HorizontalStackedBarChart);
