export type Coordinate = [number, number]

interface WayPoint {
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
  code: string
  waypoints: WayPoint[]
  routes: Route[]
}

interface RouteServiceResError {
  code: string
  message?: string
}

export type RouteServiceRes = RouteServiceResError | RouteServiceResSuccess

export interface RouteServiceResWrapper {
  ok: boolean
  status: number
  res: RouteServiceRes
}

export const searchRoute = (start: Coordinate, end: Coordinate): Promise<RouteServiceResWrapper> => fetch()
