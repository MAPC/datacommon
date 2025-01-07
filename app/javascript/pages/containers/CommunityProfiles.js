import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchChartData } from '../actions/chart';
import CommunityProfiles from '../components/CommunityProfiles';
import React from 'react';
const capitalize = (string) => {
  return string.split().map(word =>
      word.slice(0,1).toUpperCase() + word.slice(1).toLowerCase()).join('');
}

// Create a wrapper component to use the params hook
const CommunityProfilesWrapper = (props) => {
  const { muni: muniSlug, tab: tabSlug } = useParams();
  
  const muni = muniSlug
    ? props.municipalityCache[muniSlug.toLowerCase()]
    : props.municipalityCache['boston'];

  return <CommunityProfiles 
    {...props}
    name={capitalize(muni.properties.town)}
    municipalFeature={muni}
    muniSlug={muniSlug}
    tabSlug={tabSlug}
  />;
};

const mapStateToProps = (state) => ({
  municipalityCache: state.municipality.cache,
});

const mapDispatchToProps = (dispatch) => ({
  fetchChartData: (chart, muni) => dispatch(fetchChartData(chart, muni)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommunityProfilesWrapper);
