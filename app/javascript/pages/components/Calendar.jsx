import * as d3 from 'd3';
import { groups, rollup } from 'd3-array';
import React from 'react';
import refresh from '../assets/images/refresh.png';

class Calendar extends React.Component {
  componentDidMount() {
    Promise.all([
      d3.csv('/assets/econ_es202_3d_mapc.csv', (d) => ({
        measurementDate: +d.date,
        category: d.category.split(' ')
          .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
          .join(' '),
        municipality: d.name,
        employees: +d.avgemp,
      })),
    ]).then((employmentData) => {
      const filteredData = employmentData[0].filter(d => d.municipality === 'MAPC Region')
        .filter((d) => d.category !== 'Total, All Industries');

      const employmentByDate = Array.from(rollup(filteredData,
        ([d]) => d.employees,
        (d) => d.measurementDate,
        (d) => d.category))
        .map(([date, data]) => [new Date(date, 0, 1), data])
        .sort(([firstDate], [secondDate]) => d3.ascending(firstDate, secondDate)); // sort by date

      const topResults = 18;
      const barSize = 48;
      const margin = ({
        top: 16, right: 240, bottom: 6, left: 0,
      });
      const width = window.innerWidth || document.body.clientWidth;
      const height = (barSize * topResults) + margin.top + margin.bottom;

      const svg = d3.select('.jobs')
        .attr('class', 'container')
        .append('svg')
        .attr('viewBox', [0, 0, width, height]);

      const categories = new Set(filteredData.map((d) => d.category));

      function rank(value) {
        const data = Array.from(categories, (category) => ({ category, value: value(category) || 0 }));
        data.sort((a, b) => d3.descending(a.value, b.value));
        for (let i = 0; i < data.length; i += 1) data[i].rank = Math.min(topResults, i);
        return data;
      }

      function keyframes(datevalues) {
        const keyframes = [];
        let startingDate; let startingValue; let endingDate; let
          endingValue; // a starting value, b is ending value,
        for ([[startingDate, startingValue], [endingDate, endingValue]] of d3.pairs(datevalues)) {
          for (let i = 0; i < 10; i += 1) {
            // inside here we will take the values in each year and interpolate!
            const t = i / 10; // iteration divided by number of frames
            keyframes.push([
              // year and then month based on iteration.
              new Date(startingDate * (1 - t) + endingDate * t),
              rank((category) => startingValue.get(category) * (1 - t) + endingValue.get(category) * t),
            ]);
          }
        }
        // rank stays the same based on the end value.
        keyframes.push([new Date(endingDate), rank((category) => endingValue.get(category))]);
        return keyframes;
      }

      const allKeyframes = keyframes(employmentByDate);
      const nameframes = groups(allKeyframes.flatMap(([, data]) => data), (d) => d.category);
      let prev = new Map(nameframes.flatMap(([, data]) => d3.pairs(data, (a, b) => [b, a])));
      let next = new Map(nameframes.flatMap(([, data]) => d3.pairs(data)));

      const x = d3.scaleLinear([0, 1], [margin.left, width - (margin.right)]);

      const y = d3.scaleBand()
        .domain(d3.range(topResults + 1))
        .rangeRound([margin.top, margin.top + barSize * (topResults + 1 + 0.1)])
        .padding(0.1);
      const formatDate = d3.utcFormat('%Y');


      function bars(svg) {
        let bar = svg.append('g')
          .selectAll('rect');

        return ([date, data], transition) => bar = bar
          .data(data.slice(0, topResults), (d) => d.category)
          .join(
            (enter) => enter.append('rect')
              .attr('fill', '#1F4E46')
              .attr('height', y.bandwidth())
              .attr('x', x(0))
              .attr('y', (d) => y((prev.get(d) || d).rank))
              .attr('width', (d) => x((prev.get(d) || d).value) - x(0)),
            (update) => update,
            (exit) => exit.transition(transition).remove()
              .attr('y', (d) => y((next.get(d) || d).rank))
              .attr('width', (d) => x((next.get(d) || d).value) - x(0)),
          )
          .call((bar) => bar.transition(transition)
            .attr('y', (d) => y(d.rank))
            .attr('width', (d) => x(d.value) - x(0)));
      }

      function textTween(a, b) {
        const i = d3.interpolateNumber(a, b);
        return function(t) {
          this.textContent = d3.format(',d')(i(t));
        };
      }

      function labels(svg) {
        let label = svg.append('g')
          .style('font', 'bold 12px var(--sans-serif)')
          .style('font-variant-numeric', 'tabular-nums')
          .attr('text-anchor', 'right')
          .selectAll('text');

        return ([date, data], transition) => label = label
          .data(data.slice(0, topResults), d => d.category)
          .join(
            (enter) => enter.append('text')
              .attr('transform', d => `translate(${x((prev.get(d) || d).value)},${y((prev.get(d) || d).rank)})`)
              .attr('x', 6)
              .attr('y', y.bandwidth() / 1.55)
              .attr('dy', '-0.25em')
              .text(d => d.category)
              .call(text => text.append('tspan')
              .style('font-variant-numeric', 'tabular-nums')
              .attr('text-anchor', 'end')
              .attr('font-weight', 'bold')
              .attr('fill', '#FFFFFF')
              .attr('x', -6)
              .attr('y', 6)
              .attr('dy', '1.15em')),
            (update) => update,
            (exit) => exit.transition(transition).remove()
              .attr('transform', d => `translate(${x((next.get(d) || d).value)},${y((next.get(d) || d).rank)})`)
              .call(g => g.select('tspan').tween('text', d => textTween(d.value, (next.get(d) || d).value)))
          )
          .call((bar) => bar.transition(transition)
            .attr('transform', d => `translate(${x(d.value)},${y(d.rank)})`)
            .call(g => g.select('tspan').tween('text', d => textTween((prev.get(d) || d).value, d.value))))
      }

      function axis(svg) {
        const g = svg.append('g')
          .attr('transform', `translate(0,${margin.top})`);

        const axis = d3.axisTop(x)
          .ticks(width / 160)
          .tickSizeOuter(0)
          .tickSizeInner(-barSize * (topResults + y.padding()));

        return (_, transition) => {
          g.transition(transition).call(axis);
          g.select('.tick:first-of-type text').remove();
          g.selectAll('.tick:not(:first-of-type) line').attr('stroke', 'white');
          g.select('.domain').remove();
        };
      }

      function ticker(svg) {
        const now = d3.select('.jobs__subtitle')
          .append('div')
          .attr('class', 'jobs__year')
          .style('font', `bold ${barSize}px var(--sans-serif)`)
          .style('font-variant-numeric', 'tabular-nums')
          .attr('text-anchor', 'end')
          .attr('x', width - 6)
          .attr('y', margin.top + barSize * (topResults - 0.45))
          .attr('dy', '0.32em')
          .text(formatDate(allKeyframes[0][0]));

        d3.select('.jobs__subtitle')
          .append('div')
          .attr('class', 'jobs__subtitle-text')
          .text('NAICS Average Weekly Employment for MAPC Region');

        d3.select('.jobs__subtitle')
          .append('div')
          .attr('class', 'jobs__download-link')
          .text('Explore & Download Data')
          .on('click', () => window.open('https://datacommon.mapc.org/browser/datasets/388'));

        return ([date], transition) => {
          transition.end().then(() => now.text(formatDate(date))
            .style('font-size', '68px')
            .attr('fill-color', '#95989A')
            .style('font-weight', 'bold'));
        };
      }

      const updateBars = bars(svg);
      const updateAxis = axis(svg);
      const updateLabels = labels(svg);
      const updateTicker = ticker(svg);

      const replay = d3.select('svg')
        .append('g')
        .attr('class', 'replay__container')
        .attr('visibility', 'hidden');

      replay.append('image')
        .attr('href', refresh )
        .attr('class', 'replay__image')
        .attr('width', 64)
        .attr('height', 64)
        .attr('x', (width / 2) - (64 / 2))
        .attr('y', (height / 2) - (128 / 2));

      replay.append('text')
        .text('Replay')
        .attr('class', 'replay__label')
        .attr('x', (width / 2) - (128 / 2) + 20)
        .attr('y', (height / 2) - (128 / 2) + 90);


      async function runChart() {
        d3.select('.replay__container')
          .attr('visibility', 'hidden');
        for (let i = 0; i < allKeyframes.length; i += 1) {
          const transition = svg.transition().duration(250).ease(d3.easeLinear);
          x.domain([0, allKeyframes[i][1][0].value]);
          updateBars(allKeyframes[i], transition);
          updateLabels(allKeyframes[i], transition);
          updateAxis(allKeyframes[i], transition);
          updateTicker(allKeyframes[i], transition);
          await transition.end();
        }
        d3.select('.replay__container')
          .attr('visibility', 'visible');
      }

      runChart().then(() => {
        d3.select('.replay__container')
          .attr('visibility', 'visible');
        document.querySelector('.replay__container').addEventListener('click', runChart);
      });
    });
  }

