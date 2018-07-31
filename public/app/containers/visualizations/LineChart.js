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
      color: '#ff0000',
      values: [[1, 2], [2, 4], [3,5], [4, 4], [5, 6]],
    }],
  };
};

const mapDispatchToProps = (dispatch, props) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(LineChart);
