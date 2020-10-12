/* eslint-disable no-undef */
import { valuesHaveData } from '../../../containers/visualizations/LineChart';

const somerville = [{
  label: 'Water Usage per Capita',
  values: [
    [2009, 53],
    [2010, 50],
    [2011, 50],
    [2012, 50],
    [2013, 49],
    [2014, 47],
    [2015, 45],
  ],
}];

const hampden = [{
  label: 'Water Usage per Capita',
  values: [],
}];

const multiData = [{
  label: 'Water Usage per Capita 1',
  values: [],
}, {
  label: 'Water Usage per Capita 2',
  values: [
    [2009, 53],
    [2010, 50],
    [2011, 50],
    [2012, 50],
    [2013, 49],
    [2014, 47],
    [2015, 45],
  ]}, {
  label: 'Water Usage per Capita 3',
  values: [],
}];

describe('Line chart', () => {
  test('returns true when values array contains any data', () => {
    expect(valuesHaveData(somerville)).toBe(true);
  });

  test('return false when values array contains no data', () => {
    expect(valuesHaveData(hampden)).toBe(false);
  });

  test('returns true when some data object exists (multi-line chart)', () => {
    expect(valuesHaveData(multiData)).toBe(true);
  });
});
