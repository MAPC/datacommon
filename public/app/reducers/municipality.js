import types from '../actions/types';
import municipalities from '../../assets/data/ma-munis.json';

const defaultState = {
  cache: municipalities.features.reduce((cache, feature) =>
      Object.assign({}, cache, { [feature.properties.town.toLowerCase()]: feature }), {}),
};

export default function municipality(state = defaultState, action) {

  switch(action.type) {
    default:
      return state;
  }

};
