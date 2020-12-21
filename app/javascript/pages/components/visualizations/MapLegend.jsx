import React, { useState } from 'react';
import PropTypes from 'prop-types';

function setLegend(legend) {
  return legend.map((entry) => (
    <li key={entry.value}>
      <svg width="10" height="10">
        <circle cx="5" cy="5" r="5" fill={entry.color} />
      </svg>
      <span className="map-legend__entry">{entry.value}</span>
    </li>
  ));
}

const MapLegend = ({
  legend, title, columns, children,
}) => {
  const [isExpanded, setExpansion] = useState(true);
  return (
    <div position="topright" className="map-legend">
      { isExpanded ? (
        <>
          <span className="map-legend__title">{title}</span>
          <ul className={columns === 1 ? 'map-legend__list map-legend__list--one-col' : 'map-legend__list map-legend__list--two-col'}>
            {setLegend(legend)}
          </ul>
          {children}
        </>
      ) : <span className="map-legend__title">Expand Legend</span>}
      <button type="button" className="map-legend__toggle" onClick={() => setExpansion(!isExpanded)}>
        {isExpanded ? '-' : '+'}
      </button>
    </div>
  );
};

MapLegend.propTypes = {
  legend: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string.isRequired,
  columns: PropTypes.number,
};

MapLegend.defaultProps = {
  columns: 1,
};

export default MapLegend;
