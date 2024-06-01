import { Vector3, AStar, Corridor, NavMesh } from 'yuka'

interface PortalEdge {
  left: Vector3
  right: Vector3
}

export class CustomNavMesh extends NavMesh {
  constructor(navMesh: NavMesh) {
    super()
    this.epsilonContainsTest = navMesh.epsilonContainsTest
    this.epsilonCoplanarTest = navMesh.epsilonCoplanarTest
    this.graph = navMesh.graph
    this.mergeConvexRegions = navMesh.mergeConvexRegions
    this.regions = navMesh.regions
    this.spatialIndex = navMesh.spatialIndex
  }

  midpoint(a: Vector3, b: Vector3): Vector3 {
    return new Vector3((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2)
  }

  generateMidPath(portalEdges: PortalEdge[]): Vector3[] {
    const path: Vector3[] = []

    // add start point
    const portalApex = this.midpoint(portalEdges[0].left, portalEdges[0].right)
    path.push(portalApex)

    for (let i = 1, l = portalEdges.length; i < l; i++) {
      path.push(this.midpoint(portalEdges[i].left, portalEdges[i].right))
    }

    return path
  }

  findMidpointPath(from: Vector3, to: Vector3): Vector3[] {
    const path: Vector3[] = []
    let fromRegion = this.getRegionForPoint(from, this.epsilonContainsTest)
    let toRegion = this.getRegionForPoint(to, this.epsilonContainsTest)

    if (fromRegion === null || toRegion === null) {
      // if source or target are outside the navmesh, choose the nearest convex region
      if (fromRegion === null) fromRegion = this.getClosestRegion(from)
      if (toRegion === null) toRegion = this.getClosestRegion(to)
    }

    // check if both convex regions are identical
    if (fromRegion === toRegion) {
      // no search necessary, directly create the path
      path.push(new Vector3().copy(from))
      path.push(new Vector3().copy(to))
      return path
    } else {
      // source and target are not in the same region, perform search
      const source = this.getNodeIndex(fromRegion)
      const target = this.getNodeIndex(toRegion)

      const astar = new AStar(this.graph, source, target)
      astar.search()

      if (astar.found) {
        const polygonPath = astar.getPath()
        const corridor = new Corridor()
        corridor.push(from, from)

        // push sequence of portal edges to corridor
        const portalEdge: PortalEdge = { left: new Vector3(), right: new Vector3() }

        for (let i = 0, l = polygonPath.length - 1; i < l; i++) {
          const region = this.regions[polygonPath[i]]
          const nextRegion = this.regions[polygonPath[i + 1]]
          // @ts-ignore
          this._getPortalEdge(region, nextRegion, portalEdge)

          corridor.push(portalEdge.left, portalEdge.right)
        }

        corridor.push(to, to)
        path.push(...this.findShortestPath(corridor.portalEdges))
      }

      return path
    }
  }
  distance(p1: Vector3, p2: Vector3): number {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2))
  }

  interpolate(p1: Vector3, p2: Vector3, t: number): Vector3 {
    return new Vector3(p1.x + (p2.x - p1.x) * t, p1.y + (p2.y - p1.y) * t, p1.z + (p2.z - p1.z) * t)
  }

  findShortestPath(portalEdges: PortalEdge[]): Vector3[] {
    const path: Vector3[] = [portalEdges[0].left] // start with the first left point

    for (let i = 0; i < portalEdges.length - 2; i++) {
      const currentPoint = path[path.length - 1]
      const nextCorridorPoints = this.getCorridorPoints(portalEdges[i + 1])
      const nextPoint = nextCorridorPoints.reduce((closest, point) => {
        return this.distance(currentPoint, point) < this.distance(currentPoint, closest) ? point : closest
      })

      path.push(nextPoint)
    }

    path.push(portalEdges[portalEdges.length - 1].left)

    return path
  }

  getCorridorPoints(corridor: PortalEdge): Vector3[] {
    const points: Vector3[] = []

    // Interpolate points to divide into 8 sections
    const numSections = 8
    for (let i = 1; i < numSections; i++) {
      const t = i / numSections
      points.push(this.interpolate(corridor.left, corridor.right, t))
    }

    return points
  }

  // Note: Renaming this method to avoid duplicate names with above interpolate method.
  interpolatePoint(p1: Vector3, p2: Vector3, t: number): Vector3 {
    return new Vector3(p1.x + (p2.x - p1.x) * t, p1.y + (p2.y - p1.y) * t, p1.z + (p2.z - p1.z) * t)
  }
}
