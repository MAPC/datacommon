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
      values: [[1, 20], [2, 40], [3,50], [4, 40], [5, 60]],
    }, {
      label: 'New',
      values: [[1, 10], [2, 60], [3, 80], [4, 10], [5, 20]],
    }],
  };
};

const mapDispatchToProps = (dispatch, props) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(LineChart);
