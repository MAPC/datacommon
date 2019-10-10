import React from 'react';

class MuniSelect extends React.Component {

  componentWillMount() {
    this.props.fetchOptions();
  }

  render() {
    return (
      <select className="component MuniSelect">
      </select>
    );
  }

}

export default MuniSelect;
