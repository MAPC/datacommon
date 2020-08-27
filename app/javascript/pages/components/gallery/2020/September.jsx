/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';

const September = () => (
  <>
    <h1 className="calendar-viz__title">Completing the 2020 Census</h1>
    <div className="calendar-viz__iframe-wrapper">
      <iframe src="https://mapc.github.io/MapboxEmbeds/2020/08/07/census-response-rate.html" className="calendar-viz__iframe" id="september-iframe" title="Map of census response rates in MAPC region, August 31" />
    </div>
    <p>The Federal government will end the 2020 Census Count on September 30th, four weeks earlier than planned. This means there are just 30 more days to improve the accuracy of once-in-a-decade data that will impact local policy and planning decisions, determine the allocation of $675 billion per year in federal funds, shape political representation and districts, and much more.</p>
    <p>A premature conclusion of the Census means that there will be less time for Census workers to visit households that have not yet responded, making it even less likely that they will be included in the final count. This map shows response rates for the 2020 Census as of August 31 and, unfortunately, illustrates the wide range in participation throughout the region. Fortunately, there’s time to be counted, and to help others as well. We’ve collected some ideas below.</p>
    <ul className="calendar-viz__list">
      <li><strong>Respond</strong> – Make sure your household has responded to the 2020 Census, and urge your family and friends to do the same; this means the Census will be able to better concentrate their Non-Response Follow Up efforts. You can fill out your Census questionnaire at <a href="https://my2020census.gov/" className="calendar-viz__link">my2020census.gov</a>.</li>
      <li><strong>Call State Elected Officials</strong> – While the power to extend the 2020 Census rests with the Federal government, Massachusetts has over one million dollars in funds earmarked for Census complete Count efforts that have yet to be allocated to nonprofits and municipalities. Read more <a href="https://www.masslive.com/politics/2020/08/massachusetts-has-over-1-million-sitting-in-census-fund-as-communities-remain-undercounted-advocates-say.html" className="calendar-viz__link">here</a>, then call your state representative/senator and ask them to help to release these funds.</li>
      <li><strong>Phone bank</strong> – The Action Network run weekly phone banks on Tuesdays from 11:00-1:00 and on Wednesdays and Thursdays from 5:00-7:00 - along with text banks on Wednesdays from 4:00-5:00. Sign up for a phone bank at <a href="https://actionnetwork.org/campaigns/safe-elections-for-all" className="calendar-viz__link">actionnetwork.org</a>. Contact Beth Huang at the Massachusetts Voter Table for more information at <a href="mailto:beth@mavotertable.org" className="calendar-viz__link">beth@mavotertable.org</a>.</li>
      <li><strong>Spread the message digitally</strong> – Use <a href="https://docs.google.com/document/d/1ghlYZceLDfxnZt-hRDOIFElyP2-gaxQGSyDN-QnTX2Q/edit?usp=sharing" className="calendar-viz__link">Boston's outreach toolkit</a> to amplify that responding is not only crucial, but it is also safe, easy, and confidential. In the toolkit you will find messaging, sample social media copy/graphics, infographic flyers and guides, PSA videos, and additional resources. Much of the content is in six languages (English, Spanish, Traditional Chinese, Haitian Creole, Vietnamese, and Cape Verdean Creole) and relevant to people living outside of Boston.</li>
      <li><strong>Host a <a href="https://2020census.gov/en/news-events/press-releases/2020-mobile-questionnaire-assistance.html" className="calendar-viz__link">"Mobile Questionnaire Assistance (MQA)"</a> event</strong> – Census staff will come to your location (places such as meal sites or grocery stores) to help residents answer questions and respond to the Census in 13 languages. Staff will come equipped with technology, PPE, and will respect all physical distancing guidelines. You can also host an online MQA event if you’d prefer. MQAs will run until September 30. If interested, contact your local complete count representative, who can be found <a href="https://www.sec.state.ma.us/census2020/complete-count.html" className="calendar-viz__link">here</a>.</li>
    </ul>
  </>
);

export default September;
