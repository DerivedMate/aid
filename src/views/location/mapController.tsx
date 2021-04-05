import React from 'react'
import { useMapEvents } from 'react-leaflet'

interface LocalProps {}

const Elem = (): React.ReactElement => {
  const map = useMapEvents({
    click: () => {
      map.locate()
    }
  })
  return <></>
}
