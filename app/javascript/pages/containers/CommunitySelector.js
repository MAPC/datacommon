import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CommunitySelector from '../components/CommunitySelector';
import { fillPoly, emptyPoly } from '../actions/municipality';
import React from 'react';
const mapStateToProps = ({ municipality, search }, props) => {
  const munisPoly = { ...municipality.geojson };
  let { results, hovering } = search.municipality;
  
  let lineFeatures = (
    results.length
    ? { ...munisPoly, ...{ features: munisPoly.features.filter(feature => {
        return !results.length || results.indexOf(feature.properties.town.toLowerCase()) > -1;
      })}}
    : munisPoly
  );

  const muniLines = {
    type: 'line',
    geojson: lineFeatures,
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
        return !!(filledMuniIndex = i) || true;
      }
    });

    muniFill.geojson = { ...munisPoly, ...{ features: [munisPoly.features[filledMuniIndex]]}};
  }

  return { muniLines, muniFill };
};

const mapDispatchToProps = (dispatch) => ({
  fillPoly: muni => dispatch(fillPoly(muni)),
  emptyPoly: muni => dispatch(emptyPoly(muni)),
});

// Create a wrapper component to use the navigation hook
const WithNavigationCommunitySelector = (props) => {
  const navigate = useNavigate();
  return <CommunitySelector 
    {...props} 
    toProfile={(muni) => navigate(`/profile/${muni}`)} 
  />;
};

export default connect(mapStateToProps, mapDispatchToProps)(WithNavigationCommunitySelector);
