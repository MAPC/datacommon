import { connect } from 'react-redux';

import PieChart from '~/app/components/visualizations/PieChart';


const mapStateToProps = (state, { muni, chart }) => {
  const { table, columns } = chart;
  let data = [];

  if (state.chart.cache[table] && state.chart.cache[table][muni]) {
    const chartData = state.chart.cache[table][muni];
    data = Object.keys(chartData).map(key => ({ value: chartData[key], label: columns[key] }));
  }

  return {
    data,
    table: table.split('.').join('_'),
    colors: ['#ff0000', '#00ff00', '#0000ff'],
  };
};

const mapDispatchToProps = (dispatch, props) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(PieChart);
