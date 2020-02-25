/* eslint-disable max-len */
import * as d3 from 'd3';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import D3Map from '../D3Map';

let iterator;
const colors = {
  primaryNew: '#fab903',
  mixedUseNew: '#fee08e',
  primary: '#8544CC',
  mixedUse: '#c85ca1',
};

const tooltipHtml = (development) => {
  let tooltipDetails = `<p class='tooltip__title'>${development.attributes.name}</p>
  <ul class='tooltip__list'>
  <li class='tooltip__text'>Est. completion in ${development.attributes.year_compl}</li>`;
  if (development.attributes.hu) {
    tooltipDetails += `<li class='tooltip__text'>${d3.format(',')(development.attributes.hu)} housing units</li>`;
  }
  if (development.attributes.commsf) {
    tooltipDetails += `<li class='tooltip__text'>${d3.format(',')(development.attributes.commsf)} square feet of commercial space</li>`;
  }
  tooltipDetails += '</ul>';
  return tooltipDetails;
};

const tooltipLeft = (xCoordinate) => {
  const tooltipWidth = +getComputedStyle(document.querySelector('.d3-map__tooltip')).width.slice(0, -2);
  if (xCoordinate >= 300) {
    return `${xCoordinate - tooltipWidth}px`;
  }
  return `${xCoordinate + 10}px`;
};

const tooltipTop = (yCoordinate) => {
  const tooltipHeight = +getComputedStyle(document.querySelector('.d3-map__tooltip')).height.slice(0, -2);
  if (yCoordinate >= 250) {
    return `${yCoordinate - tooltipHeight - 10}px`;
  }
  return `${yCoordinate + 20}px`;
};

const drawLegend = (selection) => {
  d3.select('.d3-map__legend').remove();
  const legend = d3.select('.d3-map')
    .append('svg')
    .attr('class', 'd3-map__legend')
    .attr('x', 500)
    .attr('y', 190);

  const entryOne = legend.append('g')
    .attr('class', 'd3-map__legend-entry');
  entryOne.append('circle')
    .attr('cx', 5)
    .attr('cy', 5)
    .attr('r', 5)
    .attr('fill', colors.primaryNew);
  entryOne.append('text')
    .attr('x', 15)
    .attr('y', 10)
    .text(`New ${selection}`);
  entryOne.append('text')
    .attr('x', 15)
    .attr('y', 25)
    .text('development');

  const entryTwo = legend.append('g')
    .attr('class', 'd3-map__legend-entry');
  entryTwo.append('circle')
    .attr('cx', 5)
    .attr('cy', 40)
    .attr('r', 5)
    .attr('fill', colors.mixedUseNew);
  entryTwo.append('text')
    .attr('x', 15)
    .attr('y', 45)
    .text('New mixed-use');
  entryTwo.append('text')
    .attr('x', 15)
    .attr('y', 60)
    .text('development');

  const entryThree = legend.append('g')
    .attr('class', 'd3-map__legend-entry');
  entryThree.append('circle')
    .attr('cx', 5)
    .attr('cy', 75)
    .attr('r', 5)
    .attr('fill', colors.primary)
    .attr('opacity', 0.6);
  entryThree.append('text')
    .attr('x', 15)
    .attr('y', 80)
    .text(`Existing ${selection}`);
  entryThree.append('text')
    .attr('x', 15)
    .attr('y', 95)
    .text('development');

  const entryFour = legend.append('g')
    .attr('class', 'd3-map__legend-entry');
  entryFour.append('circle')
    .attr('cx', 5)
    .attr('cy', 110)
    .attr('r', 5)
    .attr('fill', colors.mixedUse)
    .attr('opacity', 0.6);
  entryFour.append('text')
    .attr('x', 15)
    .attr('y', 115)
    .text('Existing mixed-use');
  entryFour.append('text')
    .attr('x', 15)
    .attr('y', 130)
    .text('development');
};

