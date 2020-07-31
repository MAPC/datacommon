import React from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiaWhpbGwiLCJhIjoiY2plZzUwMTRzMW45NjJxb2R2Z2thOWF1YiJ9.szIAeMS4c9YTgNsJeG36gg';
const August = () => (
  <>
    <h1 className="calendar-viz__title">Paycheck Protection Program</h1>
    <div className="calendar-viz__iframe-wrapper">
      <iframe src="https://mapc.github.io/MapboxEmbeds/2020/07/15/ppp.html" className="calendar-viz__iframe" id="july-iframe" title="Map of PPI scores across region" />
    </div>
    <p>Pellentesque imperdiet felis ut nisi dictum, at gravida dolor vehicula. Proin sit amet turpis accumsan, varius lacus id, feugiat elit. Nunc eu lectus ut libero tincidunt gravida. Nullam tristique, lorem ut varius tincidunt, est tellus interdum orci, nec imperdiet eros mi vitae justo. In et lobortis mauris, pellentesque cursus mauris.</p>
    <p>Pellentesque imperdiet felis ut nisi dictum, at gravida dolor vehicula. Proin sit amet turpis accumsan, varius lacus id, feugiat elit. Nunc eu lectus ut libero tincidunt gravida. Nullam tristique, lorem ut varius tincidunt, est tellus interdum orci, nec imperdiet eros mi vitae justo. In et lobortis mauris, pellentesque cursus mauris.</p>
    <p>Pellentesque imperdiet felis ut nisi dictum, at gravida dolor vehicula. Proin sit amet turpis accumsan, varius lacus id, feugiat elit. Nunc eu lectus ut libero tincidunt gravida. Nullam tristique, lorem ut varius tincidunt, est tellus interdum orci, nec imperdiet eros mi vitae justo. In et lobortis mauris, pellentesque cursus mauris.</p>
  </>
);

export default August;
