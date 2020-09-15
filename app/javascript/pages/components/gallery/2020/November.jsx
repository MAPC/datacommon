import React, { useState} from 'react';
import { Client } from '@petfinder/petfinder-js';
import dotenv from 'dotenv';
import D3Map from '../D3Map';

function November() {
  const client = new Client({
    apiKey: '',
    secret: '',
  });
  client.animal.search({
    type: 'Dog',
    location: 'MA',
  })
    .then((response) => {
      console.log(response.data.animals)
    })
    .catch((error) => {
      console.log(error)
    })
  return (
    <>
      <h1 className="calendar-viz__title">Dog Map</h1>
      <div className="calendar-viz__wrapper">
        <D3Map
          oceanFill="#FEFDFE"
          maFill="#F9F7FF"
          newEngFill="#F9F7FF"
          mapcFill="#ECE2FF"
          mapcLine="#5a5a5a"
        />
      </div>
    </>
  );
}

export default November;
