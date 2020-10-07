import React from 'react';
import PropTypes from 'prop-types';
import locations from '../../constants/locations';

const ChartDetails = ({ chart, children }) => (
  <div className="chart-wrapper">
    <h3 className="chart__title">{chart.title || 'Chart Title'}</h3>
    {children}
    {chart.caveat ? (
      <div className="caveat">
        Caveat:
        {' '}
        {chart.caveat}
      </div>
    ) : null}
    <div className="metadata">
      <div className="source-timeframe">
        <div className="source">
          Source:
          {' '}
          {chart.source || 'Unknown'}
        </div>
        <div className="timeframe">
          Years:
          {' '}
          {chart.timeframe || 'Unknown'}
        </div>
      </div>
      {chart.datasetLinks ? (
        <div className="link">
          <span>Link to: </span>
          {Object.keys(chart.datasetLinks).map((label) => (
            <a key={label} href={`${locations.HOST}/browser/datasets/${chart.datasetLinks[label]}`}>{label}</a>
          ))}
        </div>
      ) : null}
    </div>
  </div>
);

ChartDetails.propTypes = {
  chart: PropTypes.shape({
    title: PropTypes.string,
    source: PropTypes.string,
    timeframe: PropTypes.string,
    datasetId: PropTypes.number,
  }).isRequired,
};

export default ChartDetails;
