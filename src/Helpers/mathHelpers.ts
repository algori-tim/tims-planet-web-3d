import { Vector3 } from 'three'

export const getDistance = (start: Vector3, end: Vector3): number => {
  return Math.sqrt(
    Math.pow(Math.abs(start.x - end.x), 2) +
      Math.pow(Math.abs(start.y - end.y), 2) +
      Math.pow(Math.abs(start.z - end.z), 2)
  )
}