  render() {
    const back = "< Back"
    return (
      <section className="route Calendar">
        <div className="container">
          <a href="/" className="back-link">{back}</a>
          <h1 className="jobs__title">Employment by Industry</h1>
          <div className="jobs" />
          <h2 className="jobs__subtitle"></h2>
          <div className="container jobs__explanation">
            <p>Metro Boston has experienced rapid economic growth over the past two decades. Although the region experienced periods of employment decline during both national recessions, employment in Metro Boston has grown to exceed previous peaks. Professional and Technical Services, Educational Services, and Food Services and Drinking Places have remained the region’s top industries since 2001 and together experienced 34% growth from 2001-2017. Healthcare comes in as one of the region’s other top employing sectors with Hospitals and Ambulatory Health Care Services rising to the 4th and 6th largest employing industries in 2017.</p>
            <p>While the MAPC region has experienced rapid increases in employment overall, some industries with historically middle-wage occupations have seen declines in employment including Public Administration, Manufacturing, and Utilities. Occupations in these industries include positions such as tax examiners and forklift operators and have often been known to create stable, middle-income jobs.</p>
            <p>The declines in these middle-income occupations, along with the rapid increases in high-wage business and health care jobs and low-wage food service and hospitality jobs, have created an environment ripe for increased wage polarization. The region’s prosperity depends not only on job growth and the continued competitiveness of the region’s economy, but also high quality of life for all its residents. With rising housing, transportation, healthcare, and childcare costs it is becoming even more difficult for low-wage employees to achieve this quality of life. While Massachusetts has increased the minimum wage in recent years, the state should tie the minimum wage to inflation ensuring wages remain stable. In addition, the state should require companies to pay tipped workers at least $15 an hour. Without ensuring stable, living wages for all employees, job growth in the region amounts to little.</p>
          </div>
        </div>
      </section>
    );
  }
}

export default Calendar;
