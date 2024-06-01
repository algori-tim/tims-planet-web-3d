// src/CustomYukaObjects/CustomNavMesh.d.ts

import { Vector3, AStar, Corridor, NavMesh } from 'yuka'

interface PortalEdge {
  left: Vector3
  right: Vector3
}

export declare class CustomNavMesh extends NavMesh {
  constructor(navMesh: NavMesh)
  midpoint(a: Vector3, b: Vector3): Vector3
  generateMidPath(portalEdges: PortalEdge[]): Vector3[]
  findMidpointPath(from: Vector3, to: Vector3): Vector3[]
  distance(p1: Vector3, p2: Vector3): number
  interpolate(p1: Vector3, p2: Vector3, t: number): Vector3
  findShortestPath(portalEdges: PortalEdge[]): Vector3[]
  getCorridorPoints(corridor: PortalEdge): Vector3[]
  interpolatePoint(p1: Vector3, p2: Vector3, t: number): Vector3
}
