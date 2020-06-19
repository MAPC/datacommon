import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiaWhpbGwiLCJhIjoiY2plZzUwMTRzMW45NjJxb2R2Z2thOWF1YiJ9.szIAeMS4c9YTgNsJeG36gg';
const July = () => {
  const colors = ['#FFFFFF', '#fee5da', '#fdae95', '#fd6a52', '#e02d2f', '#74004b'];
  let zoom = 8.4;
  let center = [-70.944, 42.37];
  if (window.innerWidth <= 480) {
    zoom = 7.75;
    center = [-71.043, 42.372];
  } else if (window.innerWidth <= 670) {
    zoom = 8.27;
    center = [-71.047, 42.377];
  } else if (window.innerWidth <= 770) {
    zoom = 8.4;
    center = [-71.039, 42.37];
  }

  const [julyMap, setMap] = useState();
  const [borderState, setBorderVisibility] = useState(false);
  const [roadState, setRoadVisibility] = useState(false);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: 'julyMap',
      zoom,
      minZoom: 6,
      maxZoom: 13,
      center,
      maxBounds: [
        [-74.728, 38.167], // Southwest bound
        [-66.541, 46.032], // Northeast bound
      ],
      style: 'mapbox://styles/ihill/ckb7xc2iq1sxf1ip9rdi5x0u6/',
    });
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    setMap(map);
  }, []);

  useEffect(() => {
    if (julyMap && julyMap.isStyleLoaded()) {
      julyMap.setPaintProperty('roads', 'line-opacity', (roadState ? 1 : 0));
      julyMap.setPaintProperty('mapc-borders', 'line-opacity', (borderState ? 1 : 0));
    }
  });

  return (
    <>
      <h1 className="calendar-viz__title">Pollution Proximity Index</h1>
      <div className="calendar-viz__wrapper">
        <div id="julyMap" className="mapboxgl__container" />
        <div className="map__overlay" style={{ top: '45px' }}>
          <span className="map__legend-entry map__legend-entry--bold map__legend-title">Pollution Proximity Index</span>
          <svg height="160" width="160" className="map__legend map__legend--translucent">
            <rect x="10" y="2" width="32" height="16" style={{ fill: colors[0], stroke: 'black', strokeWidth: '1px' }} />
            <text x="48" y="14" className="map__legend-entry" fill="#1F4E46">0</text>
            <rect x="10" y="30" width="32" height="16" style={{ fill: colors[1], stroke: 'black', strokeWidth: '1px' }} />
            <text x="48" y="42" className="map__legend-entry" fill="#1F4E46">1</text>
            <rect x="10" y="58" width="32" height="16" style={{ fill: colors[2], stroke: 'black', strokeWidth: '1px' }} />
            <text x="48" y="70" className="map__legend-entry" fill="#1F4E46">2</text>
            <rect x="10" y="86" width="32" height="16" style={{ fill: colors[3], stroke: 'black', strokeWidth: '1px' }} />
            <text x="48" y="98" className="map__legend-entry" fill="#1F4E46">3</text>
            <rect x="10" y="114" width="32" height="16" style={{ fill: colors[4], stroke: 'black', strokeWidth: '1px' }} />
            <text x="48" y="126" className="map__legend-entry" fill="#1F4E46">4</text>
            <rect x="10" y="142" width="32" height="16" style={{ fill: colors[5], stroke: 'black', strokeWidth: '1px' }} />
            <text x="48" y="154" className="map__legend-entry" fill="#1F4E46">5</text>
          </svg>
          <span className="map__legend-entry map__legend-entry--bold map__legend-title">Additional features</span>
          <div className="toggle__group">
            <div className="toggle__wrapper">
              <label className="toggle__switch">
                <input type="checkbox" onClick={() => setBorderVisibility(!borderState)} className="toggle__input" />
                <span className="toggle__circle"></span>
              </label>
              <span className="map__legend-entry">Municipal borders</span>
            </div>

            <div className="toggle__wrapper">
              <label className="toggle__switch">
                <input type="checkbox" onClick={() => setRoadVisibility(!roadState)} className="toggle__input" />
                <span className="toggle__circle"></span>
              </label>
              <span className="map__legend-entry">Roads</span>
            </div>
          </div>

          <span className="map__legend-entry map__legend-entry--bold map__legend-title calendar-viz__link">
            <a href="https://datacommon.mapc.org/browser/datasets/413">Explore & Download Data</a>
          </span>
        </div>
      </div>


      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed blandit imperdiet erat. Praesent eget rhoncus nunc, a pharetra arcu. Morbi at lacus vel lacus dapibus convallis. Phasellus ullamcorper vestibulum tempus. Cras fermentum lacus nunc, ac finibus risus efficitur et. Curabitur vitae massa non tellus semper pulvinar eu eu libero. Suspendisse augue erat, malesuada eget ultricies vel, varius id arcu. Curabitur sollicitudin velit dui, molestie iaculis felis porta id. Nunc sit amet felis ac lectus lobortis tempus. Curabitur quam nibh, dapibus sed finibus ac, fringilla a nulla. Aliquam rhoncus risus vitae erat suscipit, blandit iaculis libero cursus.</p>

      <p>Nunc non orci eget nisl hendrerit lobortis. Vestibulum suscipit, sapien eget sagittis efficitur, ligula nibh molestie mauris, ut dictum ex libero id mi. Quisque feugiat tortor non velit semper, sit amet laoreet risus congue. Morbi condimentum urna felis, ut facilisis nibh vulputate vel. Nam purus augue, porttitor vitae aliquam at, sagittis vitae risus. In consectetur eros nec diam interdum, in suscipit justo lacinia. Nulla interdum, dui in euismod interdum, quam felis tincidunt quam, in placerat justo massa et velit. Morbi ultricies interdum augue, tempor molestie ligula. Aliquam dui nibh, molestie eget est ut, hendrerit dignissim orci. Suspendisse ullamcorper elit eu eros volutpat, at maximus lacus ultricies. Nam eleifend magna interdum, dapibus metus sit amet, imperdiet quam. Mauris ut velit non ex sodales aliquet ut faucibus magna. Nullam id pretium lorem.</p>

      <p>Praesent ut magna id odio feugiat elementum a vel orci. Sed tempus urna id lectus dapibus vestibulum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce ac sem sed purus venenatis egestas quis vel diam. Curabitur laoreet aliquet ex, eget euismod tortor imperdiet ac. Ut commodo tristique mattis. Fusce eu ornare eros, vitae dignissim dolor.</p>

      <p>Donec mattis massa et mi lobortis, in tincidunt elit sodales. Vestibulum diam leo, tincidunt et tempus ac, maximus eu tortor. Praesent dignissim dui ut mi fermentum interdum. Mauris nisl dolor, posuere cursus rhoncus ac, luctus quis nisi. Sed elementum est in nunc fringilla faucibus. Curabitur in elit a dui blandit porta. Aliquam lobortis, dolor ullamcorper aliquam posuere, lacus tellus euismod elit, sit amet accumsan.</p>
    </>
  );
};

export default July;
