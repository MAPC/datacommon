/* eslint-disable object-curly-newline */
/* eslint-disable no-undef */
import { valuesHaveData } from '../../../containers/visualizations/StackedBarChart';

const somerville = [
  { x: 'W', y: 35.66, z: 'White', color: '#FDD93A' },
  { x: 'B & AA', y: 149.87, z: 'Black and African American', color: '#770F07' },
  { x: 'A & PA', y: 0, z: 'Asian and Pacific Islander', color: '#47B593' },
  { x: 'NA', y: 0, z: 'Native American', color: '#69C7D8' },
  { x: 'Other', y: 0, z: 'Other', color: '#287CCB' },
  { x: 'H & L', y: 105.53, z: 'Hispanic and Latino', color: '#ED948D' },
];

const hampden = [
  { x: 'W', y: 0, z: 'White', color: '#FDD93A' },
  { x: 'B & AA', y: 0, z: 'Black and African American', color: '#770F07' },
  { x: 'A & PA', y: 0, z: 'Asian and Pacific Islander', color: '#47B593' },
  { x: 'NA', y: null, z: 'Native American', color: '#69C7D8' },
  { x: 'Other', y: 0, z: 'Other', color: '#287CCB' },
  { x: 'H & L', y: 0, z: 'Hispanic and Latino', color: '#ED948D' },
];

describe('Stacked bar chart', () => {
  test('returns true when at least one object has a Y key with an appropriate value', () => {
    expect(valuesHaveData(somerville)).toBe(true);
  });

  test('returns false when no object has a Y key with an appropriate value', () => {
    expect(valuesHaveData(hampden)).toBe(false);
  });
});
