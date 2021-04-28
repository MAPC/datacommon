import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

function tooltipLeft(event, tooltip) {
  if (event.pageX > window.innerWidth / 2) {
    return `${event.pageX - tooltip.offsetWidth + 20}px`;
  }
  return `${event.pageX + 10}px`;
}

function tooltipTop(event, tooltip) {
  return `${event.pageY - tooltip.offsetHeight - 10}px`;
}

const margin = {
  top: 10, right: 40, bottom: 50, left: 100,
};

const bubbleColors = {
  TRUE: '#FDB525',
  FALSE: '#0097C4',
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
      .attr('width', width - margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('class', 'calendar-viz__svg')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const tooltip = d3.select('body').append('div').attr('class', 'tooltip').style('display', 'none');

    const tooltipHtml = (municipality) => `
      <p class='tooltip__title'>${municipality.municipal} (pop. ${d3.format(',')(municipality.Population)})</p>
      <ul class='tooltip__list'>
        <li class='tooltip__text'>${municipality.entitlement === 'TRUE' ? 'Entitlement community' : 'Not an entitlement community'}</li>
        <li class='tooltip__text'>COVID Recovery Need Score: ${d3.format('.3')(municipality['Weighted Score'])}</li>
        <li class='tooltip__text'>Total allocated aid: ${d3.format('$,')(municipality['Estimated Aid'])}</li>
        <li class='tooltip__text'>Aid/person: $${(+municipality['Aid per person']).toFixed(2)}</li>
      </ul>`;

    const x = d3.scaleLinear()
      .domain([0, 1.2])
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
      .domain([75, 190000])
      .range([2, 50]);

    svg.append('g')
      .selectAll('dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d) => x(d['Weighted Score']))
      .attr('cy', (d) => y(d['Estimated Aid']))
      .attr('r', (d) => z(d.Population))
      .style('fill', (d) => bubbleColors[d.entitlement])
      .style('opacity', '.7')
      .attr('stroke', 'black')
      .on('mousemove', (d) => {
        tooltip.transition()
          .duration(50)
          .style('opacity', 0.9)
          .style('display', 'inline');
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
      .attr('transform', `translate(${width / 2}, ${height + margin.top + 30})`)
      .style('text-anchor', 'middle')
      .style('font-family', 'Montserrat, sans-serif')
      .text('COVID Recovery Need Score');

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
      <h1 className="calendar-viz__title">Defining Entitlement</h1>
      <div className="calendar-viz">
        <svg className="calendar-viz__chart" />
        <div
          className="calendar-viz__legend"
          style={{
            position: 'absolute', top: '0', right: '100px', background: 'rgba(240, 239, 231, .5)', padding: '8px', maxWidth: '168px'
          }}
        >
          <svg className="calendar-viz__legend" height="160" width="168">
            <text
              x="0"
              y="10"
              className="d3-map__legend-entry d3-map__legend-entry--bold"
              fill="#1F4E46"
            >
              Municipality Type
            </text>
            <circle fill={bubbleColors.TRUE} opacity="0.6" cx="10" cy="30" r="6" width="25" height="10" stroke="black" />
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
            <circle fill={bubbleColors.FALSE} stroke="black" opacity="0.6" cx="10" cy="70" r="6" width="25" height="10" />
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
            <text
              x="0"
              y="116"
              className="d3-map__legend-entry d3-map__legend-entry--bold"
              fill="#1F4E46"
            >
              Population
            </text>
            <text
              x="0"
              y="138"
              className="d3-map__legend-entry"
              fill="#1F4E46"
            >
              Circle size corresponds
            </text>
            <text
              x="0"
              y="154"
              className="d3-map__legend-entry"
              fill="#1F4E46"
            >
              to population size
            </text>
          </svg>
        </div>
      </div>
      <p>
        <em>
          Note: Boston, an entitlement community with a population of almost 700,000, is not included in this visualization due to scale. MMA estimates that Boston will receive $569,007,913 in ARP aid; MAPC calculated Boston's COVID-19 Recovery Need Score as 0.697.
        </em>
      </p>
      <p>
        The American Rescue Plan federal aid package was signed by President Joe Biden last month. It allocated over $3 billion to Massachusetts for local coronavirus relief. How these funds will be distributed amongst municipalities is important.
      </p>
      <p>
        About a third of funding will go to municipalities and counties on a per-capita basis. The rest will be distributed through a modified Community Development Block Grant (CDBG)
        {' '}
        <a href="https://www.hudexchange.info/programs/cdbg-entitlement/cdbg-entitlement-program-eligibility-requirements/" className="calendar-viz__link">entitlement program formula</a>
        {' '}
        that relies on population thresholds (50,000-person threshold). Use of these thresholds has the effect of excluding several very-high-need communities. Newton, for example, as a community over the population threshold, is designated an entitlement community that will receive funds. Chelsea is not.
        <sup>1</sup>
        {' '}
        This is a systemic inequity.
      </p>
      <p>
        In order to demonstrate the difference between need and &quot;entitlement,&quot; we have visualized the distribution of the American Rescue Plan funds in comparison to the defined poverty and COVID impacts communities face. We’ve done this with
        {' '}
        <a href="https://www.mma.org/mma-provides-analysis-of-municipal-aid-expected-from-american-rescue-plan/" className="calendar-viz__link">data developed by our partners at the MMA</a>
        , and by creating a COVID-19 Recovery Need Score.
      </p>
      <p>
        The score is measured across three dimensions (sub-scores):
      </p>
      <ul className="calendar-viz__list">
        <li>
          <strong>COVID Impact sub-score</strong>
          {' '}
          – COVID-19 case rates and average unemployment rate from February 2020 to January 2021. This sub-score is weighted x1.5 in the final Recovery Need Score.
        </li>
        <li>
          <strong>
            Income sub-score
          </strong>
          {' '}
          – Poverty rate, percent low-income population. This sub-score is weighted x1 in the final Recovery Need Score.
        </li>
        <li>
          <strong>Demographic sub-score</strong>
          {' '}
          – Percent people of color, and percent born outside the United States. This sub-score is weighted x1 in the final Recovery Need Score.
        </li>
      </ul>
      <p>
        According to this analysis, Chelsea scores higher (more in need of funding support) than all of the Entitlement communities except for Lawrence. To address this disparity, Governor Baker directed supplemental state funding to Chelsea and several other cities and towns that aren’t entitlement communities, but that do have demonstrated need.
      </p>
      <p>
        If we want to address systemic issues that affect the equitable distribution of resources, improving the formulas that underpin these systems is an important first step. Formulae more representative of need include
        {' '}
        <a href="https://www.mass.gov/info-details/environmental-justice-populations-in-massachusetts" className="calendar-viz__link">Environmental Justice Indicators</a>
        {', '}
        <a href="https://housing-submarkets.mapc.org/" className="calendar-viz__link">Housing Submarket Indicators</a>
        {', '}
        <a href="https://climate-vulnerability.mapc.org/" className="calendar-viz__link">Climate Vulnerability Indicators</a>
        {', '}
        <a href="https://localaccess.mapc.org/" className="calendar-viz__link">Local Access Scores</a>
        {', '}
        and others.
      </p>
      <p>
        <sup>1</sup>
        {' '}
        Read the
        {' '}
        <em>Boston Globe</em>
        {' '}
        related story
        {' '}
        <a href="https://www.bostonglobe.com/2021/03/18/metro/cities-hit-hard-by-virus-are-underfunded-relative-peers-federal-stimulus/" className="calendar-viz__link">here</a>.
      </p>
    </>
  );
};

export default May;
