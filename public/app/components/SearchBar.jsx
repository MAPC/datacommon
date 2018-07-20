import React from 'react';


class SearchBar extends React.Component {

  componentWillMount() {
    this.props.fetchDatasets();
  }


  renderResults() {
    const results = this.props.results.map(result => (
      <li key={result.title}>
        <a href={`/browser/${result.id}`}>{result.title}</a>
      </li>
    ));

    return (<ul className="styled lift">{results}</ul>);
  }


  render() {
    const { results, query } = this.props;

    return (
      <div className="component SearchBar">
        <input
          value={query}
          placeholder={`Search ${results.length} datasets ...`}
          onChange={({ target }) => this.props.search(target.value)}
        />
        {(results.length && query.length) ? this.renderResults() : null}
      </div>
    );
  }

}

export default SearchBar;
