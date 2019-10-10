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
const extended = [
  [ 'DARK_GREEN', '#1F4E46' ],
  [ 'TEAL_GREEN', '#47B593' ],
  [ 'GREEN', '#79BF60' ],
  [ 'LIGHT_GREEN', '#B2E6A0' ],

  [ 'TEAL_BLUE', '#094A72' ],
  [ 'BLUE', '#287CCB' ],
  [ 'CYAN', '#69C7D8' ],
  [ 'LIGHT_BLUE', '#95E0ED' ],

  [ 'YELLOW', '#FDD93A' ],
  [ 'LIGHT_YELLOW', '#F8E89F' ],

  [ 'PINK', '#ED948D' ],
  [ 'LIGHT_PINK', '#FAC9C5' ],
  [ 'DARK_RED', '#770F07' ],
];

export default {
  BRAND: {
    PRIMARY: '#6FC68E',
    SECONDARY: '#44AD89',
    BACKGROUND_DARK: '#1F4E46',
  },
  CHART: {
    PRIMARY: new Map(primary),
    EXTENDED: new Map(extended),
  },
  CHART_DEFAULT: '#000000',
};
