import React from 'react';

const DataRow = ({ headers, rowData }) => {
  const renderedRow = headers.map((header) => <td key={header}>{rowData[header]}</td>);
  return <tr>{renderedRow}</tr>;
};

export default DataRow;
