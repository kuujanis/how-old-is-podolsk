import React, { useRef, useEffect, useState } from 'react';
import maplibregl, { DragPanHandler, disable } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import styles from './map.module.css'
import buildings from '../../layers/4buildings.geojson'




export default function Map() {
  const mapContainer = useRef("map");
  const map = useRef(null);
  const [lng] = useState(37.54);
  const [lat] = useState(55.43);
  const [zoom] = useState(11);
  const [API_KEY] = useState('YOUR_MAPTILER_API_KEY_HERE');
  const BOUNDS = [[37.405819,55.344057],[37.902264,55.512526]]

  useEffect(() => {
    if (map.current) return; // stops map from intializing more than once

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://api.maptiler.com/maps/f40a1280-834e-43de-b7ea-919faa734af4/style.json?key=5UXjcwcX8UyLW6zNAxsl',
      center: [lng, lat],
      zoom: zoom,
      maxBounds: BOUNDS
    });

      setTimeout(() => {
        map.current.addSource('buildings', {
          type: 'geojson',
          data: buildings,
          filter: ['>',['get','year_built'],0]
        });
      
        map.current.addLayer({
          id: '2dbuildings',
          type: 'fill',
          source: 'buildings',
          layout: {},
          paint: {
              'fill-color': {
                property: 'year_built',
                type: 'interval',
                stops: [
                  [1680, '#e51728'],
                  [1781, '#e57316'],
                  [1871, '#e5a717'],
                  [1921, '#e6caa0'],
                  [1943, '#f3f3f3'],
                  [1956, '#a1e6db'],
                  [1973, '#17afe6'],
                  [1993, '#1616e5'],
                  [2013, '#ab17e6'],
                ]
              },
          },
        });

        map.current.on('click', '2dbuildings', onClick);
        

      }, 100)

      

  }, [API_KEY, lng, lat, zoom]);

  const disableInteraction = () => {
        map.current.dragPan.disable();
        map.current.scrollZoom.disable();
  }
  const add3D = ()=> {
    map.current.addLayer({
      id: '3dbuildings',
      source: 'buildings',
      'type': 'fill-extrusion',
      'minzoom': 11,
      'paint': {
          'fill-extrusion-color': {
            property: 'year_built',
            type: 'interval',
            stops: [
              [1680, '#e51728'],
              [1781, '#e57316'],
              [1871, '#e5a717'],
              [1921, '#e6caa0'],
              [1943, '#f3f3f3'],
              [1956, '#a1e6db'],
              [1973, '#17afe6'],
              [1993, '#1616e5'],
              [2013, '#ab17e6'],
            ]
          },
          'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              11, 0,
              12, ['*',['get', 'level'],5]
          ]
      }
    })
  }

  

  const onClick = (e) => {
    const year = e.features[0].properties.year_built;
    console.log(year)
  };
  let threedee = false;

  const toggle3D = () => {
    if (!threedee) {
      map.current.off('click', '2dbuildings', onClick);
      add3D();
      map.current.on('click', '3dbuildings', onClick);
      threedee = true;
    } else {
      map.current.off('click', '3dbuildings', onClick);
      map.current.removeLayer('3dbuildings');
      map.current.on('click', '2dbuildings', onClick);
      threedee = false;
    }
  };

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className={styles.map} />
      <div onClick={toggle3D} className={styles.btn}/>
    </div>
  );
}