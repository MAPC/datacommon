import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { fetchChartData } from '../actions/chart';
import CommunityProfiles from '../components/CommunityProfiles';

const capitalize = (string) => {
  return string.split().map(word =>
      word.slice(0,1).toUpperCase() + word.slice(1).toLowerCase()).join('');
}

const mapStateToProps = (state, props) => {
  const muniSlug = props.match.params.muni;
  const muni = muniSlug
      ? state.municipality.cache[muniSlug.toLowerCase()]
      : state.municipality.cache['boston'];
  return {
    name: capitalize(muni.properties.town),
    municipalFeature: muni,
    muniSlug,
    tabSlug: props.match.params.tab,
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  fetchChartData: (chart) => dispatch(fetchChartData(chart, props.match.params.muni)),
  push: (path) => dispatch(push(path)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommunityProfiles);
