/* eslint-disable object-curly-newline */
/* eslint-disable no-undef */
import { valuesHaveData } from '../../../containers/visualizations/StackedAreaChart';

const peru = [
  { x: 2013, y: null, z: 'Commercial & Industrial Annual Therm Usage' },
  { x: 2014, y: null, z: 'Commercial & Industrial Annual Therm Usage' },
  { x: 2015, y: null, z: 'Commercial & Industrial Annual Therm Usage' },
  { x: 2013, y: null, z: 'Residential & Low-Income Annual Therm Usage' },
  { x: 2014, y: null, z: 'Residential & Low-Income Annual Therm Usage' },
  { x: 2015, y: null, z: 'Residential & Low-Income Annual Therm Usage' },
];

const somerville = [
  { x: 2013, y: 10038919, z: 'Commercial & Industrial Annual Therm Usage' },
  { x: 2014, y: 12955437, z: 'Commercial & Industrial Annual Therm Usage' },
  { x: 2015, y: 13255955, z: 'Commercial & Industrial Annual Therm Usage' },
  { x: 2013, y: 14718479, z: 'Residential & Low-Income Annual Therm Usage' },
  { x: 2014, y: 17706122, z: 'Residential & Low-Income Annual Therm Usage' },
  { x: 2015, y: 21898390, z: 'Residential & Low-Income Annual Therm Usage' },
];

const partialData = [
  { x: 2013, y: 0, z: 'Commercial & Industrial Annual Therm Usage' },
  { x: 2014, y: 12955437, z: 'Commercial & Industrial Annual Therm Usage' },
  { x: 2015, y: 0, z: 'Commercial & Industrial Annual Therm Usage' },
  { x: 2013, y: 14718479, z: 'Residential & Low-Income Annual Therm Usage' },
  { x: 2014, y: 17706122, z: 'Residential & Low-Income Annual Therm Usage' },
  { x: 2015, y: 0, z: 'Residential & Low-Income Annual Therm Usage' },
];

describe('Stacked area chart', () => {
  test('returns true when all objects have a Y key with an appropriate value', () => {
    expect(valuesHaveData(somerville)).toBe(true);
  });

  test('returns true when at least some objects have a Y key with an appropriate value', () => {
    expect(valuesHaveData(partialData)).toBe(true);
  });

  test('returns false when no object has a Y key with an appropriate value', () => {
    expect(valuesHaveData(peru)).toBe(false);
  });
});
