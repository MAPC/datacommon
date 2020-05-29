/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';

function displayToolTip(data) {
  return `<p class="tooltip__title">${data.Occupation}</p>
    <ul class='tooltip__list'>
      <li class='tooltip__text'>Median weekly salary: ${d3.format('$,.2f')(data.pre_median / 52)}</li>
      <li class='tooltip__text'>Median weekly unemployment benefit: ${d3.format('$,.2f')(data.post_median / 52)}</li>
    </ul>`;
}

function tooltipLeft(event, tooltip) {
  return `${event.clientX - tooltip.offsetWidth + 20}px`;
}

function tooltipTop(event, tooltip) {
  return `${event.pageY - tooltip.offsetHeight - 10}px`;
}

function wrap(text, width) {
  text.each(function () {
    const text = d3.select(this);
    const words = text.text().split(/\s+/).reverse();
    let word;
    let line = [];
    let lineNumber = 0;
    const lineHeight = 0.6; // ems
    const y = text.attr('y');
    const dy = parseFloat(text.attr('dy'));
    let tspan = text.text(null).append('tspan').attr('x', 0).attr('y', y)
      .attr('dy', `${dy}em`);
    tspan.attr('class', 'top-line');
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(' '));
      if (tspan.node().getComputedTextLength() > width) {
        tspan.attr('y', y - 7);
        line.pop();
        tspan.text(line.join(' '));
        line = [word];
        tspan = text.append('tspan').attr('x', -12).attr('y', y).attr('dy', `${++lineNumber * lineHeight + dy}em`)
          .text(word);
      }
    }
  });
}

