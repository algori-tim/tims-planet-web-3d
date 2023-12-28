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
        path.push(...this.generateMidPath(corridor.portalEdges))
      }

      return path
    }
  }
}
