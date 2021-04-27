import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

function tooltipLeft(event, tooltip) {
  return `${event.clientX - tooltip.offsetWidth - 40}px`;
}

function tooltipTop(event, tooltip) {
  return `${event.pageY - tooltip.offsetHeight - 140}px`;
}

const margin = {
  top: 10, right: 20, bottom: 40, left: 100,
};

const bubbleColors = {
  TRUE: '#69b3a2',
  FALSE: '#2c4d46',
};

const May = () => {
  const [data, setData] = useState();
  useEffect(() => {
    d3.csv('/assets/arp_scoring_entitlement_communities_aid.csv').then((response) => {
      setData(response);
    });
  }, []);
  if (data) {
    const height = 700;
    const width = getComputedStyle(document.querySelector('.calendar-viz')).width.slice(0, -2);
    const svg = d3.select('.calendar-viz__chart')
      .attr('width', width - margin.left - margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('class', 'calendar-viz__svg')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const tooltip = d3.select('.calendar-viz')
      .append('div')
      .style('opacity', 0)
      .attr('class', 'tooltip');

    const tooltipHtml = (municipality) => `
        <p class='tooltip__title'>${municipality.municipal}</p>
        <ul class='tooltip__list'>
          <li class='tooltip__text'>Popluation: ${d3.format(',')(municipality.Population)}</li>
          <li class='tooltip__text'>${municipality.entitlement === 'TRUE' ? 'Entitlement community' : 'Not an entitlement community'}</li>
        </ul>`;

    const x = d3.scaleLinear()
      .domain([0, 1.15])
      .range([0, width]);
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    const y = d3.scaleLinear()
      .domain([0, 160000000])
      .range([height, 0]);
    svg.append('g')
      .call(d3.axisLeft(y));

    const z = d3.scaleLinear()
      .domain([75, 690000])
      .range([2, 100]);

    svg.append('g')
      .selectAll('dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d) => x(d['COVID Impact Score']))
      .attr('cy', (d) => y(d['Estimated Aid']))
      .attr('r', (d) => z(d.Population))
      .style('fill', (d) => bubbleColors[d.entitlement])
      .style('opacity', '.7')
      .attr('stroke', 'black')
      .on('mousemove', (d) => {
        tooltip.transition()
          .duration(50)
          .style('opacity', 0.9);
        tooltip.html(tooltipHtml(d))
          .style('left', tooltipLeft(d3.event, document.getElementsByClassName('tooltip')[0]))
          .style('top', tooltipTop(d3.event, document.getElementsByClassName('tooltip')[0]));
      })
      .on('mouseleave', () => {
        tooltip.transition()
          .duration(200)
          .style('opacity', 0);
      });

    svg.append('text')
      .attr('transform', `translate(${width / 2}, ${height + margin.top + 20})`)
      .style('text-anchor', 'middle')
      .style('font-family', 'Montserrat, sans-serif')
      .text('COVID Impact Score');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-family', 'Montserrat, sans-serif')
      .text('Allocated Aid (US Dollars)');
  }

  return (
    <>
      <h1 className="calendar-viz__title">COVID Vulnerability Index</h1>
      <div className="calendar-viz">
        <svg className="calendar-viz__chart" />
        <div
          className="calendar-viz__legend"
          style={{
            position: 'absolute', top: '0', right: '120px', background: '#F0EFE7', padding: '8px',
          }}
        >
          <svg className="calendar-viz__legend" height="120" width="168">
            <text
              x="0"
              y="10"
              className="d3-map__legend-entry d3-map__legend-entry--bold"
              fill="#1F4E46"
            >
              Municipality Type
            </text>
            <circle fill={bubbleColors.TRUE} opacity="0.6" cx="10" cy="30" r="6" width="25" height="10" />
            <text
              x="24"
              y="33"
              className="d3-map__legend-entry"
              fill="#1F4E46"
            >
              Entitlement
            </text>
            <text
              x="24"
              y="50"
              className="d3-map__legend-entry"
              fill="#1F4E46"
            >
              community
            </text>
            <circle fill={bubbleColors.FALSE} opacity="0.6" cx="10" cy="70" r="6" width="25" height="10" />
            <text
              x="24"
              y="73"
              className="d3-map__legend-entry"
              fill="#1F4E46"
            >
              Not an entitlement
            </text>
            <text
              x="24"
              y="90"
              className="d3-map__legend-entry"
              fill="#1F4E46"
            >
              community
            </text>
          </svg>
        </div>
      </div>
      <p>
        MAPC has created a COVID-19 Recovery Need Score to better identify where municipalities stand in relation to each other on factors important to the need for COVID-19 recovery support. According to this analysis, Chelsea scores higher (more in need of funding support) than all of the Entitlement communities except for Lawrence.
      </p>
      <p>
        The score is measured across three dimensions (sub-scores), which include data as follows:
      </p>
      <ul>
        <li>COVID Impact Sub-score – COVID-19 case rates and average unemployment rate from February 2020 to January 2021; this score is weighted x1.5 in the final Recovery Need Score.</li>
        <li>Income Sub-score - poverty rate, percent low-income population; this score is weighted x1 in the final Recovery Need Score.</li>
        <li>Demographic Score - percent people of color, and percent born outside the United States; this score is weighted x1 in the final Recovery Need Score.</li>
      </ul>
    </>
  );
};

export default May;
