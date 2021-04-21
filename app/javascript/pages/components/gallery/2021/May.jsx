import React from 'react';
import * as d3 from 'd3';

const May = () => {
  d3.csv('/assets/arp_scoring.csv').then((response) => {
    const margin = {
      top: 10, right: 20, bottom: 40, left: 50,
    };
    const width = getComputedStyle(document.querySelector('.calendar-viz')).width.slice(0, -2);
    const height = 700;
    const svg = d3.select('.calendar-viz')
      .append('svg')
      .attr('width', width - margin.left - margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const tooltip = d3.select('.calendar-viz')
      .append('div')
      .style('opacity', 0)
      .attr('class', 'tooltip');

    const tooltipHtml = (municipality) => {
      let tooltipDetails = `<p class='tooltip__title'>${municipality.municipal}</p>
      <ul class='tooltip__list'>
      <li class='tooltip__text'>Popluation: ${municipality.Population}</li>`;
      tooltipDetails += '</ul>';
      return tooltipDetails;
    };

    function tooltipLeft(event, tooltip) {
      return `${event.clientX - tooltip.offsetWidth - 40}px`;
    }

    function tooltipTop(event, tooltip) {
      return `${event.pageY - tooltip.offsetHeight - 140}px`;
    }

    const x = d3.scaleLinear()
      .domain([0, 1])
      .range([0, width]);
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    const y = d3.scaleLinear()
      .domain([0, 1])
      .range([height, 0]);
    svg.append('g')
      .call(d3.axisLeft(y));

    const z = d3.scaleLinear()
      .domain([75, 51000])
      .range([1, 40]);

    svg.append('g')
      .selectAll('dot')
      .data(response)
      .enter()
      .append('circle')
      .attr('cx', (d) => x(d['COVID Impact Score']))
      .attr('cy', (d) => y(d['Income Score']))
      .attr('r', (d) => z(d.Population))
      .style('fill', '#69b3a2')
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
      .text('Income Score');
  });

  return (
    <>
      <h1 className="calendar-viz__title">COVID Vulnerability Index</h1>
      <div className="calendar-viz" />
      <p>
        Most of us forget about sewage as we flush. But how we dispose of wastewater has a profound influence on community growth, the economy, and the environment. Where there are no public sewers, the considerable land-area requirements of on-site wastewater treatment limits development potential. This contrasts with areas served by the Massachusetts Water Resources Authority (MWRA), which sends wastewater to Deer Island for processing. Indeed, the availability of sewers shapes land-use patterns in Metro Boston.
      </p>
      <p>
        For this reason, sewer system data was on MAPC&apos;s 2008 &quot;Most Wanted Datasets&quot; list. We have been slowly compiling the data ever since, focusing on the locations of existing wastewater collection pipes.
      </p>
      <p>
        As one might expect with information kept at the local level, data about pipe locations are stored in a variety of different formats and include a variety of information. Building upon work previously conducted by MassGIS, MAPC defined a basic data standard. We collected information from municipalities, from the U.S. Geological Survey, and from the MWRA. Unfortunately, some municipalities didn&apos;t share their data with us, and some of the data provided is incomplete or may now be out of date.
      </p>
      <p>
        Despite these limitations, the resulting dataset can be a valuable resource for planners and policy makers. For example, a new state law requires all MBTA-served communities to zone for multifamily housing. This sewer-system information will help identify the most promising sites for such zoning. MAPC has used this information to evaluate redevelopment potential at commercial sites across the region as part of a forthcoming &quot;Retrofitting Suburbia&quot; research report, and it is currently doing an analysis of wastewater and water supply capacity in the South Shore subregion.
      </p>
      <p>
        The lack of centralized sewer need not completely preclude denser development: modern &quot;package treatment,&quot; or other small-scale wastewater treatment facilities, can serve a large development or district while also protecting water quality. These are typically privately-owned facilities, but they could also be owned and operated by a municipality or public wastewater district. The feasibility, capacity, and cost of such facilities is influenced by site specific soil and hydrology as well as state and local regulations.
      </p>
    </>
  );
};

export default May;
