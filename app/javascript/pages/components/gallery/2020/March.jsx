/* eslint-disable max-len */
import * as d3 from 'd3';
import React, { useEffect, useState } from 'react';
import D3Map from '../D3Map';

let iterator;
const colors = {
  new: '#FFCA67',
  housing: '#654F8F',
  commercial: '#987CAD',
};

const tooltipHtml = (development) => {
  let tooltipDetails = `<p class='tooltip__title'>${development.name}</p>
  <ul class='tooltip__list'>
  <li class='tooltip__text'>Est. completion in ${development.year_compl}</li>
  <li class='tooltip__text'>${development.municipal}</li>`;
  if (development.hu) {
    tooltipDetails += `<li class='tooltip__text'>${d3.format(',')(development.hu)} housing units</li>`;
  }
  if (development.commsf) {
    tooltipDetails += `<li class='tooltip__text'>${d3.format(',')(development.commsf)} square feet of commercial space</li>`;
  }
  tooltipDetails += '</ul>';
  return tooltipDetails;
};

const tooltipLeft = () => {
  const frameWidth = Math.round(getComputedStyle(document.querySelector('.d3-map')).width.slice(0, -2));
  const xCoordinate = event.layerX;
  const tooltipWidth = +getComputedStyle(document.querySelector('.d3-map__tooltip')).width.slice(0, -2);
  if (xCoordinate > frameWidth / 2) {
    return `${xCoordinate - tooltipWidth - 5}px`;
  }
  return `${xCoordinate + 10}px`;
};

const tooltipTop = () => {
  console.log(event);
  const frameHeight = Math.round(getComputedStyle(document.querySelector('.d3-map')).height.slice(0, -2));
  const yCoordinate = event.layerY;
  const tooltipHeight = +getComputedStyle(document.querySelector('.d3-map__tooltip')).height.slice(0, -2);
  if (yCoordinate > frameHeight / 2) {
    return `${yCoordinate - tooltipHeight - 5}px`;
  }
  return `${yCoordinate + 10}px`;
};

const drawLegend = (selection) => {
  const legendText = {
    housing: {
      sizeText: 'Housing Units',
      sizeOneText: '1 - 99',
      sizeTwoText: '100 - 499',
      sizeThreeText: '500+',
    },
    commercial: {
      sizeText: 'Commercial square feet',
      sizeOneText: '1 - 99,999',
      sizeTwoText: '100,000 - 499,999',
      sizeThreeText: '500,000+',
    },
  };
  d3.select('.d3-map__legend').remove();
  const legend = d3.select('.d3-map')
    .append('svg')
    .attr('class', 'd3-map__legend')
    .attr('x', 500)
    .attr('y', 150);

  legend.append('text')
    .attr('class', 'd3-map__year')
    .attr('x', 0)
    .attr('y', 42)
    .attr('fill', colors.new)
    .text(2015);

  const entryOne = legend.append('g')
    .attr('class', 'd3-map__legend-entry');
  entryOne.append('circle')
    .attr('cx', 5)
    .attr('cy', 62)
    .attr('r', 5)
    .attr('fill', colors.new);
  entryOne.append('text')
    .attr('x', 15)
    .attr('y', 67)
    .attr('fill', '#1F4E46')
    .text(`New ${selection}`);
  entryOne.append('text')
    .attr('x', 15)
    .attr('y', 67 + 14)
    .attr('fill', '#1F4E46')
    .text('development');

  const entryTwo = legend.append('g')
    .attr('class', 'd3-map__legend-entry');
  entryTwo.append('circle')
    .attr('cx', 5)
    .attr('cy', 95)
    .attr('r', 5)
    .attr('fill', colors[selection]);
  entryTwo.append('text')
    .attr('x', 15)
    .attr('y', 100)
    .attr('fill', '#1F4E46')
    .text(`Existing ${selection}`);
  entryTwo.append('text')
    .attr('x', 15)
    .attr('y', 114)
    .attr('fill', '#1F4E46')
    .text('development');

  legend.append('text')
    .attr('x', 0)
    .attr('y', 134)
    .attr('fill', '#1F4E46')
    .attr('class', 'd3-map__legend-entry d3-map__legend-entry--bold')
    .text(legendText[selection].sizeText);

  const sizeOne = legend.append('g')
    .attr('class', 'd3-map__legend-entry');
  sizeOne.append('circle')
    .attr('cx', 12)
    .attr('cy', 150)
    .attr('r', 4)
    .attr('fill', colors[selection]);
  sizeOne.append('text')
    .attr('x', 32)
    .attr('y', 154)
    .attr('fill', '#1F4E46')
    .text(legendText[selection].sizeOneText);

  const sizeTwo = legend.append('g')
    .attr('class', 'd3-map__legend-entry');
  sizeTwo.append('circle')
    .attr('cx', 12)
    .attr('cy', 170)
    .attr('r', 8)
    .attr('fill', colors[selection]);
  sizeTwo.append('text')
    .attr('x', 32)
    .attr('y', 174)
    .attr('fill', '#1F4E46')
    .text(legendText[selection].sizeTwoText);

  const sizeThree = legend.append('g')
    .attr('class', 'd3-map__legend-entry');
  sizeThree.append('circle')
    .attr('cx', 12)
    .attr('cy', 198)
    .attr('r', 12)
    .attr('fill', colors[selection]);
  sizeThree.append('text')
    .attr('x', 32)
    .attr('y', 202)
    .attr('fill', '#1F4E46')
    .text(legendText[selection].sizeThreeText);

  const link = legend.append('a')
    .attr('xlink:href', 'https://www.massbuilds.com/map');
  link.append('text')
    .attr('class', 'd3-map__legend-entry')
    .attr('x', 10)
    .attr('y', 230)
    .attr('fill', '#1F4E46')
    .text('Explore more at');
  link.append('text')
    .attr('class', 'd3-map__legend-entry d3-map__legend-link')
    .attr('x', 10)
    .attr('y', 244)
    .attr('fill', '#1F4E46')
    .text('Massbuilds.com');
};

