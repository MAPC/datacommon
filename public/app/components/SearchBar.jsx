import React from 'react';


class SearchBar extends React.Component {

  renderResults() {
    const results = this.props.results.map(result => (
      <li>
        <a href={`/browser/${result.id}`}>{result.title}</a>
      </li>
    ));

    return (<ul className="styled lift">{results}</ul>);
  }


  render() {
    const { results } = this.props;

    return (
      <div className="component SearchBar">
        <input placeholder={`Search ${results.length} datasets ...`} />
        {results.length ? this.renderResults() : null}
      </div>
    );
  }

}

export default SearchBar;
