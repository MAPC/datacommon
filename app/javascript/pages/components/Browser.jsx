import React from 'react';
import PropTypes from 'prop-types';
import { history } from '../store';
import SearchBar from '../containers/SearchBar';
import DataMenu from './partials/DataMenu';

class Browser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOneSelectedItem: this.props.match.params.menuOneSelectedItem,
    };

    this.toDataset = this.toDataset.bind(this);
  }

  componentDidMount() {
    this.props.fetchDatasets()
  }

  structureDatasetsForMenu(datasets) {
    const menuOneItems = [...new Set(datasets.map((item) => item.menu1))];
    const menu = menuOneItems.map((menuOneTitle) => ({
      menuTitle: menuOneTitle,
      items: [
        ...new Set(
          datasets
            .filter((row) => row.menu1 === menuOneTitle)
            .map((row) => row.menu2),
        ),
      ].map((menuTwoTitle) => ({
        menuTitle: menuTwoTitle,
        items: [
          ...new Set(
            datasets
              .filter((row) => row.menu2 === menuTwoTitle)
              .map((row) => row.menu3),
          ),
        ].map((menuThreeTitle) => ({
          menuTitle: menuThreeTitle,
          dataset: datasets.filter((row) => row.menu3 === menuThreeTitle)[0],
        })),
      })),
    }));
    return menu;
  }

  handleMenuSelectedItem(childKey) {
    if (childKey === 'menuOneSelectedItem') {
      delete this.state.menuTwoSelectedItem;
    }

    return (event) => this.setState({
      [childKey]: event.currentTarget.getAttribute('data-key'),
    });
  }

  handleDatasetClick() {
    return (event) => window.location.pathname = '/browser/datasets/' + event.currentTarget.getAttribute('data-key');
  }

  toDataset(dataset) {
    // We need to direct away from the page without using React Router's push()
    // function since the databrowser is currently an Ember app.
    window.location.pathname = `/browser/datasets/${dataset.id}`;
  }

  render() {
    const { menuOneSelectedItem, menuTwoSelectedItem } = this.state;
    const items = this.structureDatasetsForMenu(this.props.datasets);

    return (
      <section className="route categories">
        <div className="page-header">
          <div className="container tight">
            <SearchBar
              contextKey="dataset"
              searchColumn="title"
              action={(selected) => this.toDataset(selected)}
              placeholder={`Search ${this.props.datasets.length} datasets ...`}
            />
          </div>
        </div>
        <div className="category-lists">
          <div className="container tight">
            <DataMenu items={items} datasets={this.props.datasets} onMenuClick={this.handleMenuSelectedItem('menuOneSelectedItem')} />
            {items.length > 0 && menuOneSelectedItem ? (
              <DataMenu
                datasets={this.props.datasets}
                items={items.filter((item) => item.menuTitle === menuOneSelectedItem)[0].items}
                onMenuClick={this.handleMenuSelectedItem('menuTwoSelectedItem')}
              />
            ) : null}
            {items.length > 0 && menuTwoSelectedItem ? (
              <DataMenu
                items={items.filter((item) => item.menuTitle === menuOneSelectedItem)[0].items.filter((item) => item.menuTitle === menuTwoSelectedItem)[0].items}
                onDatasetClick={this.handleDatasetClick()}
              />
            ) : null}
          </div>
        </div>
      </section>
    );
  }
}

Browser.propTypes = {
  datasets: PropTypes.arrayOf(PropTypes.object).isRequired,
  fetchDatasets: PropTypes.func.isRequired,
};

export default Browser;
