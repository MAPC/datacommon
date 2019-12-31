import React from 'react';

export default function DataMenu(props) {
  // if this is a dataset then onClick should take us to the dataset
  console.log(props);
  return (
    <div className="scrollable-menus">
      <h3>Topics</h3>
      <ul className="styled lift">
        { props.items.map((item, index) => (
          <li className='menu-item' onClick={props.items[0].items ? props.onMenuClick : props.onDatasetClick} key={index} data-key={item.dataset ? item.dataset.seq_id : index}>
            <div className="category-item-content">
              <div className="category-item-column">{item.menuTitle}</div>
              <div className="category-item-column">
                <small className="menu-item__dataset-count">5 Datasets</small>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
