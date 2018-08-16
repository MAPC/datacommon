import { connect } from 'react-redux';

import StackedAreaChart from '~/app/components/visualizations/StackedAreaChart';


const mapStateToProps = (state, { muni, chart }) => {
  const { table, columns } = chart;
  let data = [];

  if (state.chart.cache[table] && state.chart.cache[table][muni]) {
    const chartData = state.chart.cache[table][muni];
    data = chartData.map(row => ({ x: row.cal_year, y: row.avgemp, z: row.naicstitle }));
  }

  return {
    data,
    xAxis: {
      label: 'Time',
      format: String,
    },
    yAxis: {
      label: 'Population',
    },
  };
};

const mapDispatchToProps = (dispatch, props) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(StackedAreaChart);
