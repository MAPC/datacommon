/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';

const September = () => (
  <>
    <h1 className="calendar-viz__title">Completing the 2020 Census</h1>
    <div className="calendar-viz__iframe-wrapper">
      <iframe src="https://mapc.github.io/MapboxEmbeds/2020/08/07/census-response-rate.html" className="calendar-viz__iframe" id="september-iframe" title="Map of census response rates in MAPC region, September" />
    </div>
    <p><em>Note: at the original time of this map's publishing, the Census counting efforts were set to end on September 30, 2020. However, as of September 30 the official end date is unclear.</em></p>
    <p>A full four weeks earlier than planned, at the end of this month, the Federal government will conclude the 2020 Census. This new September 30 end means four fewer weeks to gather the data that will direct $675 billion annually in federal funds, determine the number of seats each state has in the House of Representatives, and affect much else, including local policy and planning decisions – for the next ten years.</p>
    <p>Some households are less likely to respond to the Census without a follow-up visit from a Census worker – visits for which there will be less time because of the premature cessation. The shortened process will have a disproportionate impact on these households and the municipalities where they are located.</p>
    <p>This map shows Census response rates as of September 30 and, unfortunately, illustrates the wide range in participation throughout the region. Fortunately, there’s time to be counted, and to help others as well.</p>
    <ul className="calendar-viz__list">
      <li><strong>Respond</strong> – If you haven't already done so, fill out your Census questionnaire <a href="https://my2020census.gov/" className="calendar-viz__link">here</a>.</li>
      <li><strong>Call State Elected Officials</strong> – While the power to extend the 2020 Census rests with the Federal government, Massachusetts has over one million dollars in funds earmarked for Census Complete Count efforts that have yet to be allocated to nonprofits and municipalities. Read more <a href="https://www.masslive.com/politics/2020/08/massachusetts-has-over-1-million-sitting-in-census-fund-as-communities-remain-undercounted-advocates-say.html" className="calendar-viz__link">here</a>, then call <a href="https://www.house.gov/representatives/find-your-representative" className="calendar-viz__link">your state representative</a> and ask them to help release these funds.</li>
      <li><strong>Phone bank</strong> – The Action Network runs weekly phone and text bank events. <a href="https://actionnetwork.org/campaigns/safe-elections-for-all" className="calendar-viz__link">Sign up to help!</a></li>
      <li><strong>Spread the message digitally</strong> – Use <a href="https://docs.google.com/document/d/1-uGPdY0_bN7jH7s4nU1342UwXfI923rCQR9rpk4KstY/edit" className="calendar-viz__link">Massachusetts’s Census Outreach Toolkit</a> to amplify the message that responding is not only crucial, but also safe, easy, and confidential. In the toolkit you will find messaging, sample social media copy, and infographic flyers. The  <a href="https://docs.google.com/document/d/1ghlYZceLDfxnZt-hRDOIFElyP2-gaxQGSyDN-QnTX2Q/edit?usp=sharing" className="calendar-viz__link">Boston Outreach Toolkit</a> has additional resources, many of which are in six languages and are relevant to people living outside of Boston.</li>
      <li><strong>Host a <a href="https://2020census.gov/en/news-events/press-releases/2020-mobile-questionnaire-assistance.html" className="calendar-viz__link">"Mobile Questionnaire Assistance (MQA)"</a> event</strong> – Census staff will come to your location (places such as meal sites or grocery stores) to answer questions and help residents respond to the Census in thirteen languages. If interested, contact your local complete count representative, who can be found <a href="https://www.sec.state.ma.us/census2020/complete-count.html" className="calendar-viz__link">here</a>.</li>
    </ul>
  </>
);

export default September;
