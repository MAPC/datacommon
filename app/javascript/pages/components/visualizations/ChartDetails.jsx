import React from 'react';
import PropTypes from 'prop-types';
import locations from '../../constants/locations';

class ChartDetails extends React.Component {
  render() {
    return (
      <div className="chart-wrapper">
        <h3>{this.props.chart['title'] || 'Chart Title'}</h3>
        {this.props.children}
        {this.props.chart['caveat'] ? (
          <div className="caveat">
            Caveat: {this.props.chart['caveat']}
          </div>
        ) : null}
        <div className="metadata">
          <div className="source-timeframe">
            <div className="source">
              Source: {this.props.chart['source'] || 'Unknown'}
            </div>
            <div className="timeframe">
              Years: {this.props.chart['timeframe'] || 'Unknown'}
            </div>
          </div>
          {this.props.chart['datasetLinks'] ? (
            <div className="link">
              <span>Link to: </span>
              {Object.keys(this.props.chart['datasetLinks']).map((label) => (
                <a key={label} href={`${locations.HOST}/browser/datasets/${this.props.chart['datasetLinks'][label]}`}>{label}</a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

ChartDetails.propTypes = {
  chart: PropTypes.shape({
    title: PropTypes.string,
    source: PropTypes.string,
    timeframe: PropTypes.string,
    datasetId: PropTypes.number,
  }).isRequired,
};

export default ChartDetails;
