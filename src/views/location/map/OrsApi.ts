import { BBox, Feature } from 'geojson'

/** Default Leaflet js coordinates */
export type LatLong = [number, number]

/** Default GEOJson coordinates */
export type LongLat = [number, number]

export enum Profile {
  DrivingCar = 'driving-car',
  CyclingRegular = 'cycling-regular',
  CyclingRoad = 'cycling-road',
  FootWalking = 'foot-walking',
  Wheelchair = 'wheelchair'
}

interface Metadata {
  attribution: string
  service: string
  timestamp: number
  query: {
    coordinates: LongLat[]
    profile: Profile
    format: 'json'
  }
  engine: {
    version: string
    build_date: string
    graph_date: string
  }
}

export interface DirectionResponse {
  type: 'FeatureCollection'
  features: Feature[]
  bbox: BBox
  metadata: Metadata
}

export enum DirectionFetchResult {
  Success = '@DirectionFetchResult:Success',
  Fail = '@DirectionFetchResult:Fail'
}

interface DirectionResponseWrapperSuccess {
  ok: DirectionFetchResult.Success
  res: DirectionResponse
}

interface DirectionResponseWrapperFail {
  ok: DirectionFetchResult.Fail
  status: number
  message: string
}

export type DirectionResponseWrapper = DirectionResponseWrapperSuccess | DirectionResponseWrapperFail

export const leafletOfGeoJson = ([long, lat]: LongLat): LatLong => [lat, long]
export const geoJsonOfLeaflet = ([lat, long]: LatLong): LongLat => [long, lat]

export const makeDirectionsURL = (profile: Profile): string =>
  `https://api.openrouteservice.org/v2/directions/${profile}/geojson`

export const fetchDirections = (
  APIKey: string,
  coordinates: LongLat[],
  profile: Profile
): Promise<DirectionResponseWrapper> =>
  fetch(makeDirectionsURL(profile), {
    method: 'POST',
    headers: {
      Authorization: APIKey,
      'Content-Type': 'application/geo+json;charset=UTF-8'
    },
    body: JSON.stringify({
      coordinates
    })
  }).then(async r => {
    const message = await r.text().catch(() => `{message: '[PH] Route Fetching Error'}`)
    const j = JSON.parse(message)

    if (!r.ok)
      return {
        ok: DirectionFetchResult.Fail,
        status: r.status,
        message: ('error' in j ? j.error.message : '') || r.statusText
      }

    return {
      ok: DirectionFetchResult.Success,
      res: j
    }
  })
