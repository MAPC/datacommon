/**
 * This file is necessary to properly bundle these images
 * using Parcel. There might be a better way, but I haven't
 * found it yet.
 */

import bookWithApple from '~/assets/images/book-with-apple.svg';
import bus from '~/assets/images/bus.svg';
import heads from '~/assets/images/heads.svg';
import house from '~/assets/images/house.svg';
import heartbeat from '~/assets/images/heartbeat.svg';
import lightbulb from '~/assets/images/lightbulb.svg';
import region from '~/assets/images/region.svg';
import risingLine from '~/assets/images/rising-line.svg';
import thumbsUp from '~/assets/images/thumbs-up.svg';
import timeTurner from '~/assets/images/time-turner.svg';

export default {
  'Education': bookWithApple,
  'Recently Updated': timeTurner,
  'Popular Datasets': thumbsUp,
  'Public Health': heartbeat,
  'Demographics': heads,
  'Transportation': bus,
  'Land Use': region,
  'Economy': risingLine,
  'Town Data': region,
  'Environment and Energy': lightbulb,
  'Housing': house,
  'default': bookWithApple,
};
