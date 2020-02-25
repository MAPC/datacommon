import React from 'react';
import PropTypes from 'prop-types';

const MapSelection = (props) => {
  const { option, mapName, currentlySelected, updateSelection } = props;
  return (
    <label htmlFor={option} className="d3-map__option-label">
      <input
        type="radio"
        id={option}
        name={mapName}
        value={option}
        className="d3-map__option-button"
        onChange={() => {
          updateSelection(option);
        }}
        checked={currentlySelected === option}
      />
      {option}
    </label>
  );
};

MapSelection.propTypes = {
  option: PropTypes.string.isRequired,
  mapName: PropTypes.string.isRequired,
  currentlySelected: PropTypes.string.isRequired,
  updateSelection: PropTypes.func.isRequired,
};

export default MapSelection;
