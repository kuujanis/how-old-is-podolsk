import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css';




export default function Map() {
  const mapContainer = useRef("map");
  const map = useRef(null);
  const [lng] = useState(37.54);
  const [lat] = useState(55.43);
  const [zoom] = useState(13);
  const [API_KEY] = useState('YOUR_MAPTILER_API_KEY_HERE');
  const BOUNDS = [[37.405819,55.344057],[37.902264,55.512526]]


  const EPOQUES = [
    {name:'artisan', color:'#e51728', min: 1554, max: 1781},
    {name:'merchant', color:'#e57316', min: 1781, max: 1871},
    {name:'industrial', color:'#e5a717', min: 1871, max: 1921},
    {name:'revolutionary', color:'#e6caa0', min: 1921, max: 1941},
    {name:'postwar', color:'#f3f3f3', min: 1941, max: 1956},
    {name:'thaw', color:'#a1e6db', min: 1956, max: 1973},
    {name:'stagnation', color:'#17afe6', min: 1973, max: 1993},
    {name:'postindustrial', color:'#1616e5', min: 1993, max: 2013},
    {name:'postmodern', color:'#ab17e6', min: 2013, max: 2023}
  ]


  useEffect(() => {
    if (map.current) return; // stops map from intializing more than once

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://api.maptiler.com/maps/f40a1280-834e-43de-b7ea-919faa734af4/style.json?key=5UXjcwcX8UyLW6zNAxsl',
      center: [lng, lat],
      zoom: zoom,
      maxBounds: BOUNDS
    });

    const loadEpoque = (name,color,a,b) => {
        map.current.addLayer({
                  id: name,
                  type: 'fill',
                  source: 'buildings',
                  layout: {},
                  paint: {
                      'fill-color': color
                  },
                  filter: ['all',['>',['get','year_built'],a],['<=',['get','year_built'],b]]
              });
      }

      setTimeout(() => {
        map.current.addSource('buildings', {
          type: 'geojson',
          data: '../../layers/buildings ',
          filter: ['>',['get','year_built'],0]
        });
      
        EPOQUES.forEach(epoque => { 
          loadEpoque(epoque.name,epoque.color,epoque.min,epoque.max)
        });
      }, 1000)




  }, [API_KEY, lng, lat, zoom]);


  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
}