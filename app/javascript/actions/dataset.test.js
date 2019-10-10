import * as actions from './dataset';
import types from './types';
import fetchMock from 'fetch-mock';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';


const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

// Refer to: https://redux.js.org/recipes/writing-tests
describe('Dataset actions', () => {
  afterEach(() => {
    fetchMock.reset()
    fetchMock.restore()
  });
  it('should update a dataset', () => {
    const expectedAction = {
      type: types.DATASET.UPDATE,
    };
    expect(actions.update()).toEqual(expectedAction);
  });
  it('should fetch all of the datasets', () => {
    // TODO: This mock fetch isn't setup yet because the fetchAll action doesn't
    // actually call an API yet.
    fetchMock.getOnce('/datasets', { body: { todos: ['do something'] }, headers: { 'content-type': 'application/json' } });
    const expectedActions = [{
      type: types.DATASET.UPDATE,
    }];

    const store = mockStore({ datasets: { cache: [] } });
    return store.dispatch(actions.fetchAll()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
