/* eslint-disable max-len */
import * as d3 from 'd3';
import React, { useEffect } from 'react';

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
  const tooltipWidth = +getComputedStyle(document.querySelector('.tooltip')).width.slice(0, -2);
  if (xCoordinate >= 300) {
    return `${xCoordinate - tooltipWidth}px`;
  }
  return `${xCoordinate + 10}px`;
};

const tooltipTop = (yCoordinate) => {
  const tooltipHeight = +getComputedStyle(document.querySelector('.tooltip')).height.slice(0, -2);
  if (yCoordinate >= 250) {
    return `${yCoordinate - tooltipHeight - 10}px`;
  }
  return `${yCoordinate + 20}px`;
};

const drawMap = (newEngland, massachusetts, mapc, massbuilds) => {
  const projection = d3.geoAlbers()
    .scale(37000)
    .rotate([71.057, 0])
    .center([0.33, 42.37])
    .translate([960 / 2, 500 / 2]);

  const tooltip = d3.select('.tooltip');
  const marchMap = d3.select('.d3-map');
  const housingUnits = massbuilds.filter((development) => development.attributes.hu > 0);
  const commercialUnits = massbuilds.filter((development) => development.attributes.commsf > 0);

  const housingRadius = d3.scaleLinear()
    .domain(d3.extent(housingUnits.map((development) => development.attributes.hu)))
    .range([3, 10]);

  const commercialRadius = d3.scaleLinear()
    .domain(d3.extent(commercialUnits.map((development) => development.attributes.commsf)))
    .range([3, 10]);

  marchMap.append('g')
    .attr('class', 'massbuilds-points')
    .selectAll('circle')
    .data(massbuilds)
    .enter()
    .append('circle')
    .attr('cx', (development) => projection(development.geometry.coordinates)[0])
    .attr('cy', (development) => projection(development.geometry.coordinates)[1])
    .attr('r', 3)
    .attr('class', 'd3-map__point')
    .attr('fill', '#462B78')
    .attr('cursor', 'pointer')
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

  marchMap.append('g')
    .attr('class', 'd3-map__points d3-map__commercial')
    .attr('opacity', 0)
    .selectAll('circle')
    .data(commercialUnits)
    .enter()
    .append('circle')
    .attr('cx', (development) => projection(development.coordinates)[0])
    .attr('cy', (development) => projection(development.coordinates)[1])
    .attr('r', (development) => commercialRadius(development.attributes.commsf))
    .attr('opacity', 0.5)
    .attr('stroke', 'black')
    .attr('class', 'd3-map__point')
    .attr('fill', '#462B78')
    .attr('cursor', 'pointer')
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

  d3.select('.d3-map__points').raise();
};

const March = () => {
  useEffect(() => {
    Promise.all([
      d3.json('/assets/NewEngland.geojson'),
      d3.json('/assets/Massachusetts.geojson'),
      d3.json('/assets/MAPC.geojson'),
      d3.json('/assets/massbuilds.geojson'),
    ]).then((maps) => {
      const massBuilds = maps[3].features.filter((development) => development.properties.STATUS === 'in_construction'
        && development.properties.YEAR_COMPL >= 2019
        && development.properties.RPA_NAME === 'Metropolitan Area Planning Council');
      drawMap(maps[0], maps[1], maps[2], massBuilds);
    });
  }, []);
  return (
    <>
      <h1 className="calendar-viz__title">A Region Under Construction</h1>
      <div className="calendar-viz__wrapper">
        <form className="d3-map__options">
          <label htmlFor="housing" className="d3-map__option-label">
            <input
              type="radio"
              id="housing"
              name="march"
              value="housing"
              className="d3-map__option-button"
              onChange={switchView}
              onClick={() => updateSelection('housing')}
              checked={currentlySelected === 'housing'}
            />
            Housing
          </label>
          <label htmlFor="commercial" className="d3-map__option-label">
            <input
              type="radio"
              id="commercial"
              name="march"
              value="commercial"
              className="d3-map__option-button"
              onChange={switchView}
              onClick={() => updateSelection('commercial')}
              checked={currentlySelected === 'commercial'}
            />
            Commercial
          </label>
        </form>
        <D3Map
          oceanFill="#FEFDFE"
          maFill="#FCF2FB"
          newEngFill="#FCF2FB"
          mapcFill="#DDCCF1"
          mapcLine="#5a5a5a"
        />
        <div className="tooltip" />
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
