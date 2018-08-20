import { connect } from 'react-redux';

import StackedAreaChart from '~/app/components/visualizations/StackedAreaChart';


const mapStateToProps = (state, props) => {
  const { muni, chart } = props;
  const tables = Object.keys(chart.tables);
  if (tables.every((table) => state.chart.cache[table] && state.chart.cache[table][muni])) {
    const muniTables = tables.reduce((acc, table) => Object.assign(acc, {[table]: state.chart.cache[table][muni]}), {});
    return {
      ...props,
      xAxis: chart.xAxis,
      yAxis: chart.yAxis,
      data: chart.transformer(muniTables, chart),
    };
  }
  return {
    ...props,
    xAxis: {
      label: '',
    },
    yAxis: {
      label: '',
    },
    data: [],
  };
};

const mapDispatchToProps = (dispatch, props) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(StackedAreaChart);
