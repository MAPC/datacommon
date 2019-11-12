import types from '../actions/types';

import colors from '../constants/colors';
// import municipalities from '../../assets/data/ma-munis.json';
import municipalities from '../data/ma-munis.json';

const defaultState = {
  cache: municipalities.features.reduce((cache, feature) =>
    Object.assign({}, cache, { [feature.properties.town.toLowerCase().replace(' ', '-')]: feature }), {}),
  searchable: municipalities.features.reduce((a, b) => a.concat(b.properties.town.toLowerCase()), []),
  geojson: municipalities,
};

export default function municipality(state = defaultState, action) {
  let newState = {};

  switch (action.type) {
    case types.MUNICIPALITY.FILL_POLY:
      const newGeoJSON = JSON.parse(JSON.stringify(state.geojson));

      newGeoJSON.features.some(feature => {
        if (feature.properties.town.toLowerCase() === action.muni) {
          return (feature.properties.fillColor = colors.BRAND.PRIMARY) || true;
        }
      });

      newState = { ...state, ...{ geojson: newGeoJSON } };
      break;

    case types.MUNICIPALITY.EMPTY_POLY:
      newState = { ...state, ...{ geojson: { ...defaultState.geojson } } };
      break;
  }

  return { ...defaultState, ...state, ...newState };
};
