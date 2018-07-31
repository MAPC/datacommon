import types from './types';

export function update() {
  return {
    type: types.MUNICIPALITY.UPDATE,
  };
}

export function fillPoly(muni) {
  return {
    type: types.MUNICIPALITY.FILL_POLY,
    muni,
  };
}

export function emptyPoly(muni) {
  return {
    type: types.MUNICIPALITY.EMPTY_POLY,
    muni,
  };
}
