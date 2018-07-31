import { connect } from 'react-redux';

import StackedAreaChart from '~/app/components/visualizations/StackedAreaChart';


const mapStateToProps = (state, { muni, chart }) => {
  return {};
};

const mapDispatchToProps = (dispatch, props) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(StackedAreaChart);
