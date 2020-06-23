import React from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiaWhpbGwiLCJhIjoiY2plZzUwMTRzMW45NjJxb2R2Z2thOWF1YiJ9.szIAeMS4c9YTgNsJeG36gg';
const July = () => (
  <>
    <h1 className="calendar-viz__title">Pollution Proximity Index</h1>
    <div className="calendar-viz__iframe-wrapper">
      <iframe src="https://mapc.github.io/MapboxEmbeds/2020/06/23/datacommon-ppi.html" className="calendar-viz__iframe" id="july-iframe" title="Map of PPI scores across region" />
    </div>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed blandit imperdiet erat. Praesent eget rhoncus nunc, a pharetra arcu. Morbi at lacus vel lacus dapibus convallis. Phasellus ullamcorper vestibulum tempus. Cras fermentum lacus nunc, ac finibus risus efficitur et. Curabitur vitae massa non tellus semper pulvinar eu eu libero. Suspendisse augue erat, malesuada eget ultricies vel, varius id arcu. Curabitur sollicitudin velit dui, molestie iaculis felis porta id. Nunc sit amet felis ac lectus lobortis tempus. Curabitur quam nibh, dapibus sed finibus ac, fringilla a nulla. Aliquam rhoncus risus vitae erat suscipit, blandit iaculis libero cursus.</p>

    <p>Nunc non orci eget nisl hendrerit lobortis. Vestibulum suscipit, sapien eget sagittis efficitur, ligula nibh molestie mauris, ut dictum ex libero id mi. Quisque feugiat tortor non velit semper, sit amet laoreet risus congue. Morbi condimentum urna felis, ut facilisis nibh vulputate vel. Nam purus augue, porttitor vitae aliquam at, sagittis vitae risus. In consectetur eros nec diam interdum, in suscipit justo lacinia. Nulla interdum, dui in euismod interdum, quam felis tincidunt quam, in placerat justo massa et velit. Morbi ultricies interdum augue, tempor molestie ligula. Aliquam dui nibh, molestie eget est ut, hendrerit dignissim orci. Suspendisse ullamcorper elit eu eros volutpat, at maximus lacus ultricies. Nam eleifend magna interdum, dapibus metus sit amet, imperdiet quam. Mauris ut velit non ex sodales aliquet ut faucibus magna. Nullam id pretium lorem.</p>

    <p>Praesent ut magna id odio feugiat elementum a vel orci. Sed tempus urna id lectus dapibus vestibulum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce ac sem sed purus venenatis egestas quis vel diam. Curabitur laoreet aliquet ex, eget euismod tortor imperdiet ac. Ut commodo tristique mattis. Fusce eu ornare eros, vitae dignissim dolor.</p>

    <p>Donec mattis massa et mi lobortis, in tincidunt elit sodales. Vestibulum diam leo, tincidunt et tempus ac, maximus eu tortor. Praesent dignissim dui ut mi fermentum interdum. Mauris nisl dolor, posuere cursus rhoncus ac, luctus quis nisi. Sed elementum est in nunc fringilla faucibus. Curabitur in elit a dui blandit porta. Aliquam lobortis, dolor ullamcorper aliquam posuere, lacus tellus euismod elit, sit amet accumsan.</p>
  </>
);

export default July;