const drawMap = (newDevelopments, selection) => {
  const marchMap = d3.select('.d3-map');
  const tooltip = d3.select('.d3-map__tooltip');
  const projection = d3.geoAlbers()
    .scale(37000)
    .rotate([71.057, 0])
    .center([0.395, 42.37])
    .translate([960 / 2, 500 / 2]);
  const housingRadius = (size) => {
    if (size < 100) {
      return 4;
    } if (size < 500) {
      return 8;
    }
    return 12;
  };

  const commercialRadius = (size) => {
    if (size < 100000) {
      return 4;
    } if (size < 500000) {
      return 8;
    }
    return 12;
  };

  const dataByYear = [
    newDevelopments.filter((d) => d.year_compl === '2015'),
    newDevelopments.filter((d) => d.year_compl === '2016'),
    newDevelopments.filter((d) => d.year_compl === '2017'),
    newDevelopments.filter((d) => d.year_compl === '2018'),
    newDevelopments.filter((d) => d.year_compl === '2019'),
    newDevelopments.filter((d) => d.year_compl === '2020'),
    newDevelopments.filter((d) => d.year_compl === '2021'),
    newDevelopments.filter((d) => d.year_compl === '2022'),
    newDevelopments.filter((d) => d.year_compl === '2023'),
    newDevelopments.filter((d) => d.year_compl === '2024'),
    newDevelopments.filter((d) => d.year_compl === '2025'),
  ];
  let position = 0;
  let year = 2015;
  const updateVisualization = () => {
    d3.select('.d3-map__year').text(year);
    const newPointsSeries = marchMap.append('g')
      .attr('class', 'd3-map__points')
      .selectAll('circle')
      .data(dataByYear[position])
      .enter();
    const newPoint = newPointsSeries
      .append('a')
      .append('circle')
      .attr('cx', (development) => projection(development.coordinates)[0])
      .attr('cy', (development) => projection(development.coordinates)[1])
      .attr('class', 'd3-map__point')
      .attr('cursor', 'pointer')
      .on('mousemove', (development) => {
        tooltip.transition()
          .duration(50)
          .style('opacity', 0.9);
        tooltip.html(tooltipHtml(development))
          .style('left', tooltipLeft())
          .style('top', tooltipTop());
      })
      .on('mouseleave', () => {
        tooltip.transition()
          .duration(200)
          .style('opacity', 0);
      });

    newPoint.attr('r', 0)
      .transition()
      .duration(5000)
      .attr('r', (development) => {
        if (selection === 'housing') {
          return housingRadius(development.hu);
        }
        return commercialRadius(development.commsf);
      });

    newPoint.attr('fill', colors.new)
      .attr('opacity', 1)
      .transition()
      .delay(4000)
      .duration(1000)
      .attr('fill', colors[selection])
      .attr('opacity', 0.6);
    year += 1;
    position += 1;

    if (position >= dataByYear.length) {
      clearInterval(iterator);
      year = 2015;
    }
  };

  document.querySelectorAll('.d3-map__option-label').forEach((option) => option.addEventListener('click', clearInterval(iterator)));
  updateVisualization();
  iterator = setInterval(updateVisualization, 5000);
  d3.select('.d3-map__points').raise();
};

