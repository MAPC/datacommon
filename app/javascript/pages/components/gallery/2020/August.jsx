import React from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiaWhpbGwiLCJhIjoiY2plZzUwMTRzMW45NjJxb2R2Z2thOWF1YiJ9.szIAeMS4c9YTgNsJeG36gg';
const August = () => (
  <>
    <h1 className="calendar-viz__title">Paycheck Protection Program Adoption Across Massachusetts</h1>
    <div className="calendar-viz__iframe-wrapper">
      <iframe src="https://mapc.github.io/MapboxEmbeds/2020/07/15/ppp.html" className="calendar-viz__iframe" id="august-iframe" title="Map of PPI scores across region" />
    </div>
    <p>In addition to the unemployment benefits we looked at in our June visualization the Federal CARES Act also established the Paycheck Protection Program (PPP). Administered by the Small Business Administration (SBA), the program’s goal is to incentivize small businesses to keep their workers on the payroll. As the COVID-19 pandemic halts activity across industries, this program aims to be a lifeline to people, through business, by enabling money to flow through the economy.</p>
    <p>Through this program the SBA delegates the loan-making process to private lending institutions (banks). These lending institutions, 652 in this Massachusetts data, in turn made subsidized bank loans. These loans have the potential to be forgiven by borrowers who complete objectives like keeping workers on payroll. This visualization looks across the Commonwealth at the distribution of over 100,000 loans. Using the 2018 Quarterly Census of Employment and Wages we calculated the percentage of total establishments in a municipality that received a PPP loan. About half of all businesses in Massachusetts (46%) received loans from this program by July.</p>
    <p>Data on the program was released in early July, after media companies, including the New York Times and ProPublica, brought a lawsuit to fight for the data’s release. The data is self-reported from borrowers, not all data fields were required and not all borrowers provided all information. For example, only 10% of Massachusetts borrowers indicated race/ethnicity.  This means important information for programmatic evaluation like demographic information of business owners was not fully captured.</p>
    <p>MAPC has cleaned the city and zip code data used in this visualization as open text entries lead to a variety of discrepancies. Our method and code for cleaning can be found <a href="https://github.com/MAPC/paycheck-protection-program-ma" className="calendar-viz__link">here</a>
. As always, the data is also available for download here on the DataCommon. We hope our data cleaning and visualization of this data can help support further work on a topic that has impacted industries and residents across the commonwealth.</p>
  </>
);

export default August;
