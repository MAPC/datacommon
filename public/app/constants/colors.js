const primary = [
  [ 'DARK_GREEN', '#1F4E46' ],
  [ 'TEAL_GREEN', '#47B593' ],
  [ 'GREEN', '#79BF60' ],
  [ 'TEAL_BLUE', '#094A72' ],
  [ 'BLUE', '#287CCB' ],
  [ 'CYAN', '#69C7D8' ],
  [ 'YELLOW', '#FDD93A' ],
  [ 'PINK', '#ED948D' ],
  [ 'DARK_RED', '#770F07' ],
];
const secondary = [
  [ 'LIGHT_GREEN', '#B2E6A0' ],
  [ 'LIGHT_BLUE', '#95E0ED' ],
  [ 'LIGHT_YELLOW', '#F8E89F' ],
  [ 'LIGHT_PINK', '#FAC9C5' ],
  [ 'RED', '#9A0D38' ],
  [ 'LIGHT_RED', '#D17B96' ],
];
export default {
  BRAND: {
    PRIMARY: '#6FC68E',
    SECONDARY: '#44AD89',
    BACKGROUND_DARK: '#1F4E46',
  },
  CHART: new Map([
    ...primary,
    ...secondary,
  ]),
  CHART_DEFAULT: '#000000',
};
