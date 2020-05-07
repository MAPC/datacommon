/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';


const June = () => {
  const [employmentData, setData] = useState([]);
  const svgWidth = 1000;
  const svgHeight = 600;
  const yAxisOffset = 240;
  useEffect(() => {
    d3.csv('/assets/june2020.csv').then((result) => {
      setData(result);
    });
  }, []);

  const yAxis = d3.scaleBand()
    .range([0, 570])
    .padding(1)
    .domain(employmentData.map((d) => d['Occupation (shortened)']));

  const xAxis = d3.scaleLinear()
    .range([600, 0])
    .domain([3400, 0]);

  if (document.querySelector('svg') === null) {
    const svg = d3.select('.calendar-viz')
      .append('svg')
      .attr('width', '100%')
      .attr('height', svgHeight);

    const graph = svg.append('g')
      .attr('transform', `translate(${yAxisOffset + 12},${24})`)
      .attr('class', 'graph');

    graph.append('g')
      .call(d3.axisTop(xAxis)
        .tickFormat(d3.format('$~s')))
      .attr('class', 'xaxis')
      .style('font-size', '14px')
      .style('font-variant-numeric', 'tabular-nums')
      .style('font-family', 'Montserrat')
      .attr('text-anchor', 'middle');

    graph.append('g')
      .call(d3.axisLeft(yAxis))
      .attr('class', 'yaxis')
      .style('font-size', '10px')
      .style('font-variant-numeric', 'tabular-nums')
      .style('font-family', 'Montserrat')
      .attr('text-anchor', 'end')
      .selectAll('text')
      .call(wrap, yAxisOffset)
      .attr('dx', '-12px');

    graph.append('line')
      .style('stroke', 'black')
      .style('stroke-width', 1)
      .style('stroke-dasharray', '5, 5')
      .attr('x1', xAxis(1423))
      .attr('y1', 0)
      .attr('x2', xAxis(1423))
      .attr('y2', 600);

    graph.append('g')
      .attr('class', 'pre-ranges')
      .selectAll('min')
      .data(employmentData)
      .enter()
      .append('rect')
      .attr('class', 'pre-ranges')
      .style('fill', 'gold')
      .style('opacity', 0.5)
      .attr('x', (d) => xAxis(+d.pre_firstquartile / 52))
      .attr('y', (d) => yAxis(d['Occupation (shortened)']) - 5)
      .attr('width', (d) => xAxis(+d.pre_thirdquartile / 52) - xAxis(+d.pre_firstquartile / 52))
      .attr('height', 10);

    graph.append('g')
      .attr('class', 'post-ranges')
      .selectAll('min')
      .data(employmentData)
      .enter()
      .append('rect')
      .attr('class', 'post-ranges')
      .style('fill', 'cornflowerblue')
      .style('opacity', 0.5)
      .attr('x', (d) => xAxis(+d.post_firstquartile / 52))
      .attr('y', (d) => yAxis(d['Occupation (shortened)']) - 5)
      .attr('width', (d) => xAxis(+d.post_thirdquartile / 52) - xAxis(+d.post_firstquartile / 52))
      .attr('height', 10);

    graph.append('g')
      .attr('class', 'pre-medians')
      .selectAll('premed')
      .data(employmentData)
      .enter()
      .append('line')
      .attr('class', 'pre-medians')
      .style('stroke', 'gold')
      .style('stroke-width', 2)
      .attr('x1', (d) => xAxis(+d.pre_median / 52))
      .attr('y1', (d) => yAxis(d['Occupation (shortened)']) + 10)
      .attr('x2', (d) => xAxis(+d.pre_median / 52))
      .attr('y2', (d) => yAxis(d['Occupation (shortened)']) - 10);

    graph.append('g')
      .attr('class', 'post-medians')
      .selectAll('prostmed')
      .data(employmentData)
      .enter()
      .append('line')
      .attr('class', 'post-medians')
      .style('stroke', 'cornflowerblue')
      .style('stroke-width', 2)
      .attr('x1', (d) => xAxis(+d.post_median / 52))
      .attr('y1', (d) => yAxis(d['Occupation (shortened)']) + 10)
      .attr('x2', (d) => xAxis(+d.post_median / 52))
      .attr('y2', (d) => yAxis(d['Occupation (shortened)']) - 10);

    graph.append('g')
      .attr('class', 'connections')
      .selectAll('connect')
      .data(employmentData)
      .enter()
      .append('line')
      .attr('class', 'connections')
      .style('stroke', 'black')
      .style('stroke-width', 1)
      .attr('x1', (d) => {
        if (+d.pre_thirdquartile < +d.post_firstquartile) {
          return xAxis(+d.pre_thirdquartile / 52);
        }
        return 0;
      })
      .attr('y1', (d) => yAxis(d['Occupation (shortened)']))
      .attr('x2', (d) => {
        if (+d.pre_thirdquartile < +d.post_firstquartile) {
          return xAxis(+d.post_firstquartile / 52);
        }
        return 0;
      })
      .attr('y2', (d) => yAxis(d['Occupation (shortened)']));
  }

  return (
    <>
      <h1 className="calendar-viz__title">Untitled Unemployment Visualization</h1>
      <div className="calendar-viz container" />
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer suscipit fermentum est, nec rhoncus massa rhoncus ut. Praesent fringilla tellus sed mi condimentum dignissim. Aliquam sagittis, neque sed feugiat fermentum, elit turpis scelerisque tortor, id venenatis dui eros quis urna. Praesent sagittis justo ac sem auctor tincidunt. Duis rhoncus condimentum mauris a laoreet. Sed euismod volutpat aliquam. Aliquam porta tortor id ligula sollicitudin, in pulvinar magna pretium. Duis tristique volutpat ante, vitae mattis urna vestibulum sit amet. Donec urna elit, iaculis et cursus nec, auctor ac felis. Donec consequat neque quam, nec euismod libero iaculis nec. Duis non neque tellus. Mauris aliquet mauris in fermentum malesuada. Fusce lacinia aliquam ullamcorper. Proin ut justo in ex mollis lobortis blandit sed ante. Pellentesque suscipit nulla ac congue pellentesque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>
      <p>Pellentesque egestas ut justo quis dignissim. Nam scelerisque tristique pulvinar. Ut gravida, eros vitae sollicitudin maximus, odio orci finibus augue, congue consectetur arcu purus vitae odio. Integer non nibh id tortor dignissim interdum. Etiam iaculis quam ut ultrices lacinia. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec libero enim, pulvinar quis tincidunt at, tempor et sapien. Ut tempor magna nibh, vitae egestas justo semper bibendum. Praesent pellentesque semper mauris, a consectetur augue eleifend efficitur. Etiam rhoncus rutrum libero, eleifend varius nulla consequat id. Suspendisse nisi metus, luctus vitae sollicitudin vel, tristique at enim. Suspendisse gravida orci in nisl ultrices sagittis. Phasellus felis risus, venenatis sed dolor sed, consectetur suscipit nunc.</p>
      <p>Curabitur consequat nibh et vulputate vulputate. Pellentesque iaculis dolor eget aliquam dignissim. Mauris ut lectus quis turpis iaculis blandit quis eu justo. In at sollicitudin augue. Nullam fringilla tortor vel lacus tincidunt bibendum. Donec ac tellus id nibh posuere eleifend. Cras suscipit nisi ut justo tincidunt placerat. Maecenas efficitur vestibulum ex, ut iaculis nibh. Morbi ac turpis a nisi mollis vestibulum id ac nulla. Sed posuere orci quis eleifend tempor.</p>
      <p>Phasellus rutrum augue nisl, non euismod arcu mattis nec. Cras lacinia quam vestibulum quam ultricies malesuada. Nam ultrices dolor mauris, sit amet placerat ipsum porttitor.</p>
    </>
  );
};

function wrap(text, width) {
  text.each(function () {
    const text = d3.select(this);
    const words = text.text().split(/\s+/).reverse();
    let word;
    let line = [];
    let lineNumber = 0;
    const lineHeight = 1.1; // ems
    const y = text.attr('y');
    const dy = parseFloat(text.attr('dy'));
    let tspan = text.text(null).append('tspan').attr('x', 0).attr('y', y)
      .attr('dy', `${dy}em`);
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(' '));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(' '));
        line = [word];
        tspan = text.append('tspan').attr('x', 0).attr('y', y).attr('dy', `${++lineNumber * lineHeight + dy}em`)
          .text(word);
      }
    }
  });
}

export default June;
