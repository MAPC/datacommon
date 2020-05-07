/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';


const June = () => {
  const [employmentData, setData] = useState([]);
  const svgWidth = 1000;
  const svgHeight = 600;
  const yAxisOffset = 385;
  useEffect(() => {
    d3.csv('/assets/june2020.csv').then((result) => {
      setData(result);
    });
  }, []);
  const yAxis = d3.scaleBand()
    .range([0, 570])
    .padding(0.1)
    .domain(employmentData.map((d) => d['Occupation (shortened)']));

  const xAxis = d3.scaleLinear()
    .range([500, 0])
    .domain([1500, 400]);

  if (document.querySelector('svg') === null) {
    const svg = d3.select('.calendar-viz')
      .append('svg')
      .style('border', '1px solid blue')
      .attr('width', svgWidth)
      .attr('height', svgHeight);

    const graph = svg.append('g')
      .attr('transform', `translate(${yAxisOffset},${24})`)
      .attr('class', 'graph');

    graph.append('g')
      .call(d3.axisTop(xAxis)
        .tickFormat(d3.format('~s')))
      .attr('class', 'xaxis')
      .style('font-size', '16px')
      .style('font-variant-numeric', 'tabular-nums')
      .style('font-family', 'Montserrat')
      .attr('text-anchor', 'right')
      .selectAll('text')
      .attr('dx', '-1em');

    graph.append('g')
      .call(d3.axisLeft(yAxis))
      .attr('class', 'yaxis')
      .style('font-size', '16px')
      .style('font-variant-numeric', 'tabular-nums')
      .style('font-family', 'Montserrat')
      .attr('text-anchor', 'end')
      .selectAll('text');
  }

  return (
    <>
      <h1 className="calendar-viz__title">Untitled Unemployment Visualization</h1>
      <div className="calendar-viz container" style={{ border: '1px solid red' }} />
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer suscipit fermentum est, nec rhoncus massa rhoncus ut. Praesent fringilla tellus sed mi condimentum dignissim. Aliquam sagittis, neque sed feugiat fermentum, elit turpis scelerisque tortor, id venenatis dui eros quis urna. Praesent sagittis justo ac sem auctor tincidunt. Duis rhoncus condimentum mauris a laoreet. Sed euismod volutpat aliquam. Aliquam porta tortor id ligula sollicitudin, in pulvinar magna pretium. Duis tristique volutpat ante, vitae mattis urna vestibulum sit amet. Donec urna elit, iaculis et cursus nec, auctor ac felis. Donec consequat neque quam, nec euismod libero iaculis nec. Duis non neque tellus. Mauris aliquet mauris in fermentum malesuada. Fusce lacinia aliquam ullamcorper. Proin ut justo in ex mollis lobortis blandit sed ante. Pellentesque suscipit nulla ac congue pellentesque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>
      <p>Pellentesque egestas ut justo quis dignissim. Nam scelerisque tristique pulvinar. Ut gravida, eros vitae sollicitudin maximus, odio orci finibus augue, congue consectetur arcu purus vitae odio. Integer non nibh id tortor dignissim interdum. Etiam iaculis quam ut ultrices lacinia. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec libero enim, pulvinar quis tincidunt at, tempor et sapien. Ut tempor magna nibh, vitae egestas justo semper bibendum. Praesent pellentesque semper mauris, a consectetur augue eleifend efficitur. Etiam rhoncus rutrum libero, eleifend varius nulla consequat id. Suspendisse nisi metus, luctus vitae sollicitudin vel, tristique at enim. Suspendisse gravida orci in nisl ultrices sagittis. Phasellus felis risus, venenatis sed dolor sed, consectetur suscipit nunc.</p>
      <p>Curabitur consequat nibh et vulputate vulputate. Pellentesque iaculis dolor eget aliquam dignissim. Mauris ut lectus quis turpis iaculis blandit quis eu justo. In at sollicitudin augue. Nullam fringilla tortor vel lacus tincidunt bibendum. Donec ac tellus id nibh posuere eleifend. Cras suscipit nisi ut justo tincidunt placerat. Maecenas efficitur vestibulum ex, ut iaculis nibh. Morbi ac turpis a nisi mollis vestibulum id ac nulla. Sed posuere orci quis eleifend tempor.</p>
      <p>Phasellus rutrum augue nisl, non euismod arcu mattis nec. Cras lacinia quam vestibulum quam ultricies malesuada. Nam ultrices dolor mauris, sit amet placerat ipsum porttitor.</p>
    </>
  );
};

export default June;
