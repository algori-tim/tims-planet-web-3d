import { create } from 'zustand';
import {
	Vector3,
	EntityManager,
	Time,
	FollowPathBehavior,
	OnPathBehavior,
	NavMeshLoader,
} from 'yuka';

// import { NavMeshLoader } from './yuka/NavMeshLoader';
import * as THREE from 'three';
import {
	CustomVehicle,
	createConvexRegionHelper,
	createPathHelper,
	CustomNavMesh,
} from './navHelpers';

const interactionMatrix = new Map();
interactionMatrix.set('look_ground', "It's so green...");
interactionMatrix.set('look_player', "It's you! Aren't you handsome.");
interactionMatrix.set('look_sub_ground', "It's so brown...");
interactionMatrix.set('look_space', 'Ah... the final frontier!');
interactionMatrix.set('walk_ground', 'Off you go.');

const getInteractionMessage = (cursor, interactionPoint) => {
	console.log(`${cursor}_${interactionPoint}`);
	const message = interactionMatrix.get(`${cursor}_${interactionPoint}`);
	if (message) return message;

	if (cursor === 'walk') return "Unlike some boots, that's not made for walking.";
	if (cursor === 'talk') return 'It responds with utter silence.';
	if (cursor === 'look') return 'Stop looking at that!';
};

const sync = (entity, renderComponent) => {
	// console.log(renderComponent)
	renderComponent.matrix.copy(entity.worldMatrix);
};

const useStore = create((set, get) => {
	let cursorType = document.getElementById('root').getAttribute('data-cursor');
	let navMesh;
	let playerVehicle;
	let entityManager = new EntityManager();
	let time = new Time();
	let pathHelper = createPathHelper();
	let includeHelpers = false;

	return {
		entityManager,
		time,
		init(scene) {
			if (navMesh) return;
			includeHelpers = includeHelpers;
			const loader = new NavMeshLoader();
			loader.load('./models/world_0_nav.glb').then((navigationMesh) => {
				navMesh = new CustomNavMesh(navigationMesh);
				scene.add(createConvexRegionHelper(navMesh));
				scene.add(pathHelper);
			});
		},
		setPlayerVehicle(playerMesh) {
			if (playerVehicle) return;
			playerVehicle = new CustomVehicle();
			playerVehicle.navMesh = navMesh;
			playerVehicle.maxForce = 1;
			playerVehicle.maxSpeed = 1.5;
			playerVehicle.setRenderComponent(playerMesh, sync);
			const followPathBehavior = new FollowPathBehavior();
			followPathBehavior.nextWaypointDistance = 1;
			followPathBehavior.active = false;
			playerVehicle.steering.add(followPathBehavior);
			entityManager.add(playerVehicle);
		},
		setCursor(cursor) {
			cursorType = cursor;
			console.log(`set ${cursorType}`);
		},
		handleInteraction(event) {
			event.stopPropagation();

			document.getElementById('hud-messages').innerHTML = getInteractionMessage(
				cursorType,
				event.object.name
			);

			const groundIntersect = event.intersections.find((x) => x.object.name === 'ground');
			if (groundIntersect && cursorType === 'walk') {
				const pathVectors = navMesh.findMidpointPath(
					playerVehicle.position,
					new Vector3().copy(groundIntersect.point)
				);

				if (pathVectors.length < 2) return;

				pathHelper.visible = true;
				pathHelper.geometry.dispose();
				pathHelper.geometry = new THREE.BufferGeometry().setFromPoints(pathVectors);

				playerVehicle.toRegion = navMesh.getRegionForPoint(groundIntersect.point);
				playerVehicle.steering.behaviors[0].active = true;
				playerVehicle.steering.behaviors[0].path.clear();

				pathVectors.map((point) => playerVehicle.steering.behaviors[0].path.add(point));

				playerVehicle.steering.add(new OnPathBehavior(playerVehicle.steering.behaviors[0].path));
			} else {
				console.log('missed');
			}
		},
	};
});

export default useStore;