const March = () => {
  const [currentlySelected, updateSelection] = useState('housing');
  const [housingData, setHousingData] = useState([]);
  const [commercialData, setCommercialData] = useState([]);
  useEffect(() => {
    d3.csv('/assets/march2020.csv').then((mapData) => {
      const newDevelopments = mapData.map((development) => ({ ...development, coordinates: [development.longitude, development.latitude] }));
      const housing = newDevelopments.filter((development) => development.hu > 0);
      const commercial = newDevelopments.filter((development) => development.commsf > 0);
      setHousingData(housing);
      setCommercialData(commercial);
      drawLegend(currentlySelected);
      const checkIfLoaded = setInterval(() => {
        if (document.querySelector('.d3-map__massachusetts')) {
          clearInterval(checkIfLoaded);
          drawMap(housing, 'housing');
        }
      }, 500);
    });
  }, []);
  useEffect(() => {
    d3.selectAll('.d3-map__points').remove();
    d3.select('.d3-map__year').text(2015);
    drawLegend(currentlySelected);
    if (currentlySelected === 'housing') {
      drawMap(housingData, 'housing');
    } else if (currentlySelected === 'commercial') {
      drawMap(commercialData, 'commercial');
    }
  }, [currentlySelected]);
  return (
    <>
      <h1 className="calendar-viz__title">MassBuilds: A Region Under Construction</h1>
      <div className="calendar-viz__wrapper">
        <form className="d3-map__options">
          <label htmlFor="housing" className="d3-map__option-label">
            <input
              type="radio"
              id="housing"
              name="march"
              value="housing"
              className="d3-map__option-button"
              onChange={() => updateSelection('housing')}
              checked={currentlySelected === 'housing'}
            />
            Housing
          </label>
          <label htmlFor="commercial" className="d3-map__option-label">
            <input
              type="radio"
              id="commercial"
              name="march"
              value="commercial"
              className="d3-map__option-button"
              onChange={() => updateSelection('commercial')}
              checked={currentlySelected === 'commercial'}
            />
            Commercial
          </label>
        </form>
        <form className="d3-map__options--mobile">
          <select onChange={(event) => updateSelection(event.target.value)}>
            <option value="housing">Housing</option>
            <option value="commercial">Commercial</option>
          </select>
        </form>
        <D3Map
          oceanFill="#FEFDFE"
          maFill="#F9F7FF"
          newEngFill="#F9F7FF"
          mapcFill="#ECE2FF"
          mapcLine="#5a5a5a"
        />
        <div className="d3-map__tooltip" />
      </div>
      <p>Anyone living or working in Metro Boston is no stranger to the sights and sounds of construction happening around them. It can feel like our region is constantly under development. While many know about a specific development in their community or next to their office it’s hard to know: What is the regional picture? Where is most of this development happening? How close does the construction of new housing units get us to our production goals? Where will jobs be located in the future? MAPC’s MassBuilds database can help answer these questions.</p>
      <p>MassBuilds is a collaborative data inventory that provides a picture of the region’s growth through a website that allows users to view, download, and contribute information about thousands of development projects recently completed or in the pipeline. This map of MassBuilds data shows projects completed since 2015 as well as those in or nearing construction in the next five years. Together this group totals 128,374 housing units and 100.86 million sqft of commercial development. 1,310 developments in the Inner Core account for 72% of the housing and 70% of the commercial square footage, with the balance distributed across 864 developments elsewhere in the region. Office and medical space has dominated the majority of commercial square footage development, accounting for 35% percent of all tracked development from 2015 to 2020. This database also shows a move towards transit-oriented development. 65% of all housing units and commercial square footage from 2015-2025 are within ½ mile of a commuter rail or rapid transit station. This may help explain the low residential parking rates. For residential projects with information about parking, we see an average of 0.68 spaces per unit for developments completed 2015-2019 and compared to 0.60 spaces per unit projected for developments with a completion date of 2020-2025.</p>
      <p>
Data like this helps shape our region and is available because MassBuilds collects it across geographic boundaries. Tracking and anticipating development across Metro Boston is challenging. Each municipality has its own planning office and building inspector, and information about development is often scattered across multiple websites or sitting in spreadsheets across the region. MassBuilds allows municipalities, and state agencies get a fuller picture of development trends in real time as they regulate and invest in sustainable and equitable development. However, this system is just the beginning of a broader vision. Without a regional system for development applications or building permits, housing and job growth is usually measured after the fact with disparate data sources that often lack detailed information. One day we hope to move to a more integrated regional system that encourages the collection of this data within the development process: projects could be tagged when a construction or occupancy permit is awarded, site plans could automatically track information about parking and affordability, and projects of all sizes could be automatically tracked across the region. Learn more about MassBuilds and contribute data by creating a free account at
        {' '}
        <a href="https://www.massbuilds.com" className="calendar-viz__link">www.MassBuilds.com</a>
        {' '}
today.
      </p>
      <p>
        <em>
Map data up-to-date as of 11:15am, 4/17/2020.
          <br />
All statistics up-to-date as of 9:30am, 2/28/2020, only projects in the MAPC region analyzed.
        </em>
      </p>
    </>
  );
};

export default March;
