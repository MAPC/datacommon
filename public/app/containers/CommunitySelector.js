import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import CommunitySelector from '../components/CommunitySelector';
import hexToRgb from '~/app/utils/hexToRgb';
import colors from '~/app/constants/colors';


const mapStateToProps = ({ municipality, search }, props) => {
  const munisPoly = municipality.geojson;
  const searchResults = search.municipality.results;

  munisPoly.features.forEach(feature => {
    var selected = !searchResults.length || searchResults.indexOf(feature.properties.town.toLowerCase()) > -1;
    feature.properties.lineColor = selected ? colors.BRAND.PRIMARY : `rgba(${hexToRgb(colors.BRAND.PRIMARY)}, 0)`;
  });

  return { munisPoly };
};

const mapDispatchToProps = (dispatch, props) => ({
  toProfile: muni => dispatch(push(`/profile/${muni}`))
});

export default connect(mapStateToProps, mapDispatchToProps)(CommunitySelector);
