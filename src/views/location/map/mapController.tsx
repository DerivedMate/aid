/*
import L, { latLng } from 'leaflet'
import React from 'react'
import { useMap, useMapEvents } from 'react-leaflet'
import { Coordinate } from './OsrmApi'

interface LocalProps {
  waypoints: Coordinate[]
}

const Elem = ({ waypoints }: LocalProps): React.ReactElement => {
  L.Routing.control({
    waypoints: waypoints.map(latLng),
    router: L.Routing.osrmv1({
      language: 'en',
      profile: 'car'
    })
  }).addTo(useMap())
  return <></>
}

export default Elem

*/
