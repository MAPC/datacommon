import React, { useEffect } from 'react';
import axios from 'axios';

function November() {
  useEffect(() => {
    axios.get('/calendar/dogs').then((response) => console.log(response.data));
  }, []);

  return (
    <>
      <h1 className="calendar-viz__title">Dog Map</h1>
      <div className="calendar-viz__wrapper">
        Insert map here (Mapbox or d3)
      </div>
    </>
  );
}

export default November;
