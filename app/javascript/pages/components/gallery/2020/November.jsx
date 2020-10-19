import React from 'react';

const November = () => (
  <>
    <h1 className="calendar-viz__title">Adoptable Dogs in Massachusetts</h1>
    <div className="calendar-viz__iframe-wrapper">
      <iframe src="https://mapc.github.io/MapboxEmbeds/2020/09/15/dog-map.html" className="calendar-viz__iframe" id="november-iframe" title="Map of adoptable dogs in Massachusetts, according to Petfinder" />
    </div>
    <p>Scroll through the forty-thousand-plus photos on the #dogsofmassachusetts Instagram feed and it’s clear: Bay Staters love their canines. Despite this, pet ownership is quite low in Massachusetts. According to the American Veterinary Medical Association, at the end of 2016, Massachusetts had the sixth-lowest rate of dog ownership in the country (29 percent, compared to the national average of 38.4 percent) and seventh-lowest rate of overall pet ownership (49 percent, almost seven percent lower than the 56.8 percent national average).</p>
    <p>Why might this be? Since many in the region’s urban areas live in denser housing situations and rental units, perhaps fewer people here feel they have the kind or amount of space best for sharing with a pooch. Nationally, about 47 percent of people who live in houses have dogs, compared to 21 percent of apartment-dwellers; and 45 percent of home-owners, as opposed to only 32 percent of renters, own dogs.</p>
    <p>Or perhaps Greater Boston’s infamous commute times limit leisure for pet care.</p>
    <p>
      As with most things, hover, COVID-19 has flipped the script. With isolation, four-legged companions have become highly coveted. And it may be that for those suddenly working from home, the logistics of the lunchtime walk aren’t quite so daunting. In April, the Massachusetts Society for the Prevention of Cruelty to Animals
      {' '}
      <a href="https://www.nbcboston.com/news/coronavirus/mspca-sees-increase-in-adoptions-amid-covid-19-pandemic/2112698/" className="calendar-viz__link">reported a 20% increase in pet adoptions.</a>
    </p>
    <p>COVID-19 has also affected the pet “pipeline.” Many canine adoptees come from southern states, where more lenient neuter and spay laws result in a surfeit of animals in need of homes. With travelers from most states requiring either a 14-day quarantine or negative COVID-19 test upon entering Massachusetts, and with temporary shelter closures both here and in the south, fewer animals have been transported than in a normal year.</p>
    <p>Despite all this, there are still adoptable dogs in Massachusetts. Using the Petfinder API, we scraped dozens of available pets from shelters and organizations all around the Commonwealth. Click around the map to see who is up for adoption and where. You might just meet your new best friend!</p>
  </>
);

export default November;
