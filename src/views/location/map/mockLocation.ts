import { Coordinate } from './OsrmApi'

const wait = (time: number): Promise<void> =>
  new Promise(res => {
    setTimeout(res, time)
  })

export const randomWalk = (start: Coordinate, range: number): Coordinate =>
  start.map(s => s + (Math.random() - 0.5) * range) as Coordinate
