import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import HorizontalStackedBarChart from './HorizontalStackedBarChart';


class PercentStackedBarChart extends React.Component {

  render() {
    const totalY = this.props.data.reduce((tot, row) => tot + row.y, 0);
    console.log(totalY);

    const data = this.props.data.map(row => ({ ...row, y: row.y / totalY }));
    console.log(data);

    return (
      <HorizontalStackedBarChart
        {...this.props}
        data={data}
      />
    );
  }

}

PercentStackedBarChart.propTypes = {
  xAxis: PropTypes.shape({
    label: PropTypes.string.isRequired,
  }).isRequired,
  yAxis: PropTypes.shape({
    label: PropTypes.string.isRequired,
  }).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.string.isRequired,
    z: PropTypes.string.isRequired,
  })).isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default HorizontalStackedBarChart;