const drawMap = (newDevelopments, selection) => {
  const marchMap = d3.select('.d3-map');
  const tooltip = d3.select('.d3-map__tooltip');
  const projection = d3.geoAlbers()
    .scale(37000)
    .rotate([71.057, 0])
    .center([0.395, 42.37])
    .translate([960 / 2, 500 / 2]);
  const housingRadius = d3.scaleLinear()
    .domain([d3.min(newDevelopments, (d) => d.attributes.hu || Infinity), d3.max(newDevelopments, (d) => d.attributes.hu)])
    .range([3, 10]);
  const commercialRadius = d3.scaleLinear()
    .domain([d3.min(newDevelopments, (d) => d.attributes.commsf || Infinity), d3.max(newDevelopments, (d) => d.attributes.commsf)])
    .range([3, 10]);

  const data2015 = newDevelopments.filter((d) => d.attributes.year_compl === 2015);
  const data2016 = newDevelopments.filter((d) => d.attributes.year_compl === 2016);
  const data2017 = newDevelopments.filter((d) => d.attributes.year_compl === 2017);
  const data2018 = newDevelopments.filter((d) => d.attributes.year_compl === 2018);
  const data2019 = newDevelopments.filter((d) => d.attributes.year_compl === 2019);
  const data2020 = newDevelopments.filter((d) => d.attributes.year_compl === 2020);
  const data2021 = newDevelopments.filter((d) => d.attributes.year_compl === 2021);
  const data2022 = newDevelopments.filter((d) => d.attributes.year_compl === 2022);
  const data2023 = newDevelopments.filter((d) => d.attributes.year_compl === 2023);
  const data2024 = newDevelopments.filter((d) => d.attributes.year_compl === 2024);
  const data2025 = newDevelopments.filter((d) => d.attributes.year_compl === 2025);
  const dataPool = [data2015, data2016, data2017, data2018, data2019, data2020, data2021, data2022, data2023, data2024, data2025];
  let position = 0;
  let year = 2015;
  const updateVisualization = () => {
    d3.select('.d3-map__year').text(year);
    const newPointsSeries = marchMap.append('g')
      .attr('class', 'd3-map__points')
      .selectAll('circle')
      .data(dataPool[position])
      .enter();
    const newPoint = newPointsSeries.append('circle')
      .attr('cx', (development) => projection(development.coordinates)[0])
      .attr('cy', (development) => projection(development.coordinates)[1])
      .attr('class', 'd3-map__point')
      .attr('cursor', 'pointer')
      .on('mousemove', (development) => {
        tooltip.transition()
          .duration(50)
          .style('opacity', 0.9);
        tooltip.html(tooltipHtml(development))
          .style('left', tooltipLeft(projection(development.coordinates)[0]))
          .style('top', tooltipTop(projection(development.coordinates)[1]));
      })
      .on('mouseleave', () => {
        tooltip.transition()
          .duration(200)
          .style('opacity', 0);
      });

    newPoint.attr('r', 1)
      .transition()
      .duration(2000)
      .attr('r', (development) => {
        if (selection === 'housing') {
          return housingRadius(development.attributes.hu);
        }
        return commercialRadius(development.attributes.commsf);
      });

    newPoint.attr('fill', (development) => {
      if (development.attributes.hu > 0 && development.attributes.commsf > 0) {
        return colors.mixedUseNew;
      }
      return colors.primaryNew;
    })
      .attr('opacity', 1)
      .transition()
      .delay(4000)
      .duration(1000)
      .attr('fill', (development) => {
        if (development.attributes.hu > 0 && development.attributes.commsf > 0) {
          return colors.mixedUse;
        }
        return colors.primary;
      })
      .attr('opacity', 0.6);
    year += 1;
    position += 1;
    if (position >= dataPool.length) {
      clearInterval(iterator);
      year = 2015;
    }
  };

  document.querySelectorAll('.d3-map__option-label').forEach((option) => option.addEventListener('click', clearInterval(iterator)));
  updateVisualization();
  d3.select('.d3-map__points').raise();
  iterator = setInterval(updateVisualization, 5000);
};

