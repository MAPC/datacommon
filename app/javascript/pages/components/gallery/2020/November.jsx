/* eslint-disable no-await-in-loop */
import React, { useEffect, useState } from 'react';
import { Client } from '@petfinder/petfinder-js';

function November() {
  const client = new Client({
    apiKey: '',
    secret: '',
  });
  const [allDogs, setDogs] = useState([]);

  useEffect(() => {
    async function showAnimals() {
      console.log("Show animals called")
      let page = 1;
      let apiResult;

      const allTempDogs = [];
      do {
        apiResult = await client.animal.search({
          type: 'Dog',
          location: 'MA',
          limit: 100,
          page,
        });
        page += 1;
        allTempDogs.push(...apiResult.data.animals);
      } while (apiResult.data.pagination && apiResult.data.pagination.total_pages >= page);
      setDogs(allTempDogs);
    }
    showAnimals();
  }, []);


  // client.animal.search({
  //   type: 'Dog',
  //   location: 'MA',
  //   limit: 100,
  //   currentPage,
  // })
  //   .then((response) => setPages(response.data.pagination.total_pages));

  // useEffect(() => {
  //   if (currentPage + 1 <= pages) {
  //     client.animal.search({
  //       type: 'Dog',
  //       location: 'MA',
  //       limit: 100,
  //       currentPage,
  //     })
  //       .then((response) => {
  //         let tempData = allDogs;
  //         tempData.push(response.data.animals)
  //         setDogs(tempData);
  //         setCurrentPage(currentPage + 1);
  //       });
  //   }
  // }, [pages, currentPage]);

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
