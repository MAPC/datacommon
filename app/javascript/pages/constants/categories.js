/**
 * This file is necessary to properly bundle these images
 * using Parcel. There might be a better way, but I haven't
 * found it yet.
 */

import bookWithApple from '../assets/images/book-with-apple.svg';
import bus from '../assets/images/bus.svg';
import folder from '../assets/images/folder.svg';
import heads from '../assets/images/heads.svg';
import house from '../assets/images/house.svg';
import heartbeat from '../assets/images/heartbeat.svg';
import lightbulb from '../assets/images/lightbulb.svg';
import region from '../assets/images/region.svg';
import risingLine from '../assets/images/rising-line.svg';
import thumbsUp from '../assets/images/thumbs-up.svg';
import timeTurner from '../assets/images/time-turner.svg';

const prioritized = new Map([
  ['Recently Updated', timeTurner],
  ['Popular Datasets', thumbsUp],
  ['Public Health', heartbeat],
  ['Demographics', heads],
  ['Education', bookWithApple],
  ['Transportation', bus],
  ['Land Use', region],
  ['Economy', risingLine],
  ['Clean Energy', lightbulb],
  ['Housing', house],
]);

const all = [...prioritized].reduce(
  (all, p) => ({...all, ...{[p[0]]: p[1]}}),
  {
    'Town Data': region,
    'default': folder,
  }
);

export { prioritized };
export default all;
