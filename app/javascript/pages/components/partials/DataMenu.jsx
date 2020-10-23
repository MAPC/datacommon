import React from 'react';

export default function DataMenu({
  items,
  onMenuClick,
  onDatasetClick,
  datasets,
}) {
  const datasetCount = (item) => {
    if (item[0].dataset) {
      return `${item.length} ${item.length > 1 ? 'Datasets' : 'Dataset'}`;
    } else {
      const datasetCount = item
        .map((item) => item.items.length)
        .reduce((a, b) => a + b, 0);
      return `${datasetCount} ${datasetCount > 1 ? 'Datasets' : 'Dataset'}`;
    }
  };

  return (
    <div className="scrollable-menus">
      <h3>Topics</h3>
      <ul className="styled lift">
        {items.map((item, index) => (
          <li
            className="menu-item"
            onClick={item.items ? onMenuClick : onDatasetClick}
            key={index}
            data-key={item.dataset ? item.dataset.seq_id : item.menuTitle}
          >
            <div className="category-item-content">
              <div className="category-item-column">{item.menuTitle}</div>
              <div className="menu-item__dataset-count">
                {item.items ? datasetCount(item.items) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
