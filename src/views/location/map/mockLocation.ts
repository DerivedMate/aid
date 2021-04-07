import { LatLong } from './OrsApi'

export const randomWalk = (start: LatLong, range: number): LatLong =>
  start.map(s => s + (Math.random() - 0.5) * range) as LatLong
