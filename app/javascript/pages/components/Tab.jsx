import React from 'react';

function setActiveTab(isActive) {
  if (isActive) {
    return 'tab tab--active';
  }
  return 'tab';
}

const Tab = ({ active, children }) => (
  <section className={setActiveTab(active)}>
    {children}
  </section>
);

export default Tab;
