import { connect } from 'react-redux';

import { fetchChartData } from '~/app/actions/chart';
import CommunityProfiles from '~/app/components/CommunityProfiles';

const capitalize = (string) => {
  return string.split().map(word =>
      word.slice(0,1).toUpperCase() + word.slice(1).toLowerCase()).join('');
}

const mapStateToProps = (state, props) => {
  const key = props.match.params.muni;
  const muni = key ? state.municipality.cache[key.toLowerCase()] : null;
  if (muni) {
    return {
      name: capitalize(muni.properties.town),
      municipalFeature: muni,
    };
  }
  return {
    name: 'An Unknown Municipality',
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  fetchChartData: (table, columns) => dispatch(fetchChartData(table, props.match.params.muni, columns)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommunityProfiles);
