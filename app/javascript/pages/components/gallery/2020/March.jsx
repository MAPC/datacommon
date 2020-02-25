/* eslint-disable max-len */
import * as d3 from 'd3';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import D3Map from '../D3Map';
import MapSelection from '../MapSelection';

const tooltipHtml = (development) => {
  let tooltipDetails = `<p class='tooltip__title'>${development.attributes.name}</p>
  <ul class='tooltip__list'>
  <li class='tooltip__text'>Est. completion in ${development.attributes.year_compl}</li>`;
  if (development.attributes.hu) {
    tooltipDetails += `<li class='tooltip__text'>${d3.format(',')(development.attributes.hu)} housing units</li>`;
  }
  if (development.attributes.commsf) {
    tooltipDetails += `<li class='tooltip__text'>${d3.format(',')(development.attributes.commsf)} square feet of commercial space</li>`;
  }
  tooltipDetails += '</ul>';
  return tooltipDetails;
};

const tooltipLeft = (xCoordinate) => {
  const tooltipWidth = +getComputedStyle(document.querySelector('.d3-map__tooltip')).width.slice(0, -2);
  if (xCoordinate >= 300) {
    return `${xCoordinate - tooltipWidth}px`;
  }
  return `${xCoordinate + 10}px`;
};

const tooltipTop = (yCoordinate) => {
  const tooltipHeight = +getComputedStyle(document.querySelector('.d3-map__tooltip')).height.slice(0, -2);
  if (yCoordinate >= 250) {
    return `${yCoordinate - tooltipHeight - 10}px`;
  }
  return `${yCoordinate + 20}px`;
};

const mapView = (data, selection) => {
  d3.selectAll('.d3-map__points').remove();
  const projection = d3.geoAlbers()
    .scale(37000)
    .rotate([71.057, 0])
    .center([0.33, 42.37])
    .translate([960 / 2, 500 / 2]);

  const tooltip = d3.select('.d3-map__tooltip');
  const marchMap = d3.select('.d3-map');
  let radius;
  if (selection === 'housing') {
    radius = d3.scaleLinear()
      .domain(d3.extent(data.map((development) => development.attributes.hu)))
      .range([3, 10]);
  } else {
    radius = d3.scaleLinear()
      .domain(d3.extent(data.map((development) => development.attributes.commsf)))
      .range([3, 10]);
  }

  const data2020 = data.filter((d) => d.attributes.year_compl === 2020);
  const data2021 = data.filter((d) => d.attributes.year_compl === 2021);
  const data2022 = data.filter((d) => d.attributes.year_compl === 2022);
  const data2023 = data.filter((d) => d.attributes.year_compl === 2023);
  const data2024 = data.filter((d) => d.attributes.year_compl === 2024);
  const data2025 = data.filter((d) => d.attributes.year_compl === 2025);
  const dataPool = [data2020, data2021, data2022, data2023, data2024, data2025];
  let position = 0;
  let iterator;
  let year = 2020;

  const updateVisualization = () => {
    d3.select('.d3-map__year').text(year);
    marchMap.selectAll('.d3-map__point')
      .attr('fill', '#462B78')
      .attr('opacity', 0.6);
    marchMap.append('g')
      .attr('class', 'd3-map__points')
      .selectAll('circle')
      .data(dataPool[position])
      .enter()
      .append('circle')
      .attr('cx', (development) => projection(development.coordinates)[0])
      .attr('cy', (development) => projection(development.coordinates)[1])
      .attr('r', (development) => {
        if (selection === 'housing') {
          return radius(development.attributes.hu);
        }
        return radius(development.attributes.commsf);
      })
      .attr('class', 'd3-map__point')
      .attr('cursor', 'pointer')
      .attr('fill', '#8544CC')
      .on('mousemove', (development) => {
        tooltip.transition()
          .duration(50)
          .style('opacity', 0.9);
        tooltip.html(tooltipHtml(development))
          .style('left', tooltipLeft(projection(development.coordinates)[0]))
          .style('top', tooltipTop(projection(development.coordinates)[1]));
      })
      .on('mouseleave', () => {
        tooltip.transition()
          .duration(200)
          .style('opacity', 0);
      });
    year += 1;
    position += 1;
    if (position >= dataPool.length) {
      clearInterval(iterator);
      year = 2020;
    }
  };

  d3.select('.d3-map__points').raise();
  iterator = setInterval(updateVisualization, 3000);
};

