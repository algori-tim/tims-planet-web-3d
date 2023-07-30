import * as THREE from 'three';
import { Vehicle, Vector3, AStar, Corridor, NavMesh } from 'yuka';

export const createConvexRegionHelper = (navMesh) => {
	const regions = navMesh.regions;

	const geometry = new THREE.BufferGeometry();
	const material = new THREE.MeshBasicMaterial({ color: 'lightblue' });
	material.wireframe = true;
	const mesh = new THREE.Mesh(geometry, material);

	const positions = [];
	const colors = [];

	const color = new THREE.Color();

	for (let region of regions) {
		// one color for each convex region

		// count edges

		let edge = region.edge;
		const edges = [];

		do {
			edges.push(edge);

			edge = edge.next;
		} while (edge !== region.edge);

		// triangulate

		const triangleCount = edges.length - 2;

		for (let i = 1, l = triangleCount; i <= l; i++) {
			const v1 = edges[0].vertex;
			const v2 = edges[i + 0].vertex;
			const v3 = edges[i + 1].vertex;

			positions.push(v1.x, v1.y, v1.z);
			positions.push(v2.x, v2.y, v2.z);
			positions.push(v3.x, v3.y, v3.z);
		}
	}

	geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
	geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

	return mesh;
};

export const createPathHelper = () => {
	const pathMaterial = new THREE.LineBasicMaterial({ color: 'red' });
	const pathHelper = new THREE.Line(new THREE.BufferGeometry(), pathMaterial);
	pathHelper.visible = false;
	return pathHelper;
};

export const createCellSpaceHelper = (spatialIndex) => {
	const cells = spatialIndex.cells;

	const geometry = new THREE.BufferGeometry();
	console.log(geometry);
	const material = new THREE.LineBasicMaterial();

	const lines = new THREE.LineSegments(geometry, material);

	const positions = [];

	for (let i = 0, l = cells.length; i < l; i++) {
		const cell = cells[i];
		const min = cell.aabb.min;
		const max = cell.aabb.max;

		// generate data for twelve lines segments

		// bottom lines

		positions.push(min.x, min.y, min.z, max.x, min.y, min.z);
		positions.push(min.x, min.y, min.z, min.x, min.y, max.z);
		positions.push(max.x, min.y, max.z, max.x, min.y, min.z);
		positions.push(max.x, min.y, max.z, min.x, min.y, max.z);

		// top lines

		positions.push(min.x, max.y, min.z, max.x, max.y, min.z);
		positions.push(min.x, max.y, min.z, min.x, max.y, max.z);
		positions.push(max.x, max.y, max.z, max.x, max.y, min.z);
		positions.push(max.x, max.y, max.z, min.x, max.y, max.z);

		// torso lines

		positions.push(min.x, min.y, min.z, min.x, max.y, min.z);
		positions.push(max.x, min.y, min.z, max.x, max.y, min.z);
		positions.push(max.x, min.y, max.z, max.x, max.y, max.z);
		positions.push(min.x, min.y, max.z, min.x, max.y, max.z);
	}

	geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

	return lines;
};

export class CustomVehicle extends Vehicle {
	constructor() {
		super();
		this.navMesh = null;
		this.currentRegion = null;
		this.fromRegion = null;
		this.toRegion = null;
	}

	update(delta) {
		super.update(delta);

		// this code is used to adjust the height of the entity according to its current region
		const currentRegion = this.navMesh.getRegionForPoint(this.position, 1);

		if (currentRegion !== null) {
			this.currentRegion = currentRegion;

			const distance = this.currentRegion.distanceToPoint(this.position);

			this.position.y -= distance * 0.2;
		}

		return this;
	}
}

export class CustomNavMesh extends NavMesh {
	constructor(navMesh) {
		super();
		this.epsilonContainsTest = navMesh.epsilonContainsTest;
		this.epsilonCoplanarTest = navMesh.epsilonCoplanarTest;
		this.graph = navMesh.graph;
		this.mergeConvexRegions = navMesh.mergeConvexRegions;
		this.regions = navMesh.regions;
		this.spatialIndex = navMesh.spatialIndex;
	}

	midpoint(a, b) {
		return new Vector3((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2);
	}

	generateMidPath(portalEdges) {
		const path = new Array();

		// add start point
		const portalApex = this.midpoint(portalEdges[0].left, portalEdges[0].right);
		path.push(portalApex);

		for (let i = 1, l = portalEdges.length; i < l; i++) {
			path.push(this.midpoint(portalEdges[i].left, portalEdges[i].right));
		}

		console.log('PATH', path);
		return path;
	}

	findMidpointPath(from, to) {
		const graph = this.graph;
		const path = new Array();

		let fromRegion = this.getRegionForPoint(from, this.epsilonContainsTest);
		let toRegion = this.getRegionForPoint(to, this.epsilonContainsTest);

		if (fromRegion === null || toRegion === null) {
			// if source or target are outside the navmesh, choose the nearest convex region

			if (fromRegion === null) fromRegion = this.getClosestRegion(from);
			if (toRegion === null) toRegion = this.getClosestRegion(to);
		}

		// check if both convex region are identical

		if (fromRegion === toRegion) {
			// no search necessary, directly create the path

			path.push(new Vector3().copy(from));
			path.push(new Vector3().copy(to));
			return path;
		} else {
			// source and target are not in same region, perform search

			const source = this.getNodeIndex(fromRegion);
			const target = this.getNodeIndex(toRegion);

			const astar = new AStar(graph, source, target);
			astar.search();

			if (astar.found === true) {
				const polygonPath = astar.getPath();
				const corridor = new Corridor();
				corridor.push(from, from);

				// push sequence of portal edges to corridor

				const portalEdge = { left: null, right: null };

				for (let i = 0, l = polygonPath.length - 1; i < l; i++) {
					const region = this.regions[polygonPath[i]];
					const nextRegion = this.regions[polygonPath[i + 1]];

					this._getPortalEdge(region, nextRegion, portalEdge);

					corridor.push(portalEdge.left, portalEdge.right);
				}

				corridor.push(to, to);
				// console.log(' MER', corridor.portalEdges);
				path.push(...this.generateMidPath(corridor.portalEdges));
			}

			return path;
		}
	}
}