const June = () => {
  const [employmentData, setData] = useState([]);
  const [svgWidth, setWidth] = useState(1000);
  const [svgHeight, setHeight] = useState(650);
  const [yAxisOffset, setOffset] = useState(165);
  useEffect(() => {
    d3.csv('/assets/june2020.csv').then((result) => {
      setData(result);
      if (window.innerWidth < 400) {
        setWidth(300);
      } else if (window.innerWidth < 460) {
        setOffset(110);
        setWidth(350);
      } else if (window.innerWidth < 550) {
        setWidth(400);
      } else if (window.innerWidth < 650) {
        setOffset(120);
        setWidth(500);
      } else if (window.innerWidth < 700) {
        setWidth(550);
      } else if (window.innerWidth < 850) {
        setWidth(600);
      } else if (window.innerWidth < 1000) {
        setWidth(750);
      } else if (window.innerWidth < 1200) {
        setWidth(900);
      } else {
        setHeight(650);
        setWidth(1000);
        setOffset(165);
      }
    });
  }, []);

  useEffect(() => {
    window.addEventListener('resize', () => {
      const chart = d3.select('calendar-viz__chart');
      if (window.innerWidth < 460) {
        setOffset(110);
        setWidth(350);
      } else if (window.innerWidth < 550) {
        setWidth(400);
      } else if (window.innerWidth < 650) {
        setOffset(120);
        setWidth(500);
      } else if (window.innerWidth < 700) {
        setWidth(550);
      } else if (window.innerWidth < 850) {
        setWidth(600);
      } else if (window.innerWidth < 1000) {
        setWidth(750);
      } else if (window.innerWidth < 1200) {
        setWidth(900);
      } else {
        setHeight(650);
        setWidth(1000);
        setOffset(165);
      }
      chart.attr('width', svgWidth);
      chart.attr('height', svgHeight);
    });
  });
  d3.selectAll('.tooltip').remove();

  const yAxis = d3.scaleBand()
    .range([0, svgHeight - 20])
    .padding(1)
    .domain(employmentData.map((d) => d['Occupation (shortened)']));

  const xAxis = d3.scaleLinear()
    .range([svgWidth - yAxisOffset, 0])
    .domain([3400, 0]);

  if (d3.select('.graph')) {
    d3.select('.graph').remove();
  }

  const svg = d3.select('.calendar-viz__chart')
    .attr('height', svgHeight)
    .attr('width', svgWidth);

  const tooltip = d3.select('body').append('div').attr('class', 'tooltip');

  const graph = svg.append('g')
    .attr('transform', `translate(${yAxisOffset + 12},${24})`)
    .attr('class', 'graph');

  graph.append('g')
    .call(d3.axisTop(xAxis)
      .tickFormat(d3.format('$~s')))
    .attr('class', 'xaxis')
    .style('font-size', '12px')
    .style('font-variant-numeric', 'tabular-nums')
    .style('font-family', 'Montserrat')
    .attr('text-anchor', 'middle');

  graph.append('g')
    .call(d3.axisLeft(yAxis))
    .attr('class', 'yaxis')
    .style('font-size', '12px')
    .style('font-variant-numeric', 'tabular-nums')
    .style('font-family', 'Montserrat')
    .attr('text-anchor', 'end')
    .selectAll('text')
    .call(wrap, yAxisOffset)
    .attr('dx', '-12px');

  graph.append('line')
    .style('stroke', '#1F4E46')
    .style('opacity', 0.3)
    .style('stroke-width', 1)
    .style('stroke-dasharray', '5, 5')
    .attr('x1', xAxis(1423))
    .attr('y1', 0)
    .attr('x2', xAxis(1423))
    .attr('y2', svgHeight);

  graph.append('text')
    .style('font-size', '12px')
    .style('font-variant-numeric', 'tabular-nums')
    .style('font-family', 'Montserrat')
    .style('fill', '#1F4E46')
    .attr('x', xAxis(1423) + 5)
    .attr('y', yAxis('Personal Care'))
    .text('Max. weekly');

  graph.append('text')
    .style('font-size', '12px')
    .style('font-variant-numeric', 'tabular-nums')
    .style('font-family', 'Montserrat')
    .style('fill', '#1F4E46')
    .attr('x', xAxis(1423) + 5)
    .attr('y', yAxis('Personal Care') + 16)
    .text('benefit ($1,423)');

  employmentData.forEach((occupation) => {
    const barGroup = graph.append('g').attr('class', `soc__${occupation.soc_2}`);

    barGroup.append('rect')
      .style('fill', '#F67D41') // orange
      .style('opacity', 0.6)
      .attr('x', xAxis(+occupation.pre_firstquartile / 52))
      .attr('y', yAxis(occupation['Occupation (shortened)']) - 5)
      .attr('width', xAxis(+occupation.pre_thirdquartile / 52) - xAxis(+occupation.pre_firstquartile / 52))
      .attr('height', 10);

    barGroup.append('rect')
      .style('fill', '#0097C4') // blue
      .style('opacity', 0.6)
      .attr('x', xAxis(+occupation.post_firstquartile / 52))
      .attr('y', yAxis(occupation['Occupation (shortened)']) - 5)
      .attr('width', xAxis(+occupation.post_thirdquartile / 52) - xAxis(+occupation.post_firstquartile / 52))
      .attr('height', 10);

    barGroup.append('line')
      .style('stroke', '#F67D41')
      .style('stroke-width', 3)
      .attr('x1', xAxis(+occupation.pre_median / 52))
      .attr('y1', yAxis(occupation['Occupation (shortened)']) + 10)
      .attr('x2', xAxis(+occupation.pre_median / 52))
      .attr('y2', yAxis(occupation['Occupation (shortened)']) - 10);

    barGroup.append('line')
      .style('stroke', '#0097C4')
      .style('stroke-width', 3)
      .attr('x1', xAxis(+occupation.post_median / 52))
      .attr('y1', yAxis(occupation['Occupation (shortened)']) + 10)
      .attr('x2', xAxis(+occupation.post_median / 52))
      .attr('y2', yAxis(occupation['Occupation (shortened)']) - 10);

    barGroup.append('line')
      .style('stroke', '#1F4E46')
      .style('opacity', 0.5)
      .style('stroke-width', 1)
      .attr('x1', () => {
        if (+occupation.pre_thirdquartile < +occupation.post_firstquartile) {
          return xAxis(+occupation.pre_thirdquartile / 52);
        }
        return 0;
      })
      .attr('y1', yAxis(occupation['Occupation (shortened)']))
      .attr('x2', () => {
        if (+occupation.pre_thirdquartile < +occupation.post_firstquartile) {
          return xAxis(+occupation.post_firstquartile / 52);
        }
        return 0;
      })
      .attr('y2', yAxis(occupation['Occupation (shortened)']));

    barGroup.on('mousemove', () => {
      tooltip.html(displayToolTip(occupation));
      tooltip.style('display', 'inline')
        .style('left', tooltipLeft(d3.event, document.getElementsByClassName('tooltip')[0]))
        .style('top', tooltipTop(d3.event, document.getElementsByClassName('tooltip')[0]));
    })
      .on('mouseleave', () => { tooltip.style('display', 'none'); });
  });

  return (
    <>
      <h1 className="calendar-viz__title">Unemployment Under the Federal CARES Act</h1>
      <div className="calendar-viz">
        <svg className="calendar-viz__chart" />
        <svg className="calendar-viz__legend" height="120" width="250">
          <rect fill="#F67D41" opacity="0.6" x="10" y="10" width="25" height="10" />
          <line x1="22.25" y1="5" x2="22.25" y2="25" strokeWidth="3" stroke="#F67D41" />
          <text
            x="40"
            y="20"
            style={{
              'font-size': '12px', 'font-variant-numeric': 'tabular-nums', 'font-family': 'Montserrat', fill: '#95989A',
            }}
          >
Weekly salary range
          </text>
          <text
            x="40"
            y="35"
            style={{
              'font-size': '12px', 'font-variant-numeric': 'tabular-nums', 'font-family': 'Montserrat', fill: '#95989A',
            }}
          >
(1st quartile, median, 3rd quartile)
          </text>
          <rect fill="#0097C4" opacity="0.6" x="10" y="50" width="25" height="10" />
          <line x1="22.25" y1="45" x2="22.25" y2="65" strokeWidth="3" stroke="#0097C4" />
          <text
            x="40"
            y="60"
            style={{
              'font-size': '12px', 'font-variant-numeric': 'tabular-nums', 'font-family': 'Montserrat', fill: '#95989A',
            }}
          >
Weekly benefit range
          </text>
          <text
            x="40"
            y="75"
            style={{
              'font-size': '12px', 'font-variant-numeric': 'tabular-nums', 'font-family': 'Montserrat', fill: '#95989A',
            }}
          >
(1st quartile, median, 3rd quartile)
          </text>
          <a href="https://datacommon.mapc.org/browser/datasets/414"><text x="40" y="105" className="calendar-viz__download-link" style={{ 'font-size': '20px' }}>Explore & Download Data</text></a>
        </svg>
      </div>
      <p>From March 16 through May 28, over 890,000 workers in Massachusetts filed for unemployment benefits. The weekly monetary benefits, typically calculated as half of the worker’s expected weekly wages (with the benefit capped at $823), have temporarily increased by $600 as a result of the Federal CARES Act. With the additional benefit, which will end in Massachusetts on July 25, any worker making less than $1,200 a week ($62,400 a year) before the loss of their job is seeing an increase in household income as a result of unemployment payments. We estimate that 62% of all eligible workers would experience an increase in wages as a result of the expanded unemployment benefits.</p>
      <p>This visualization exposes how vulnerable many households were before the crisis. The horizontal orange and blue bars represent the range of wages and expected weekly unemployment benefits for the middle 50% of workers. The darker vertical lines indicate the median wages and benefits. The further to the left the median wage is from the median benefit, the more additional money an unemployed worker in that occupation is likely to collect in benefits over what they would earn if employed. For example, an unemployed pharmacy sales clerk or grocery store cashier may make more than one who is unemployed.</p>
      <p>The chart also show that those whose wages are most exceeded by potential unemployment benefits are in occupations widely considered essential. Many of those for whom new employment will mean a reduced income will simultaneously face a heightened job-associated risk of exposure to the coronavirus. There are also, of course, many workers, such as those without documents, who when laid off are unable to receive federal assistance at all.</p>
      <p>This data shows the multiple burdens borne by lower income groups – even as these groups perform what are now understood to be critical work. Long-term solutions to raise wages, improve financial security, and provide housing security will help both the vulnerable households and the entire region as we seek ways to emerge from COVID-19 stronger than before.</p>
    </>
  );
};

export default June;
