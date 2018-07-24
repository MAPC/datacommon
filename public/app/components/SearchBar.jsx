import React from 'react';

import wordSearch from '~/app/utils/wordSearch';


class SearchBar extends React.Component {

  constructor(props) {
    super(props);

    this.search = this.search.bind(this);
  }


  search(query) {
    const results = query.length
      ? wordSearch(this.props.items, query, this.props.searchColumn)
      : this.props.items;

    this.props.onSearch(results, query);
  }


  renderResults() {
    const results = this.props.results.map((result,i) => (
      <li key={i} onClick={() => this.props.action(result)}>
        <span className="a-tag">{result[this.props.searchColumn]}</span>
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
          placeholder={this.props.placeholder}
          onChange={({ target }) => this.search(target.value)}
        />
        {(results.length && query.length) ? this.renderResults() : null}
      </div>
    );
  }

}

export default SearchBar;
