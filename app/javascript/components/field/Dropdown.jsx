import React from 'react';
import PropTypes from 'prop-types';

class Dropdown extends React.Component {

  constructor(props) {
    super(props);
    this.state = { open: false };
    // this.handleClick = this.handleClick.bind(this);
  }

  render() {
    return (
      <div className="component Dropdown">
        <select
          value={this.props.value}
          onChange={this.props.onChange}
          disabled={this.props.disabled}
        >
          {this.props.options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

}

Dropdown.propTypes = {
  value: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default Dropdown;

