import React from 'react';

class MuniSelect extends React.Component {

  componentWillMount() {
    console.log(this.props);
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
