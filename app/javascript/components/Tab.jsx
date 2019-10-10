import React from 'react';

class Tab extends React.Component {

  render() {
    return (
      <section className={'component Tab' + (this.props.active ? ' active' : '')}>
        {this.props.children}
      </section>
    );
  }

}

export default Tab;
