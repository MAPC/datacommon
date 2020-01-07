import React from 'react';

export default function DataMenu(props) {
  return (
    <div className="scrollable-menus">
      <h3>Topics</h3>
      <ul className="styled lift">
        { props.items.map((item, index) => (
          <li className='menu-item' onClick={item.items ? props.onMenuClick : props.onDatasetClick} key={index} data-key={item.dataset ? item.dataset.seq_id : index}>
            <div className="category-item-content">
              <div className="category-item-column">{item.menuTitle}</div>
              <div className="category-item-column">
                <small className="menu-item__dataset-count">{item.items ? item.items.length + ' Subtopics' : null}</small>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
