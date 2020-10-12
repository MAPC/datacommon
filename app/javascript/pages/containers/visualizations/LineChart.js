import { connect } from 'react-redux';
import LineChart from '../../components/visualizations/LineChart';

function valuesHaveData(transformedData) {
  const checkData = transformedData.reduce((acc, row) => {
    let datumHasValue = false;
    if (row.values.every((value) => value !== null && value !== 0) && row.values.length > 0) {
      datumHasValue = true;
    }
    acc.push(datumHasValue);
    return acc;
  }, []);

  if (checkData.includes(true)) {
    return true;
  }
  return false;
}

const mapStateToProps = (state, props) => {
  const { muni, chart } = props;
  const tables = Object.keys(chart.tables);
  if (tables.every((table) => state.chart.cache[table] && state.chart.cache[table][muni])) {
    const muniTables = tables.reduce((acc, table) => Object.assign(acc, { [table]: state.chart.cache[table][muni] }), {});
    return {
      ...props,
      xAxis: chart.xAxis,
      yAxis: chart.yAxis,
      data: chart.transformer(muniTables, chart),
      hasData: valuesHaveData(chart.transformer(muniTables, chart)),
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
    hasData: false,
  };
};

const mapDispatchToProps = (dispatch, props) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(LineChart);
export { valuesHaveData };
