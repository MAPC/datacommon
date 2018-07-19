import { connect } from 'react-redux';

import CategoryGrid from '../components/CategoryGrid';


const mapStateToProps = ({ category }, props) => ({
  categories: category.cache
});

const mapDispatchToProps = (dispatch, props) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(CategoryGrid);
