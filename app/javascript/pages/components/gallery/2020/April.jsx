import React from 'react';
import * as d3 from 'd3';
import mapboxgl from 'mapbox-gl';
import blankSquare from '../../../assets/images/blank-square.png';

mapboxgl.accessToken = 'pk.eyJ1IjoiaWhpbGwiLCJhIjoiY2plZzUwMTRzMW45NjJxb2R2Z2thOWF1YiJ9.szIAeMS4c9YTgNsJeG36gg';
const colors = ['#F15B52', '#F37871', '#F8B4B0', '#FBD2CF', '#F0EFE7'];

const April = () => {
  Promise.all([
    d3.csv('/assets/april2020.csv'),
    d3.csv('/assets/MA_2010_return_rates.csv'),
  ]).then((response) => {
    let zoom = 8.4;
    let center = [-70.944, 42.37];
    if (window.innerWidth <= 480) {
      zoom = 7.75;
      center = [-71.043, 42.372];
    } else if (window.innerWidth <= 670) {
      zoom = 8.27;
      center = [-71.047, 42.377];
    } else if (window.innerWidth <= 770) {
      zoom = 8.4;
      center = [-71.039, 42.37];
    }
    const aprilMap = new mapboxgl.Map({
      container: 'aprilMap',
      zoom,
      minZoom: 6,
      maxZoom: 13,
      center,
      maxBounds: [
        [-74.728, 38.167], // Southwest bound
        [-66.541, 46.032], // Northeast bound
      ],
      style: 'mapbox://styles/ihill/ck7qhmh0715wv1ilds1q8cb4z',
    });
    const colorScale = (value) => {
      if (isNaN(value)) {
        return colors[4];
      } if (value >= 25) {
        return colors[0];
      } if (value >= 15) {
        return colors[1];
      } if (value >= 5) {
        return colors[2];
      }
      return colors[3];
    };
    aprilMap.on('load', () => {
      aprilMap.resize();
      aprilMap.setPaintProperty('background', 'background-color', '#FBF9EE');
      aprilMap.setPaintProperty('Non MAPC municipalities', 'fill-color', '#FBF9EE');
      aprilMap.setPaintProperty('External State', 'fill-color', '#FBF9EE');
      const choropleth = ['match', ['get', 'ct10_id']];
      const responseRate = ['match', ['get', 'ct10_id']];
      const responseRateOpacity = ['match', ['get', 'ct10_id']];
      const percentageCompOwnership = {};
      const compMarginOfError = {};
      const numHouseholds = {};
      const responseRates = {};

      response[0].forEach((row) => {
        const withoutComputers = 100 - +row.hascomp;
        choropleth.push(row.tractID, colorScale(withoutComputers));
        percentageCompOwnership[row.tractID] = withoutComputers;
        numHouseholds[row.tractID] = row['Total Households'];
        compMarginOfError[row.tractID] = row.HasCompMOE;
      });

      response[1].forEach((row) => {
        responseRate.push(row.tractID, +row.MailReturnRateCen2010 <= 73 ? 'Pattern_Hatching_Brown' : 'new-blank');
        responseRateOpacity.push(row.tractID, +row.MailReturnRateCen2010 <= 73 ? 1 : 0);
        responseRates[row.tractID] = row.MailReturnRateCen2010;
      });

      choropleth.push(colors[4]);
      responseRate.push('new-blank');
      responseRateOpacity.push(0);
      aprilMap.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
      aprilMap.addLayer({
        id: 'Computer Ownership by Tract',
        type: 'fill',
        source: 'composite',
        'source-layer': 'Tracts-2jsl06',
        paint: {
          'fill-color': choropleth,
        },
      });

      aprilMap.loadImage(blankSquare, (err, image) => {
        if (err) throw err;
        aprilMap.addImage('new-blank', image);

        aprilMap.addLayer({
          id: '2010 Response Rates',
          type: 'fill',
          source: 'composite',
          'source-layer': 'Tracts-2jsl06',
          paint: {
            'fill-pattern': responseRate,
          },
        });
      });

      aprilMap.moveLayer('Computer Ownership by Tract', 'MAPC municipal borders');

      aprilMap.on('click', 'MAPC tracts', (e) => {
        const clickedData = aprilMap.queryRenderedFeatures(
          [e.point.x, e.point.y],
          { layers: ['MAPC tracts', 'MAPC municipalities', 'Computer Ownership by Tract'] },
        );
        const tractId = clickedData[0].properties.ct10_id;
        const tractData = percentageCompOwnership[tractId] <= 100
          ? `${d3.format('.1f')(percentageCompOwnership[tractId])}% (&#177; ${compMarginOfError[tractId]}%) of approximately ${d3.format(',')(numHouseholds[tractId])} households lack a computing device`
          : 'Computer ownership data unavailable';
        const returnRate = +responseRates[tractId] !== 99999.0 ? `${responseRates[tractId]}% 2010 census mail return rate` : '2010 census return rate unavailable';
        const tooltipText = `<p class='tooltip__title'>Tract ${tractId}
        (${clickedData[2].properties.municipal})</p>
        <ul class='tooltip__list'>
        <li class='tooltip__text'>${tractData}</li>
        <li class='tooltip__text'>${returnRate}</li>
        </ul>`;
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(tooltipText)
          .addTo(aprilMap);
      });
    });
  });
  return (
    <>
      <h1 className="calendar-viz__title">The Digital Divide and the 2020 Census</h1>
      <div className="calendar-viz__wrapper">
        <div id="aprilMap" className="mapboxgl__container" />
        <div className="map__overlay" style={{ top: '98px' }}>
          <span className="map__legend-entry map__legend-entry--bold map__legend-title">Households without a computing device</span>
          <svg height="258" width="160" className="map__legend map__legend--translucent">
            <rect x="10" y="2" width="16" height="16" style={{ fill: colors[0], stroke: 'black', strokeWidth: '1px' }} />
            <text x="32" y="14" className="map__legend-entry" fill="#1F4E46">25 – 35%</text>
            <rect x="10" y="30" width="16" height="16" style={{ fill: colors[1], stroke: 'black', strokeWidth: '1px' }} />
            <text x="32" y="42" className="map__legend-entry" fill="#1F4E46">15 – 25%</text>
            <rect x="10" y="58" width="16" height="16" style={{ fill: colors[2], stroke: 'black', strokeWidth: '1px' }} />
            <text x="32" y="70" className="map__legend-entry" fill="#1F4E46">5 – 15%</text>
            <rect x="10" y="86" width="16" height="16" style={{ fill: colors[3], stroke: 'black', strokeWidth: '1px' }} />
            <text x="32" y="98" className="map__legend-entry" fill="#1F4E46">0 – 5%</text>
            <rect x="10" y="114" width="16" height="16" style={{ fill: colors[4], stroke: 'black', strokeWidth: '1px' }} />
            <text x="32" y="126" className="map__legend-entry" fill="#1F4E46">Data unavailable</text>
            <rect x="10" y="142" width="16" height="16" style={{ fill: 'white', stroke: 'black', strokeWidth: '1px' }} />
            <line x1="10" y1="150" x2="18" y2="142" style={{ stroke: '#2C110F', strokeWidth: '2px' }} />
            <line x1="10" y1="158" x2="26" y2="142" style={{ stroke: '#2C110F', strokeWidth: '2px' }} />
            <line x1="18" y1="158" x2="26" y2="150" style={{ stroke: '#2C110F', strokeWidth: '2px' }} />
            <text x="32" y="154" className="map__legend-entry" fill="#1F4E46">Hard-to-count tract</text>
            <text x="32" y="166" className="map__legend-entry" fill="#1F4E46">(&#x2264; 73% mail return</text>
            <text x="32" y="178" className="map__legend-entry" fill="#1F4E46">rate, 2010 census)</text>
            <text x="8" y="198" className="map__legend-entry map__legend-entry--bold" fill="#1F4E46">Explore & Download</text>
            <text x="8" y="212" className="map__legend-entry map__legend-entry--bold" fill="#1F4E46">Data</text>
            <text x="8" y="230" className="map__legend-entry" fill="#1F4E46">
              &#8226;
              {' '}
              <a href="https://www.censushardtocountmaps2020.us/" className="calendar-viz__link" fill="#1F4E46">Census mail return rate</a>
            </text>
            <text x="8" y="246" className="map__legend-entry" fill="#1F4E46">
              &#8226;
              {' '}
              <a href="https://data.census.gov/cedsci/map?q=massachusetts&g=0400000US25.140000,25&hidePreview=false&tid=ACSST5Y2018.S2801&vintage=2018&cid=S2801_C01_001E&t=Telephone,%20Computer,%20and%20Internet%20Access" className="calendar-viz__link" fill="#1F4E46">
                2014⁠–2018 ACS
              </a>
            </text>
          </svg>
        </div>
      </div>
      <p>The COVID-19 pandemic has upended daily life in Greater Boston and around the world. Thousands of people can’t report to work, and millions are being told to cease nonessential travel. Never before has the internet been so essential for working remotely and staying connected. Unfortunately, 10 percent of the region’s households still lack the technology needed to access the internet from home. Not only does this inequity make it harder for people to get the information and socialization they need to make it through this crisis; it will also impact the decennial US census being conducted this month.</p>
      <p>While the census might seem extraneous to some people right now, it is of utmost importance to the functioning of government, including preparation for future public emergencies. Census counts determine legislative apportionment and districts; are the basis for federal funding allocation; and inform innumerable policy, planning, emergency response, and business decisions.</p>
      <p>
        Even with this year’s new option to answer the census online, getting every household to respond is a tough job. This is especially true in
        {' '}
        <a href="https://www.bostonindicators.org/reports/report-website-pages/census-2020" className="calendar-viz__link">“hard-to-count”</a>
        {' '}
        communities where limited English proficiency, immigration status, nontraditional housing arrangements, and distrust of government, among other factors, are formidable barriers to getting a complete count. Many municipalities and community-based organizations had planned extensive personal outreach—tabling, fairs and parties, and question assistance centers—to promote census response in these neighborhoods. However, the current need for “social distancing” means that all of these in-person efforts have been cancelled.
      </p>
      <p>Like many jobs, census outreach and follow-up efforts can’t all be shifted online. As shown on the map, hard-to-count tracts often correspond to those lacking the technology needed to access the internet. In some neighborhoods, over 30 percent of households do not have a computer, smartphone, tablet, or some other computing device. This will make it hard to reach households with online advertising promoting census response, and these same households will have to wait for a paper form rather than responding online. The digital divide may depress return rates among the most at-risk communities, with long term effects on funding, services, and representation.</p>
      <p>It’s more critical than ever to respond promptly to the census so that follow-up efforts can be focused on communities that need it. As the current pandemic accelerates our transformation into a more digital region, we must pay attention to equity of access to the online world.</p>
    </>
  );
};

export default April;
