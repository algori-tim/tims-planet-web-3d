import { Vector3, AStar, Corridor, NavMesh } from 'yuka'

export class CustomNavMesh extends NavMesh {
  constructor(navMesh) {
    super()
    this.epsilonContainsTest = navMesh.epsilonContainsTest
    this.epsilonCoplanarTest = navMesh.epsilonCoplanarTest
    this.graph = navMesh.graph
    this.mergeConvexRegions = navMesh.mergeConvexRegions
    this.regions = navMesh.regions
    this.spatialIndex = navMesh.spatialIndex
  }

  midpoint(a, b) {
    return new Vector3((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2)
  }

  generateMidPath(portalEdges) {
    const path = new Array()

    // add start point
    const portalApex = this.midpoint(portalEdges[0].left, portalEdges[0].right)
    path.push(portalApex)

    for (let i = 1, l = portalEdges.length; i < l; i++) {
      path.push(this.midpoint(portalEdges[i].left, portalEdges[i].right))
    }

    return path
  }

  findMidpointPath(from, to) {
    const graph = this.graph
    const path = new Array()

    let fromRegion = this.getRegionForPoint(from, this.epsilonContainsTest)
    let toRegion = this.getRegionForPoint(to, this.epsilonContainsTest)

    if (fromRegion === null || toRegion === null) {
      // if source or target are outside the navmesh, choose the nearest convex region

      if (fromRegion === null) fromRegion = this.getClosestRegion(from)
      if (toRegion === null) toRegion = this.getClosestRegion(to)
    }

    // check if both convex region are identical

    if (fromRegion === toRegion) {
      // no search necessary, directly create the path

      path.push(new Vector3().copy(from))
      path.push(new Vector3().copy(to))
      return path
    } else {
      // source and target are not in same region, perform search

      const source = this.getNodeIndex(fromRegion)
      const target = this.getNodeIndex(toRegion)

      const astar = new AStar(graph, source, target)
      astar.search()

      if (astar.found === true) {
        const polygonPath = astar.getPath()
        const corridor = new Corridor()
        corridor.push(from, from)

        // push sequence of portal edges to corridor

        const portalEdge = { left: null, right: null }

        for (let i = 0, l = polygonPath.length - 1; i < l; i++) {
          const region = this.regions[polygonPath[i]]
          const nextRegion = this.regions[polygonPath[i + 1]]

          this._getPortalEdge(region, nextRegion, portalEdge)

          corridor.push(portalEdge.left, portalEdge.right)
        }

        corridor.push(to, to)
        // path.push(...this.generateMidPath(corridor.portalEdges))
        path.push(...this.findShortestPath(corridor.portalEdges))
      }

      return path
    }
  }

  distance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2))
  }

  interpolate(p1, p2, t) {
    return {
      x: p1.x + (p2.x - p1.x) * t,
      y: p1.y + (p2.y - p1.y) * t,
      z: p1.z + (p2.z - p1.z) * t,
    }
  }

  findShortestPath(portalEdges) {
    console.log(portalEdges)
    let path = [portalEdges[0].left] // start with the first left point

    for (let i = 0; i < portalEdges.length - 2; i++) {
      let currentPoint = path[path.length - 1]
      let nextCorridorPoints = this.getCorridorPoints(portalEdges[i + 1])
      let nextPoint = nextCorridorPoints.reduce((closest, point) => {
        return this.distance(currentPoint, point) < this.distance(currentPoint, closest) ? point : closest
      })

      path.push(nextPoint)
    }

    path.push(portalEdges[portalEdges.length - 1].left)

    return path
  }

  getCorridorPoints(corridor) {
    let points = []
    // points.push(corridor.left) // left endpoint

    // Interpolate points to divide into 8 sections
    const numSections = 8
    for (let i = 1; i < numSections; i++) {
      const t = i / numSections
      points.push(this.interpolate(corridor.left, corridor.right, t))
    }

    // points.push(corridor.right) // right endpoint
    return points
  }

  interpolate(p1, p2, t) {
    return new Vector3(p1.x + (p2.x - p1.x) * t, p1.y + (p2.y - p1.y) * t, p1.z + (p2.z - p1.z) * t)
  }
}
