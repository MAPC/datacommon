import React from 'react';

const February = () => (
  <>
    <h1 className="calendar-viz__title">Family Sized Housing Units</h1>
    <div className="calendar-viz__iframe-wrapper">
      <iframe src="https://mapc.github.io/MapboxEmbeds/2020/01/27/large-units.html" className="calendar-viz__iframe" id="february-iframe" title="Map of percent family-sized units" />
    </div>
    <p>We all know that the number of new housing units in Greater Boston hasn’t kept up with our growth. But the problem is not just sheer quantity. Whether it’s a growing family that can’t find a big-enough place in the city, roommates who can’t afford to move out on their own, or empty nesters who can’t find a place to downsize in the suburbs, the housing we have in our region is a mismatch for the housing we need, where we need it.</p>
    <p>This map shows, from area to area, what portion of all the housing units are large – that is, having three or more bedrooms. That’s regardless of whether they’re owner-occupied or rental, single family, condo, or apartment. In the areas that are darkest on the map, more than three quarters of all homes have three or more bedrooms. Carlisle has the highest proportion of large homes at 95%. Meanwhile, the lighter areas on the map, which are mostly in more urban communities, have a lower share of units with three bedrooms.</p>
    <p>Especially in suburban communities with mostly large units, the lack of smaller places means that seniors looking to downsize in their own community have few options. They instead stay in places with empty bedrooms.</p>
    <p>Meanwhile, in the mostly urban neighborhoods with a small share of family-sized units, families with children face stiff competition for what little is available: roommate groups with multiple incomes often outbid families. And prices for smaller places are such that members of those roommate groups can’t afford to live on their own.</p>
    <p>
MAPC’s new study,
      <em><a href="https://metrocommon.mapc.org/reports/10">Crowded In and Priced Out: Why it’s so Hard to Find a Family-Sized Unit in Greater Boston</a></em>
      {' '}
found that in Boston and a dozen surrounding cities and towns, households with children only occupy 39 percent of larger units. Instead, families squeeze into smaller places, two or more to a bedroom.
    </p>
    <p>Construction of new family-sized units is necessary, but not sufficient. We also need more smaller, senior-friendly units into which older residents can downsize. We need more one-bedroom apartments in which roommates can live affordably on their own. With a greater number and variety of units on the market, more of our region’s residents will be able to find the homes they need and can afford.</p>
    <p>
Read the full report at
      <a href="https://metrocommon.mapc.org/reports/10" className="calendar-viz__link">mapc.ma/largeunits.</a>
    </p>
  </>
);

export default February;
