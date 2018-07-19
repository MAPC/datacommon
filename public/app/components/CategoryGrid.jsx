import React from 'react';
import { Link } from 'react-router-dom';

import icons from '../constants/category-icons';


class CategoryGrid extends React.Component {

  renderCategories() {
    return this.props.categories.map((category, i) => (
      <li key={i}>
        <Link to={`/browser/${category.endpoint}`}>
          <div className="category-image">
            <img src={icons[category.icon]} alt={`Icon for ${category.title}`} />
          </div>

          {category.title}
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
