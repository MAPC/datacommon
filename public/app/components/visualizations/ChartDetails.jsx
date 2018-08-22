import React from 'react';
import PropTypes from 'prop-types';
import locations from '~/app/constants/locations';

class ChartDetails extends React.Component {
  render() {
    return (
      <div className="chart-wrapper">
        <h3>{this.props.chart['title'] || 'Chart Title'}</h3>
        {this.props.children}
        <div className="metadata">
          <span className="source">
            Source: <b>{this.props.chart['source'] || 'Unknown'}</b>
          </span>
          <span className="timeframe">
            Years: <b>{this.props.chart['timeframe'] || 'Unknown'}</b>
          </span>
          <span className="link">
            Full Datasets: <b><a href={`${locations.HOST}/browser/datasets/${this.props.chart['datasetId']}`}>Link to DataBrowser</a></b>
          </span>
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
