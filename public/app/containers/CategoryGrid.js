import { connect } from 'react-redux';

import CategoryGrid from '../components/CategoryGrid';
import { prioritized } from '~/app/constants/categories';


const mapStateToProps = ({ dataset }, props) => {

  const prioritizedCategories = [...prioritized.keys()];
  const categoryPool = [...dataset.categories];
  const categories = [];
  const maxCategories = 10;

  const categoriesRemainIn = pool =>  pool.length !== 0 && categories.length < maxCategories;

  while (categoriesRemainIn(prioritizedCategories)) {
    const priority = prioritizedCategories.shift();

    categoryPool.some((category, i) => {
      if (category === priority) {
        categories.push(category);
        categoryPool.splice(i, 1);

        return true;
      }
    });
  }

  // We always want max categories if we have them. Now that we
  // have fulfilled our priorities, we can fill the remainder
  // with what we have left.
  while (categoriesRemainIn(categoryPool)) {
    categories.push(categoryPool.shift());
  }

  return { categories };
};

const mapDispatchToProps = (dispatch, props) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(CategoryGrid);
