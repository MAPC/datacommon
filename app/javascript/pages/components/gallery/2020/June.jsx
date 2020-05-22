/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';

function displayToolTip(data) {
  return `<p class="tooltip__title">${data['Occupation']}</p>
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
  const [viewBox, setViewBox] = useState([0, 0, 1000, 650]);
  useEffect(() => {
    d3.csv('/assets/june2020.csv').then((result) => {
      setData(result);
      if (window.innerWidth < 550) {
        setWidth(400);
        setViewBox([0, 0, 400, 650]);
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
      if (window.innerWidth < 550) {
        setWidth(400);
        setViewBox([0, 0, 400, 650]);
        chart.attr('viewBox', viewBox);
      } else if (window.innerWidth < 650) {
        setOffset(120);
        setWidth(500);
      } else if (window.innerWidth < 700) {
        setWidth(550);
      } else if (window.innerWidth < 850) {
        setWidth(600);
        setViewBox([0, 0, 600, 650]);
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
      .style('fill', '#FFEB7F')
      .attr('x', xAxis(+occupation.pre_firstquartile / 52))
      .attr('y', yAxis(occupation['Occupation (shortened)']) - 5)
      .attr('width', xAxis(+occupation.pre_thirdquartile / 52) - xAxis(+occupation.pre_firstquartile / 52))
      .attr('height', 10);

    barGroup.append('rect')
      .style('fill', 'cornflowerblue')
      .style('opacity', 0.5)
      .attr('x', xAxis(+occupation.post_firstquartile / 52))
      .attr('y', yAxis(occupation['Occupation (shortened)']) - 5)
      .attr('width', xAxis(+occupation.post_thirdquartile / 52) - xAxis(+occupation.post_firstquartile / 52))
      .attr('height', 10);

    barGroup.append('line')
      .style('stroke', 'gold')
      .style('stroke-width', 3)
      .attr('x1', xAxis(+occupation.pre_median / 52))
      .attr('y1', yAxis(occupation['Occupation (shortened)']) + 10)
      .attr('x2', xAxis(+occupation.pre_median / 52))
      .attr('y2', yAxis(occupation['Occupation (shortened)']) - 10);

    barGroup.append('line')
      .style('stroke', 'cornflowerblue')
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
      <h1 className="calendar-viz__title">Untitled Unemployment Visualization</h1>
      <div className="calendar-viz container">
        <svg className="calendar-viz__chart" />
        <svg className="calendar-viz__legend" height="80" width="250">
          <rect fill="gold" opacity="0.5" x="10" y="10" width="25" height="10" />
          <line x1="22.25" y1="5" x2="22.25" y2="25" strokeWidth="3" stroke="gold" />
          <text x="40" y="20" style={{'font-size': '12px', 'font-variant-numeric': 'tabular-nums', 'font-family': 'Montserrat', 'fill': '#1F4E46' }}>Weekly salary range</text>
          <text x="40" y="35" style={{'font-size': '12px', 'font-variant-numeric': 'tabular-nums', 'font-family': 'Montserrat', 'fill': '#1F4E46' }}>(1st quartile, median, 3rd quartile)</text>
          <rect fill="cornflowerblue" opacity="0.5" x="10" y="50" width="25" height="10" />
          <line x1="22.25" y1="45" x2="22.25" y2="65" strokeWidth="3" stroke="cornflowerblue" />
          <text x="40" y="60" style={{'font-size': '12px', 'font-variant-numeric': 'tabular-nums', 'font-family': 'Montserrat', 'fill': '#1F4E46' }}>Weekly benefit range</text>
          <text x="40" y="75" style={{'font-size': '12px', 'font-variant-numeric': 'tabular-nums', 'font-family': 'Montserrat', 'fill': '#1F4E46' }}>(1st quartile, median, 3rd quartile)</text>
        </svg>
      </div>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer suscipit fermentum est, nec rhoncus massa rhoncus ut. Praesent fringilla tellus sed mi condimentum dignissim. Aliquam sagittis, neque sed feugiat fermentum, elit turpis scelerisque tortor, id venenatis dui eros quis urna. Praesent sagittis justo ac sem auctor tincidunt. Duis rhoncus condimentum mauris a laoreet. Sed euismod volutpat aliquam. Aliquam porta tortor id ligula sollicitudin, in pulvinar magna pretium. Duis tristique volutpat ante, vitae mattis urna vestibulum sit amet. Donec urna elit, iaculis et cursus nec, auctor ac felis. Donec consequat neque quam, nec euismod libero iaculis nec. Duis non neque tellus. Mauris aliquet mauris in fermentum malesuada. Fusce lacinia aliquam ullamcorper. Proin ut justo in ex mollis lobortis blandit sed ante. Pellentesque suscipit nulla ac congue pellentesque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>
      <p>Pellentesque egestas ut justo quis dignissim. Nam scelerisque tristique pulvinar. Ut gravida, eros vitae sollicitudin maximus, odio orci finibus augue, congue consectetur arcu purus vitae odio. Integer non nibh id tortor dignissim interdum. Etiam iaculis quam ut ultrices lacinia. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec libero enim, pulvinar quis tincidunt at, tempor et sapien. Ut tempor magna nibh, vitae egestas justo semper bibendum. Praesent pellentesque semper mauris, a consectetur augue eleifend efficitur. Etiam rhoncus rutrum libero, eleifend varius nulla consequat id. Suspendisse nisi metus, luctus vitae sollicitudin vel, tristique at enim. Suspendisse gravida orci in nisl ultrices sagittis. Phasellus felis risus, venenatis sed dolor sed, consectetur suscipit nunc.</p>
      <p>Curabitur consequat nibh et vulputate vulputate. Pellentesque iaculis dolor eget aliquam dignissim. Mauris ut lectus quis turpis iaculis blandit quis eu justo. In at sollicitudin augue. Nullam fringilla tortor vel lacus tincidunt bibendum. Donec ac tellus id nibh posuere eleifend. Cras suscipit nisi ut justo tincidunt placerat. Maecenas efficitur vestibulum ex, ut iaculis nibh. Morbi ac turpis a nisi mollis vestibulum id ac nulla. Sed posuere orci quis eleifend tempor.</p>
      <p>Phasellus rutrum augue nisl, non euismod arcu mattis nec. Cras lacinia quam vestibulum quam ultricies malesuada. Nam ultrices dolor mauris, sit amet placerat ipsum porttitor.</p>
    </>
  );
};

export default June;
