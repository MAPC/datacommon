import { connect } from 'react-redux';

import BarChart from '~/app/components/visualizations/BarChart';


const mapStateToProps = ({ chart }, props) => ({
  data: chart.cache[props.table],
});

const mapDispatchToProps = (dispatch, props) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(BarChart);
