import React from 'react';

const February = () => (
  <>
    <h1 className="calendar-viz__title">Exploring the Housing Markets in Greater Boston</h1>
    <div className="calendar-viz__iframe-wrapper">
      <iframe src="https://mapc.github.io/MapboxEmbeds/2021/01/22/housing-submarkets.html" className="calendar-viz__iframe" id="february-iframe" title="Maps of Census tracts in the MAPC region" />
    </div>
    <p>
      <em>Note: on February 23, 2021, <a href="https://housing-submarkets.mapc.org/" className="calendar-viz__link">MAPC Housing Submarkets</a> went live. You can view a YouTube recording of the launch webinar <a href="https://www.youtube.com/watch?v=ztN6UuXcedM" className="calendar-viz__link">here</a>.</em>
    </p>
    <p>Greater Boston is not one housing market, but many – and the factors that distinguish them don&apos;t follow lines on a map. In a single municipality, there can be wild differences from block to block. There are neighborhoods more akin to other parts of the region than to the next streets over.</p>
    <p>Some areas, for example in the inner core, are characterized by high density and increasing home prices. Others, often suburban, have mostly older housing stock and residents with incomes high enough to affect supply and demand. The defining variables may – but don&apos;t always – vary directly.</p>
    <p>A one-size-fits-all housing policy can&apos;t serve the region&apos;s needs – they&apos;re too heterogeneous. But so are the needs of any municipality. Instead, policies should be tailored to housing submarkets: areas, wherever they are, with similar characteristics.</p>
    <p>MAPC examined 28 indicators and how they combine across 2010 Census tracts. We drew from this seven submarkets, as will be detailed in a report and interactive map to be released this month. The accompanying map charts five of the variables we used:</p>
    <ol className="calendar-viz__list calendar-viz__list--numbered">
      <li>Median home value</li>
      <li>Percent change in median home value (from 2000 to 2017)</li>
      <li>Percentage of renter households</li>
      <li>Percent of home stock built before 1960</li>
      <li>Percent of homes bought with cash</li>
    </ol>
    <p>These maps do not directly display the submarkets, but they do reveal patterns in the ways even these few indicators combine. For example, tracts in the southwest and near the north shore tend to have median home values under $250,000 and a low percentage of renters. Downtown Boston has, as a whole, experienced a surge in median home values, but the percentage of houses built before 1960 varies from tract to tract.</p>
    <p>
      Be among the first to dive into housing submarkets and submarket-specific policy at our February 23 webinar. We hope to see you there!
    </p>
  </>
);

export default February;