const March = () => {
  const [currentlySelected, updateSelection] = useState('housing');
  useEffect(() => {
    const massBuildsUrl = 'https://api.massbuilds.com/developments?filter%5Bstatus%5D%5Bcol%5D=status&filter%5Bstatus%5D%5Bname%5D=Status&filter%5Bstatus%5D%5BglossaryKey%5D=STATUS&filter%5Bstatus%5D%5Btype%5D=string&filter%5Bstatus%5D%5Boptions%5D%5B%5D=completed&filter%5Bstatus%5D%5Boptions%5D%5B%5D=in_construction&filter%5Bstatus%5D%5Boptions%5D%5B%5D=planning&filter%5Bstatus%5D%5Boptions%5D%5B%5D=projected&filter%5Bstatus%5D%5Bfilter%5D=metric&filter%5Bstatus%5D%5Bvalue%5D=in_construction&filter%5Bstatus%5D%5Binflector%5D=eq&filter%5Byear_compl%5D%5Bcol%5D=year_compl&filter%5Byear_compl%5D%5Bname%5D=Year%20complete&filter%5Byear_compl%5D%5BglossaryKey%5D=YEAR_COMPLETE&filter%5Byear_compl%5D%5Btype%5D=number&filter%5Byear_compl%5D%5Bfilter%5D=metric&filter%5Byear_compl%5D%5Bvalue%5D=2019&filter%5Byear_compl%5D%5Binflector%5D=%3E';
    axios.get(massBuildsUrl, { headers: { Accept: 'application/vnd.api+json' } }).then((mapData) => {
      const massbuilds = mapData.data.data.filter((development) => development.attributes.rpa_name === 'Metropolitan Area Planning Council')
        .map((development) => ({ attributes: development.attributes, coordinates: [development.attributes.longitude, development.attributes.latitude] }));
      const housingData = massbuilds.filter((development) => development.attributes.hu > 0);
      const commercialData = massbuilds.filter((development) => development.attributes.commsf > 0);

      if (currentlySelected === 'housing') {
        mapView(housingData, 'housing');
      } else {
        mapView(commercialData, 'commercial');
      }
      d3.select('.d3-map__year').text(2020);
    });
  }, [currentlySelected]);

  return (
    <>
      <h1 className="calendar-viz__title">A Region Under Construction</h1>
      <div className="calendar-viz__wrapper">
        <form className="d3-map__options">
          <MapSelection
            option="housing"
            mapName="march"
            currentlySelected={currentlySelected}
            updateSelection={updateSelection}
          />
          <MapSelection
            option="commercial"
            mapName="march"
            currentlySelected={currentlySelected}
            updateSelection={updateSelection}
          />
        </form>
        <D3Map
          oceanFill="#FEFDFE"
          maFill="#FCF2FB"
          newEngFill="#FCF2FB"
          mapcFill="#DDCCF1"
          mapcLine="#5a5a5a"
        />
        <div className="d3-map__tooltip" />
        <div className="d3-map__year">2020</div>
      </div>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sapien faucibus et molestie ac feugiat sed lectus vestibulum. Ultricies mi quis hendrerit dolor magna eget. Commodo elit at imperdiet dui accumsan sit amet nulla. Imperdiet sed euismod nisi porta lorem mollis aliquam ut porttitor. At in tellus integer feugiat scelerisque. Eget duis at tellus at urna condimentum. Lectus mauris ultrices eros in cursus turpis massa tincidunt dui. Aliquet risus feugiat in ante metus dictum at tempor. Egestas sed tempus urna et pharetra pharetra.</p>
      <p>Morbi leo urna molestie at elementum eu facilisis sed odio. Adipiscing diam donec adipiscing tristique risus nec. Vitae suscipit tellus mauris a diam maecenas sed enim ut. Vel quam elementum pulvinar etiam non quam. Arcu felis bibendum ut tristique et egestas quis ipsum suspendisse. Feugiat sed lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi. Praesent semper feugiat nibh sed pulvinar proin. Duis ultricies lacus sed turpis. Massa id neque aliquam vestibulum. Ac tortor vitae purus faucibus ornare suspendisse sed nisi.</p>
      <p>Tempor orci dapibus ultrices in. Auctor augue mauris augue neque gravida in fermentum et sollicitudin. Ante metus dictum at tempor. Nulla facilisi cras fermentum odio eu feugiat. Enim sit amet venenatis urna cursus eget nunc. Enim nunc faucibus a pellentesque. Fames ac turpis egestas sed tempus urna. Nunc aliquet bibendum enim facilisis gravida neque. Ultricies leo integer malesuada nunc vel risus commodo. Mi eget mauris pharetra et ultrices neque. Enim eu turpis egestas pretium aenean. Elementum nibh tellus molestie nunc non blandit massa enim. Euismod quis viverra nibh cras pulvinar mattis nunc. Faucibus purus in massa tempor nec feugiat nisl pretium.</p>
      <p>Dictum varius duis at consectetur lorem. Quam nulla porttitor massa id neque aliquam. Neque viverra justo nec ultrices dui sapien eget mi proin. Dignissim sodales ut eu sem integer vitae justo eget. Elit eget gravida cum sociis natoque penatibus et. Dictumst vestibulum rhoncus est pellentesque elit. Volutpat lacus laoreet non curabitur. Cras ornare arcu dui vivamus arcu. Magna fermentum iaculis eu non diam. Posuere ac ut consequat semper. Dignissim suspendisse in est ante in nibh mauris cursus. Sed cras ornare arcu dui vivamus. Mauris nunc congue nisi vitae suscipit tellus mauris. Urna porttitor rhoncus dolor purus non enim praesent. Tristique sollicitudin nibh sit amet commodo nulla facilisi. Congue nisi vitae suscipit tellus mauris. Id cursus metus aliquam eleifend mi in nulla. Turpis massa sed elementum tempus. Dictum sit amet justo donec enim diam vulputate ut. Aliquet sagittis id consectetur purus ut faucibus pulvinar elementum integer.</p>
      <p>Ipsum a arcu cursus vitae. Rhoncus est pellentesque elit ullamcorper dignissim cras tincidunt lobortis. Ac felis donec et odio. Vel quam elementum pulvinar etiam non quam lacus. Quam adipiscing vitae proin sagittis nisl rhoncus. Cursus mattis molestie a iaculis at erat pellentesque. Pretium lectus quam id leo in. Molestie nunc non blandit massa. Vitae proin sagittis nisl rhoncus mattis rhoncus urna. In nibh mauris cursus mattis molestie. Mi in nulla posuere sollicitudin aliquam ultrices sagittis orci. Et molestie ac feugiat sed lectus vestibulum. Feugiat sed lectus vestibulum mattis ullamcorper. Viverra justo nec ultrices dui sapien eget mi proin. Ipsum consequat nisl vel pretium. Eget felis eget nunc lobortis. Pharetra sit amet aliquam id diam maecenas.</p>
    </>
  );
};

export default March;
