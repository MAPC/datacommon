/* eslint-disable no-undef */
import { valuesHaveData } from '../../../containers/visualizations/PieChart';

const peru = [
  { value: 0, label: 'Open Space' },
  { value: 12479, label: 'Industrial' },
  { value: 64862, label: 'Personal Property' },
  { value: 65497, label: 'Commercial' },
  { value: 436425, label: 'Non-Property' },
  { value: 1597032, label: 'Residential' },
];

const failingTest = [
  { value: 0, label: 'Open Space' },
  { value: 0, label: 'Industrial' },
  { value: 0, label: 'Personal Property' },
  { value: 0, label: 'Commercial' },
  { value: 0, label: 'Non-Property' },
  { value: 0, label: 'Residential' },
];

describe('Pie charts', () => {
  test('return true when at least one data object has an appropriate Y value', () => {
    expect(valuesHaveData(peru)).toBe(true);
  });

  test('return true when no data objects have an appropriate Y value', () => {
    expect(valuesHaveData(failingTest)).toBe(false);
  });
});
