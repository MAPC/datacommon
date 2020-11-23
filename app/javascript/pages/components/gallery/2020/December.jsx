import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import mapboxgl from 'mapbox-gl';
import { VegaLite } from 'react-vega';

const colorPalette = ['#F3F3F3', '#B1C6D8', '#50789D', '#2e4b66', '#c1b9bb'];
const colorPolygon = (value) => {
  if (value >= 200) {
    return colorPalette[3];
  } if (value >= 100) {
    return colorPalette[2];
  } if (value >= 50) {
    return colorPalette[1];
  }
  return colorPalette[0];
};
const colorExpression = ['match', ['get', 'town']];

function setHeader(currentMuni, medianObj) {
  if (currentMuni) {
    return `${currentMuni}: ${medianObj[currentMuni]} mbps`;
  }
  return 'Please select a muni';
}

const December = () => {
  const [mapData, setMapData] = useState();
  const [map, setMap] = useState();
  const [medianObj, setMedianObj] = useState({});
  const [currentMuni, setMuni] = useState();
  const [chartData, setChartData] = useState();
  const [chart, setChart] = useState();
  const [spec, setSpec] = useState();
  // Get map data
  useEffect(() => {
    d3.csv('/assets/december2020.csv').then((response) => {
      setMapData(response);
    });
  }, []);
  // Declare map
  useEffect(() => {
    const decMap = new mapboxgl.Map({
      container: 'decMap',
      style: 'mapbox://styles/ihill/ckcnnn63u26o11ip2qf4odwyp',
      accessToken: 'pk.eyJ1IjoiaWhpbGwiLCJhIjoiY2plZzUwMTRzMW45NjJxb2R2Z2thOWF1YiJ9.szIAeMS4c9YTgNsJeG36gg',
      center: [-70.944, 42.37],
      zoom: 8.4,
      minZoom: 6,
      maxZoom: 13,
      maxBounds: [
        [-74.728, 38.167], // Southwest bound
        [-66.541, 46.032], // Northeast bound
      ],
    });
    setMap(decMap);
  }, []);
  // Add map features
  useEffect(() => {
    if (mapData) {
      const tempMedianObj = {};
      mapData.forEach((row) => {
        colorExpression.push(row.muni, row.median_download_speed_mbps_2020 !== '-' ? colorPolygon(+row.median_download_speed_mbps_2020) : colorPalette[4]);
        tempMedianObj[row.muni] = row.median_download_speed_mbps_2020;
      });
      setMedianObj(tempMedianObj);
      colorExpression.push(colorPalette[4]);
      map.on('load', () => {
        map.addLayer({
          id: 'Median Download Speed',
          type: 'fill',
          source: 'composite',
          'source-layer': 'MA_Munis',
          paint: {
            'fill-color': colorExpression,
          },
        });
        map.moveLayer('Muni borders');
        map.moveLayer('MAPC outline');
        map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
      });
    }
  }, [mapData]);
  // Get chart data
  useEffect(() => {
    d3.csv('/assets/december2020-chart.csv').then((response) => {
      setChartData({ table: response });
    });
  }, []);
  // Set up chart
  useEffect(() => {
    // set the dimensions and margins of the graph
    if (chartData) {
      console.log(chartData);
      const specTemp = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        data: {name: 'table'},
        mark: 'bar',
        width: 'container',
        height: 450,
        encoding: {
          x: {
            bin: { binned: true, step: 2 },
            field: 'buckets',
          },
          x2: { field: 'bucket_end' },
          y: {
            field: 'frequency',
            type: 'quantitative',
          },
        },
      };
      setSpec(specTemp);
    }
  }, [chartData]);

  if (map) {
    map.on('click', 'Median Download Speed', (e) => {
      setMuni(e.features[0].properties.town);
      map.setPaintProperty('Muni borders', 'line-color', ['match', ['get', 'town'], e.features[0].properties.town, '#EE3125', 'black']);
      map.setPaintProperty('Muni borders', 'line-width', ['match', ['get', 'town'], e.features[0].properties.town, 3, 1]);
    });
  }

  return (
    <>
      <h1 className="calendar-viz__title">The Need for Speed</h1>
      <div className="calendar-viz__wrapper--two-col">
        <div className="calendar-viz__wrapper">
          <div id="decMap" className="mapboxgl__container" />
          <div className="map__overlay" style={{ top: '98px' }}>
            <span className="map__legend-entry map__legend-entry--bold map__legend-title">Median Download Speed (Megabits per Second)</span>
            <svg height="132" width="168">
              <rect x="2" y="2" width="16" height="16" fill="#F3F3F3" stroke="#231F20" />
              <text x="28" y="14" className="map__legend-entry" fill="#1F4E46">1 – 50</text>
              <rect x="2" y="30" width="16" height="16" fill="#B1C6D8" stroke="#231F20" />
              <text x="28" y="42" className="map__legend-entry" fill="#1F4E46">50 – 100</text>
              <rect x="2" y="58" width="16" height="16" fill="#50789D" stroke="#231F20" />
              <text x="28" y="70" className="map__legend-entry" fill="#1F4E46">100 – 200</text>
              <rect x="2" y="86" width="16" height="16" fill="#2e4b66" stroke="#231F20" />
              <text x="28" y="98" className="map__legend-entry" fill="#1F4E46">200+</text>
              <rect x="2" y="114" width="16" height="16" fill="#c1b9bb" stroke="#231F20" />
              <text x="28" y="126" className="map__legend-entry" fill="#1F4E46">Data unavailable</text>
            </svg>
          </div>
        </div>
        {/* <div id="decChart" className="calendar-viz__chart">
          { setHeader(currentMuni, medianObj) }
        </div> */}
        { spec ? <VegaLite spec={spec} data={chartData} /> : ''}
      </div>
      <p>Have you ever used that convenient widget that appears at the top of Google searches for “speed test”? Maybe your Zoom video keeps cutting out and you hop over to Google for a quick speed test. Ever wonder where all that data goes or how you compare with your neighbors? Well, Google partners with the Measurement Lab (M-Lab) to run those speed tests. M-Lab is committed to making the non-identifiable data open and available to the public.</p>
      <p>We took speed tests submitted by users and averaged the results of all speed tests made by a single user on a single day. decMapped are these median speeds by municipality for 2020. In the tooltip we show the distribution for each municipality. We put those averages into 5 megabit per second bins. The higher the bar in the histogram, the more people that have experienced speeds within the range for the bin (example 0-5Mbps). While there may be some clustering around speed tiers offered by internet service providers, there are a lot of factors that contribute to speed from equipment performance to heavy use with multiple family members sharing a connection.</p>
      <p>Despite broadband currently not treated as a public utility, it has been become an even more an essential resource in 2020. Across the Commonwealth, governments and communities are looking to make investments in the infrastructure, equipment and training that can increase access to the internet and the need speed to keep residents connected.</p>
      <p>---</p>
      <p>Despite broadband currently not being treated as a public utility, it has been become an essential resource in 2020.  The COVID pandemic has created an environment where multiple members of the same household may need to be accessing video calls, online cloud storage, and other digital tools for work, school, and healthcare – potentially at the same time.  Having access to high speed and reliable internet is now no longer an amenity, it is a critical tool for daily life.</p>
      <p>The issue of internet access, broadly referred to as the “Digital Divide”, is a function of three critical elements:</p>
      <ol>
        <li>A adequate device.  A phone of tablet may be good for entertainment but nor for school or work.</li>
        <li>Literacy:  The ability to use the device to access the tools and resources an individual needs.</li>
        <li>Connection:  A household or building connection to an internet service provider at a price that they can afford. </li>
      </ol>
      <p>Many Massachusetts communities have only one or two internet service providers, with lower income communities lacking some of the more expensive high speed providers such as Verizon FIOS.  Some communities have taken it upon themselves to provide internet through a municipal broadband initiative.</p>
      <p>To better understand where there might be issues of quality connectivity or service provision, decMapC took M-Lab speed tests submitted by users and averaged the results of all speed tests made by a single user on a single day. decMapped are these median speeds by municipality for 2020. In the tooltip we show the distribution for each municipality. We put those averages into 5 megabit per second bins. The higher the bar in the histogram, the more people that have experienced speeds within the range for the bin (example 0-5Mbps). While there may be some clustering around speed tiers offered by internet service providers, there are a lot of factors that contribute to speed from equipment performance to heavy use with multiple family members sharing a connection.</p>
      <p>Across the Commonwealth,  communities are looking to make investments in the infrastructure, equipment and training that can increase quality access to the internet.  decMapC believes that municipalities can play a leading role in ensuring internet access and connectivity for families, students, seniors, and other individuals who are needing to use digital resources in new ways.</p>
      <p>decMapC proposes a three step approach to tackling municipal Digital Divide issues:</p>
      <ol>
        <li>Understanding the specific needs of the community: Identifying the specific barriers that individuals and households are facing across a community is an important first step to addressing Digital Divide issues.</li>
        <li>Developing a Digital Access Plan:  Similar to a Master Plan or Housing Production Plan, a Municipal Digital Access Plan can lay out the vision and actors needed to address digital divide issues in a community.</li>
        <li>Infrastrucutre Evaluation:  Evaluating the existing and needed infrastructure to improve connectivity can be an important final step in improving digital access.  Knowing where existing resources such as dark fiber lines, carrier hotels, and other components of internet infrastructure can provide direction for a municipality looking to improve connectivity for it’s residents and businesses.</li>
      </ol>
      <p>decMapC also believes that this should not sit a vaccuum – something about workforce tie in...</p>
      <p>If your community is interested in exploring issues related to the digital divide, please reach out to (Josh/Ryan/Matt) and we would be happy to discuss how to produce these elements...</p>
    </>
  );
};

export default December;
