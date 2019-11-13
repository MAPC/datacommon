import React from 'react';
import PropTypes from 'prop-types';

import wordSearch from '../utils/wordSearch';
import capitalize from '../utils/capitalize';


class SearchBar extends React.Component {

  constructor(props) {
    super(props);

    this.search = this.search.bind(this);
  }


  search(query) {
    const results = query.length
      ? wordSearch(this.props.items, query, this.props.searchColumn)
      : this.props.items;

    this.props.setResults(results, query);
  }


  executeAction(result) {
    this.props.action(result);
    this.props.clear();
  }


  renderResults() {
    const results = this.props.results.map((result,i) => (
      <li
        key={result[this.props.searchColumn] ? `${result.id}-${result[this.props.searchColumn]}` : result}
        onClick={() => this.executeAction(result)}
        onMouseEnter={() => this.props.setHovering(result)}
        onMouseLeave={() => this.props.setHovering(null)}
      >
        <span className="a-tag">{capitalize(result[this.props.searchColumn] || result)}</span>
      </li>
    ));

    return (<ul className="styled lift">{results}</ul>);
  }


  render() {
    const { results, query, className } = this.props;

    return (
      <div className={`component SearchBar ${className}`}>
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


const itemType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.object,
]);

SearchBar.propTypes = {
  clear: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(itemType).isRequired,
  action: PropTypes.func.isRequired,
  results: PropTypes.arrayOf(itemType).isRequired,
  setResults: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,

  searchColumn: PropTypes.string,
  className: PropTypes.string,
};

export default SearchBar;
