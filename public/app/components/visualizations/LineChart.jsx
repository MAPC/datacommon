import React from 'react';
import PropTypes from 'prop-types';

class LineChart extends React.Component {

}

LineChart.propTypes = {
  xAxis: PropTypes.shape({
    label: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
  }).isRequired,
  yAxis: PropTypes.shape({
    label: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
  }).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    color: PropTypes.string,
    values: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  })).isRequired,
};

export default LineChart;
