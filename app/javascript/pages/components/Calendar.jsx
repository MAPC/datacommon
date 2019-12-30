import * as d3 from 'd3';
import { groups, rollup } from 'd3-array';
import React from 'react';

class Calendar extends React.Component {
  componentDidMount() {
    Promise.all([
      d3.csv('/assets/tabular.econ_es202_naics_2d_m_2001_2002_2003_2004_2005_2006_2007_2008_2009_2010_2011_2012_2013_2014_2015_2016_2017.csv', (d) => ({
        measurementDate: +d.cal_year,
        category: d.naicstitle.split(' ')
          .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
          .join(' '),
        municipality: d.municipal,
        employees: +d.estab,
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
        top: 16, right: 6, bottom: 6, left: 0,
      });
      const width = window.innerWidth || document.body.clientWidth;
      const height = (barSize * topResults) + margin.top + margin.bottom;

      const svg = d3.select('.jobs')
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

      const x = d3.scaleLinear([0, 1], [margin.left, width - margin.right]);
      const y = d3.scaleBand()
        .domain(d3.range(topResults + 1))
        .rangeRound([margin.top, margin.top + barSize * (topResults + 1 + 0.1)])
        .padding(0.1);
      const formatDate = d3.utcFormat('%Y');


      function bars(svg) {
        let bar = svg.append('g')
          .attr('fill-opacity', 0.6)
          .selectAll('rect');

        return ([date, data], transition) => bar = bar
          .data(data.slice(0, topResults), (d) => d.category)
          .join(
            (enter) => enter.append('rect')
              .attr('fill', '#0c8585')
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
          .attr('text-anchor', 'end')
          .selectAll('text');

        return ([date, data], transition) => label = label
          .data(data.slice(0, topResults), d => d.category)
          .join(
            (enter) => enter.append('text')
              .attr('transform', d => `translate(${x((prev.get(d) || d).value)},${y((prev.get(d) || d).rank)})`)
              .attr('y', y.bandwidth() / 2)
              .attr('x', -6)
              .attr('dy', '-0.25em')
              .text(d => d.category)
              .call(text => text.append('tspan')
                .attr('fill-opacity', 0.7)
                .attr('font-weight', 'normal')
                .attr('x', -6)
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
        const now = svg.append('text')
          .style('font', `bold ${barSize}px var(--sans-serif)`)
          .style('font-variant-numeric', 'tabular-nums')
          .attr('text-anchor', 'end')
          .attr('x', width - 6)
          .attr('y', margin.top + barSize * (topResults - 0.45))
          .attr('dy', '0.32em')
          .text(formatDate(allKeyframes[0][0]));

        return ([date], transition) => {
          transition.end().then(() => now.text(formatDate(date)));
        };
      }

      const updateBars = bars(svg);
      const updateAxis = axis(svg);
      const updateLabels = labels(svg);
      const updateTicker = ticker(svg);

      async function codeToRun() {
        for (let i = 0; i < allKeyframes.length; i += 1) {
          const transition = svg.transition().duration(250).ease(d3.easeLinear);
          x.domain([0, allKeyframes[i][1][0].value]);
          updateBars(allKeyframes[i], transition);
          updateLabels(allKeyframes[i], transition);
          updateAxis(allKeyframes[i], transition);
          updateTicker(allKeyframes[i], transition);
          await transition.end();
        }
      }

      codeToRun();
    });
  }

  render() {
    return (
      <section className="route Calendar">
        <div className="jobs" />
      </section>
    );
  }
}

export default Calendar;