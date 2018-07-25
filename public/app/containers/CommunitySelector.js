import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import CommunitySelector from '../components/CommunitySelector';
import hexToRgb from '~/app/utils/hexToRgb';
import colors from '~/app/constants/colors';
import { fillPoly, emptyPoly } from '~/app/actions/municipality';


const mapStateToProps = ({ municipality, search }, props) => {
  const munisPoly = { ...municipality.geojson };
  let { results, hovering } = search.municipality;

  const muniLines = {
    type: 'line',
    geojson: { ...munisPoly, ...{ features: munisPoly.features.filter(feature => {
      return !results.length || results.indexOf(feature.properties.town.toLowerCase()) > -1;
    })}},
  };

  const muniFill = {
    type: 'fill',
    geojson: { ...munisPoly, ...{ features: []}}
  };

  if (hovering) {
    hovering = hovering.toUpperCase();

    let filledMuniIndex = null;
    munisPoly.features.some((feature, i) => {
      if (feature.properties.town === hovering.toUpperCase()) {
        return true && (filledMuniIndex = i);
      }
    });

    muniFill.geojson = { ...munisPoly, ...{ features: [munisPoly.features[filledMuniIndex]]}};
  }

  return { muniLines, muniFill };
};

const mapDispatchToProps = (dispatch, props) => ({
  toProfile: muni => dispatch(push(`/profile/${muni}`)),
  fillPoly: muni => dispatch(fillPoly(muni)),
  emptyPoly: muni => dispatch(emptyPoly(muni)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommunitySelector);
