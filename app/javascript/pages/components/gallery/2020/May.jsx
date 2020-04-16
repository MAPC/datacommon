/* eslint-disable max-len */
import React from 'react';
import * as d3 from 'd3';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiaWhpbGwiLCJhIjoiY2plZzUwMTRzMW45NjJxb2R2Z2thOWF1YiJ9.szIAeMS4c9YTgNsJeG36gg';

const May = () => {
  d3.csv('/assets/testingcenters.geojson')
    .then((response) => {
      let zoom = 8.4;
      let center = [-70.944, 42.37];
      if (window.innerWidth <= 480) {
        zoom = 7.75;
        center = [-71.043, 42.372];
      } else if (window.innerWidth <= 670) {
        zoom = 8.27;
        center = [-71.047, 42.377];
      } else if (window.innerWidth <= 770) {
        zoom = 8.4;
        center = [-71.039, 42.37];
      }
      const mayMap = new mapboxgl.Map({
        container: 'mayMap',
        zoom,
        minZoom: 6,
        maxZoom: 13,
        center,
        maxBounds: [
          [-74.728, 38.167], // Southwest bound
          [-66.541, 46.032], // Northeast bound
        ],
        style: 'mapbox://styles/ihill/ck92yirkh2mt71ho83t7y60m9/draft',
      });

      mayMap.on('load', () => {
        mayMap.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
        mayMap.addSource('mapc-testing', {
          type: 'geojson',
          data: '/assets/testingcenters.geojson',
        });

        mayMap.addLayer({
          id: 'mapc-testing',
          type: 'symbol',
          source: 'mapc-testing',
          layout: {
            'icon-image': 'hospital-JP-15',
            'icon-size': 1,
          },
        });

        mayMap.addSource('non-mapc-testing', {
          type: 'geojson',
          data: '/assets/non-mapc-testing.geojson',
        });

        mayMap.addLayer({
          id: 'non-mapc-testing',
          type: 'symbol',
          source: 'non-mapc-testing',
          layout: {
            'icon-image': 'hospital-JP-15',
            'icon-size': 1,
          },
        });

        mayMap.addSource('indiv-shelters', {
          type: 'geojson',
          data: '/assets/indiv-shelters.geojson',
        });

        mayMap.addLayer({
          id: 'indiv-shelters',
          type: 'symbol',
          source: 'indiv-shelters',
          layout: {
            'icon-image': 'home-15',
            'icon-size': 1,
          },
        });

        mayMap.addSource('alternative-shelters', {
          type: 'geojson',
          data: '/assets/alternative-shelters.geojson',
        });

        mayMap.addLayer({
          id: 'alternative-shelters',
          type: 'symbol',
          source: 'alternative-shelters',
          layout: {
            'icon-image': 'town-15',
            'icon-size': 1,
          },
        });
      });
    });

  return (
    <>
      <h1 className="calendar-viz__title">A Regional Response to COVID-19</h1>
      <div className="calendar-viz__wrapper">
        <div id="mayMap" className="mapboxgl__container" />
      </div>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sollicitudin quam eu ligula faucibus, eu mollis metus elementum. Sed sit amet ligula quis arcu finibus pulvinar eget et risus. Sed lectus mi, ornare id vulputate nec, scelerisque vitae velit. Morbi lacus ante, pulvinar et augue sit amet, suscipit sagittis mauris. Nullam quis tincidunt neque, a luctus arcu. Morbi malesuada erat enim, id sollicitudin sem vestibulum a. Curabitur tempus orci turpis, ac pulvinar nisi aliquet vel. Duis feugiat eros eu felis elementum, in tempor purus lacinia. Nam nec vehicula urna. Morbi at mi nec metus ultrices tempor non eget risus. Maecenas in odio diam. Donec ligula magna, volutpat et ornare nec, varius nec felis.</p>
      <p>Nulla condimentum vel dolor mollis venenatis. Proin nec vestibulum purus. Nullam cursus ultricies euismod. Curabitur vulputate velit nisi, ac convallis nunc mollis sit amet. Donec turpis felis, lobortis vitae blandit et, eleifend eget justo. Nam pharetra vel massa at convallis. Quisque justo ipsum, elementum in tempus eu, gravida eget sapien. Curabitur tristique tincidunt massa. Maecenas magna eros, lobortis ut orci eget, ullamcorper porta purus. Curabitur ut maximus nisl.</p>
      <p>Proin velit eros, luctus quis velit eget, tempus suscipit eros. Aliquam vel turpis nisl. Ut facilisis lorem id sagittis vestibulum. Donec auctor mi massa, sit amet sagittis odio sodales at. Curabitur condimentum ex eu diam placerat accumsan. Praesent volutpat ex id urna tincidunt, in lobortis nisl porta. Vestibulum et erat sed dui vulputate ullamcorper at at nulla. Nam molestie rhoncus ex quis dictum.</p>
      <p>Duis quis rhoncus velit. Donec accumsan purus vel lectus egestas ultrices. Aliquam ac sodales mi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Curabitur elit est, sodales sed pellentesque a, gravida a purus. Donec finibus magna ac quam vulputate dictum. Aenean elementum elit nulla, pretium elementum odio feugiat vitae. Duis a facilisis ligula. Aliquam consectetur sed ante nec posuere. Maecenas volutpat mi at nunc placerat, sit amet molestie purus tincidunt. Sed id condimentum urna. Integer ut iaculis neque, nec malesuada ante. Pellentesque lorem mi, molestie vel dui ornare, commodo finibus sem. Mauris lorem ante, vehicula id purus et, ultrices eleifend justo.</p>
    </>
  );
};

export default May;
