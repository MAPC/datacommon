import { connect } from 'react-redux';

import LineChart from '~/app/components/visualizations/LineChart';


const mapStateToProps = (state, props) => {

  return {
    xAxis: {
      label: 'Time',
    },
    yAxis: {
      label: 'Stuff',
    },
    data: [{
      label: 'New',
      values: [[1, 2], [2, 4], [3,5], [4, 4], [5, 6]],
    }, {
      label: 'New',
      values: [[1, 1], [2, 6], [3, 8], [4, 1], [5, 2]],
    }],
  };
};

const mapDispatchToProps = (dispatch, props) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(LineChart);
