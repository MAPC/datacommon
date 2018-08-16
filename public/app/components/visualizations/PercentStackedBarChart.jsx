import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import HorizontalStackedBarChart from './HorizontalStackedBarChart';


class PercentStackedBarChart extends React.Component {

  render() {
    const groups = (() => {
      const acc = {};
      this.props.data.forEach(row => acc[row.y] = [ ...(acc[row.y] || []), row.x]);
      return acc;
    })();

    Object.keys(groups).forEach(group => {
      groups[group] = groups[group].reduce((a,b) => a + b, 0);
    });

    const data = this.props.data.map(row => ({ ...row, x: (row.x / groups[row.y]) * 100 }));

    return (
      <HorizontalStackedBarChart
        {...this.props}
        data={data}
      />
    );
  }

}


const AxisShape = {
  label: PropTypes.string.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  format: PropTypes.func,
};

PercentStackedBarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.string.isRequired,
    z: PropTypes.string.isRequired,
  })).isRequired,
  xAxis: PropTypes.shape(AxisShape).isRequired,
  yAxis: PropTypes.shape(AxisShape).isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PercentStackedBarChart;
