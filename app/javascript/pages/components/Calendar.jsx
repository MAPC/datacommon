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
      const filteredData = employmentData[0].filter((d) => d.municipality === 'MAPC Region')
        .filter((d) => d.category !== 'Total, All Industries');

      const employmentByDate = Array.from(rollup(filteredData,
        ([d]) => d.employees,
        (d) => d.measurementDate,
        (d) => d.category))
        .map(([date, data]) => [new Date(date, 0, 1), data])
        .sort(([firstDate], [secondDate]) => d3.ascending(firstDate, secondDate)); // sort by date

      const topResults = 18;
      const barSize = 48;
      const width = window.innerWidth || document.body.clientWidth;
      let margin;
      if (width > 500) {
        margin = ({
          top: 16, right: 450, bottom: 6, left: 0,
        });
      } else {
        margin = ({
          top: 16, right: 0, bottom: 6, left: 0,
        });
      }
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
      const prev = new Map(nameframes.flatMap(([, data]) => d3.pairs(data, (a, b) => [b, a])));
      const next = new Map(nameframes.flatMap(([, data]) => d3.pairs(data)));

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
        return function (t) {
          this.textContent = d3.format(',d')(i(t));
        };
      }

      function labels(svg) {
        let label = svg.append('g')
          .style('font-size', '24px')
          .style('font-variant-numeric', 'tabular-nums')
          .style('font-family', 'Montserrat')
          .attr('text-anchor', 'right')
          .selectAll('text');

        return ([date, data], transition) => label = label
          .data(data.slice(0, topResults), (d) => d.category)
          .join(
            (enter) => enter.append('text')
              .attr('transform', (d) => `translate(${x((prev.get(d) || d).value)},${y((prev.get(d) || d).rank)})`)
              .attr('x', 6)
              .attr('y', y.bandwidth() / 1.55)
              .attr('dy', '0.1em')
              .style('font-weight', 'lighter')
              .style('fill', '#1F4E46')
              .text((d) => d.category)
              .call((text) => text.append('tspan')
                .style('font-variant-numeric', 'tabular-nums')
                .attr('text-anchor', 'end')
                .attr('fill', '#FFFFFF')
                .attr('x', -6)
                .attr('y', 6)
                .attr('dy', '1em')),
            (update) => update,
            (exit) => exit.transition(transition).remove()
              .attr('transform', (d) => `translate(${x((next.get(d) || d).value)},${y((next.get(d) || d).rank)})`)
              .call((g) => g.select('tspan').tween('text', (d) => textTween(d.value, (next.get(d) || d).value))),
          )
          .call((bar) => bar.transition(transition)
            .attr('transform', (d) => `translate(${x(d.value)},${y(d.rank)})`)
            .call((g) => g.select('tspan').tween('text', (d) => textTween((prev.get(d) || d).value, d.value))));
      }

      function axis(svg) {
        const g = svg.append('g')
          .attr('transform', `translate(0,${margin.top})`);

        const axis = d3.axisTop(x)
          .ticks(width / 160)
          .tickSizeOuter(0)
          .tickSizeInner(-barSize * (topResults + y.padding()))
          .tickFormat(d3.format('~s'));

        return (_, transition) => {
          g.transition(transition).call(axis);
          g.select('.tick:first-of-type text').remove();
          g.selectAll('.tick:not(:first-of-type) line').attr('stroke', 'white');
          g.selectAll('.tick > text').style('font-size', '18px');
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
          .text('NAICS Average Monthly Employment for MAPC Region');

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
        .attr('href', refresh)
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
    const back = '<< Back to 2020 Gallery';
    return (
      <section className="route Calendar">
        <div className="container">
          <a href="/gallery" className="back-link">{back}</a>
          <h1 className="jobs__title">Employment by Industry</h1>
          <div className="jobs" />
          <h2 className="jobs__subtitle" />
          <div className="container jobs__explanation">
            <p>Metro Boston has experienced rapid economic growth over the past two decades. Although the region experienced periods of employment decline during the 2001 and 2008 national recessions, its employment today is 10% above its previous peak set in 2001. Its top three employing industries since 2001—Professional and Technical Services, Educational Services, and Food Services and Drinking Places—together grew 38% from 2001 to 2018. Healthcare and social assistance industries account for a quarter of jobs among the region’s top 15 industries in 2018, and have seen 89% job growth since 2001. Jobs in Social Assistance, such as those in individual and family services and child day care, were the fastest growing among the region’s top 15, at 116%.</p>
            <p>Average wages in the region across all industries grew 15% (in real dollars) between 2001 and 2018. Yet, looking at wages in the region’s largest individual industries, wage growth has been polarized. Average weekly wages in Social Assistance—the top growing industry among the top 15—declined 4% from an already low $662 per week to $638, in 2018 dollars. Wages in Food Services and Drinking Places, the third largest industry and that with the lowest wages among the top 15, grew only 7%, from $457 to $489. On the other hand, wages in Professional and Technical Services grew 28%, from $2,163 to $2,774, and wages in Financial Investment and Related Activity, already the highest among the top 15, grew the fastest at 39%, from $4,520 to $6,305.</p>
            <p>The region’s prosperity depends not only on job growth and the continued competitiveness of the region’s economy, but also high quality of life for all its residents. With rising housing, transportation, healthcare, and childcare costs it is becoming even more difficult for low-wage employees to achieve this quality of life. While Massachusetts has increased the minimum wage in recent years, the state‘s policies should go further to ensure stability and prosperity for its lowest income workers, such as tying the minimum wage to inflation and requiring companies to pay tipped workers at least $15 an hour. Without ensuring stable, living wages for all employees, job growth in the region amounts to little.</p>
          </div>
        </div>
      </section>
    );
  }
}

export default Calendar;
