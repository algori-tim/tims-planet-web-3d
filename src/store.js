import { create } from 'zustand';
import {
	Vector3,
	Vehicle,
	EntityManager,
	Time,
	FollowPathBehavior,
	NavMeshLoader,
	OnPathBehavior,
	Path,
} from 'yuka';
import * as THREE from 'three';
import { createConvexRegionHelper, createPathHelper } from './navHelper';

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

	return {
		entityManager,
		time,
		init(scene = null) {
			if (navMesh) return;
			const loader = new NavMeshLoader();
			loader.load('./models/world_0_nav.glb').then((out) => {
				navMesh = out;
				navMesh.mergeConvexRegions = false;
				if (scene) {
					const helper = createConvexRegionHelper(navMesh);
					helper.position.y = 0.01;
					scene.add(helper);
					scene.add(pathHelper);
				}
			});
		},
		setPlayerVehicle(playerMesh) {
			if (playerVehicle) return;
			playerVehicle = new Vehicle();
			playerVehicle.setRenderComponent(playerMesh, sync);
			playerVehicle.maxForce = 1;
			playerVehicle.maxSpeed = 1.5;
			const followPathBehavior = new FollowPathBehavior();
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
				console.log(
					`${playerVehicle.position.x}-${playerVehicle.position.y}-${playerVehicle.position.z} -> ${groundIntersect.point.x}-${groundIntersect.point.y}-${groundIntersect.point.z}`
				);
				const pathVectors = navMesh.findPath(
					playerVehicle.position,
					new Vector3().copy(groundIntersect.point) //.x, groundIntersect.point.y, groundIntersect.point.z)
				);
				if (pathVectors.length < 1) return;
				console.log(pathVectors);

				pathHelper.visible = true;
				pathHelper.geometry.dispose();
				pathHelper.geometry = new THREE.BufferGeometry().setFromPoints(pathVectors);

				const followPathBehavior = playerVehicle.steering.behaviors[0];
				followPathBehavior.active = true;
				followPathBehavior.path.clear();

				pathVectors.map((point) => followPathBehavior.path.add(point));

				playerVehicle.steering.add(new OnPathBehavior(followPathBehavior.path));
			} else {
				console.log('missed');
			}
		},
	};
});

export default useStore;
