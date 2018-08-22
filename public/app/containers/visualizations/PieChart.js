import { connect } from 'react-redux';

import PieChart from '~/app/components/visualizations/PieChart';


const mapStateToProps = (state, props) => {
  const { muni, chart } = props;
  const tables = Object.keys(chart.tables);
  if (tables.every((table) => state.chart.cache[table] && state.chart.cache[table][muni])) {
    const muniTables = tables.reduce((acc, table) => Object.assign(acc, {[table]: state.chart.cache[table][muni]}), {});
    return {
      ...props,
      xAxis: chart.xAxis,
      data: chart.transformer(muniTables, chart),
    };
  }

  return {
    ...props,
    xAxis: { format: d => d },
    data: [],
  };
};

const mapDispatchToProps = (dispatch, props) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(PieChart);
