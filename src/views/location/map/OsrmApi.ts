/**
 * A `[longitude, latitude]` pair
 */
export type Coordinate = [number, number]

export interface WayPoint {
  name: string
  location: Coordinate
  distance: number
  hint: string
}

interface Leg {
  distance: number
  /**Duration in seconds */
  duration: number
  weight: number
  summary: string
  steps: unknown[]
  annotations: unknown[]
}

enum Geometry {
  Polyline = 'polyline',
  Polyline6 = 'polyline6',
  GeoJSON = 'geojson'
}

enum WeightName {
  Simplified = 'simplified',
  Full = 'full',
  False = 'false'
}

interface Route {
  distance: number
  /**Duration in seconds */
  duration: number
  geometry: Geometry
  weight: number
  weight_name: WeightName
  legs: Leg[]
}

interface RouteServiceResSuccess {
  code: 'Ok'
  waypoints: WayPoint[]
  routes: Route[]
}

interface RouteServiceResError {
  code: string
  message?: string
}

export type RouteServiceRes = RouteServiceResError | RouteServiceResSuccess

interface RouteServiceResWrapperError {
  ok: false
  status: number
  res: RouteServiceRes
}

interface RouteServiceResWrapperSuccess {
  ok: true
  status: number
  res: RouteServiceRes
}

export type RouteServiceResWrapper = RouteServiceResWrapperError | RouteServiceResWrapperSuccess

export enum Profile {
  Car = 'car',
  Bike = 'bike',
  Foot = 'foot'
}

export interface OsrmReq {
  start: Coordinate
  end: Coordinate
  profile: Profile
}

export const searchRoute = ({ start, end, profile }: OsrmReq): Promise<RouteServiceResWrapper> =>
  fetch(`http://router.project-osrm.org/route/v1/${profile}/${start[0]},${start[1]};${end[0]},${end[1]}?overview=false`)
    .then(r =>
      r.json().then((j: RouteServiceRes) => ({
        ok: r.ok,
        status: r.status,
        res: j
      }))
    )
    .catch(e => {
      console.error(e)
      return {
        ok: false,
        status: 418,
        res: null
      }
    })
