import { connect } from 'react-redux';

import CategoryGrid from '../components/CategoryGrid';


const mapStateToProps = ({ dataset }, props) => ({
  categories: dataset.categories
});

const mapDispatchToProps = (dispatch, props) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(CategoryGrid);
