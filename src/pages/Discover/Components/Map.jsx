import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";

import StationMarker from './StationMarker';

const Map = (props) => {

  const { isMarkerShown, onMarkerClick, center } = props;

  const stations = [
    {
      id: 1,
      coordinate: { lat: 35.929673, lng: -78.948237 },
      info: {
        name: 'Leon S Kennedy',
        rating: 3.4
      }
    },
    {
      id: 2,
      coordinate: { lat: 38.889510, lng: -77.032000 },
      info: {
        name: 'Leon S Kennedy 1111',
        rating: 4.4
      }
    },
  ]
  return (
    <GoogleMap
      defaultZoom={6}
      defaultCenter={center}
    >
      {
        stations.map((station) => {
          const { id, ...rest } = station;
          return (
            <StationMarker key={id} {...rest} />
          )
        })
      }
    </GoogleMap>
  )
}

export default withScriptjs(withGoogleMap(Map));