const March = () => {
  const [currentlySelected, updateSelection] = useState('housing');
  const [housingData, setHousingData] = useState([]);
  const [commercialData, setCommercialData] = useState([]);
  useEffect(() => {
    const newMassBuilds = 'https://api.massbuilds.com/developments?filter%5Byear_compl%5D%5Bcol%5D=year_compl&filter%5Byear_compl%5D%5Bname%5D=Year%20complete&filter%5Byear_compl%5D%5BglossaryKey%5D=YEAR_COMPLETE&filter%5Byear_compl%5D%5Btype%5D=number&filter%5Byear_compl%5D%5Bfilter%5D=metric&filter%5Byear_compl%5D%5Bvalue%5D=2014&filter%5Byear_compl%5D%5Binflector%5D=%3E';
    axios.get(newMassBuilds, { headers: { Accept: 'application/vnd.api+json' } }).then((mapData) => {
      const newDevelopments = mapData.data.data.filter((development) => development.attributes.rpa_name === 'Metropolitan Area Planning Council'
        && development.attributes.year_compl <= 2025)
        .map((development) => ({ attributes: development.attributes, coordinates: [development.attributes.longitude, development.attributes.latitude] }));
      const newHousing = newDevelopments.filter((development) => development.attributes.hu > 0);
      const newCommercial = newDevelopments.filter((development) => development.attributes.commsf > 0);
      setHousingData(newHousing);
      setCommercialData(newCommercial);
      drawLegend(currentlySelected);
      drawMap(newHousing, 'housing');
    });
  }, []);
  useEffect(() => {
    d3.selectAll('.d3-map__points').remove();
    d3.select('.d3-map__year').text(2015);
    drawLegend(currentlySelected);
    if (currentlySelected === 'housing') {
      drawMap(housingData, 'housing');
    } else {
      drawMap(commercialData, 'commercial');
    }
  }, [currentlySelected]);
  return (
    <>
      <h1 className="calendar-viz__title">A Region Under Construction</h1>
      <div className="calendar-viz__wrapper">
        <form className="d3-map__options">
          <label htmlFor="housing" className="d3-map__option-label">
            <input
              type="radio"
              id="housing"
              name="march"
              value="housing"
              className="d3-map__option-button"
              onChange={() => {
                updateSelection('housing');
              }}
              checked={currentlySelected === 'housing'}
            />
            Housing
          </label>
          <label htmlFor="housing" className="d3-map__option-label">
            <input
              type="radio"
              id="commercial"
              name="march"
              value="commercial"
              className="d3-map__option-button"
              onChange={() => {
                updateSelection('commercial');
              }}
              checked={currentlySelected === 'commercial'}
            />
            Commercial
          </label>
        </form>
        <D3Map
          oceanFill="#FEFDFE"
          maFill="#FCF2FB"
          newEngFill="#FCF2FB"
          mapcFill="#DDCCF1"
          mapcLine="#5a5a5a"
        />
        <div className="d3-map__tooltip" />
        <div className="d3-map__year">2015</div>
      </div>
      <p>Anyone living or working in Metro Boston is no stranger to the sights and sounds of construction happening around them. It can feel like our region is constantly under development. While many know about a specific development in their community or next to their office it’s hard to know: What is the regional picture? Where is most of this development happening? How close does the construction of new housing units get us to our production goals? Where will jobs be located in the future? MAPC’s MassBuilds database can help answer these questions.</p>
      <p>MassBuilds is a collaborative data inventory that provides a picture of the region’s growth through a website that allows users to view, download, and contribute information about thousands of development projects recently completed or in the pipeline. This map shows projects completed since 2015 as well as those in or nearing construction in the next five years. Together this group totals XXX housing units and XX million sqft of commercial development. XXX growth in the Inner Core includes almost XX of the new housing and jobs, with the balance distributed across XX developments. Office space has dominated the majority of commercial square footage development, accounting for XX percent of all development since 2015. This database also shows a move towards more transit-oriented development. XX% of all housing units are within ½ mile walkshed of a commuter rail or rapid transit station. This may help explain the decline in parking ratios over time. For residential projects with information about parking, we see an average of XX spaces per unit in XXX compared to XX spaces per unit in XXX.</p>
      <p>
MassBuilds was created because tracking and anticipating development across Metro Boston is challenging. Each municipality has its own planning office and building inspector, and information about development is often scattered across multiple websites or sitting in spreadsheets across the region. MassBuilds allows municipalities, and state agencies get a fuller picture of development rends in real time as they regulate and invest in sustainable and equitable development. However, this system is just the beginning of a broader vision. Without a regional system for development applications or building permits, housing and job growth is usually measured after the fact with disparate data sources that often lack detailed information. One day we hope to move to a more integrated regional system that encourages the collection of this data within the development process: projects could be tagged when a construction or occupancy permit is awarded, site plans could automatically track information about parking and affordability, and projects of all sizes could be automatically tracked across the region. Learn more about MassBuilds and contribute data by creating a free account at
        <a href="https://www.massbuilds.com/map">www.MassBuilds.com</a>
        {' '}
today.
      </p>
    </>
  );
};

export default March;
