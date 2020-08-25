import React from 'react';

const September = () => (
  <>
    <h1 className="calendar-viz__title">Completing the 2020 Census</h1>
    <div className="calendar-viz__iframe-wrapper">
      <iframe src="https://mapc.github.io/MapboxEmbeds/2020/08/07/census-response-rate.html" className="calendar-viz__iframe" id="september-iframe" title="Map of census response rates in MAPC region, August 31" />
    </div>
    <p>The Federal government will end the 2020 Census on September 30th, four weeks earlier than planned. This means there are just 30 more days to improve the accuracy of once-in-a-decade data that will determine the allocation of $675 billion per year in federal funds, the seats each state will have in the House of Representatives, the data that impacts local policy and planning decisions, and much, much more.</p>
    <p>While a premature conclusion of the Census is bad for the country as a whole, it will disproportionately impact communities with a greater share of people that have not responded to the Census, as there will be less time for Census workers to visit households that have not yet participated. People with any number of the following characteristics are typically less likely to respond to the Census:</p>
    <ul className="calendar-viz__list">
      <li>Young children</li>
      <li>Highly mobile persons</li>
      <li>Racial and ethnic minorities</li>
      <li>Non-English speakers</li>
      <li>Low income persons</li>
      <li>Persons experiencing homelessness</li>
      <li>Undocumented immigrants</li>
      <li>Persons who distrust the government</li>
      <li>LGBTQ persons</li>
      <li>Persons with mental or physical disabilities</li>
      <li>Persons who do not live in traditional housing</li>
    </ul>
    <p>Thus, these households, and the municipalities where they are located, are now even less likely to access their fair share of the benefits described in the opening paragraph.</p>
    <p>This map shows response rates for the 2020 census as of August 31 and, unfortunately, illustrates the wide range in participation throughout the region. Fortunately, there’s time to be counted, and to help others as well. We’ve provided some ideas below.</p>
    <p className="calendar-viz__header">How to Help</p>
    <ul className="calendar-viz__list">
      <li>Respond – Make sure your household has responded to the 2020 Census, and urge your family and friends to do the same; this means the Census will be able to better concentrate their Non-Response Follow Up efforts. You can fill out your Census questionnaire at <a href="https://my2020census.gov/" className="calendar-viz__link">my2020census.gov</a>.</li>
      <li>Call the Federal government – There is still time to fight to reinstate the planned deadline of October 31st, and doing so could make a big difference. Read more <a href="https://www.bostonglobe.com/2020/08/10/opinion/census-count-deadlines-must-be-extended/" className="calendar-viz__link">here</a>, then call your representative and ask them to [WHAT].</li>
      <li>Call the State government – While the power to extend the 2020 Census rests with the Federal government, Massachusetts has over one million dollars in funds earmarked for Census complete Count efforts that have yet to be allocated to nonprofits and municipalities. Read more <a href="https://www.masslive.com/politics/2020/08/massachusetts-has-over-1-million-sitting-in-census-fund-as-communities-remain-undercounted-advocates-say.html" className="calendar-viz__link">here</a>, then call your representative and ask them to help to release these funds.</li>
    </ul>
  </>
);

export default September;
