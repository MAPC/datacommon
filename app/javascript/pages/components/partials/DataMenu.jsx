import React from 'react';

export default function DataMenu({ items, onMenuClick, onDatasetClick, datasets }) {
  const datasetCount = (item) => {
    const count = datasets.filter(dataset => dataset.menu1 === item.menuTitle || dataset.menu2 === item.menuTitle).length;
    return (count + ' Datasets');
  };

  return (
    <div className="scrollable-menus">
      <h3>Topics</h3>
      <ul className="styled lift">
        { props.items.map((item, index) => (
          <li className='menu-item' onClick={item.items ? props.onMenuClick : props.onDatasetClick} key={index} data-key={item.dataset ? item.dataset.seq_id : item.menuTitle}>
            <div className="category-item-content">
              <div className="category-item-column">{item.menuTitle}</div>
              <div className="menu-item__dataset-count">{item.items ? datasetCount(item) : null}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
