import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import SearchBar from '../containers/SearchBar';
import DataMenu from './partials/DataMenu';

const Browser = ({ datasets, fetchDatasets }) => {
  const navigate = useNavigate();
  const params = useParams();
  const [menuOneSelectedItem, setMenuOneSelectedItem] = React.useState(params?.menuOneSelectedItem || null);
  const [menuTwoSelectedItem, setMenuTwoSelectedItem] = React.useState(params?.menuTwoSelectedItem || null);

  React.useEffect(() => {
    fetchDatasets();
  }, [fetchDatasets]);

  const handleMenuSelectedItem = (childKey, event) => {
    const newValue = event.currentTarget.getAttribute('data-key');
    
    if (childKey === 'menuOneSelectedItem') {
      setMenuOneSelectedItem(newValue);
      setMenuTwoSelectedItem(null);
      navigate(`/browser/${newValue}`);
    } else {
      setMenuTwoSelectedItem(newValue);
      navigate(`/browser/${menuOneSelectedItem}/${newValue}`);
    }
  };

  const handleDatasetClick = (event) => {
    window.location.pathname = '/browser/datasets/' + event.currentTarget.getAttribute('data-key');
  };

  const toDataset = (dataset) => {
    window.location.pathname = `/browser/datasets/${dataset.id}`;
  };

  const structureDatasetsForMenu = (datasets) => {
    const menuOneItems = [...new Set(datasets.map((item) => item.menu1))];
    const menu = menuOneItems.map((menuOneTitle) => ({
      menuTitle: menuOneTitle,
      items: [
        ...new Set(
          datasets
            .filter((row) => row.menu1 === menuOneTitle)
            .map((row) => row.menu2)
        ),
      ].map((menuTwoTitle) => ({
        menuTitle: menuTwoTitle,
        items: [
          ...new Set(
            datasets
              .filter((row) => row.menu2 === menuTwoTitle)
              .map((row) => row.menu3)
          ),
        ].map((menuThreeTitle) => ({
          menuTitle: menuThreeTitle,
          dataset: datasets.filter((row) => row.menu3 === menuThreeTitle)[0],
        })),
      })),
    }));
    return menu;
  };

  const items = structureDatasetsForMenu(datasets);

  return (
    <section className="route categories">
      <div className="page-header">
        <div className="container tight">
          <SearchBar
            contextKey="dataset"
            searchColumn="title"
            action={(selected) => toDataset(selected)}
            placeholder={`Search ${datasets.length} datasets ...`}
          />
        </div>
      </div>
      <div className="category-lists">
        <div className="container tight">
          <DataMenu
            items={items}
            datasets={datasets}
            onMenuClick={(event) =>
              handleMenuSelectedItem('menuOneSelectedItem', event)
            }
          />
          {items.length > 0 && menuOneSelectedItem ? (
            <DataMenu
              datasets={datasets}
              items={
                items.filter(
                  (item) => item.menuTitle === menuOneSelectedItem
                )[0].items
              }
              onMenuClick={(event) =>
                handleMenuSelectedItem('menuTwoSelectedItem', event)
              }
            />
          ) : null}
          {items.length > 0 && menuTwoSelectedItem ? (
            <DataMenu
              items={
                items
                  .filter((item) => item.menuTitle === menuOneSelectedItem)[0]
                  .items.filter(
                    (item) => item.menuTitle === menuTwoSelectedItem
                  )[0].items
              }
              onDatasetClick={handleDatasetClick}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
};

Browser.propTypes = {
  datasets: PropTypes.arrayOf(PropTypes.object).isRequired,
  fetchDatasets: PropTypes.func.isRequired,
};

export default Browser;
