import { connect } from 'react-redux';

import HorizontalStackedBarChart from '~/app/components/visualizations/HorizontalStackedBarChart';


const mapStateToProps = (state, props) => {
  const { muni, chart } = props;
  const { table, columns } = chart;
  if (state.chart.cache[table] && state.chart.cache[table][muni]) {
    const raw = state.chart.cache[table][muni];
    const data = raw.reduce((acc, row) =>
      acc.concat(Object.keys(row).reduce((set, key) =>
        (chart.yearCol == key ? set : set.concat([{
          x: row[key],
          y: row[chart.yearCol],
          z: chart.columns[key],
        }]))
      , []))
    , []);
    return {
      xAxis: {
        label: chart.xAxis.label,
        format: d => `${d/1000}k`
      },
      yAxis: {
        label: chart.yAxis.label,
      },
      data,
    };
  }
  return {
    ...props,
    data: [],
  };
};

const mapDispatchToProps = (dispatch, props) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(HorizontalStackedBarChart);
