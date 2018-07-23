import React from 'react';
import { Link } from 'react-router-dom';

import icons from '../constants/category-icons';


class CategoryGrid extends React.Component {

  renderCategories() {
    return this.props.categories.map(category => (
      <li key={category} className="lift">
        <Link to={`/browser/${category}`}>
          <div className="category-image">
            <img src={icons[category] || icons['default']} alt={`Icon for ${category}`} />
          </div>

          <h4>{category}</h4>
        </Link>
      </li>
    ));
  }

  render() {
    return (
      <ul className="component CategoryGrid">
        {this.renderCategories()}
      </ul>
    );
  }

}

export default CategoryGrid;
