import React from 'react';

const DataRow = ({ headers, rowData }) => {
  const renderedRow = headers.filter((header) => header !== 'seq_id')
    .map((header) => <td key={header}>{rowData[header]}</td>);
  return <tr>{renderedRow}</tr>;
};

export default DataRow;
