import React from 'react';
import { history, store } from '../store';
import axios from 'axios';
import DataMenu from './partials/DataMenu';

class Browser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
    };
  }

  componentDidMount() {
    axios.get('https://prql.mapc.org/?token=16a2637ee33572e46f5609a578b035dc&query=SELECT%20*%20FROM%20tabular._data_browser%20WHERE%20active%20%3D%20%27Y%27%20ORDER%20BY%20menu1,menu2,menu3%20ASC')
      .then((response) => {
        const menuOneItems = [...new Set(response.data.rows.map((item) => item.menu1))];
        const menu = menuOneItems.map((menuOneTitle) => ({
          menuTitle: menuOneTitle,
          items: [
            ...new Set(
              response.data.rows
                .filter((row) => row.menu1 === menuOneTitle)
                .map((row) => row.menu2),
            ),
          ].map((menuTwoTitle) => ({
            menuTitle: menuTwoTitle,
            items: [
              ...new Set(
                response.data.rows
                  .filter((row) => row.menu2 === menuTwoTitle)
                  .map((row) => row.menu3),
              ),
            ].map((menuThreeTitle) => ({
              menuTitle: menuThreeTitle,
              dataset: response.data.rows.filter((row) => row.menu3 === menuThreeTitle)[0],
            })),
          })),
        }));
        this.setState({ items: menu });
      });
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
    return (event) => history.push('/browser/datasets/' + event.currentTarget.getAttribute('data-key'));
  }

  render() {
    const { items, menuOneSelectedItem, menuTwoSelectedItem } = this.state;

    return (
      <section className="route categories">
        <div className="page-header">
          <div className="container tight">
            {/* {{search-bar records=searchables class="lift"}} */}
          </div>
        </div>
        <div className="category-lists">
          <div className="container tight">
            <DataMenu items={items} onMenuClick={this.handleMenuSelectedItem('menuOneSelectedItem')} />
            {menuOneSelectedItem ? <DataMenu items={items[menuOneSelectedItem].items} onMenuClick={this.handleMenuSelectedItem('menuTwoSelectedItem')} /> : null}
            {menuTwoSelectedItem ? <DataMenu items={items[menuOneSelectedItem].items[menuTwoSelectedItem].items} onDatasetClick={this.handleDatasetClick()} /> : null}
          </div>
        </div>
      </section>
    );
  }
}

export default Browser;
