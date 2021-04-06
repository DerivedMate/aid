import { Coordinate, WayPoint } from './OsrmApi'

export type SimpleRoute = Coordinate[]
export const simpleRouteOfWaypoints = (wps: WayPoint[]): SimpleRoute => wps.map(({ location }) => location)
