import types from '../actions/types';

import colors from '~/app/constants/colors';
import municipalities from '~/assets/data/ma-munis.json';

const defaultState = {
  cache: municipalities.features.reduce((cache, feature) =>
      Object.assign({}, cache, { [feature.properties.town.toLowerCase()]: feature }), {}),
  searchable: municipalities.features.reduce((a,b) => a.concat(b.properties.town.toLowerCase()), []),
  geojson: municipalities,
};

export default function municipality(state = defaultState, action) {
  let newState = {};

  switch(action.type) {
    case types.MUNICIPALITY.FILL_POLY:
      const newGeoJSON = { ...state.geojson };

      newGeoJSON.features.some(feature => {
        if (feature.properties.town.toLowerCase() === action.muni) {
          return true && (feature.properties.fillColor = colors.BRAND.PRIMARY);
        }
      });

      newState = { ...state, ...{ geojson: newGeoJSON }};
      break;

    case types.MUNICIPALITY.EMPTY_POLY:
      newState = { ...state, ...{ geojson: { ...defaultState.geojson }}};
      break;
  }

  return { ...defaultState, ...state, ...newState };
};
