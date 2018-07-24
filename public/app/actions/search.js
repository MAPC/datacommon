import types from './types';

export function storeSearchResults(store, results, query) {
  return {
    type: types.SEARCH.STORE_RESULTS,
    store,
    query,
    results,
  };
};
